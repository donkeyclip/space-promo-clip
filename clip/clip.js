import { HTMLClip, loadPlugin } from "@donkeyclip/motorcortex";
import html from "./clip.html";
import css from "!!raw-loader!./clip.css";
import { initParamsValidationRules, initParams } from "./initParams";
import threejsDefinition from "@donkeyclip/motorcortex-threejs";
import { planet, planetAnimationNames } from "./incidents";

const threejs = loadPlugin(threejsDefinition);

export const clip = new HTMLClip({
  html,
  css,
  host: document.getElementById("clip"),
  initParamsValidationRules,
  initParams: initParams[1].value,
  containerParams: {
    width: "1280px",
    height: "720px",
  },
});

const threeClip = new threejs.Clip(
  {
    renderers: {
      parameters: [{ physicallyCorrectLights: true }],
      settings: {
        setClearColor: ["#C7DCFF"],
      },
    },
    scenes: {
      fog: ["#C7DCFF", 1, 7000],
    },
    lights: [
      {
        type: "HemisphereLight",
        parameters: ["#ff12fb", "#b8eeff", "0.3"],
        settings: {
          position: { set: [-290, 70, 150] },
        },
      },
      {
        type: "DirectionalLight",
        parameters: ["#12ffeb", "0.1"],
        settings: {
          position: { set: [-290, 70, 150] },
        },
      },
    ],
    cameras: [
      {
        id: "camera_1",
        type: "PerspectiveCamera",
        parameters: [45, 1920 / 1080, 0.01, 1000],
        settings: {
          position: { x: 0, y: 160, z: 0 },
          far: 10000000,
          near: 1,
        },
      },
    ],
    entities: [planet],
    controls: { maxDistance: 50000, enable: true, enableEvents: true },
  },
  {
    selector: ".container",
    containerParams: {
      width: "1920px",
      height: "1080px",
    },
  }
);
window.threeClip = threeClip;
clip.addIncident(threeClip, 0);
planetAnimationNames.forEach((animationName, index) => {
  const planetAnimation = new threejs.MorphAnimation(
    {
      attrs: {
        singleLoopDuration: 3000,
        animationName,
      },
      animatedAttrs: {
        [`time_${index}`]: 3000,
      },
    },
    {
      selector: "!#planet",
      duration: 3000,
    }
  );
  threeClip.addIncident(planetAnimation, 0);
});
