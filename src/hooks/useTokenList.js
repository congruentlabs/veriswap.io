import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getTokenListUrl } from '../consts.js';

export function useTokenList(chainId) {
  return useQuery({
    queryKey: ['tokenList', chainId],
    enabled: Boolean(chainId && getTokenListUrl(chainId)),
    staleTime: 1000 * 60 * 60,
    queryFn: async () => {
      const url = getTokenListUrl(chainId);
      if (!url) return [];
      const res = await axios.get(url);
      return (res.data?.tokens || []).map((t) => ({
        address: t.address,
        symbol: t.symbol,
        name: t.name,
        decimals: t.decimals,
        logoURI: t.logoURI
      }));
    }
  });
}
