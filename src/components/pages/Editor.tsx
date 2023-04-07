import { ReactP5Wrapper } from "react-p5-wrapper";
import { FliesenPlanner } from "../../app/FliesenPlanner";
import { createContext, forwardRef, useEffect, useRef, useState } from "react";
import { Modes, Mode } from "../../types/Modes";
import { PolygonMesh, testMesh } from "../../types/Drawing";
import { Vector } from "p5";

export interface GlobalContext {
  drawLengthCM: number;
  setDrawLengthCM: React.Dispatch<React.SetStateAction<number>>;
  tileDims: [number, number];
  setTileDims: React.Dispatch<React.SetStateAction<[number, number]>>;
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  mainContentRef: React.MutableRefObject<HTMLDivElement | null>;
  mesh: PolygonMesh;
  setMesh: React.Dispatch<React.SetStateAction<PolygonMesh>>;
  tileOffset: Vector;
  setTileOffset: React.Dispatch<React.SetStateAction<Vector>>;
}

export const GlobalContext = createContext<GlobalContext>({
  drawLengthCM: 100,
  setDrawLengthCM: () => {},
  tileDims: [25, 25],
  setTileDims: () => {},
  mode: Modes[0],
  setMode: () => {},
  name: "test",
  setName: () => {},
  mainContentRef: { current: null },
  mesh: testMesh,
  setMesh: () => {},
  tileOffset: new Vector(0, 0),
  setTileOffset: () => {},
});

export function Editor() {
  const [drawLengthCM, setDrawLengthCM] = useState(100);
  const [tileDims, setTileDims] = useState<[number, number]>([25, 25]);
  const [name, setName] = useState("test");
  const [mode, setMode] = useState<Mode>(Modes[1]);
  const [mesh, setMesh] = useState(testMesh);
  const [tileOffset, setTileOffset] = useState(new Vector(0, 0));
  const mainContentRef = useRef<HTMLDivElement>(null);

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
      <div ref={ref} className="print:contrast-200 print:invert ">
        <ReactP5Wrapper
          sketch={FliesenPlanner}
          drawLength={drawLengthCM}
          tileDims={tileDims}
          mode={mode["name"]}
          mesh={mesh}
          tileOffset={tileOffset}
        />
      </div>
    );
  });

  return (
    <>
      <GlobalContext.Provider
        value={{
          drawLengthCM,
          setDrawLengthCM,
          tileDims,
          setTileDims,
          mode,
          setMode,
          name,
          setName,
          mainContentRef,
          mesh,
          setMesh,
          tileOffset,
          setTileOffset,
        }}
      >
        <div id="sketch-window" className="w-full h-full">
          <ComponentToPrint ref={mainContentRef} />
        </div>
      </GlobalContext.Provider>
    </>
  );
}
