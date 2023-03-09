"use client";
import { createContext, useContext, useEffect, useState } from "react";
import DLSJSON from "../constants/DLS.json";
import { ContractInterface, ethers, providers } from "ethers";
import { DLSAddress } from "../constants/contractAddress";
import Web3Modal from "web3modal";
import useContract from "../hooks/useContract";
import { getData } from "../../@core/helpers/localStorage";
import { LOCAL_STORAGE_KEYS, ROLES } from "../../@core/globals/enums";

const initialValue = {
  connectToWallet: () => {},
  userAddress: "",
  err: null,
  loading: false,
  fetchAllUsers: async () => [],
  fetchSpecificUser: async (userAddress: string) => {},
  contract: null,
  userRole: ROLES.visitor,
};

const DLSContext = createContext(initialValue);

export const useDLSContext = () => {
  return useContext(DLSContext);
};

export const DLSContextProvider = ({ children }) => {
  const [userAddress, setUserAddress] = useState("");
  const [err, setErr] = useState(null);

  const {
    fetchContractDetails,
    fetchSpecificUser,
    fetchAllUsers,
    loginUser,
    loading,
    setLoading,
    contract,
    userRole,
  } = useContract();

  const accountChangedHandler = async (newAccount) => {
    const address = await newAccount.getAddress();
    console.log("address is ", address);
    setUserAddress(address);
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
      const address = getData(LOCAL_STORAGE_KEYS.accountAddress);

      if (!!address) {
        await loginUser(address);
        setUserAddress(address);
      }
    })();
  }, []);

  return (
    <DLSContext.Provider
      value={{
        connectToWallet,
        fetchAllUsers,
        fetchSpecificUser,
        userRole,
        userAddress,
        err,
        loading,
        contract,
      }}
    >
      {children}
    </DLSContext.Provider>
  );
};
