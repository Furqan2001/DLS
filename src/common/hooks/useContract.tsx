import DLSJSON from "../constants/DLS.json";
import { ContractInterface, ethers, providers } from "ethers";
import { DLSAddress } from "../constants/contractAddress";
import Web3Modal from "web3modal";
import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import {
  LOCAL_STORAGE_KEYS,
  ROLES,
  SOLIDITY_ROLES_ENUM,
  URLS,
} from "../../@core/globals/enums";
import { saveData } from "../../@core/helpers/localStorage";

const abi = DLSJSON.abi;

const fetchContract = (signerOrProvider: ethers.providers.JsonRpcSigner) =>
  new ethers.Contract(DLSAddress, abi, signerOrProvider);

const useContract = () => {
  const [contract, setContract] = useState<ethers.Contract>();
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<ROLES>();

  const router = useRouter();
  const fetchContractDetails = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = await fetchContract(signer);

      setContract(contract);
    } catch (err) {
      console.log("err in fetching the contract ", err);
    }

    return contract;
  };

  const loginUser = async (currentAccountAddress: string) => {
    const contract = await fetchContractDetails();
    if (!contract) {
      setLoading(false);
      return console.log(
        "please try again later. Error in fetching the contract "
      );
    }
    const user = await contract.getUser();

    if (/^0x0+$/.test(user["userAddress"])) {
      // user is not find, so create a new user
      try {
        await contract.registerNewUser();
      } catch (err) {
        console.log("err in doing tranaction ", err);
        return;
      }
    }

    assignUserRole(user);
    saveData(LOCAL_STORAGE_KEYS.accountAddress, currentAccountAddress);
    router.push(URLS.dashboard);
  };

  const assignUserRole = (user: { role: SOLIDITY_ROLES_ENUM }) => {
    if (user.role === SOLIDITY_ROLES_ENUM.Moderator) {
      setUserRole(ROLES.moderator);
    } else if (user.role === SOLIDITY_ROLES_ENUM.Admin) {
      setUserRole(ROLES.admin);
    } else {
      setUserRole(ROLES.visitor);
    }
  };

  const fetchAllUsers = async () => {
    let users = [];
    try {
      users = await contract.fetchAllUsers();
    } catch (err) {
      console.log("err in fetching all the users ", contract, err);
    }
    return users;
  };

  const fetchSpecificUser = useCallback(
    async (userAddress: string) => {
      if (!contract) return;
      try {
        const user = await contract.fetchSingleUser(userAddress);
        console.log("user is ", user);
      } catch (err) {
        console.log("err in fetching the user ", contract, err);
      }
    },
    [contract]
  );

  return {
    fetchContractDetails,
    loginUser,
    fetchAllUsers,
    contract,
    loading,
    userRole,
    setLoading,
    fetchSpecificUser,
  };
};

export default useContract;
