import { useContractFunction, useCall } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';

import SWAP_ABI from 'swapAbi.json';
import ID_ABI from 'idAbi.json';

export const getSwapContract = (chainId) => {
  if (chainId === 1) {
    return new Contract('0x2bBB08e5BeCd636b15D8E8de0DCcb98923a2Daad', SWAP_ABI); // TODO: Replace with mainnet contract
  }
  if (chainId === 4) {
    return new Contract('0x2bBB08e5BeCd636b15D8E8de0DCcb98923a2Daad', SWAP_ABI);
  }
  return new Contract('0x2bBB08e5BeCd636b15D8E8de0DCcb98923a2Daad', SWAP_ABI);
};

export const getTokenContract = (chainId) => {
  if (chainId === 1) {
    return new Contract('0x2bBB08e5BeCd636b15D8E8de0DCcb98923a2Daad', SWAP_ABI); // TODO: Replace with mainnet contract
  }
  if (chainId === 4) {
    return new Contract('0x2bBB08e5BeCd636b15D8E8de0DCcb98923a2Daad', SWAP_ABI);
  }
  return new Contract('0x2bBB08e5BeCd636b15D8E8de0DCcb98923a2Daad', SWAP_ABI);
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

export function useChangeExecutor(chainId) {
  const swapContract = getSwapContract(chainId);

  const { state, send, events, resetState } = useContractFunction(swapContract, 'changeExecutor', {
    transactionName: 'Change Executor'
  });
  return { state, send, events, resetState };
}

export function useApprove(erc20Token) {
  const { state, send, events, resetState } = useContractFunction(erc20Token, 'approve', {
    transactionName: 'Approve'
  });
  return { state, send, events, resetState };
}

export const getSwapContractAddress = (chainId) => {
  if (chainId === 1) {
    // mainnet
    return '';
  }
  if (chainId === 4) {
    // rinkeby
    return '0x2bBB08e5BeCd636b15D8E8de0DCcb98923a2Daad';
  }
  return '';
};

export const getIdentityContractAddress = (chainId) => {
  if (chainId === 1) {
    // mainnet
    return '';
  }
  if (chainId === 4) {
    // rinkeby
    return '0xb24e28a4b7fed6d59d3bd06af586f02fddfa6385';
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
