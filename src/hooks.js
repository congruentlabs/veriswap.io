import { useContractFunction, useCall, ERC20 } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';

import * as consts from 'consts';

import SWAP_ABI from 'swapAbi.json';
import ID_ABI from 'idAbi.json';
import WRAP_ABI from 'wrapAbi.json';
import ERC20_ABI from 'erc20Abi.json';

export const getTokenList = (chainId) => {
  if (chainId === 1) {
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/tokenlist.json';
  }
  if (chainId === 4) {
    return '';
  }
  if (chainId === 56) {
    // bsc
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/tokenlist.json';
  }
  if (chainId === 137) {
    // matic
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/tokenlist.json';
  }
  if (chainId === 250) {
    // fantom
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/tokenlist.json';
  }
  if (chainId === 1088) {
    // metis
    return '';
  }
  if (chainId === 43114) {
    // avax
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/tokenlist.json';
  }
  if (chainId === 42161) {
    // avax
    return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/tokenlist.json';
  }
  return '';
};

export const getSwapContractAddress = (chainId) => {
  if (chainId === 1) {
    return consts.SWAP_CONTRACT_MAINNET;
  }
  if (chainId === 4) {
    return consts.SWAP_CONTRACT_RINKEBY;
  }
  if (chainId === 56) {
    // bsc
    return consts.SWAP_CONTRACT_BSC;
  }
  if (chainId === 137) {
    // matic
    return consts.SWAP_CONTRACT_MATIC;
  }
  if (chainId === 250) {
    // fantom
    return consts.SWAP_CONTRACT_FTM;
  }
  if (chainId === 1088) {
    // metis
    return consts.SWAP_CONTRACT_METIS;
  }
  if (chainId === 43114) {
    // avax
    return consts.SWAP_CONTRACT_AVAX;
  }
  if (chainId === 42161) {
    return consts.SWAP_CONTRACT_ARBITRUM;
  }
  return consts.SWAP_CONTRACT_MAINNET;
};

export const getSwapContract = (chainId) => new Contract(getSwapContractAddress(chainId), SWAP_ABI);

export const getIdContractAddress = (chainId) => {
  if (chainId === 1) {
    return consts.ID_CONTRACT_MAINNET;
  }
  if (chainId === 4) {
    return consts.ID_CONTRACT_RINKEBY;
  }
  if (chainId === 56) {
    // bsc
    return consts.ID_CONTRACT_BSC;
  }
  if (chainId === 137) {
    // matic
    return consts.ID_CONTRACT_MATIC;
  }
  if (chainId === 250) {
    // fantom
    return consts.ID_CONTRACT_FTM;
  }
  if (chainId === 1088) {
    // metis
    return consts.ID_CONTRACT_METIS;
  }
  if (chainId === 43114) {
    // avax
    return consts.ID_CONTRACT_AVAX;
  }
  if (chainId === 42161) {
    return consts.ID_CONTRACT_ARBITRUM;
  }
  return consts.ID_CONTRACT_MAINNET;
};

export const getIdContract = (chainId) => new Contract(getIdContractAddress(chainId), ID_ABI);

// SATA

export const getSataWrapContractAddress = (chainId) => {
  return consts.SATA_WRAP_CONTRACT_MAINNET;
};

export const getSataWrapContract = (chainId) => new Contract(getSataWrapContractAddress(chainId), WRAP_ABI);

export const getSataTokenAddress = (chainId) => {
  return consts.SATA_CONTRACT_MAINNET;
};

export const getSataTokenContract = (chainId) => new Contract(getSataTokenAddress(chainId), ERC20_ABI);

export function useDepositSata(chainId) {
  const sataWrapContract = getSataWrapContract(chainId);

  const { state, send, events, resetState } = useContractFunction(sataWrapContract, 'deposit', {
    transactionName: 'Deposit SATA'
  });
  return { state, send, events, resetState };
}

export function useWithdrawSata(chainId) {
  const sataWrapContract = getSataWrapContract(chainId);

  const { state, send, events, resetState } = useContractFunction(sataWrapContract, 'withdraw', {
    transactionName: 'Withdraw SATA'
  });
  return { state, send, events, resetState };
}

// USDT

export const getUsdtWrapContractAddress = (chainId) => {
  return consts.USDT_WRAP_CONTRACT_MAINNET;
};

export const getUsdtWrapContract = (chainId) => new Contract(getUsdtWrapContractAddress(chainId), WRAP_ABI);

export const getUsdtTokenAddress = (chainId) => {
  return consts.USDT_CONTRACT_MAINNET;
};

export const getUsdtTokenContract = (chainId) => new Contract(getUsdtTokenAddress(chainId), ERC20_ABI);

export function useDepositUsdt(chainId) {
  const wrapContract = getUsdtWrapContract(chainId);

  const { state, send, events, resetState } = useContractFunction(wrapContract, 'deposit', {
    transactionName: 'Deposit USDT'
  });
  return { state, send, events, resetState };
}

export function useWithdrawUsdt(chainId) {
  const wrapContract = getUsdtWrapContract(chainId);

  const { state, send, events, resetState } = useContractFunction(wrapContract, 'withdraw', {
    transactionName: 'Withdraw USDT'
  });
  return { state, send, events, resetState };
}

// USDC

export const getUsdcWrapContractAddress = (chainId) => {
  return consts.USDC_WRAP_CONTRACT_MAINNET;
};

export const getUsdcWrapContract = (chainId) => new Contract(getUsdcWrapContractAddress(chainId), WRAP_ABI);

export const getUsdcTokenAddress = (chainId) => {
  return consts.USDC_CONTRACT_MAINNET;
};

export const getUsdcTokenContract = (chainId) => new Contract(getUsdcTokenAddress(chainId), ERC20_ABI);

export function useDepositUsdc(chainId) {
  const wrapContract = getUsdcWrapContract(chainId);

  const { state, send, events, resetState } = useContractFunction(wrapContract, 'deposit', {
    transactionName: 'Deposit USDC'
  });
  return { state, send, events, resetState };
}

export function useWithdrawUsdc(chainId) {
  const wrapContract = getUsdcWrapContract(chainId);

  const { state, send, events, resetState } = useContractFunction(wrapContract, 'withdraw', {
    transactionName: 'Withdraw USDC'
  });
  return { state, send, events, resetState };
}

// DAI

export const getDaiWrapContractAddress = (chainId) => {
  return consts.DAI_WRAP_CONTRACT_MAINNET;
};

export const getDaiWrapContract = (chainId) => new Contract(getDaiWrapContractAddress(chainId), WRAP_ABI);

export const getDaiTokenAddress = (chainId) => {
  return consts.DAI_CONTRACT_MAINNET;
};

export const getDaiTokenContract = (chainId) => new Contract(getDaiTokenAddress(chainId), ERC20_ABI);

export function useDepositDai(chainId) {
  const wrapContract = getDaiWrapContract(chainId);

  const { state, send, events, resetState } = useContractFunction(wrapContract, 'deposit', {
    transactionName: 'Deposit DAI'
  });
  return { state, send, events, resetState };
}

export function useWithdrawDai(chainId) {
  const wrapContract = getDaiWrapContract(chainId);

  const { state, send, events, resetState } = useContractFunction(wrapContract, 'withdraw', {
    transactionName: 'Withdraw DAI'
  });
  return { state, send, events, resetState };
}

// SWAP

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

export function shouldBeLoading(state) {
  switch (state) {
    case 'PendingSignature':
      return true;
    case 'Exception':
      return false;
    case 'None':
      return false;
    case 'Mining':
      return true;
    case 'Success':
      return false;
    default:
      return false;
  }
}

export function logLoading(state, name) {
  if (state && window.location.hostname === 'localhost') {
    if (state && state.status !== 'None') {
      console.log({ name, state: { ...state } });
    }
  }
}
