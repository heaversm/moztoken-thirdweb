const express = require("express");
const ethers = require("ethers").ethers;
const ThirdwebSDK = require("@3rdweb/sdk").ThirdwebSDK;
require("dotenv").config();

const PORT = process.env.PORT || 3001;
const path = require("path");
const app = express();

// Instantiate thirdrdweb SDK

// This url indicates which chain you want to connect to
//const rpcUrl = "https://rinkeby-light.eth.linkpool.io/"; //rinkeby (ethereum test net)
const rpcUrl = "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"; //rinkeby (ethereum test net)
//const rpcUrl = "https://matic-mumbai.chainstacklabs.com"; //polygon mumbai
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
const token = sdk.getTokenModule("0x4cAA8c43D87EF8fd05B941a139efE55097E8aEf7");


async function getBalance(balanceAddress) {
  const balance = await token.balanceOf(balanceAddress);
  return balance;
}

async function mintTo(mintAddress) {
  console.log(`address: ${mintAddress}`);
  //const amount = 1; // The number of tokens you want to send
  // Note that the connected wallet must have approval to transfer the tokens of the fromAddress
  return await token.mintTo(mintAddress, ethers.utils.parseEther("1"));
}

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get("/connect", (req, res) => {
  res.json({ message: "connected to server" });
});

app.get("/get_balance/:userAddress", async (req, res) => {
  try {
    console.log("userAddress", req.params.userAddress);
    const balanceAddress = req.params.userAddress;

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

app.get("/mint_to/:userAddress", async (req, res) => {
  try {
    const mintAddress = req.params.userAddress;
    await mintTo(mintAddress);
    res.json({ message: "success" });
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
