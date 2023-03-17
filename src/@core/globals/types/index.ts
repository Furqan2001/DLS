import { ThemeColor } from "../../layouts/types";
import { LAND_RECORD_STATUS, ROLES } from "../enums";

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

export interface ILandRecord {
  ipfsHash: string;
  itemId: number;
  status: LAND_RECORD_STATUS;
}

export interface IIPFSRecord {
  certificate: string;
  owner_full_name: string;
  owner_father_name: string;
  owner_mother_name: string;
  owner_email: string;
  owner_phone: string;
  owner_cnic: string;
  owner_complete_address: string;
  land_total_area: string;
  land_amount: string;
  land_city: string;
  land_district: string;
  land_complete_location: string;
  plot_num: string;
  land_purchase_date?: Date;
  prev_owner_cnic?: string;
}
