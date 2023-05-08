import { useEffect, useState } from "react";
import { getData } from "../helpers/localStorage";
import { LOCAL_STORAGE_KEYS, ROLES, URLS } from "../globals/enums";
import { useDLSContext } from "../../common/context/DLSContext";
import { useRouter } from "next/router";
import Error401 from "../../pages/401";

const withAuth = (Component, role: ROLES | "all" = "all") => {
  const AuthenticatedComponent = (props: any = {}) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const { refreshLogin, contract, userRole } = useDLSContext();

    useEffect(() => {
      (async () => {
        const address = getData(LOCAL_STORAGE_KEYS.accountAddress);
        if (!!address) {
          refreshLogin(address, true);
        } else {
          console.log(Component);
          return router.push(URLS.login);
        }
        setLoading(false);
      })();
    }, [contract]);

    if (loading) return <div>Please wait ...</div>;
    if (role !== "all" && userRole !== role) return <Error401 />;

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
