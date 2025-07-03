// src/App.jsx
import { useEffect, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { createPublicClient, http } from "viem";
import { defineChain } from "viem/chains";
import { parseAbi } from "viem";

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

const DOMAIN_CONTRACT_ADDRESS = "0xF390f308B1Cf93e7AbB1FDa86B3c4A94aB2EfB75";
const DOMAIN_ABI = parseAbi([
  "function getName(address owner) view returns (string)"
]);

export default function App() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const [balance, setBalance] = useState(null);
  const [domain, setDomain] = useState(null);

  const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
  const address = embeddedWallet?.address;

  useEffect(() => {
    if (!address) return;

    async function fetchData() {
      const bal = await client.getBalance({ address });
      setBalance(Number(bal) / 1e18);

      try {
        const name = await client.readContract({
          address: DOMAIN_CONTRACT_ADDRESS,
          abi: DOMAIN_ABI,
          functionName: "getName",
          args: [address]
        });
        setDomain(name);
      } catch (err) {
        setDomain(null);
      }
    }

    fetchData();
  }, [address]);

  if (!ready)
    return (
      <div className="text-white bg-black h-screen flex items-center justify-center text-2xl">
        Loading game interface...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-green-400 font-mono p-6">
      <div className="max-w-xl mx-auto border border-green-500 p-6 rounded-xl bg-black/60 shadow-xl backdrop-blur-sm">
        <h1 className="text-3xl font-bold mb-6 text-center border-b border-green-600 pb-2">
          🎮 Somnia Web3 Console
        </h1>

        {!authenticated ? (
          <button
            onClick={login}
            className="w-full bg-green-700 hover:bg-green-600 text-white py-3 rounded text-xl"
          >
            Connect to Somnia
          </button>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-900 p-4 rounded border border-green-600">
              <p className="text-lg">👤 Identity: <strong>{domain || "-"}</strong></p>
              <p>💼 Wallet: <code className="break-words">{address}</code></p>
              <p>💰 STT Balance: <strong>{balance?.toFixed(4) ?? "..."}</strong></p>
            </div>
            <button
              onClick={logout}
              className="w-full bg-red-700 hover:bg-red-600 text-white py-3 rounded text-xl"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
