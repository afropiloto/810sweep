// Helper to get variable from import.meta.env supporting both VITE_ and NEXT_PUBLIC_ prefixes
const getEnv = (key: string, defaultValue: string): string => {
  const env = (import.meta as any).env || {};
  return (
    env[`VITE_${key}`] ||
    env[`NEXT_PUBLIC_${key}`] ||
    defaultValue
  );
};

export const API_BASE_URL = getEnv('API_BASE_URL', 'https://eight10-api-server-xrduryn2ya-ew.a.run.app').replace(/\/+$/, '');
export const CHAIN_ID = Number(getEnv('CHAIN_ID', '84532'));
export const CHAIN_NAME = getEnv('CHAIN_NAME', 'Base Sepolia');
export const RPC_URL = getEnv('RPC_URL', 'https://sepolia.base.org');
export const MARKET_FACTORY = getEnv('MARKET_FACTORY', '0xdbF769037b903b3389815263972b3A11008c44ec');
export const USDC_ADDRESS = getEnv('USDC_ADDRESS', '0xeDc470e81998281bcbaaF91578ad0a72D2ee2f71');
export const PRIVY_APP_ID = getEnv('PRIVY_APP_ID', 'cmn5h5prq011m0cl1kh69b9lg');
export const CURRENCY = 'USDC';
