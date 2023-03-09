import axios from "axios";
import { IUserInfo } from "../../@core/globals/types";

export const fetchUserInfo: (
  accountAddress: string
) => Promise<IUserInfo> = async (accountAddress: string) => {
  const res = await axios.get(
    `/api/user-info?accountAddress=${accountAddress}`
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
