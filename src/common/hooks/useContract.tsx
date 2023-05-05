import DLSJSON from "../constants/DLS.json";
import { BigNumber, ethers } from "ethers";
import { DLSAddress } from "../constants/contractAddress";
import Web3Modal from "web3modal";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  GET_ALL_LAND_RECORD_STATUS,
  LAND_RECORD_STATUS,
  LOCAL_STORAGE_KEYS,
  ROLES,
  URLS,
} from "../../@core/globals/enums";
import { saveData } from "../../@core/helpers/localStorage";
import { ILandRecord } from "../../@core/globals/types";
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
  const [custodialContract, setCustodialContract] = useState<ethers.Contract>();
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<ROLES>();
  const [contractErr, setContractErr] = useState("");

  const router = useRouter();

  const trackApiUtility = () => {
    setLoading(true);
    setContractErr("");
  };

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

      if (role === ROLES.admin) {
        router.push(URLS.dashboard);
      } else {
        router.push(URLS.allLands);
      }
    }
  };

  const fetchAllUsers = useCallback(
    async (type: ROLES.admin | ROLES.moderator | "users" = "users") => {
      if (!contract) return;
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
    },
    [contract]
  );

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
    async (ipfsHash: string, cnic: string) => {
      if (!contract) return;
      setLoading(true);
      try {
        await contract.createProperty(ipfsHash, cnic);
      } catch (err) {
        console.log("err in making the moderator ", contract, err);
        setContractErr(String(err?.error?.message));
      }
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    },
    [!!contract]
  );

  const getAllLandRecords = useCallback(
    async (type: GET_ALL_LAND_RECORD_STATUS) => {
      if (!contract) return;
      setLoading(true);
      let landsRecords;
      try {
        if (type === "all") {
          landsRecords = await contract.fetchAllProperties();
        } else if (type === GET_ALL_LAND_RECORD_STATUS.approved) {
          landsRecords = await contract.fetchAllApprovedProperties();
        } else if (type === GET_ALL_LAND_RECORD_STATUS.rejected) {
          landsRecords = await contract.fetchAllRejectedProperties();
        } else if (type === GET_ALL_LAND_RECORD_STATUS.pending) {
          landsRecords = await contract.fetchAllPendingProperties();
        } else if (type === GET_ALL_LAND_RECORD_STATUS.underChangeReview) {
          landsRecords = await contract.fetchAllUnderReviewProperties();
        }

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
    },
    [!!contract]
  );

  const connectCustodialWallet = () => {
    const provider = new ethers.providers.JsonRpcProvider(
      `https://sepolia.infura.io/v3/${process.env.PROJECT_ID}`
    );
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const contract = new ethers.Contract(DLSAddress, abi, signer);
    setCustodialContract(contract);
    return contract;
  };

  const getOwnerLandRecords = useCallback(
    async (cnic: string) => {
      let contract = custodialContract;
      if (!contract) contract = connectCustodialWallet();
      setLoading(true);
      let landsRecords;
      try {
        landsRecords = await contract.fetchOwnerProperties(cnic);

        const lands = landsRecords?.map((land) => ({
          ipfsHash: land.ipfsHash,
          itemId: convertBigHexNumberToNumber(land.itemId),
          status: getLandRecordStatus(land.status),
        })) as ILandRecord[];

        return lands;
      } catch (err) {
        console.log("Error in fetching User records ", contract, err);
      }
      setLoading(false);
    },
    [!!contract]
  );

  const approveProperty = useCallback(
    async (itemId: number, ownershipChangeReq: boolean = false) => {
      if (!contract) return;
      trackApiUtility();
      try {
        if (!ownershipChangeReq) await contract.approveProperty(itemId);
        else await contract.approveOwnershipChange(itemId);
      } catch (err) {
        console.log("err in making the moderator ", contract);
        setContractErr(String(err?.error?.message));
      }
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    },
    [!!contract]
  );

  const rejectProperty = useCallback(
    async (
      itemId: number,
      msg: string,
      ownershipChangeReq: boolean = false
    ) => {
      if (!contract) return;
      trackApiUtility();
      try {
        if (!ownershipChangeReq) await contract.rejectProperty(itemId, msg);
        else await contract.rejectOwnershipChange(itemId, msg);
      } catch (err) {
        console.log("err in rejecting the property ", contract, err);
        setContractErr(String(err?.error?.message));
      }
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    },
    [!!contract]
  );

  const fetchSinglePropertyInfo = useCallback(
    async (itemId: string) => {
      if (!contract) return;
      trackApiUtility();
      let propertyInfo: ILandRecord;
      try {
        propertyInfo = await contract.fetchSingleProperty(
          BigNumber.from(itemId)
        );
      } catch (err) {
        console.log("err in fetching single property info ", err);
        setContractErr(String(err?.error?.message));
      }

      setLoading(false);
      return propertyInfo;
    },
    [!!contract]
  );

  const transferLandOwnership = useCallback(
    async (itemId: string, ipfsHash: string, cnic: string) => {
      if (!contract) return;
      setLoading(true);
      try {
        await contract.changeOwnership(BigNumber.from(itemId), ipfsHash, cnic);
      } catch (err) {
        console.log("err in transfering the ownership ", contract, err);
        setContractErr(String(err?.error?.message));
      }
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    },
    [!!contract]
  );

  return {
    fetchContractDetails,
    loginUser,
    fetchAllUsers,
    contract,
    loading,
    userRole,
    contractErr,
    setLoading,
    fetchSpecificUser,
    addNewModerator,
    addNewAdmin,
    addNewLandRecord,
    getAllLandRecords,
    getOwnerLandRecords,
    approveProperty,
    rejectProperty,
    fetchSinglePropertyInfo,
    transferLandOwnership,
  };
};

export default useContract;
