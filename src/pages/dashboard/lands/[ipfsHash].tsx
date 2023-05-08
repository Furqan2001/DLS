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
import LandDetails from "../../../views/Lands/LandDetails";
import { getLandRecordStatus, isEmptyObject } from "../../../@core/helpers";
import LandStatusActionButton from "../../../views/Lands/LandStatusActionButton";
import CustomModal from "../../../@core/components/shared/CustomModal";
import { sendMail } from "../../../common/api/sendMail";
import EmailVerification from "../../../views/Ownership/EmailVerification";

const LandDetail = () => {
  const router = useRouter();
  const [formState, setFormState] = useState<IIPFSRecord>();
  const [landRecord, setLandRecord] = useState<ILandRecord>();
  const [showRejectionBox, setShowRejectionBox] = useState(false);
  const [rejectionBoxMsg, setRejectionBoxMsg] = useState("");
  const [showEmailVerificationBox, setShowEmailVerificationBox] =
    useState(true);

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
      setLandRecord({ ...res, status: getLandRecordStatus(res.status) });
    })();
  }, [fetchSinglePropertyInfo, itemId]);

  const handleAction = async (type: "approve" | "reject" | "previousOwner") => {
    if (type === "approve") {
      await approveProperty(
        Number(itemId),
        landRecord.status === LAND_RECORD_STATUS.underChangeReview
      );
      router.push(`${URLS.allLands}`);
    } else if (type === "reject") {
      setShowRejectionBox(true);
    } else if (type === "previousOwner" && formState.previous_onwers_hashes) {
      const previousOnwerHash =
        formState.previous_onwers_hashes[
          formState.previous_onwers_hashes.length - 1
        ];
      router.push(`${URLS.allLands}/${previousOnwerHash}`);
    }
  };

  const rejectPropertyWrapper = async () => {
    try {
      await rejectProperty(
        Number(itemId),
        rejectionBoxMsg,
        landRecord.status === LAND_RECORD_STATUS.underChangeReview
      );
    } catch (err) {}
  };

  const sendRejectPropertyEmail = async () => {
    try {
      await sendMail({
        subject: "Property rejected",
        message: `Your property has been rejected with the following message ${rejectionBoxMsg}`,
        to: formState.owner_email,
      });
    } catch (err) {}
  };

  const handleReject = async () => {
    if (!rejectionBoxMsg) return;

    await Promise.all([rejectPropertyWrapper(), sendRejectPropertyEmail()]);
    router.push(URLS.allLands);
    if (!contractErr) router.push(URLS.allLands);
  };

  const shouldShowEmailVerificationBox = ![
    ROLES.admin,
    ROLES.moderator,
  ].includes(userRole);

  return (
    <>
      {!true ? (
        <div>Please wait ....</div>
      ) : shouldShowEmailVerificationBox && showEmailVerificationBox ? (
        <EmailVerification
          setShowLandRecord={() => {
            setShowEmailVerificationBox(false);
          }}
          email={formState?.owner_email}
        />
      ) : (
        <>
          <Card>
            <CardHeader
              title="Land Details"
              titleTypographyProps={{ variant: "h6" }}
            />

            {formState && (
              <>
                <Divider />
                <CardContent>
                  <LandDetails
                    hideFileField
                    disableFields
                    formState={formState}
                  />
                  <Typography fontSize={12}>
                    Each action will take approx 2-3 mins, so please wait after
                    pressing the button. So if you see no changes even after 2-3
                    mins, then please wait more 5-10 mins
                  </Typography>
                </CardContent>

                <CardActions>
                  <LandStatusActionButton
                    contractActionLoading={contractActionLoading}
                    handleAction={handleAction}
                    landStatus={landRecord?.status}
                    itemId={itemId as string}
                    isAdmin={userRole === ROLES.admin}
                    showOwnlyPreviousHistoryBtn={
                      !!formState.previous_onwers_hashes
                    }
                  />
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={formState.certificate}
                    style={{ marginLeft: 10 }}
                  >
                    Check Certificate
                  </a>
                </CardActions>
                {contractErr && (
                  <Alert color="error" sx={{ ml: 1 }}>
                    {contractErr}
                  </Alert>
                )}
              </>
            )}
          </Card>

          <CustomModal
            open={showRejectionBox}
            handleClose={() => setShowRejectionBox(false)}
          >
            <Box>
              <Typography sx={{ fontWeight: "bold" }}>
                Enter a message why are you rejecting the property?
              </Typography>

              <TextField
                sx={{ mt: 4, mb: 2 }}
                multiline
                minRows={2}
                label="Message"
                fullWidth
                value={rejectionBoxMsg}
                onChange={(e) => setRejectionBoxMsg(e.target.value)}
                placeholder="Enter a message why are you rejecting the property?"
              />

              <LoadingButton
                fullWidth
                onClick={handleReject}
                loading={contractActionLoading}
              >
                Submit
              </LoadingButton>
            </Box>
          </CustomModal>
        </>
      )}
    </>
  );
};

export default LandDetail;
