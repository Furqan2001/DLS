import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { fetchUserInfo } from "../../common/api/userInfo";
import { useDLSContext } from "../../common/context/DLSContext";
import { IDbUserInfo } from "../../@core/globals/types";
import { ROLES } from "../../@core/globals/enums";

interface IUserInfoContext {
  userInfo: IDbUserInfo;
  loadingUserInfo: boolean;
  userAddress: string;
  userRole: ROLES;
  fetchUserDbDetails: (defaultUserAddress: string) => Promise<IDbUserInfo>;
  fetchCurrentUserDetail: () => Promise<void>;
}

const initialValue: IUserInfoContext = {
  userInfo: {
    username: "",
    name: "",
    email: "",
    cnic: ""
  },
  loadingUserInfo: false,
  userAddress: "",
  userRole: ROLES.visitor,
  fetchUserDbDetails: async (defaultUserAddress: string) => ({
    name: "",
    username: "",
    email: "",
    cnic: ""
  }),
  fetchCurrentUserDetail: async () => {},
};

const UserInfoContext = createContext<IUserInfoContext>(initialValue);

export const useUserInfo = () => {
  return useContext(UserInfoContext);
};

const UserInfoContextProvider = ({
  children,
}: {
  children: ReactNode | ReactNode[];
}) => {
  const [userInfo, setUserInfo] = useState<IDbUserInfo>();
  const [loading, setLoading] = useState(false);
  const { userAddress, userRole } = useDLSContext();

  const fetchUserDbDetails = useCallback(async (defaultUserAddress: string) => {
    setLoading(true);
    try {
      const userInfo = await fetchUserInfo(defaultUserAddress);
      return userInfo;
    } catch (err) {
      console.log("err in fetching the user detail ", err);
    }
    setLoading(false);
  }, []);

  const fetchCurrentUserDetail = useCallback(async () => {
    if (!userAddress) return;
    const res = await fetchUserDbDetails(userAddress);
    if (res) {
      setUserInfo(res);
    }
  }, [userAddress]);

  useEffect(() => {
    fetchCurrentUserDetail();
  }, [fetchCurrentUserDetail]);

  return (
    <UserInfoContext.Provider
      value={{
        userInfo,
        fetchUserDbDetails,
        fetchCurrentUserDetail,
        loadingUserInfo: loading,
        userAddress,
        userRole,
      }}
    >
      {children}
    </UserInfoContext.Provider>
  );
};

export default UserInfoContextProvider;
