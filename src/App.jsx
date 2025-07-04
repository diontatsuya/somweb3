import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function App() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();

  const [walletAddress, setWalletAddress] = useState("-");
  const [sttBalance, setSttBalance] = useState("-");
  const [loadingBalance, setLoadingBalance] = useState(false);

  useEffect(() => {
    if (!ready || !authenticated) return;

    const fetchWalletInfo = async () => {
      const privyWallet = wallets[0];
      if (!privyWallet) return;

      const address = privyWallet.address;
      setWalletAddress(address);

      try {
        setLoadingBalance(true);
        const provider = new ethers.providers.JsonRpcProvider("https://rpc-testnet.somnia.network");
        const balance = await provider.getBalance(address);
        setSttBalance(parseFloat(ethers.utils.formatEther(balance)).toFixed(4));
      } catch (error) {
        console.error("Failed to fetch balance:", error);
        setSttBalance("Error");
      } finally {
        setLoadingBalance(false);
      }
    };

    fetchWalletInfo();
  }, [ready, authenticated, wallets]);

  if (!ready) return <div className="console">⏳ Loading...</div>;
  if (!authenticated)
    return (
      <div className="console">
        <h2>🎮 Somnia Web3 Console</h2>
        <p>🔐 Status: Not Connected</p>
        <button onClick={login}>Login</button>
      </div>
    );

  return (
    <div className="console">
      <h2>🎮 Somnia Web3 Console</h2>
      <p>🔐 Status: Connected</p>
      <p>💼 Wallet: {walletAddress}</p>
      <p>
        💰 STT Balance:{" "}
        {loadingBalance ? (
          <span>Loading...</span>
        ) : (
          <span>{sttBalance}</span>
        )}
      </p>
      <button onClick={logout}>Log Out</button>
    </div>
  );
}
