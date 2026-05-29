import "./App.css";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import {
  WalletModalProvider,
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";

import "@solana/wallet-adapter-react-ui/styles.css";

import { Airdrop } from "./Airdrop";

function App() {
  return (
    <ConnectionProvider
      endpoint="https://api.devnet.solana.com"
    >
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div className="container">
            <h1>Solana Devnet Faucet</h1>

            <div className="wallet-buttons">
              <WalletMultiButton />
              <WalletDisconnectButton />
            </div>

            <Airdrop />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;