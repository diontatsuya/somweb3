// src/App.jsx
import { useEffect, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { createPublicClient, http } from "viem";
import { defineChain } from "viem/chains";

const somniaTestnet = defineChain({
  id: 50312,
  name: 'Somnia Testnet',
  nativeCurrency: {
    name: 'Somnia Token',
    symbol: 'STT',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://dream-rpc.somnia.network']
    },
  },
});

const client = createPublicClient({
  chain: somniaTestnet,
  transport: http()
});

export default function App() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets } = useWallets();
  const [balance, setBalance] = useState(null);

  const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
  const address = embeddedWallet?.address;

  useEffect(() => {
    if (!address) return;
    async function fetchBalance() {
      const bal = await client.getBalance({ address });
      setBalance(Number(bal) / 1e18);
    }
    fetchBalance();
  }, [address]);

  if (!ready) return <p>Loading...</p>;

  return (
    <main className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Somnia Testnet dApp</h1>

      {!authenticated ? (
        <button onClick={login} className="bg-blue-500 text-white px-4 py-2 rounded">
          Login with Privy
        </button>
      ) : (
        <div className="space-y-4">
          <p>✅ Logged in as: <strong>{user?.email || address}</strong></p>
          <p>💼 Wallet Address: <code>{address}</code></p>
          {balance !== null && <p>💰 Balance: {balance.toFixed(4)} STT</p>}
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>
      )}
    </main>
  );
}
