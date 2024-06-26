import React, { Suspense, useContext } from "react";
import { MobileContext } from "../../App";

const Spline = React.lazy(() => import("@splinetool/react-spline"));

const Letter = () => {
  const isMobile = useContext(MobileContext);
  return (
    <div className="z-0">
      <Suspense fallback={<div>Loading...</div>}>
        <Spline
          scene="https://prod.spline.design/n64JWnDcuDS0-WQs/scene.splinecode"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: `${isMobile ? "80px" : "-20"}`,
            left: "",
            zIndex: "2",
            marginBottom: "10",
          }}
        />
      </Suspense>
    </div>
  );
};

export default Letter;
