// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

interface IERC20 {
    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

interface ISignataIdentity {
    function getIdentity(address delegateKey) external view returns (address);

    function isLocked(address identity) external view returns (bool);
}

interface ISignataRight {
    function holdsTokenOfSchema(address holder, uint256 schemaId)
        external
        view
        returns (bool);
}

interface IClaimRight {
    function schemaId() external view returns (uint256);
}

interface SanctionsList {
    function isSanctioned(address addr) external view returns (bool);
}

abstract contract Ownable {
    address private _owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    constructor() {
        _transferOwnership(msg.sender);
    }

    modifier onlyOwner() {
        require(owner() == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    function owner() public view returns (address) {
        return _owner;
    }

    function renounceOwnership() external onlyOwner {
        _transferOwnership(address(0));
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(
            newOwner != address(0),
            "Ownable: new owner is the zero address"
        );
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status = _NOT_ENTERED;

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

contract VeriswapNative is Ownable, ReentrancyGuard {
    ISignataIdentity public signataIdentity;
    ISignataRight public signataRight;
    IClaimRight public claimRight;
    address public sanctionsContract;

    enum States {
        INVALID,
        OPEN,
        CLOSED,
        EXPIRED
    }

    struct EscrowSwap {
        address inputToken;
        uint256 inputAmount;
        address outputToken;
        uint256 outputAmount;
        address executor;
        address creator;
        bool requireIdentity;
        bool requireKyc;
        bool requireSanctionCheck;
        States state;
    }

    bool public canSwap = true;

    mapping(address => EscrowSwap) public swaps;

    event SwapCreated(EscrowSwap swapData);
    event SwapExecuted(address creatorAddress);
    event SwapCancelled(address creatorAddress);
    event ExecutorModified(
        address creatorAddress,
        address oldExecutor,
        address newExecutor
    );
    event IdentityContractChanged(ISignataIdentity newIdentity);
    event RightsContractChanged(ISignataRight newRights);
    event ClaimRightContractChanged(IClaimRight newClaimRight);
    event SanctionsListChanged(address newSanctionsList);

    constructor(
        ISignataIdentity _signataIdentity,
        ISignataRight _signataRight,
        IClaimRight _kycClaimRight,
        address _sanctionsContract
    ) {
        signataIdentity = _signataIdentity;
        signataRight = _signataRight;
        claimRight = _kycClaimRight;
        sanctionsContract = _sanctionsContract;
    }

    receive() external payable {
        revert("VeriswapNative::direct native transfers disabled");
    }

    function createSwap(
        address _inputToken,
        uint256 _inputAmount,
        address _outputToken,
        uint256 _outputAmount,
        address _executor,
        bool _requireIdentity,
        bool _requireKyc,
        bool _requireSanctionCheck
    ) external payable nonReentrant {
        require(canSwap, "createSwap::swaps not enabled!");
        _validateNativePair(
            _inputToken,
            _inputAmount,
            _outputToken,
            _outputAmount,
            _executor
        );
        _validateCreatorChecks(
            _executor,
            _requireIdentity,
            _requireKyc,
            _requireSanctionCheck
        );

        EscrowSwap memory swapToCheck = swaps[msg.sender];
        require(
            swapToCheck.state != States.OPEN,
            "createSwap::already have an open swap"
        );

        if (_isNative(_inputToken)) {
            require(
                msg.value == _inputAmount,
                "createSwap::invalid native amount"
            );
        } else {
            require(msg.value == 0, "createSwap::unexpected native value");
            IERC20 inputToken = IERC20(_inputToken);

            require(
                _inputAmount <= inputToken.allowance(msg.sender, address(this)),
                "createSwap::insufficient allowance"
            );
            require(
                inputToken.transferFrom(
                    msg.sender,
                    address(this),
                    _inputAmount
                ),
                "createSwap::transferFrom failed"
            );
        }

        EscrowSwap memory newSwap = EscrowSwap({
            inputToken: _inputToken,
            inputAmount: _inputAmount,
            outputToken: _outputToken,
            outputAmount: _outputAmount,
            executor: _executor,
            creator: msg.sender,
            requireIdentity: _requireIdentity,
            requireKyc: _requireKyc,
            requireSanctionCheck: _requireSanctionCheck,
            state: States.OPEN
        });
        swaps[msg.sender] = newSwap;

        emit SwapCreated(newSwap);
    }

    function executeSwap(address creatorAddress)
        external
        payable
        nonReentrant
    {
        require(canSwap, "executeSwap::swaps not enabled!");

        EscrowSwap memory swapToExecute = swaps[creatorAddress];

        require(
            swapToExecute.state == States.OPEN,
            "executeSwap::not an open swap"
        );
        require(
            swapToExecute.executor == msg.sender,
            "executeSwap::only the executor can call this function"
        );
        require(
            msg.value == (_isNative(swapToExecute.outputToken)
                ? swapToExecute.outputAmount
                : 0),
            "executeSwap::invalid native amount"
        );

        _validateExecutorChecks(swapToExecute);

        swaps[swapToExecute.creator].state = States.CLOSED;

        if (_isNative(swapToExecute.inputToken)) {
            _sendNative(
                payable(swapToExecute.executor),
                swapToExecute.inputAmount,
                "executeSwap::native input transfer failed"
            );
        } else {
            require(
                IERC20(swapToExecute.inputToken).transfer(
                    swapToExecute.executor,
                    swapToExecute.inputAmount
                ),
                "executeSwap::input transfer failed"
            );
        }

        if (_isNative(swapToExecute.outputToken)) {
            _sendNative(
                payable(swapToExecute.creator),
                swapToExecute.outputAmount,
                "executeSwap::native output transfer failed"
            );
        } else {
            IERC20 outputToken = IERC20(swapToExecute.outputToken);
            require(
                swapToExecute.outputAmount <=
                    outputToken.allowance(msg.sender, address(this)),
                "executeSwap::insufficient allowance"
            );
            require(
                outputToken.transferFrom(
                    msg.sender,
                    swapToExecute.creator,
                    swapToExecute.outputAmount
                ),
                "executeSwap::output transferFrom failed"
            );
        }

        emit SwapExecuted(creatorAddress);
    }

    function cancelSwap() external nonReentrant {
        EscrowSwap memory swapToCancel = swaps[msg.sender];
        require(
            swapToCancel.creator == msg.sender,
            "cancelSwap::not the creator"
        );
        require(
            swapToCancel.state == States.OPEN,
            "cancelSwap::not an open swap"
        );

        swaps[msg.sender].state = States.EXPIRED;

        if (_isNative(swapToCancel.inputToken)) {
            _sendNative(
                payable(swapToCancel.creator),
                swapToCancel.inputAmount,
                "cancelSwap::native refund failed"
            );
        } else {
            require(
                IERC20(swapToCancel.inputToken).transfer(
                    swapToCancel.creator,
                    swapToCancel.inputAmount
                ),
                "cancelSwap::refund transfer failed"
            );
        }

        emit SwapCancelled(swapToCancel.creator);
    }

    function changeExecutor(address newExecutor) external {
        require(
            newExecutor != address(0),
            "changeExecutor::cannot set to 0 address"
        );
        EscrowSwap memory swapToChange = swaps[msg.sender];

        address oldExecutor = swaps[msg.sender].executor;

        require(
            newExecutor != oldExecutor,
            "changeExecutor::not different values"
        );
        require(
            swapToChange.creator == msg.sender,
            "changeExecutor::not the creator"
        );
        require(
            swapToChange.state == States.OPEN,
            "changeExecutor::not an open swap"
        );

        swaps[msg.sender].executor = newExecutor;

        emit ExecutorModified(msg.sender, oldExecutor, newExecutor);
    }

    function enableSwaps() external onlyOwner {
        canSwap = true;
    }

    function disableSwaps() external onlyOwner {
        canSwap = false;
    }

    function updateSignataIdentity(ISignataIdentity newIdentity)
        external
        onlyOwner
    {
        require(
            address(newIdentity) != address(signataIdentity),
            "updateSignataIdentity::not different values"
        );
        signataIdentity = newIdentity;
        emit IdentityContractChanged(newIdentity);
    }

    function updateSignataRight(ISignataRight newRights) external onlyOwner {
        require(
            address(newRights) != address(signataRight),
            "updateSignataRight::not different values"
        );
        signataRight = newRights;
        emit RightsContractChanged(newRights);
    }

    function updateSanctionsList(address newSanctionsContract)
        external
        onlyOwner
    {
        require(
            newSanctionsContract != address(sanctionsContract),
            "updateSanctionsList::not different values"
        );
        sanctionsContract = newSanctionsContract;
        emit SanctionsListChanged(newSanctionsContract);
    }

    function updateClaimRight(IClaimRight newClaimRight) external onlyOwner {
        require(
            address(newClaimRight) != address(claimRight),
            "updateClaimRight::not different values"
        );
        claimRight = newClaimRight;
        emit ClaimRightContractChanged(newClaimRight);
    }

    function _validateNativePair(
        address _inputToken,
        uint256 _inputAmount,
        address _outputToken,
        uint256 _outputAmount,
        address _executor
    ) private pure {
        require(_inputAmount > 0, "VeriswapNative::invalid input amount");
        require(_outputAmount > 0, "VeriswapNative::invalid output amount");
        require(_executor != address(0), "VeriswapNative::invalid executor");
        require(
            _isNative(_inputToken) != _isNative(_outputToken),
            "VeriswapNative::exactly one side must be native"
        );
    }

    function _validateCreatorChecks(
        address _executor,
        bool _requireIdentity,
        bool _requireKyc,
        bool _requireSanctionCheck
    ) private view {
        if (_requireIdentity) {
            address senderId = signataIdentity.getIdentity(msg.sender);
            require(
                !signataIdentity.isLocked(senderId),
                "createSwap::Creator must not be locked"
            );
        }
        if (_requireKyc) {
            require(
                signataRight.holdsTokenOfSchema(
                    msg.sender,
                    claimRight.schemaId()
                ),
                "createSwap::Creator must have kyc nft"
            );
        }
        if (_requireSanctionCheck) {
            SanctionsList sanctionsList = SanctionsList(sanctionsContract);
            require(
                !sanctionsList.isSanctioned(msg.sender),
                "createSwap::Creator must not be sanctioned"
            );
            require(
                !sanctionsList.isSanctioned(_executor),
                "createSwap::Executor must not be sanctioned"
            );
        }
    }

    function _validateExecutorChecks(EscrowSwap memory swapToExecute)
        private
        view
    {
        if (swapToExecute.requireIdentity) {
            address senderId = signataIdentity.getIdentity(msg.sender);
            require(
                !signataIdentity.isLocked(senderId),
                "executeSwap::Sender must not be locked"
            );
            address executorId = signataIdentity.getIdentity(
                swapToExecute.executor
            );
            require(
                !signataIdentity.isLocked(executorId),
                "executeSwap::Executor must not be locked"
            );
        }

        if (swapToExecute.requireKyc) {
            require(
                signataRight.holdsTokenOfSchema(
                    msg.sender,
                    claimRight.schemaId()
                ),
                "executeSwap::Sender must have kyc nft"
            );
            require(
                signataRight.holdsTokenOfSchema(
                    swapToExecute.executor,
                    claimRight.schemaId()
                ),
                "executeSwap::Executor must have kyc nft"
            );
        }

        if (swapToExecute.requireSanctionCheck) {
            SanctionsList sanctionsList = SanctionsList(sanctionsContract);
            require(
                !sanctionsList.isSanctioned(msg.sender),
                "executeSwap::Sender must not be sanctioned"
            );
            require(
                !sanctionsList.isSanctioned(swapToExecute.executor),
                "executeSwap::Executor must not be sanctioned"
            );
        }
    }

    function _sendNative(
        address payable recipient,
        uint256 amount,
        string memory errorMessage
    ) private {
        (bool success, ) = recipient.call{value: amount}("");
        require(success, errorMessage);
    }

    function _isNative(address token) private pure returns (bool) {
        return token == address(0);
    }
}
