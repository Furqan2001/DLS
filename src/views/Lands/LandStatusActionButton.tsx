import { CardContent, Divider } from "@mui/material";
import LoadingButton from "../../@core/components/shared/LoadingButton";
import { LAND_RECORD_STATUS } from "../../@core/globals/enums";
import { useMemo } from "react";

type ThandleActionKey = "approve" | "reject";
type TColors = "primary" | "secondary" | "error";

interface IProps {
  contractActionLoading: boolean;
  handleAction: (key: ThandleActionKey) => {};
  landStatus: LAND_RECORD_STATUS;
}

const allButtons = [
  {
    type: "approve" as ThandleActionKey,
    text: "Approve",
    color: "primary" as TColors,
  },
  {
    type: "reject" as ThandleActionKey,
    text: "Reject",
    color: "error" as TColors,
  },
];

const LandStatusActionButton = ({
  contractActionLoading,
  handleAction,
  landStatus,
}: IProps) => {
  // buttons will show according to the status of the land records
  const buttonsList = useMemo(() => {
    if (
      landStatus === LAND_RECORD_STATUS.approved ||
      landStatus === LAND_RECORD_STATUS.rejected
    ) {
      return []; // no button will be show
    } else if (landStatus === LAND_RECORD_STATUS.pending) return allButtons;
  }, [landStatus]);

  return (
    <>
      {buttonsList.map((btn) => (
        <LoadingButton
          key={btn.type}
          color={btn.color}
          size="large"
          type="submit"
          sx={{ mr: 2 }}
          variant="contained"
          loading={contractActionLoading}
          onClick={() => handleAction(btn.type)}
        >
          {btn.text}
        </LoadingButton>
      ))}
    </>
  );
};

export default LandStatusActionButton;
