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
import { IBlockchainUserInfo } from "../../@core/globals/types";

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

  const loginUser = async (
    currentAccountAddress: string,
    skipRouting = false
  ) => {
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

    const role = getUserRole(user);

    setUserRole(role);

    if (!skipRouting) {
      saveData(LOCAL_STORAGE_KEYS.accountAddress, currentAccountAddress);
      router.push(URLS.dashboard);
    }
  };

  const getUserRole = (user: { role: SOLIDITY_ROLES_ENUM }) => {
    if (user.role === SOLIDITY_ROLES_ENUM.Moderator) {
      return ROLES.moderator;
    } else if (user.role === SOLIDITY_ROLES_ENUM.Admin) {
      return ROLES.admin;
    } else {
      return ROLES.visitor;
    }
  };

  const fetchAllUsers = async (
    type: ROLES.admin | ROLES.moderator | "users" = "users"
  ) => {
    let users = [];

    console.log("type is ", type);
    try {
      if (type === "users") {
        users = await contract.fetchAllUsers();
      } else if (type === ROLES.admin) {
        users = await contract.fetchAllAdmins();
      } else if (type === ROLES.moderator) {
        users = await contract.fetchAllModerators();
      }
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

        return {
          userAddress: user.userAddress,
          adminApprovalsLeft: Number(user.adminApprovalsLeft),
          modApprovalsLeft: Number(user.modApprovalsLeft),
          role: getUserRole(user),
        };
      } catch (err) {
        console.log("err in fetching the user ", contract, err);
      }
    },
    [contract]
  );

  const addNewModerator = useCallback(
    async (userAddress: string) => {
      if (!contract) return;
      setLoading(true);
      try {
        await contract.addNewModerator(userAddress);
      } catch (err) {
        console.log("err in making the moderator ", contract, err);
      }
      setLoading(false);
    },
    [contract]
  );

  const addNewAdmin = useCallback(
    async (userAddress: string) => {
      if (!contract) return;
      setLoading(true);
      try {
        await contract.addNewAdmin(userAddress);
      } catch (err) {
        console.log("err in making the moderator ", contract, err);
      }
      setLoading(false);
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
    addNewModerator,
    addNewAdmin,
  };
};

export default useContract;
