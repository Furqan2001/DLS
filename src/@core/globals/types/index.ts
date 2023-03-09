import { ThemeColor } from "../../layouts/types";

export interface IUserInfo {
  username: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  birthDate?: Date;
  phoneNumber?: string;
  gender?: string;
}

export type TGenericObj = { [key: string]: any };

export interface IGenericColor {
  [key: string]: {
    color: ThemeColor;
  };
}
