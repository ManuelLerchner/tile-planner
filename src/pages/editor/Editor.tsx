import { Box, CircularProgress } from "@mui/material";
import * as htmlToImage from "html-to-image";
import { Vector } from "p5";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import { useParams } from "react-router-dom";
import EditProjectModal from "../../components/EditProjectModal";
import { supabase } from "../../database/subabaseClient";
import { PolygonMesh } from "../../types/Drawing";
import { InteractTool, Tools } from "../../types/InteractMode";
import { TileMode } from "../../types/TileMode";
import { TilePlanner } from "./TilePlanner/TilePlanner";
import EditorLayout from "./layout/EditorLayout";
import { MarkerMode } from "../../types/MarkerMode";
import { decode } from "base64-arraybuffer";
import { useAuth } from "../../hooks/useAuth";
import HelpModal from "../../components/HelpModal";

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
  const { user } = useAuth();

  if (!user) {
    throw new Error("User not logged in");
  }

  const [loaded, setLoaded] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [drawLength, setDrawLength] = useState(100);
  const [interactTool, setInteractTool] = useState<InteractTool>(Tools[1]);
  const [markerMode, setMarkerMode] = useState<MarkerMode>("Ortho");
  const mainContentRef = useRef<HTMLDivElement>(null);

  const [tileDims, setTileDims] = useState<[number, number]>([25, 25]);
  const [mesh, setMesh] = useState<PolygonMesh>({
    vertices: [],
    edges: [],
  });
  const [tileOffset, setTileOffset] = useState(new Vector(0, 0));
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tileMode, setTileMode] = useState<TileMode>("Straight");

  const fetchData = useCallback(async () => {
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
  }, [id]);

  const save = useCallback(async () => {
    var node = mainContentRef.current;
    if (!node) return;
    if (!loaded) return;

    const base64Image = await htmlToImage.toJpeg(node, {
      quality: 0.5,
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

    const dataParts = base64Image.split(",");
    const arrayBuffer = decode(dataParts[1]);

    await supabase.storage
      .from("thumbnails")
      .upload(user.id + "/" + id + ".jpg", arrayBuffer, {
        contentType: "image/jpg",
        upsert: true,
      });
  }, [loaded, tileDims, tileOffset, tileMode, id, mesh, user.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      save();
    }, 20000);
    return () => clearInterval(interval);
  }, [save]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setInteractTool(Tools[1]);
  }, [markerMode, drawLength]);

  const ComponentToPrint = forwardRef<HTMLDivElement>((props, ref) => {
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
    return (
      <div id="sketch-window" ref={ref} className="h-full">
        <div className="hidden print:flex p-4 flex-col items-center justify-center">
          <h1 className="text-4xl mb-4">
            {name +
              " - " +
              new Date().toLocaleDateString("gb-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
          </h1>
          <p className="text-2xl">{description}</p>
        </div>
        <div className="print:contrast-200 print:invert print:mt-4">
          <ReactP5Wrapper
            sketch={TilePlanner}
            drawLength={drawLength}
            tileDims={tileDims}
            tool={interactTool.name}
            mesh={mesh}
            tileOffset={tileOffset}
            tileMode={tileMode}
            markerMode={markerMode}
          />
        </div>
      </div>
    );
  });

  return (
    <EditorLayout
      interactTool={interactTool}
      setInteractTool={setInteractTool}
      tileDims={tileDims}
      setTileDims={setTileDims}
      tileMode={tileMode}
      setTileMode={setTileMode}
      drawLength={drawLength}
      setDrawLength={setDrawLength}
      mainContentRef={mainContentRef}
      setShowEdit={setShowEdit}
      setShowHelp={setShowHelp}
      save={save}
      markerMode={markerMode}
      setMarkerMode={setMarkerMode}
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

      {showHelp && <HelpModal setShowHelp={setShowHelp} />}

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
        <div className="w-full h-full">
          <ComponentToPrint ref={mainContentRef} />
        </div>
      )}
    </EditorLayout>
  );
}
