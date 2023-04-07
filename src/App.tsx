import { ReactP5Wrapper } from "react-p5-wrapper";
import { FliesenPlanner } from "./app/FliesenPlanner";
import PageLayout from "./components/PageLayout";
import { createContext, forwardRef, useEffect, useRef, useState } from "react";
import { Modes, Mode } from "./types/Modes";
import { testMesh } from "./types/Drawing";
import ReactToPrint from "react-to-print";

export interface GlobalContext {
  drawLengthCM: number;
  setDrawLengthCM: React.Dispatch<React.SetStateAction<number>>;
  tileDims: [number, number];
  setTileDims: React.Dispatch<React.SetStateAction<[number, number]>>;
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
}

export const GlobalContext = createContext<GlobalContext>({} as GlobalContext);

export function App() {
  const [drawLengthCM, setDrawLengthCM] = useState(100);
  const [tileDims, setTileDims] = useState<[number, number]>([30, 30]);
  const [mode, setMode] = useState<Mode>(Modes[0]);

  const mesh = testMesh;

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

  const mainContentRef = useRef<any>();

  const ComponentToPrint = forwardRef<HTMLDivElement>((props, ref) => {
    return (
      <div ref={ref} className="print:contrast-200 print:invert ">
        <ReactP5Wrapper
          sketch={FliesenPlanner}
          drawLength={drawLengthCM}
          tileDims={tileDims}
          mode={mode["name"]}
          mesh={mesh}
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
        }}
      >
        <PageLayout mainContentRef={mainContentRef}>
          <div id="sketch-window" className="w-full h-full">
            <ComponentToPrint ref={mainContentRef} />
          </div>
        </PageLayout>
      </GlobalContext.Provider>
    </>
  );
}
