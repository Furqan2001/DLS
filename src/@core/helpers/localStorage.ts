import { LOCAL_STORAGE_KEYS } from "../globals/enums";

export const saveData = (key: LOCAL_STORAGE_KEYS, value: string) =>
  localStorage.setItem(key, value);

export const getData = (key: LOCAL_STORAGE_KEYS) => localStorage.getItem(key);
