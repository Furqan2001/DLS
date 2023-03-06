"use client";
import { createContext, useContext, useEffect, useState } from "react";
import DLSJSON from "../constants/DLS.json";
import { ContractInterface, ethers, providers } from "ethers";
import { DLSAddress } from "../constants/contractAddress";
import Web3Modal from "web3modal";
import useContract from "../hooks/useContract";
import { getData } from "../../@core/helpers/localStorage";
import { LOCAL_STORAGE_KEYS } from "../../@core/globals/enums";

const initialValue = {
  connectToWallet: () => {},
  currentAccount: "",
  err: null,
  loading: false,
};

const DLSContext = createContext(initialValue);

export const useDLSContext = () => {
  return useContext(DLSContext);
};

export const DLSContextProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [err, setErr] = useState(null);

  const { fetchContractDetails, loginUser, loading, setLoading } =
    useContract();

  const accountChangedHandler = async (newAccount) => {
    const address = await newAccount.getAddress();
    setCurrentAccount(address);
    const balance = await newAccount.getBalance();

    await loginUser(address);
  };

  const connectToWallet = async () => {
    if (!window) {
      return console.log("please wait");
    }

    if (!window.ethereum) return setErr("Please install the metamask/phantom");

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    setLoading(true);
    try {
      await provider.send("eth_requestAccounts", []);

      await accountChangedHandler(provider.getSigner());
    } catch (err) {
      console.log("err in connectToWallet ", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      const address = getData(LOCAL_STORAGE_KEYS.web3AccountAddress);
      if (!!address) {
        await loginUser(address);
        setCurrentAccount(address);
      }
    })();
  }, []);

  return (
    <DLSContext.Provider
      value={{ connectToWallet, currentAccount, err, loading }}
    >
      {children}
    </DLSContext.Provider>
  );
};
