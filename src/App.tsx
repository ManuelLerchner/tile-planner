import { ReactP5Wrapper } from "react-p5-wrapper";
import { FliesenPlanner } from "./sketch/FliesenPlanner";
import PageLayout from "./components/PageLayout";
import { createContext, useState } from "react";

export interface LengthContext {
  drawLengthCM: number;
  setDrawLengthCM: React.Dispatch<React.SetStateAction<number>>;
  tileDims: [number, number];
  setTileDims: React.Dispatch<React.SetStateAction<[number, number]>>;
}

export const LengthContext = createContext<LengthContext>({} as LengthContext);

export function App() {
  const [drawLengthCM, setDrawLengthCM] = useState(100);
  const [tileDims, setTileDims] = useState<[number, number]>([30, 30]);

  return (
    <>
      <LengthContext.Provider
        value={{ drawLengthCM, setDrawLengthCM, tileDims, setTileDims }}
      >
        <PageLayout>
          <div id="sketch-window" className="w-full h-full">
            <ReactP5Wrapper
              sketch={FliesenPlanner}
              drawLength={drawLengthCM}
              tileDims={tileDims}
            />
          </div>
        </PageLayout>
      </LengthContext.Provider>
    </>
  );
}
