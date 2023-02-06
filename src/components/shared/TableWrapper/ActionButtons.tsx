import { RoleTypes, TGenericObj } from "../../../globals/types";
import LoadingButton from "../LoadingButton";

export type actionBtnType = "more" | "approve" | "delete" | "link";
export interface IActionButton {
  type: actionBtnType;
  onClick?: (id: string, row: TGenericObj) => void;
  requireAdminAccess?: boolean; // particular action button will only be visible for admin only
  conditionalKey?: string; // if particular key is present in data then particular action btn will show otherwise not
}

const getActionBtnColor = (type: actionBtnType) => {
  if (type === "delete") return "error"; // red color will show
  else if (type === "approve") return "primary";
  return "info";
};

interface IProps {
  actionButtons?: IActionButton[];
  role?: RoleTypes;
  row: TGenericObj;
}

const ActionButtons = ({ actionButtons, role, row }: IProps) => {
  return (
    <>
      {actionButtons?.map((btn) =>
        btn.requireAdminAccess ? ( // some specific buttons are only for admin
          role === "admin" ? ( // if role is not admin then no button will be show in action column
            btn.conditionalKey ? ( // conditionally show button if user wants
              !row[btn.conditionalKey] && (
                <ActionBtn key={btn.type} btn={btn} id={row.id} row={row} />
              )
            ) : (
              <ActionBtn key={btn.type} btn={btn} id={row.id} row={row} />
            )
          ) : null
        ) : (
          <ActionBtn key={btn.type} btn={btn} id={row.id} row={row} />
        )
      )}
    </>
  );
};

const ActionBtn = ({
  btn,
  id,
  row,
}: {
  btn: IActionButton;
  id: string;
  row: TGenericObj;
}) => (
  <LoadingButton
    size="small"
    key={btn.type}
    text={btn.type}
    sx={{ mr: 1 }}
    color={getActionBtnColor(btn.type)}
    onClick={() => btn.onClick?.(id, row)}
  />
);

export default ActionButtons;
