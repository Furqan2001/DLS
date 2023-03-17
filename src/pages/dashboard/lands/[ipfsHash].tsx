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
} from "../../../@core/globals/types";
import { ROLES } from "../../../@core/globals/enums";
import LoadingButton from "../../../@core/components/shared/LoadingButton";
import { useUserInfo } from "../../../common/context/UserInfoContext";
import withAuth from "../../../@core/HOC/withAuth";
import {
  DOMAIN_URL,
  client,
  getValueFromHash,
} from "../../../@core/helpers/ipfs";
import AddNewLand from "../../../views/Lands/AddNewLand";

const LandDetail = () => {
  // ** States

  const [blockchainUserInfo, setBlockchainUserInfo] =
    useState<IBlockchainUserInfo>();

  const router = useRouter();
  const [formState, setFormState] = useState<IIPFSRecord>();

  const { ipfsHash } = router.query;

  useEffect(() => {
    if (!ipfsHash) return;

    (async () => {
      try {
        const res = await getValueFromHash<IIPFSRecord>(ipfsHash as string);
        console.log("res ", res);

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

  return (
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
              <AddNewLand hideFileField formState={formState} />
            </CardContent>

            <CardActions>
              <LoadingButton
                size="large"
                type="submit"
                sx={{ mr: 2 }}
                variant="contained"
              >
                Approve
              </LoadingButton>
              <LoadingButton
                size="large"
                type="submit"
                sx={{ mr: 2 }}
                variant="contained"
              >
                Reject
              </LoadingButton>
              <a
                target="_blank"
                rel="noreferrer"
                href={formState.certificate}
                style={{ marginLeft: 10 }}
              >
                Check Certificate
              </a>
            </CardActions>
          </>
        )}
      </Card>
    </>
  );
};

export default withAuth(LandDetail);
