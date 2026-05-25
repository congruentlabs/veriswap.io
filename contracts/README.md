# Veriswap Native Asset Contract

`VeriswapNative.sol` supports swaps where exactly one side is the chain native asset and the other side is an ERC20.

- Use `0x0000000000000000000000000000000000000000` as the native asset token address.
- Constructor arguments match the existing Veriswap identity, rights, KYC claim, and sanctions contracts.
- After deployment, set the matching `NATIVE_SWAP_CONTRACT_*` constant in `src/consts.js` so the UI can open and execute native swaps on that chain.

ERC20-to-ERC20 swaps should continue using the existing `VeriswapERC20` contract.
