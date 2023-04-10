import React, { useCallback, useEffect, useId, useState } from "react";

import PushPinIcon from "@mui/icons-material/PushPin";
import TimelineIcon from "@mui/icons-material/Timeline";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import PanToolIcon from "@mui/icons-material/PanTool";

export default function HelpModal({
  setShowHelp,
}: {
  setShowHelp: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const modalID = useId();

  setTimeout(() => {
    try {
      const modal = document.getElementById(modalID) as HTMLInputElement;
      modal.checked = true;
    } catch (e) {
      console.error(e);
    }
  }, 20);

  return (
    <>
      <input
        type="checkbox"
        id={modalID}
        className="modal-toggle"
        onClick={() => {
          setShowHelp(false);
        }}
      />
      <label
        htmlFor={modalID}
        className="modal cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        <label className="modal-box relative w-11/12 max-w-5xl" htmlFor="">
          <h3 className="text-lg font-semibold">Tools</h3>
          <div className="flex flex-col gap-4 my-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-4 items-center">
                <div className="flex items-center justify-center rounded-full p-1 bg-gray-300">
                  <PanToolIcon />
                </div>
                <div className="flex flex-col">
                  <h5 className="text-md font-semibold">Move</h5>
                  <p className="text-sm">
                    Press and drag to move the canvas, scroll to zoom in and
                    out.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-4 items-center">
                <div className="flex items-center justify-center rounded-full p-1 bg-gray-300">
                  <PushPinIcon />
                </div>
                <div className="flex flex-col">
                  <h5 className="text-md font-semibold">Marker</h5>
                  <p className="text-sm">
                    Click to place the initial marker on the canvas.
                    <br />
                    After placing the initial marker, you can <u>only</u> place
                    additional markers by clicking on a <u>previous</u> marker.
                    <br />
                    There exist two modes for placing markers:
                    <ul className="list-disc list-inside m-2 my-4">
                      <li>
                        <b>Ortho</b>: The marker will be placed a fixed distance
                        from the previous marker.
                      </li>
                      <li>
                        <b>Free</b>: The marker will be placed at the cursor
                        position.
                      </li>
                    </ul>
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-4 items-center">
                <div className="flex items-center justify-center rounded-full p-1 bg-gray-300">
                  <TimelineIcon />
                </div>
                <div className="flex flex-col">
                  <h5 className="text-md font-semibold">Connect</h5>
                  <p className="text-sm">
                    Click on two markers to connect them with a wall segment.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-4 items-center">
                <div className="flex items-center justify-center rounded-full p-1 bg-gray-300">
                  <DeleteIcon />
                </div>
                <div className="flex flex-col">
                  <h5 className="text-md font-semibold">Delete</h5>
                  <p className="text-sm">
                    Click on a marker or the <u>center</u> of a wall segment to
                    delete it.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-4 items-center">
                <div className="flex items-center justify-center rounded-full p-1 bg-gray-300">
                  <OpenWithIcon />
                </div>
                <div className="flex flex-col">
                  <h5 className="text-md font-semibold">Align</h5>
                  <p className="text-sm">
                    Drag and drop the tiles to align them with your floor plan.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold">Settings</h3>
          <div className="flex flex-col gap-4 my-4">
            <p className="text-sm">
              At the bottom of the screen, you can find the settings panel.
              <ul className="list-disc list-inside m-2">
                <li>
                  <b>Marker Mode</b>: The mode for placing markers.
                </li>
                <li>
                  <b>Tile Size</b>: The <u>size</u> of the tiles in the editor,
                  and their <u>pattern</u>.
                </li>
              </ul>
            </p>
          </div>
          <h3 className="text-lg font-semibold">Export</h3>
          <div className="flex flex-col gap-4 my-4">
            <p className="text-sm">
              On the top right of the screen, you can find the <b>Print</b> and
              the <b>Save</b> buttons.
              <ul className="list-disc list-inside m-2">
                <li>
                  <b>Print</b>: Opens a printable version of the floor plan.
                  Bevore printing, you need to <u>align</u> your drawing so that
                  it <u>fits</u> inside the Editor.
                </li>
                <li>
                  <b>Save</b>: Saves the floor plan to the database. This also
                  happens automatically every 30 seconds.
                </li>
              </ul>
            </p>
          </div>
        </label>
      </label>
    </>
  );
}
