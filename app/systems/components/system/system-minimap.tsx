import React from "react";
import Loader from "@/components/loader";

declare const $: any; // Declare $ to avoid TypeScript errors, assuming jQuery will be globally available

// This will ensure scripts are only loaded once
const loadScriptsAndInitialize = (() => {
  let isInitialized = false;

  return () => {
    if (isInitialized) return; // Prevent running this multiple times

    isInitialized = true;

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
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
      (window as any).Ed3d.init({
        container: 'edmap',
        basePath: './',
        jsonContainer: "json-coords",
        withHudPanel: true,
        showGalaxyInfos: true,
        effectScaleSystem: [4000, 8000],
        startAnim: true,
        systemColor: '#C7F900',
        playerPos: [-2638, 175, -436],
        cameraPos: [-7638, 15175, -15436]
      });
    };

    loadScript("https://code.jquery.com/jquery-2.1.4.min.js")
      .then(() => loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r75/three.min.js"))
      .then(() => {
        loadStylesheet("https://wiki.ed-board.net/ED3D-Galaxy-Map/css/styles.css");
        return loadScript("https://wiki.ed-board.net/ED3D-Galaxy-Map/js/ed3dmap.min.js?v=9");
      })
      .then(() => {
        $(initializeMap);
      })
      .catch(error => {
        console.error("Failed to load scripts or initialize map:", error);
      });
  };
})();

// Ensure scripts and initialization run when the module is first imported
loadScriptsAndInitialize();

const MyComponent: React.FC<{ isLoading: boolean; }> = ({ isLoading }) => {
  return (
    <>
      {isLoading && <Loader visible={isLoading} />}

      <div className="p-20">
        <div id="minimap">
          <div id="edmap"></div>
        </div>
      </div>
    </>
  );
};

export default MyComponent;
