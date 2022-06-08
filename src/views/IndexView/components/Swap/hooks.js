import { useContractFunction } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';
import SWAP_ABI from './swapAbi.json';

const SWAP_CONTRACT = '0x2bBB08e5BeCd636b15D8E8de0DCcb98923a2Daad'; // rinkeby
const swapContract = new Contract(SWAP_CONTRACT, SWAP_ABI);

export function useCreateSwap() {
  const { state, send, events, resetState } = useContractFunction(swapContract, 'createSwap', {
    transactionName: 'Create Swap'
  });
  return { state, send, events, resetState };
}

export function useExecuteSwap() {
  const { state, send, events, resetState } = useContractFunction(swapContract, 'executeSwap', {
    transactionName: 'Execute Swap'
  });
  return { state, send, events, resetState };
}

export function useCancelSwap() {
  const { state, send, events, resetState } = useContractFunction(swapContract, 'cancelSwap', {
    transactionName: 'Cancel Swap'
  });
  return { state, send, events, resetState };
}

export function useChangeExecutor() {
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
