"use client";
import { createContext, useContext, useEffect, useState } from "react";
import DLSJSON from "../constants/DLS.json";
import { ContractInterface, ethers, providers } from "ethers";
import { DLSAddress } from "../constants/contractAddress";
import Web3Modal from "web3modal";
import useContract from "../hooks/useContract";
import { getData } from "../../@core/helpers/localStorage";
import {
  GET_ALL_LAND_RECORD_STATUS,
  LAND_RECORD_STATUS,
  LOCAL_STORAGE_KEYS,
  ROLES,
} from "../../@core/globals/enums";

const initialValue = {
  connectToWallet: () => {},
  fetchAllUsers: async (type: ROLES | "users" = "users") => [],
  fetchSpecificUser: async (userAddress: string) => ({}),
  addNewModerator: async (userAddress: string) => {},
  addNewAdmin: async (userAddress: string) => {},
  addNewLandRecord: async (ipfsHash: string, cnic: string) => {},
  refreshLogin: async (address: string, skipCurrentLogin: boolean) => {},
  getAllLandRecords: async (type: GET_ALL_LAND_RECORD_STATUS) => [],
  getOwnerLandRecords: async (cnic: string) => [],
  approveProperty: async (itemId: number, ownershipChangeReq = false) => {},
  rejectProperty: async (
    itemId: number,
    msg: string,
    ownershipChangeReq = false
  ) => {},
  fetchSinglePropertyInfo: async (itemId: string) => ({}),
  transferLandOwnership: async (
    itemId: string,
    ipfsHash: string,
    cnic: string
  ) => {},
  userAddress: "",
  err: null,
  loading: false,
  contract: null,
  userRole: ROLES.visitor,
  contractErr: "",
};

const DLSContext = createContext(initialValue);

export const useDLSContext = () => {
  return useContext(DLSContext);
};

export const DLSContextProvider = ({ children }) => {
  const [userAddress, setUserAddress] = useState("");
  const [err, setErr] = useState(null);

  const contractFile = useContract({ userAddress });

  const accountChangedHandler = async (newAccount) => {
    const address = await newAccount.getAddress();

    setUserAddress(address);
    const balance = await newAccount.getBalance();

    await contractFile.loginUser(address);
  };

  const connectToWallet = async () => {
    if (!window) {
      return console.log("please wait");
    }

    if (!window.ethereum) return setErr("Please install the metamask/phantom");

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    contractFile.setLoading(true);
    try {
      await provider.send("eth_requestAccounts", []);

      await accountChangedHandler(provider.getSigner());
    } catch (err) {
      console.log("err in connectToWallet ", err);
    }
    contractFile.setLoading(false);
  };

  const refreshLogin = async (address: string, skipCurrentLogin: boolean) => {
    await contractFile.loginUser(address, skipCurrentLogin);
    setUserAddress(address);
  };

  return (
    <DLSContext.Provider
      value={{
        connectToWallet,
        userAddress,
        err,
        refreshLogin,
        ...contractFile,
      }}
    >
      {children}
    </DLSContext.Provider>
  );
};
