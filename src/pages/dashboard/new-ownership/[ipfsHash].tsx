// ** React Imports
import {
  ChangeEvent,
  MouseEvent,
  useState,
  SyntheticEvent,
  useEffect,
  useCallback,
} from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CardHeader from "@mui/material/CardHeader";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";

// ** Icons Imports
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";
import { useRouter } from "next/router";
import {
  Alert,
  CardActions,
  Divider,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useDLSContext } from "../../../common/context/DLSContext";
import {
  IBlockchainUserInfo,
  IDbUserInfo,
  IIPFSRecord,
  ILandRecord,
} from "../../../@core/globals/types";
import { LAND_RECORD_STATUS, ROLES, URLS } from "../../../@core/globals/enums";
import LoadingButton from "../../../@core/components/shared/LoadingButton";
import { useUserInfo } from "../../../common/context/UserInfoContext";
import withAuth from "../../../@core/HOC/withAuth";
import {
  DOMAIN_URL,
  client,
  getValueFromHash,
} from "../../../@core/helpers/ipfs";
import LandRecordForm from "../../../views/NewLand/LandRecordForm";
import { getLandRecordStatus, isEmptyObject } from "../../../@core/helpers";
import LandStatusActionButton from "../../../views/Lands/LandStatusActionButton";
import CustomModal from "../../../@core/components/shared/CustomModal";
import { sendEmailConfirmation, sendMail } from "../../../common/api/sendMail";
import EmailVerification from "../../../views/Ownership/EmailVerification";

const LandDetail = () => {
  const router = useRouter();

  const [showEmailVerificationBox, setShowEmailVerificationBox] =
    useState(true);
  const [formState, setFormState] = useState<IIPFSRecord>();
  const [landRecord, setLandRecord] = useState<ILandRecord>();
  const [showRejectionBox, setShowRejectionBox] = useState(false);
  const [rejectionBoxMsg, setRejectionBoxMsg] = useState("");

  const { userRole } = useUserInfo();

  const { ipfsHash, itemId } = router.query;
  const {
    approveProperty,
    rejectProperty,
    fetchSinglePropertyInfo,
    contractErr,
    loading: contractActionLoading,
  } = useDLSContext();

  useEffect(() => {
    if (!ipfsHash) return;

    (async () => {
      try {
        const res = await getValueFromHash<IIPFSRecord>(ipfsHash as string);

        setFormState({
          ...res,
          land_purchase_date: res.land_purchase_date
            ? new Date(res.land_purchase_date)
            : new Date(),
        });
      } catch (err) {
        console.log("err is ", err);
      }
    })();
  }, [ipfsHash]);

  useEffect(() => {
    if (!itemId) return;
    (async () => {
      const res = (await fetchSinglePropertyInfo(itemId as string)) as
        | ILandRecord
        | {};

      if (isEmptyObject(res)) return;

      //@ts-ignore
      const status = getLandRecordStatus(res.status);

      if (status === LAND_RECORD_STATUS.approved) {
        setShowEmailVerificationBox(true);
      }

      //@ts-ignore
      setLandRecord({ ...res, status });
    })();
  }, [fetchSinglePropertyInfo, itemId]);

  const handleAction = async (type: "approve" | "reject") => {
    if (type === "approve") {
      await approveProperty(Number(itemId));
      router.push(URLS.allLands);
    } else if (type === "reject") {
      setShowRejectionBox(true);
    }
  };
  const isAdmin = userRole === ROLES.admin;

  const shouldShowEmailVerificationBox = formState && showEmailVerificationBox;
  const shouleShowLandRecord = !showEmailVerificationBox && formState;

  return (
    <Box>
      {shouldShowEmailVerificationBox && (
        <EmailVerification
          setShowLandRecord={() => {
            setShowEmailVerificationBox(false);
          }}
          email={formState.owner_email}
          subject="Ownership Transfer Confirmation"
        />
      )}
      {shouleShowLandRecord && (
        <LandRecordForm
          form="transferLandOwnership"
          ipfsHash={ipfsHash as string}
          itemId={itemId as string}
          formState={formState}
        />
      )}
    </Box>
  );
};

export default withAuth(LandDetail);
