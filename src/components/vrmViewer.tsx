import { useContext, useCallback } from "react";
import { ViewerContext } from "../features/vrmViewer/viewerContext";
import { buildUrl } from "@/utils/buildUrl";
import { get, set } from "idb-keyval";

export default function VrmViewer() {
  const { viewer } = useContext(ViewerContext);

  const canvasRef = useCallback(
    async (canvas: HTMLCanvasElement) => {
      if (canvas) {
        viewer.setup(canvas);

        const modelPath = await get("vrmModel");

        if (modelPath) {
          if (typeof modelPath === "string") {
            viewer.loadVrm(buildUrl(modelPath));
          } else {
            const blob = new Blob([modelPath], {
              type: "application/octet-stream",
            });
            const url = window.URL.createObjectURL(blob);

            viewer.loadVrm(url);
          }
        } else {
          viewer.loadVrm(buildUrl("/three-vrm-girl.vrm"));
        }

        // Drag and DropでVRMを差し替え
        canvas.addEventListener("dragover", function (event) {
          event.preventDefault();
        });

        canvas.addEventListener("drop", function (event) {
          event.preventDefault();

          const files = event.dataTransfer?.files;
          if (!files) {
            return;
          }

          const file = files[0];
          if (!file) {
            return;
          }

          const file_type = file.name.split(".").pop();
          if (file_type === "vrm") {
            const blob = new Blob([file], { type: "application/octet-stream" });
            const url = window.URL.createObjectURL(blob);
            viewer.loadVrm(url);

            set("vrmModel", file);
          }
        });
      }
    },
    [viewer]
  );

  return (
    <div
      className={"absolute top-0 left-0 w-full h-full -z-10 overflow-hidden"}
    >
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
