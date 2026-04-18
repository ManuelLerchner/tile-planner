import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import SaveIcon from "@mui/icons-material/Save";
import HelpIcon from "@mui/icons-material/Help";
import { Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ReactToPrint from "react-to-print";

export default function TopBar({
  mainContentRef,
  setShowEdit,
  setShowHelp,
  save,
}: {
  mainContentRef: React.MutableRefObject<HTMLDivElement | null>;
  setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setShowHelp: React.Dispatch<React.SetStateAction<boolean>>;
  save: () => Promise<void>;
}) {
  const navigate = useNavigate();

  const Action = ({
    icon,
    label,
    onClick,
  }: {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
  }) => (
    <button
      className="flex flex-col items-center gap-0.5 cursor-pointer hover:text-teal-400 text-slate-300 transition-colors hover:scale-105"
      onClick={onClick}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  return (
    <div className="bg-slate-800 border-b border-slate-700 text-white h-16 flex flex-row items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-6">
        <Action
          icon={<HomeIcon style={{ fontSize: "1.5rem" }} />}
          label="Home"
          onClick={() => navigate("/")}
        />
        <Action
          icon={<Edit style={{ fontSize: "1.5rem" }} />}
          label="Edit"
          onClick={() => setShowEdit(true)}
        />
        <Action
          icon={<HelpIcon style={{ fontSize: "1.5rem" }} />}
          label="Help"
          onClick={() => setShowHelp(true)}
        />
      </div>

      <div className="flex items-center gap-6">
        <ReactToPrint
          trigger={() => (
            <Action
              icon={<LocalPrintshopIcon style={{ fontSize: "1.5rem" }} />}
              label="Print"
            />
          )}
          content={() => mainContentRef.current}
        />
        <Action
          icon={<SaveIcon style={{ fontSize: "1.5rem" }} />}
          label="Save"
          onClick={async () => {
            await save();
            alert("Saved!");
          }}
        />
      </div>
    </div>
  );
}
