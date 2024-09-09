"use client";

import { type FunctionComponent, useEffect, useState } from "react";
import Loader from "@/components/loader";

declare const $: any; // Declare $ to avoid TypeScript errors, assuming jQuery will be globally available

const GalaxyMap: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document === undefined) {
          reject(new Error("Document is not available"));
          return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
      });
    };

    const loadStylesheet = (href: string) => {
      const link = document.createElement("link");
      link.href = href;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    };

    const initializeMap = () => {
      const edmap = document.getElementById("edmap");
      if (edmap) {
        edmap.innerHTML = ""; // Clear the map container to ensure it's reset
      }

      (window as any).Ed3d.init({
        container: "edmap",
        basePath: "./",
        jsonPath: "./data/milkyway.json",
        withHudPanel: false,
        showGalaxyInfos: true,
        startAnim: true,
        playerPos: [-2638, 175, -436],
        cameraPos: [-14638, 4175, -1436],
      });
    };

    // Load scripts and initialize the map
    loadScript("https://code.jquery.com/jquery-2.1.4.min.js")
      .then(() => loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r75/three.min.js"))
      .then(() => {
        loadStylesheet("https://wiki.ed-board.net/ED3D-Galaxy-Map/css/styles.css");
        return loadScript("/js/ed3dmap.min.js?v=10");
      })
      .then(() => {
        $(initializeMap);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load scripts or initialize map:", error);
      });

    // Cleanup on unmount
    return () => {
      const edmap = document.getElementById("edmap");
      if (edmap) {
        edmap.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="edmap-wrapper z-10">
      {isLoading && <Loader visible={isLoading} />}

      <div id="minimap" className="mt-24 rounded">
        <div id="edmap"></div>
      </div>
    </div>
  );
};

export default GalaxyMap;
