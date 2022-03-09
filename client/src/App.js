import React from "react";
import "./App.css";
import moztoken from "./moztoken.jpg"; // gives image path

function App() {
  const [connected, setConnected] = React.useState(null);
  const [balance, setBalance] = React.useState(null);
  const [publicKey, setPublicKey] = React.useState("");
  const [isMinting, setIsMinting] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetch("/connect")
      .then((res) => res.json())
      .then((data) => setConnected(data.message));
  }, []);

  async function getBalance() {
    fetch(`/get_balance/${publicKey}`)
      .then((res) => res.json())
      .then((data) => setBalance(data.balance));
  }

  async function mintTo() {
    if (publicKey !== "") {
      setIsMinting(true);
      const mintAddress = publicKey;
      fetch(`/mint_to/${mintAddress}`)
        .then((res) => res.json())
        .then((data) => {
          setIsMinting(false);
          if (data.message === "success") {
            getBalance();
            setError("");
          } else if (data.message === "error") {
            setError(
              "Error minting. It's possible the minter may not have sufficient ETH to pay the gas, or your public key is incorrect"
            );
          }
        });
    } else {
      setError("you must enter a public key");
    }
  }

  const handlePublicKeyChange = (e) => {
    setPublicKey(e.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        {connected ? (
          <div className="App-loaded-container">
            <div className="App-logo-container">
              <img className="App-logo" src={moztoken} alt="MozToken Logo" />
            </div>
            <div className="App-input-container">
              <label htmlFor="publicKey">Enter your public key:</label>
              <p>
                <input
                  type="text"
                  className="App-pk-inpu3"
                  id="publicKey"
                  value={publicKey}
                  onChange={handlePublicKeyChange}
                  placeholder="0x000..."
                />
              </p>
            </div>

            <div className="App-button-container">
              {!isMinting ? (
                <button className="App-mint-button" onClick={mintTo}>
                  Gimme Some MOZ
                </button>
              ) : (
                <button className="App-mint-button">
                  Minting in progress...
                </button>
              )}
            </div>
            <div className="App-output-container">
              {balance && (
                <p>
                  <span className="bold">Your Balance:</span> {balance} MOZ
                </p>
              )}
              {error && <p>Error: {error}</p>}
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </header>
    </div>
  );
}

export default App;
