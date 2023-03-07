import { createContext, useContext, useEffect, useState } from "react";
import DLSJSON from "../../artifacts/contracts/DLS.sol/DLS.json";
import { ContractInterface, ethers, providers } from "ethers";
import { DLSAddress } from "../../config";

const abi = DLSJSON.abi;

declare global {
  interface Window {
    ethereum?: providers.ExternalProvider;
  }
}

const initialValue = {
  connectToWallet: () => {},
  currentAccount: "",
  err: null,
};

const DLSContext = createContext(initialValue);

export const useDLSContext = () => {
  return useContext(DLSContext);
};

export const DLSContextProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("42");
  const [err, setErr] = useState(null);

  const connectToWallet = async () => {
    console.log("connect to wallet ");
    if (!window) {
      return console.log("please wait");
    }

    if (!window.ethereum) return setErr("Please install the metamask/phantom");

    const account = (await window.ethereum.request({
      method: "eth_accounts",
    })) as string[];

    if (account.length) {
      console.log("current connected account is ", account[0]);
      setCurrentAccount(account[0]);
    } else {
      setErr("Please install the metamask/phantom & connect, reload");
    }
  };

  return (
    <DLSContext.Provider value={{ connectToWallet, currentAccount, err }}>
      {children}
    </DLSContext.Provider>
  );
};

const fetchContract = (signerOrProvider: ContractInterface) =>
  new ethers.Contract(DLSAddress, signerOrProvider);
