import { ReactP5Wrapper } from "react-p5-wrapper";
import { TilePlanner } from "./TilePlanner/TilePlanner";
import { createContext, forwardRef, useEffect, useRef, useState } from "react";
import { Modes, InteractMode } from "../../types/InteractMode";
import { PolygonMesh } from "../../types/Drawing";
import { Vector } from "p5";
import EditorLayout from "./layout/EditorLayout";
import { useParams } from "react-router-dom";
import { supabase } from "../../database/subabaseClient";
import { Box, CircularProgress } from "@mui/material";
import EditProjectModal from "../../components/EditProjectModal";
import * as htmlToImage from "html-to-image";
import { TileMode } from "../../types/TileMode";

type RowEntry = {
  id: string;
  mesh: PolygonMesh;
  tile_dims_x: number;
  tile_dims_y: number;
  tile_offset_x: number;
  tile_offset_y: number;
  tile_mode: TileMode;
  projects: {
    name: string;
    description: string;
  };
};

export function Editor() {
  const id = useParams().id as string;

  const [loaded, setLoaded] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [drawLength, setDrawLength] = useState(100);
  const [mode, setMode] = useState<InteractMode>(Modes[1]);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const [tileDims, setTileDims] = useState<[number, number]>([25, 25]);
  const [mesh, setMesh] = useState<PolygonMesh>({
    vertices: [],
    edges: [],
  });
  const [tileOffset, setTileOffset] = useState(new Vector(0, 0));
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tileMode, setTileMode] = useState<TileMode>("Interlaced");

  const fetchData = async () => {
    setLoaded(false);
    const { data } = await supabase
      .from("drawings")
      .select("*, projects(name, description)")
      .eq("id", id)
      .single();
    const row = data as RowEntry;

    setLoaded(true);
    if (row) {
      setMesh(row.mesh);
      setTileDims([row.tile_dims_x, row.tile_dims_y]);
      setTileOffset(new Vector(row.tile_offset_x, row.tile_offset_y));
      setName(row.projects.name);
      setDescription(row.projects.description);
      setTileMode(row.tile_mode);
    }
  };

  const save = async () => {
    var node = mainContentRef.current;
    if (!node) return;
    if (!loaded) return;

    const dataUrl = await htmlToImage.toJpeg(node, {
      quality: 0.95,
    });

    await supabase.from("drawings").upsert({
      id: id,
      mesh: mesh,
      tile_dims_x: tileDims[0],
      tile_dims_y: tileDims[1],
      tile_offset_x: tileOffset.x,
      tile_offset_y: tileOffset.y,
      tile_mode: tileMode,
      updated_at: new Date().toISOString(),
    });

    await supabase
      .from("projects")
      .update({
        image: dataUrl,
      })
      .eq("id", id);
  };

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

  useEffect(() => {
    const interval = setInterval(() => {
      save();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const initialFetch = async () => {
      await fetchData();
      save();
    };
    initialFetch();
  }, []);

  const ComponentToPrint = forwardRef<HTMLDivElement>((props, ref) => {
    return (
      <div ref={ref} className="h-full">
        <div className="hidden print:block p-4">
          <h1 className="text-4xl mb-4">{name}</h1>
          <p className="text-2xl">{description}</p>
        </div>
        <div className="print:contrast-200 print:invert ">
          <ReactP5Wrapper
            sketch={TilePlanner}
            drawLength={drawLength}
            tileDims={tileDims}
            mode={mode["name"]}
            mesh={mesh}
            tileOffset={tileOffset}
            tileMode={tileMode}
          />
        </div>
      </div>
    );
  });

  return (
    <EditorLayout
      mode={mode}
      setMode={setMode}
      tileDims={tileDims}
      setTileDims={setTileDims}
      tileMode={tileMode}
      setTileMode={setTileMode}
      drawLength={drawLength}
      setDrawLength={setDrawLength}
      mainContentRef={mainContentRef}
      setShowEdit={setShowEdit}
      save={save}
    >
      {showEdit && (
        <EditProjectModal
          projectId={id}
          setShowEdit={setShowEdit}
          onEdit={async () => {
            await save();
            fetchData();
          }}
        />
      )}

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
