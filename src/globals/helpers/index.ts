import { TGenericObj } from "../types";

export const findUndefinedKeyInObj = (obj: TGenericObj) =>
  Object.keys(obj).find((key) => !obj[key]);
