import { ROLES } from "../globals/enums";
import { TGenericObj } from "../globals/types";

enum SOLIDITY_ENUM_ROLE {
  Visitor = 0,
  Moderator = 1,
  Admin = 2,
}

export const findUndefinedKeyInObj = (obj: TGenericObj) =>
  Object.keys(obj).find((key) => !obj[key]);

export const getRole = (role: SOLIDITY_ENUM_ROLE) => {
  if (role === SOLIDITY_ENUM_ROLE.Admin) return ROLES.admin;
  else if (role === SOLIDITY_ENUM_ROLE.Moderator) return ROLES.moderator;
  else ROLES.visitor;
};
