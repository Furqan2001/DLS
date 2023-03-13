import { ThemeColor } from "../../layouts/types";
import { ROLES } from "../enums";

export interface IDbUserInfo {
  username: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  birthDate?: Date;
  phoneNumber?: string;
  gender?: string;
  cnic?: string;
}

export interface IBlockchainUserInfo {
  userAddress: string;
  modApprovalsLeft: number;
  role: ROLES;
  adminApprovalsLeft: number;
}

export type TGenericObj = { [key: string]: any };

export interface IGenericColor {
  [key: string]: {
    color: ThemeColor;
  };
}
