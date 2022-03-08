const express = require("express");
const ethers = require("ethers").ethers;
const ThirdwebSDK = require("@3rdweb/sdk").ThirdwebSDK;
require("dotenv").config();

const PORT = process.env.PORT || 3001;
const path = require("path");
const app = express();

// Instantiate thirdrdweb SDK

// This url indicates which chain you want to connect to
const rpcUrl = "https://rinkeby-light.eth.linkpool.io/"; //rinkeby (ethereum test net)
// You can switch out this provider with any wallet or provider setup you like.
//const provider = ethers.Wallet.createRandom(); //from code sample in thirdweb
const provider = ethers.getDefaultProvider(rpcUrl);
const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    // Your wallet private key
    process.env.PRIVATE_KEY,
    // RPC URL
    provider
  )
);

// Instantiate Token module
const token = sdk.getTokenModule("0xc33A4EBa66A3a3Cf84F898f2398966Bf6A2e37a3");
// Address of the wallet who owns the funds
const ownerAddress = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";

async function getBalance(balanceAddress) {
  const balance = await token.balanceOf(balanceAddress);
  return balance;
}

async function transferBalance(balanceAddress) {
  const amount = 1; // The number of tokens you want to send
  // Note that the connected wallet must have approval to transfer the tokens of the fromAddress
  return await token.transferFrom(ownerAddress, balanceAddress, amount);
}

async function mintTo(mintAddress) {
  const amount = 1; // The number of tokens you want to send
  // Note that the connected wallet must have approval to transfer the tokens of the fromAddress
  return await token.mintTo(mintAddress, amount);
}

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get("/api", (req, res) => {
  res.json({ message: "connected to server" });
});

app.get("/get_balance/:userAddress", async (req, res) => {
  try {
    console.log("userAddress", req.params.userAddress);
    const balanceAddress = req.params.userAddress
      ? req.params.userAddress
      : ownerAddress;

    const balance = await getBalance(balanceAddress);
    console.log("balance", balance);
    const balanceVal =
      balance.decimals > 0
        ? balance.displayValue
        : ethers.utils.formatEther(balance.value);
    res.json({ balance: balanceVal });
  } catch (error) {
    console.log("error", error);
    res.json({ balance: "error" });
  }
});

app.get("/transfer_balance/:userAddress", async (req, res) => {
  try {
    const balanceAddress = req.params.userAddress;
    const balance = await transferBalance(balanceAddress);
    console.log("balance", balance);
    res.json({ balance: balanceVal });
  } catch (error) {
    console.log("error", error);
    res.json({ balance: "error" });
  }
});

app.get("/mint_to/:userAddress", async (req, res) => {
  try {
    const mintAddress = req.params.userAddress;
    const mintResponse = await mintTo(mintAddress);
    console.log("mintResponse", mintResponse);
    res.json({ message: mintResponse });
  } catch (error) {
    console.log("error", error);
    res.json({ message: "error" });
  }
});



app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
