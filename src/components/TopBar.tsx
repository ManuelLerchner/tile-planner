import React from "react";
import ReactToPrint from "react-to-print";

export default function TopBar({
  mainContentRef,
}: {
  mainContentRef: React.RefObject<any>;
}) {
  return (
    <div className="bg-gray-700 text-white text-2xl font-bold p-4 h-16">
      <div className="flex justify-between">
        <ReactToPrint
          trigger={() => {
            // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
            // to the root node of the returned component as it will be overwritten.
            return <a href="#">Print this out!</a>;
          }}
          content={() => mainContentRef.current}
        />
      </div>
    </div>
  );
}
