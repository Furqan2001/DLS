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
