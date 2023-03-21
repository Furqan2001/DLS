import { useEffect, useState } from "react";
import { getData } from "../helpers/localStorage";
import { LOCAL_STORAGE_KEYS, URLS } from "../globals/enums";
import { useDLSContext } from "../../common/context/DLSContext";
import { useRouter } from "next/router";

const withAuth = (Component) => {
  const AuthenticatedComponent = () => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const { refreshLogin, contract } = useDLSContext();

    useEffect(() => {
      (async () => {
        const address = getData(LOCAL_STORAGE_KEYS.accountAddress);
        if (!!address) {
          refreshLogin(address, true);
        } else {
          return router.push(URLS.login);
        }
        setLoading(false);
      })();
    }, [contract]);

    if (loading) return <div>Please wait ...</div>;

    return <Component />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
