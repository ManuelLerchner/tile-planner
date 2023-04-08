import { ReactP5Wrapper } from "react-p5-wrapper";
import { TilePlanner } from "./TilePlanner/TilePlanner";
import { createContext, forwardRef, useEffect, useRef, useState } from "react";
import { Modes, Mode } from "../../types/Modes";
import { PolygonMesh } from "../../types/Drawing";
import { Vector } from "p5";
import EditorLayout from "./layout/EditorLayout";
import { useParams } from "react-router-dom";
import { supabase } from "../../database/subabaseClient";
import { Box, CircularProgress } from "@mui/material";

type RowEntry = {
  id: string;
  mesh: PolygonMesh;
  tile_dims_x: number;
  tile_dims_y: number;
  tile_offset_x: number;
  tile_offset_y: number;
  projects: {
    name: string;
  };
};

export function Editor() {
  const id = useParams().id as string;

  const [loaded, setLoaded] = useState(false);
  const [drawLength, setDrawLength] = useState(100);
  const [mode, setMode] = useState<Mode>(Modes[1]);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const [tileDims, setTileDims] = useState<[number, number]>([25, 25]);
  const [mesh, setMesh] = useState<PolygonMesh>({
    vertices: [],
    edges: [],
  });
  const [tileOffset, setTileOffset] = useState(new Vector(0, 0));
  const [name, setName] = useState("");

  const fetchData = async () => {
    setLoaded(false);
    const { data } = await supabase
      .from("drawings")
      .select("*, projects(name)")
      .eq("id", id)
      .single();
    const row = data as RowEntry;

    setLoaded(true);
    if (row) {
      setMesh(row.mesh);
      setTileDims([row.tile_dims_x, row.tile_dims_y]);
      setTileOffset(new Vector(row.tile_offset_x, row.tile_offset_y));
      setName(row.projects.name);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // disable right click
  useEffect(() => {
    const handleContextmenu = (e: any) => {
      e.preventDefault();
    };
    document
      .getElementById("sketch-window")
      ?.addEventListener("contextmenu", handleContextmenu);
    return function cleanup() {
      document.removeEventListener("contextmenu", handleContextmenu);
    };
  }, []);

  const ComponentToPrint = forwardRef<HTMLDivElement>((props, ref) => {
    return (
      <div ref={ref}>
        <div className="hidden print:block p-4">
          <h1 className="text-2xl ">{name}</h1>
          <h2 className="text-xl">
            {new Date().toLocaleDateString("gb-GB", {
              weekday: "long",
              year: "numeric",
              month: "numeric",
            })}
          </h2>
        </div>
        <div className="print:contrast-200 print:invert ">
          <ReactP5Wrapper
            sketch={TilePlanner}
            drawLength={drawLength}
            tileDims={tileDims}
            mode={mode["name"]}
            mesh={mesh}
            tileOffset={tileOffset}
          />
        </div>
      </div>
    );
  });

  return (
    <EditorLayout
      mode={mode}
      setMode={setMode}
      id={id}
      tileDims={tileDims}
      setTileDims={setTileDims}
      drawLength={drawLength}
      setDrawLength={setDrawLength}
      tileOffset={tileOffset}
      mainContentRef={mainContentRef}
      mesh={mesh}
      loaded={loaded}
    >
      {!loaded && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {loaded && (
        <div id="sketch-window" className="w-full h-full">
          <ComponentToPrint ref={mainContentRef} />
        </div>
      )}
    </EditorLayout>
  );
}
