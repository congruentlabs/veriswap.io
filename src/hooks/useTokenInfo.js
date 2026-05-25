import { useReadContracts } from 'wagmi';
import { erc20Abi, isAddress } from 'viem';

export function useTokenInfo(tokenAddress, owner, spender) {
  const enabled = Boolean(tokenAddress && isAddress(tokenAddress));
  const baseContract = enabled
    ? { address: tokenAddress, abi: erc20Abi }
    : undefined;

  const contracts = enabled
    ? [
        { ...baseContract, functionName: 'name' },
        { ...baseContract, functionName: 'symbol' },
        { ...baseContract, functionName: 'decimals' },
        ...(owner ? [{ ...baseContract, functionName: 'balanceOf', args: [owner] }] : []),
        ...(owner && spender
          ? [{ ...baseContract, functionName: 'allowance', args: [owner, spender] }]
          : [])
      ]
    : [];

  const result = useReadContracts({
    contracts,
    query: { enabled: contracts.length > 0 }
  });

  const data = result.data || [];
  return {
    ...result,
    name: data[0]?.result,
    symbol: data[1]?.result,
    decimals: data[2]?.result,
    balance: owner ? data[3]?.result : undefined,
    allowance: owner && spender ? data[4]?.result : undefined
  };
}
