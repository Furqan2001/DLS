import { ROLES } from "../globals/enums";
import { TGenericObj } from "../globals/types";

enum getRole {
  Visitor = 0,
  Moderator = 1,
  Admin = 2,
}

export const findUndefinedKeyInObj = (obj: TGenericObj) =>
  Object.keys(obj).find((key) => !obj[key]);

export const getRoles = (role: getRole) => {
  if (role === getRole.Admin) return ROLES.admin;
  else if (role === getRole.Moderator) return ROLES.moderator;
  else ROLES.visitor;
};
