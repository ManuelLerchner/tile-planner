import React, { useContext } from "react";
import ReactToPrint from "react-to-print";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import SaveIcon from "@mui/icons-material/Save";
import * as htmlToImage from "html-to-image";
import { GlobalContext } from "../../pages/Editor";

export default function TopBar() {
  const { mesh, name, setName, mainContentRef, tileDims, tileOffset } =
    useContext(GlobalContext);

  const save = () => {
    var node = mainContentRef.current;
    if (!node) return;
    htmlToImage
      .toJpeg(node, {
        quality: 0.95,
      })
      .then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        document.body.appendChild(img);
        console.log(name);
        console.log(mesh);
        console.log(tileDims);
        console.log(tileOffset);
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  };

  return (
    <div className="bg-gray-700 text-white text-2xl font-bold p-4 h-16 flex flex-row items-center justify-between">
      <div className="flex items-center gap-4">
        <input
          type="text"
          className="bg-gray-800 text-white p-2 rounded-lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
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
        <SaveIcon
          onClick={save}
          style={{
            fontSize: "2rem",
          }}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}
