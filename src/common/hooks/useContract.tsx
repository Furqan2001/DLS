import DLSJSON from "../constants/DLS.json";
import { ContractInterface, ethers, providers } from "ethers";
import { DLSAddress } from "../constants/contractAddress";
import Web3Modal from "web3modal";
import { useState } from "react";
import { useRouter } from "next/router";
import { URLS } from "../../@core/enums";

const abi = DLSJSON.abi;

const fetchContract = (signerOrProvider: ethers.providers.JsonRpcSigner) =>
  new ethers.Contract(DLSAddress, abi, signerOrProvider);

const useContract = () => {
  const [contract, setContract] = useState<ethers.Contract>();
  const [loading, setLoading] = useState(false);
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

  const loginUser = async () => {
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

    router.push(URLS.dashboard);
  };

  return { fetchContractDetails, loginUser, contract, loading, setLoading };
};

export default useContract;
