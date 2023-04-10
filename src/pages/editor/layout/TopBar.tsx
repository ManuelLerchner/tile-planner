import HomeIcon from "@mui/icons-material/Home";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import SaveIcon from "@mui/icons-material/Save";
import HelpIcon from "@mui/icons-material/Help";
import React from "react";
import ReactToPrint from "react-to-print";

import { Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

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

  return (
    <>
      <div className="bg-gray-700 text-white text-2xl font-bold p-4 h-16 flex flex-row items-center justify-between px-8 ">
        <div className="flex items-center gap-8 ">
          <div
            className="flex flex-col cursor-pointer hover:scale-[105%]"
            onClick={() => navigate("/")}
          >
            <HomeIcon
              style={{
                fontSize: "2rem",
              }}
            />
            <label className="text-gray-300 text-sm font-semibold cursor-pointer">
              Home
            </label>
          </div>

          <div
            className="flex flex-col cursor-pointer hover:scale-[105%]"
            onClick={() => {
              setShowEdit(true);
            }}
          >
            <Edit
              style={{
                fontSize: "2rem",
              }}
            />
            <label className="text-gray-300 text-sm font-semibold ">Edit</label>
          </div>

          <div
            className="flex flex-col cursor-pointer hover:scale-[105%]"
            onClick={() => {
              setShowHelp(true);
            }}
          >
            <HelpIcon
              style={{
                fontSize: "2rem",
              }}
            />
            <label className="text-gray-300 text-sm font-semibold ">Help</label>
          </div>
        </div>

        <div className="flex items-center gap-8 ">
          <div
            className="flex flex-col cursor-pointer hover:scale-[105%]"
            onClick={save}
          >
            <ReactToPrint
              trigger={() => {
                return (
                  <LocalPrintshopIcon
                    style={{
                      fontSize: "2rem",
                    }}
                  />
                );
              }}
              content={() => mainContentRef.current}
            />
            <label className="text-gray-300 text-sm font-semibold ">
              Print
            </label>
          </div>

          <div className="flex flex-col cursor-pointer hover:scale-[105%]">
            <SaveIcon
              onClick={async () => {
                await save();
                alert("Saved!");
              }}
              style={{
                fontSize: "2rem",
              }}
            />
            <label className="text-gray-300 text-sm font-semibold ">Save</label>
          </div>
        </div>
      </div>
    </>
  );
}
