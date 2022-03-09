import React from "react";
import "./App.css";
import { ThirdwebProvider } from "@3rdweb/react";
import Interface from "./Interface";
function App() {
  // Put the ethereum chain ids of the chains you want to support
  const supportedChainIds = [1, 4, 137]; //ethereum(1), ethereum rinkeby (4), polygon(137)

  const connectors = {
    injected: {},
  };

  /**
   * Make sure that your app is wrapped with these contexts.
   * If you're using Next JS, you'll have to replace children with the Component setup
   */
  return (
    <ThirdwebProvider
      connectors={connectors}
      supportedChainIds={supportedChainIds}
    >
      <Interface />
    </ThirdwebProvider>
  );
}

export default App;