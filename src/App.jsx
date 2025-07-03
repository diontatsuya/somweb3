import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

export default function App() {
  const { ready, authenticated, login, logout, user } = usePrivy();

  if (!ready) return <div>Loading...</div>;

  return (
    <div style={{ textAlign: 'center', paddingTop: '100px' }}>
      <h1>Privy Login</h1>
      {authenticated ? (
        <div>
          <p>👛 Wallet: {user?.wallet?.address}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  );
}
