import { useContractFunction, useCall } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';

import { ID_CONTRACT_MAINNET, ID_CONTRACT_RINKEBY, SWAP_CONTRACT_MAINNET, SWAP_CONTRACT_RINKEBY } from 'consts';

import SWAP_ABI from 'swapAbi.json';
import ID_ABI from 'idAbi.json';

export const getSwapContract = (chainId) => {
  if (chainId === 1) {
    return new Contract(SWAP_CONTRACT_MAINNET, SWAP_ABI);
  }
  if (chainId === 4) {
    return new Contract(SWAP_CONTRACT_RINKEBY, SWAP_ABI);
  }
  return new Contract(SWAP_CONTRACT_MAINNET, SWAP_ABI);
};

export const getIdContract = (chainId) => {
  if (chainId === 1) {
    return new Contract(ID_CONTRACT_MAINNET, ID_ABI);
  }
  if (chainId === 4) {
    return new Contract(ID_CONTRACT_RINKEBY, ID_ABI);
  }
  return new Contract(ID_CONTRACT_MAINNET, ID_ABI);
};

export function useCreateSwap(chainId) {
  const swapContract = getSwapContract(chainId);

  const { state, send, events, resetState } = useContractFunction(swapContract, 'createSwap', {
    transactionName: 'Create Swap'
  });
  return { state, send, events, resetState };
}

export function useExecuteSwap(chainId) {
  const swapContract = getSwapContract(chainId);

  const { state, send, events, resetState } = useContractFunction(swapContract, 'executeSwap', {
    transactionName: 'Execute Swap'
  });
  return { state, send, events, resetState };
}

export function useCancelSwap(chainId) {
  const swapContract = getSwapContract(chainId);

  const { state, send, events, resetState } = useContractFunction(swapContract, 'cancelSwap', {
    transactionName: 'Cancel Swap'
  });
  return { state, send, events, resetState };
}

export function useEnableSwaps(chainId) {
  const swapContract = getSwapContract(chainId);

  const { state, send, events, resetState } = useContractFunction(swapContract, 'enableSwaps', {
    transactionName: 'Enable Swaps'
  });
  return { state, send, events, resetState };
}

export function useChangeExecutor(chainId) {
  const swapContract = getSwapContract(chainId);

  const { state, send, events, resetState } = useContractFunction(swapContract, 'changeExecutor', {
    transactionName: 'Change Executor'
  });
  return { state, send, events, resetState };
}

export function useApprove(erc20TokenContractObj) {
  const { state, send, events, resetState } = useContractFunction(erc20TokenContractObj, 'approve', {
    transactionName: 'Approve'
  });
  return { state, send, events, resetState };
}

export const getSwapContractAddress = (chainId) => {
  if (chainId === 1) {
    // mainnet
    return SWAP_CONTRACT_MAINNET;
  }
  if (chainId === 4) {
    // rinkeby
    return SWAP_CONTRACT_RINKEBY;
  }
  return '';
};

export const getIdentityContractAddress = (chainId) => {
  if (chainId === 1) {
    // mainnet
    return ID_CONTRACT_MAINNET;
  }
  if (chainId === 4) {
    // rinkeby
    return ID_CONTRACT_RINKEBY;
  }
  return '';
};

export const useGetValue = (method, args, contractAddress, contract) => {
  const { value, error } =
    useCall(
      contractAddress && {
        contract,
        method,
        args
      }
    ) ?? {};
  if (error) {
    console.error(error.message);
    return {};
  }
  return value;
};

export const useGetSingleValue = (method, args, contractAddress, contract) => {
  const { value, error } =
    useCall(
      contractAddress && {
        contract,
        method,
        args
      }
    ) ?? {};
  if (error) {
    console.error(error.message);
    return {};
  }
  return value?.[0];
};
