import { PrivyProvider, useLogin, usePrivy } from '@privy-io/react-auth';

const LoggedIn = () => {
  const { user } = usePrivy();
  return (
    <div>
      <h2>Login sukses!</h2>
      <p>Wallet: {user.wallet?.address}</p>
    </div>
  );
};

const LoggedOut = () => {
  const { login } = useLogin();
  return (
    <button onClick={login}>
      Login with Privy
    </button>
  );
};

const MyApp = () => {
  const { ready, authenticated } = usePrivy();
  if (!ready) return <p>Loading...</p>;
  return authenticated ? <LoggedIn /> : <LoggedOut />;
};

export default function App() {
  return (
    <PrivyProvider appId="cmcn6y46j00mnl40m3u5bee9v">
      <h1 style={{ textAlign: 'center', marginTop: '50px' }}>somweb3</h1>
      <MyApp />
    </PrivyProvider>
  );
}
