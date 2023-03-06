import axios from "axios";
import { IUserInfo } from "../../@core/globals/types";

export const fetchUserInfo: (
  web3AccountAddress: string
) => Promise<IUserInfo> = async (web3AccountAddress: string) => {
  const res = await axios.get(
    `/api/user-info?web3AccountAddress=${web3AccountAddress}`
  );
  return res.data.user;
};

export const updateUserInfo = async (data: FormData) => {
  const res = await axios.post(`/api/user-info`, data);
  return res.data;
};

interface IUpdateUserBioInfo
  extends Pick<IUserInfo, "bio" | "gender" | "birthDate" | "phoneNumber"> {}

export const updateUserBioInfo = async (data: FormData) => {
  const res = await axios.post(`/api/user-info`, data);
  return res.data;
};
