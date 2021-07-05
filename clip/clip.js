import MotorCortex from '@kissmybutton/motorcortex';
import MyPluginDefinition from "@kissmybutton/motorcortex-threejs";
const threejsPlugin  = MotorCortex.loadPlugin(MyPluginDefinition);

export const clip = new MotorCortex.HTMLClip({
  html: `
  <div id="scene"></div>`,
  css: `
    #scene{
      width:100%;
      height:100%;
      position:relative;
    }
  `,
  host: document.getElementById('clip'),
  containerParams: {
      width: '800px',
      height: '600px'
  },
  // initParamsValidationRules: {
    // color: {
    //   type: "color",
    //   optional: true,
    //   default: "white",
    // },
  // },
  // initParams: {
    // color: "white",
  // },
 
});
const planetAnimation = {
  id: "planet_1",
  model: {
    id: "planet",
    loader: "GLTFLoader",
    file: "./assets/planet.glb",
  },
  settings: {
    position: { x: 0, y: 0, z: 0 },
    scale: { x: 0.2, y: 0.2, z: 0.2 },
  },
};

const entities = [planetAnimation];

const threeClip = new threejsPlugin.Clip(
  {
    renderers: {
      settings: { setClearColor: ["#999"], physicallyCorrectLight: true },
    },
    scenes: { id: "scene", fog: ["#999", 0.1, 500] },
    lights: [
      {
        parameters: ["#457", 1],
        type: "SpotLight",
        settings: {
          position: { set: [-40, 80, 20] },
          shadow: {
            radius: 1.2,
            camera: {
              near: 0.5,
              far: 500,
              left: -100,
              bottom: -100,
              right: 100,
              top: 100,
            },
            bias: 0.01,
            mapSize: { x: 1024 * 6, y: 1024 * 6 },
          },
        },
      },
      {
        parameters: ["#999", 1],
        type: "PointLight",
        settings: {
          position: { set: [-40, 80, 20] },
          shadow: {
            radius: 1.2,
            camera: {
              near: 0.5,
              far: 500,
              left: -100,
              bottom: -100,
              right: 100,
              top: 100,
            },
            bias: 0.01,
            mapSize: { x: 1024 * 6, y: 1024 * 6 },
          },
        },
      },
      {
        type: "HemisphereLight",
        settings: {
          position: { set: [-40, 180, 20] },
        },
      },
    ],
    cameras: {
      id: "camera_1",
      settings: {
        position: { x: -290, y: 70, z: 150 },
        lookAt: [-33, 14, 30],
      },
    },
    entities,
    controls: { enable: true },
  },
  {
    selector: "#scene",
    containerParams: { width: "800px", height: "600px" }
  }
);

console.log(threeClip)

clip.addIncident(threeClip, 0);