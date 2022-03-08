import React from "react";
import "./App.css";

function App() {
  const [data, setData] = React.useState(null);
  const [connected, setConnected] = React.useState(null);
  const [balance, setBalance] = React.useState(null);

  const ownerAddress = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  async function getBalance() {
    fetch(`/get_balance/${ownerAddress}`)
      .then((res) => res.json())
      .then((data) => setBalance(data.balance));
  }

  async function transferBalance() {
    const transferAddress = "0x82A820016E3dE2b0c1e259B4aBB275c0E8f8E33F"; //THOMAS
    fetch(`/transfer_balance/${transferAddress}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }

  async function mintTo() {
    const transferAddress = "0x82A820016E3dE2b0c1e259B4aBB275c0E8f8E33F"; //THOMAS
    fetch(`/mint_to/${transferAddress}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>{!data ? "Loading..." : data}</p>
        <button onClick={getBalance}>getBalance</button>
        <p>{!balance ? "" : `Balance: ${balance}`}</p>
        <button onClick={mintTo}>mintTo</button>
      </header>
    </div>
  );
}

export default App;
