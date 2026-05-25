import { mainnet, bsc, polygon, fantom, avalanche, metis, arbitrum } from 'wagmi/chains';

export const SUPPORTED_CHAINS = [mainnet, bsc, avalanche, fantom, metis, polygon, arbitrum];

export const SUPPORTED_CHAIN_IDS = SUPPORTED_CHAINS.map((c) => c.id);

export const SANCTIONS_SUPPORTED_CHAIN_IDS = [
  mainnet.id,
  bsc.id,
  avalanche.id,
  fantom.id,
  polygon.id,
  arbitrum.id
];

const SWAP = {
  [mainnet.id]: '0x9D416D72ec596B830889aBF95037AC7E0f887Aa6',
  [bsc.id]: '0x4D6A137B248dB37672D99d33f8696012fA4Bd2F3',
  [avalanche.id]: '0xf7aA340c32B7CB6aE9Eb24Da659b484E67987bB3',
  [fantom.id]: '0xE73f02493a60f1c8599deffE71cDFFd23E3A9e45',
  [metis.id]: '0xE73f02493a60f1c8599deffE71cDFFd23E3A9e45',
  [polygon.id]: '0x4D6A137B248dB37672D99d33f8696012fA4Bd2F3',
  [arbitrum.id]: '0x03DE09777952082B12C968785FfDC898bfBb3F52'
};

const ID = {
  [mainnet.id]: '0x8101429f99aFD10C494F5427E697716c4fD74AcC',
  [bsc.id]: '0x3ebb4A4e91Ad83BE51F8d596533818b246F4bEe1',
  [avalanche.id]: '0x2D8C199371bAC9f63A5a0EE4448A5b329531eCdF',
  [fantom.id]: '0x0BaFDe3aDAd83b679FAE5E9793Cd44ab247c6096',
  [metis.id]: '0xbec0A9aEa58b6a0c0f05a03078f7E7Dcecc13A95',
  [polygon.id]: '0x545f8952A5cADF63DeE9658C189B309FAd5d789f',
  [arbitrum.id]: '0xe1A0f23b29fba2c82d8af15D354aaE048AE1Cd13'
};

const RIGHTS = {
  [mainnet.id]: '0x5E93D064008D7D3001f27E296a1B046635a58baa',
  [bsc.id]: '0xbec0A9aEa58b6a0c0f05a03078f7E7Dcecc13A95',
  [avalanche.id]: '0x8f2F667bf1E3411FC2f6ef8f12F6aD1E939a13CA',
  [fantom.id]: '0x5120db1015610bd7088157359ce92f3a4906faf7',
  [metis.id]: '0x5120DB1015610BD7088157359ce92f3a4906faf7',
  [polygon.id]: '0xe1A0f23b29fba2c82d8af15D354aaE048AE1Cd13',
  [arbitrum.id]: '0x3ebb4A4e91Ad83BE51F8d596533818b246F4bEe1'
};

const KYC_CLAIM = {
  [mainnet.id]: '0xd5Aea1C83b57B03Ebe7D71F3dbee7Ae79cB9A4F2',
  [bsc.id]: '0x2D8C199371bAC9f63A5a0EE4448A5b329531eCdF',
  [avalanche.id]: '0x84F104d014Cc61FD6Ce2a9172eD9349e2135F6eF',
  [fantom.id]: '0x8f2F667bf1E3411FC2f6ef8f12F6aD1E939a13CA',
  [metis.id]: '0x8f2F667bf1E3411FC2f6ef8f12F6aD1E939a13CA',
  [polygon.id]: '0x3ebb4A4e91Ad83BE51F8d596533818b246F4bEe1',
  [arbitrum.id]: '0x0BaFDe3aDAd83b679FAE5E9793Cd44ab247c6096'
};

export const getSwapAddress = (chainId) => SWAP[chainId];
export const getIdAddress = (chainId) => ID[chainId];
export const getRightsAddress = (chainId) => RIGHTS[chainId];
export const getKycClaimAddress = (chainId) => KYC_CLAIM[chainId];

export const isChainSupported = (chainId) => SUPPORTED_CHAIN_IDS.includes(chainId);
export const isSanctionsSupported = (chainId) => SANCTIONS_SUPPORTED_CHAIN_IDS.includes(chainId);

export const WRAPPED_ASSETS_MAINNET = [
  {
    key: 'SATA',
    label: 'vSATA',
    underlying: '0x3ebb4A4e91Ad83BE51F8d596533818b246F4bEe1',
    wrap: '0xC20E9F2e42f31CC7f1D531cc2df152a2b135871A'
  },
  {
    key: 'USDT',
    label: 'vUSDT',
    underlying: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    wrap: '0x09877260e069e774D5938e33A7B2CC67bCF472a1'
  },
  {
    key: 'USDC',
    label: 'vUSDC',
    underlying: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    wrap: '0x9d8446Ee81d974cee51028eC03803960AcDA051f'
  },
  {
    key: 'DAI',
    label: 'vDAI',
    underlying: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    wrap: '0xb44b095F626E95FE86E8B880e9eadAc47d51408a'
  }
];

const TRUST_LISTS = {
  [mainnet.id]: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/tokenlist.json',
  [bsc.id]: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/tokenlist.json',
  [avalanche.id]: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/tokenlist.json',
  [fantom.id]: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/tokenlist.json',
  [polygon.id]: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/tokenlist.json',
  [arbitrum.id]: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/tokenlist.json'
};

export const getTokenListUrl = (chainId) => TRUST_LISTS[chainId] || null;
