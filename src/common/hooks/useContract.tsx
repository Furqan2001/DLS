import DLSJSON from "../constants/DLS.json";
import { ContractInterface, ethers, providers } from "ethers";
import { DLSAddress } from "../constants/contractAddress";
import Web3Modal from "web3modal";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LOCAL_STORAGE_KEYS, ROLES, URLS } from "../../@core/globals/enums";
import { saveData } from "../../@core/helpers/localStorage";
import { IBlockchainUserInfo, ILandRecord } from "../../@core/globals/types";
import {
  convertBigHexNumberToNumber,
  getLandRecordStatus,
  getRole,
  isNullAddress,
} from "../../@core/helpers";

const abi = DLSJSON.abi;

const fetchContract = (signerOrProvider: ethers.providers.JsonRpcSigner) =>
  new ethers.Contract(DLSAddress, abi, signerOrProvider);

const useContract = ({ userAddress }: { userAddress: string }) => {
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
    } else {
      setContract(contract);
    }

    const user = await contract.getUser();

    if (isNullAddress(user["userAddress"])) {
      // user is not find, so create a new user
      try {
        await contract.registerNewUser();
      } catch (err) {
        console.log("err in doing tranaction ", err);
        return;
      }
    }

    const role = getRole(user.role);

    setUserRole(role);

    if (!skipRouting) {
      saveData(LOCAL_STORAGE_KEYS.accountAddress, currentAccountAddress);
      router.push(URLS.dashboard);
    }
  };

  const fetchAllUsers = async (
    type: ROLES.admin | ROLES.moderator | "users" = "users"
  ) => {
    let users = [];

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
      if (!contract || !userAddress) return;

      try {
        const user = await contract.fetchSingleUser(userAddress);

        return {
          userAddress: user.userAddress,
          adminApprovalsLeft: convertBigHexNumberToNumber(
            user.adminApprovalsLeft
          ),
          modApprovalsLeft: convertBigHexNumberToNumber(user.modApprovalsLeft),
          role: getRole(user.role),
        };
      } catch (err) {
        console.log("err in fetching the user ", contract, err);
      }
    },
    [!!contract, userAddress]
  );

  const addNewModerator = useCallback(
    async (userAddress: string) => {
      if (!contract || !userAddress) return;
      setLoading(true);
      try {
        await contract.addNewModerator(userAddress);
      } catch (err) {
        console.log("err in making the moderator ", contract, err);
      }
      setLoading(false);
    },
    [!!contract, userAddress]
  );

  const addNewAdmin = useCallback(
    async (userAddress: string) => {
      if (!contract || !userAddress) return;
      setLoading(true);
      try {
        await contract.addNewAdmin(userAddress);
      } catch (err) {
        console.log("err in making the moderator ", contract, err);
      }
      setLoading(false);
    },
    [!!contract, userAddress]
  );

  const addNewLandRecord = useCallback(
    async (ipfsHash: string) => {
      if (!contract) return;
      setLoading(true);
      try {
        await contract.createProperty(ipfsHash);
      } catch (err) {
        console.log("err in making the moderator ", contract, err);
      }
      setLoading(false);
    },
    [!!contract]
  );

  const getAllLandRecords = useCallback(async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const landsRecords = await contract.fetchAllProperties();
      const lands = landsRecords?.map((land) => ({
        ipfsHash: land.ipfsHash,
        itemId: convertBigHexNumberToNumber(land.itemId),
        status: getLandRecordStatus(land.status),
      })) as ILandRecord[];

      return lands;
    } catch (err) {
      console.log("err in making the moderator ", contract, err);
    }
    setLoading(false);
  }, [!!contract]);

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
    addNewLandRecord,
    getAllLandRecords,
  };
};

export default useContract;
