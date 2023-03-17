import { LAND_RECORD_STATUS, ROLES } from "../globals/enums";
import { TGenericObj } from "../globals/types";

enum SOLIDITY_ENUM_ROLE {
  Visitor = 0,
  Moderator = 1,
  Admin = 2,
}

enum SOLIDITY_LAND_RECORDS_STATUS {
  Pending = 0,
  UnderChangeReview = 1,
  Approved = 2,
  Rejected = 3,
}

export const findUndefinedKeyInObj = (obj: TGenericObj) =>
  Object.keys(obj).find((key) => !obj[key]);

export const getRole = (role: SOLIDITY_ENUM_ROLE) => {
  if (role === SOLIDITY_ENUM_ROLE.Admin) return ROLES.admin;
  else if (role === SOLIDITY_ENUM_ROLE.Moderator) return ROLES.moderator;
  else return ROLES.visitor;
};

export const isNullAddress = (address: string) => /^0x0+$/.test(address);

export const getLandRecordStatus = (status: SOLIDITY_LAND_RECORDS_STATUS) => {
  switch (status) {
    case SOLIDITY_LAND_RECORDS_STATUS.Pending:
      return LAND_RECORD_STATUS.pending;
    case SOLIDITY_LAND_RECORDS_STATUS.Rejected:
      return LAND_RECORD_STATUS.rejected;
    case SOLIDITY_LAND_RECORDS_STATUS.Approved:
      return LAND_RECORD_STATUS.approved;
    case SOLIDITY_LAND_RECORDS_STATUS.UnderChangeReview:
      return LAND_RECORD_STATUS.underChangeReview;
    default:
      return;
  }
};

export const convertBigHexNumberToNumber = (bigHexNumber: number) =>
  Number(bigHexNumber);
