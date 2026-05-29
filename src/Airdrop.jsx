import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useCallback, useEffect, useRef, useState } from "react";

export function Airdrop() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();

  const [amount, setAmount] = useState("");
  const [rawBalance, setRawBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const prevPublicKeyRef = useRef(null);

  // Derived — no setState needed for reset
  const balance = connected ? rawBalance : 0;

  const fetchBalance = useCallback(async (key) => {
    if (!key) return;
    try {
      const lamports = await connection.getBalance(key);
      setRawBalance(lamports / LAMPORTS_PER_SOL);
    } catch (err) {
      console.error("Failed to fetch balance:", err);
    }
  }, [connection]);

  useEffect(() => {
    if (publicKey && publicKey !== prevPublicKeyRef.current) {
      prevPublicKeyRef.current = publicKey;
      fetchBalance(publicKey);
    }

    if (!publicKey) {
      prevPublicKeyRef.current = null;
    }
  }, [publicKey, fetchBalance]);

  const sendAirdropToUser = useCallback(async () => {
    if (!publicKey) {
      alert("Please connect your wallet first");
      return;
    }

    const parsed = Number(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);

      const signature = await connection.requestAirdrop(
        publicKey,
        parsed * LAMPORTS_PER_SOL
      );

      const latestBlockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction(
        { signature, ...latestBlockhash },
        "confirmed"
      );

      await fetchBalance(publicKey);
      setAmount("");
      alert("Airdrop successful 🚀");
    } catch (err) {
      console.error(err);
      alert("Airdrop failed");
    } finally {
      setLoading(false);
    }
  }, [publicKey, amount, connection, fetchBalance]);

  return (
    <div className="faucet-card">

      {!connected ? (
        <p>Connect your wallet to continue.</p>
      ) : (
        <>
          <div className="balance-box">
            <h5>Current Balance 🪙</h5>
            <h3>{balance.toFixed(4)} SOL</h3>
          </div>

          <div className="address-box">
            <small>Wallet Address</small>
            <p>{publicKey?.toBase58()}</p>
          </div>

          <input
            type="number"
            placeholder="Amount in SOL"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button onClick={sendAirdropToUser} disabled={loading}>
            {loading ? "Processing..." : "Send Airdrop"}
          </button>
        </>
      )}
    </div>
  );
}