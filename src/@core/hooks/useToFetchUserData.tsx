import { useCallback, useEffect, useState } from "react";
import { IUserInfo } from "../globals/types";
import { fetchUserInfo } from "../../common/api/userInfo";
import { useDLSContext } from "../../common/context/DLSContext";

const useToFetchUserData = ({
  defaultUserAddress,
}: { defaultUserAddress?: string } = {}) => {
  const [userInfo, setUserInfo] = useState<IUserInfo>();
  const { userAddress } = useDLSContext();

  const fetchUserDetail = useCallback(async () => {
    if (!userAddress && !defaultUserAddress) return;
    try {
      const userInfo = await fetchUserInfo(defaultUserAddress || userAddress);
      if (userInfo) {
        setUserInfo(userInfo);
      }
    } catch (err) {
      console.log("err in fetching the user detail ", err);
    }
  }, [userAddress, defaultUserAddress]);

  useEffect(() => {
    fetchUserDetail();
  }, [fetchUserDetail]);

  return { userInfo };
};

export default useToFetchUserData;
