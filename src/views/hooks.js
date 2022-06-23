import { useContractFunction, useCall } from '@usedapp/core';

export function useCreateSwap(swapContract) {
  const { state, send, events, resetState } = useContractFunction(swapContract, 'createSwap', {
    transactionName: 'Create Swap'
  });
  return { state, send, events, resetState };
}

export function useExecuteSwap(swapContract) {
  const { state, send, events, resetState } = useContractFunction(swapContract, 'executeSwap', {
    transactionName: 'Execute Swap'
  });
  return { state, send, events, resetState };
}

export function useCancelSwap(swapContract) {
  const { state, send, events, resetState } = useContractFunction(swapContract, 'cancelSwap', {
    transactionName: 'Cancel Swap'
  });
  return { state, send, events, resetState };
}

export function useChangeExecutor(swapContract) {
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
