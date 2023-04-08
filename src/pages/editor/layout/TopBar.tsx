import React, { useContext, useEffect } from "react";
import ReactToPrint from "react-to-print";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import ReplyIcon from "@mui/icons-material/Reply";
import SaveIcon from "@mui/icons-material/Save";
import * as htmlToImage from "html-to-image";
import { Vector } from "p5";
import { PolygonMesh } from "../../../types/Drawing";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../database/subabaseClient";

export default function TopBar({
  id,
  mainContentRef,
  mesh,
  tileDims,
  tileOffset,
  loaded,
}: {
  id: string;
  mainContentRef: React.MutableRefObject<HTMLDivElement | null>;
  mesh: PolygonMesh;
  tileDims: [number, number];
  tileOffset: Vector;
  loaded: boolean;
}) {
  const navigate = useNavigate();

  const save = () => {
    var node = mainContentRef.current;
    if (!node) return;
    if (!loaded) return;
    htmlToImage
      .toJpeg(node, {
        quality: 0.95,
      })
      .then(async function (dataUrl) {
        await supabase.from("drawings").upsert({
          id: id,
          mesh: mesh,
          tile_dims_x: tileDims[0],
          tile_dims_y: tileDims[1],
          tile_offset_x: tileOffset.x,
          tile_offset_y: tileOffset.y,
          updated_at: new Date().toISOString(),
        });

        const { error } = await supabase
          .from("projects")
          .update({
            image: dataUrl,
          })
          .eq("id", id);
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      save();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-700 text-white text-2xl font-bold p-4 h-16 flex flex-row items-center justify-between">
      <div className="flex flex-col mx-4">
        <ReplyIcon
          onClick={() => navigate("/")}
          style={{
            fontSize: "2rem",
          }}
          className="cursor-pointer"
        />
        <label className="text-gray-300 text-sm font-semibold ">Back</label>
      </div>
      <div className="flex items-center gap-8 ">
        <div className="flex flex-col" onClick={save}>
          <ReactToPrint
            trigger={() => {
              return (
                <LocalPrintshopIcon
                  style={{
                    fontSize: "2rem",
                  }}
                  className="cursor-pointer"
                />
              );
            }}
            content={() => mainContentRef.current}
          />
          <label className="text-gray-300 text-sm font-semibold ">Print</label>
        </div>

        <div className="flex flex-col">
          <SaveIcon
            onClick={save}
            style={{
              fontSize: "2rem",
            }}
            className="cursor-pointer"
          />
          <label className="text-gray-300 text-sm font-semibold ">Save</label>
        </div>
      </div>
    </div>
  );
}
