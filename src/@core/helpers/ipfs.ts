import { IPFSHTTPClient, create as ipfsHttpClient } from "ipfs-http-client";

const IPFS_PROJECT_ID = "2N2eFx9XbKHwzZnwWM7zwUzvFO2";
const IPFS_PROJECT_SECRET = "b9e7ac2f4898bb82b77c507c6920aca7";

const auth =
  "Basic " +
  Buffer.from(IPFS_PROJECT_ID + ":" + IPFS_PROJECT_SECRET).toString("base64");

export const DOMAIN_URL = "https://dls.infura-ipfs.io/ipfs/";

export const client: IPFSHTTPClient = ipfsHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export const getValueFromHash = async <T>(hash: string): Promise<T> => {
  const url = DOMAIN_URL + hash;
  const res = await fetch(url).then((res) => res.json());
  return res;
};
