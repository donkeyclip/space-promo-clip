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
      width: '801px',
      height: '600px'
  },
  initParamsValidationRules: {
    color: {
      type: "color",
      optional: true,
      default: "white",
    },
  },
  initParams: {
    color: "white",
  },
 
});
const planetAnimation = {
  id: "planet",
  model: {
    loader: "GLTFLoader",
    file: "./assets/planet.glb",
  },
};

const spaceShipAnimation = {
  id: "spaceship",
  model: {
    loader: "GLTFLoader",
    file: "./assets/spaceship.glb",
  },
};


const entities = [planetAnimation,spaceShipAnimation];

function pad(n, width, z) {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const threeClip = new threejsPlugin.Clip(
  {
    renderers: {
      settings: { setClearColor: ["#0d121c"], physicallyCorrectLight: true },
    },
    scenes: { id: "scene" },
    lights: [
      {
        type: "HemisphereLight",
        parameters:["#ff12fb","#b8eeff", "0.3"],
        settings: {
          position: { set: [-290, 70, 150] },
        },
      },
      {
        type: "DirectionalLight",
        parameters:["#12ffeb", "0.1"],
        settings: {
          position: { set: [-290, 70, 150] },
        },
      },
    ],
    cameras: {
      id: "camera_1",
      settings: {
        position: { x: -22, y: 1, z: 9 },
        lookAt: [0, 0, 0],
      },
    },
    entities,
    controls: { enable: true, enableEvents: true },
  },
  {
    selector: "#scene",
    containerParams: { width: "800px", height: "600px" }
  }
);

for (let index = 0; index <= 258; index++) {
  const planetAnimation = new threejsPlugin.MorphAnimation(
    {
      attrs: {
        singleLoopDuration: 2000,
        animationName: `Cell_0.${pad(index, 3)}Action`,
      },
      animatedAttrs: {
        [`time_${index}`]: 2000,
      },
    },
    {
      selector: "!#planet",
      duration: 2000,
    }
  );
  threeClip.addIncident(planetAnimation, 0);
}

for (let index = 0; index <= 13; index++) {
  const spaceshipAnimation = new threejsPlugin.MorphAnimation(
    {
      attrs: {
        singleLoopDuration: 2000,
        animationName: `Action.${pad(index, 3)}`,
      },
      animatedAttrs: {
        [`time_${index}`]: 2000,
      },
    },
    {
      selector: "!#spaceship",
      duration: 2000,
    }
  );
  threeClip.addIncident(spaceshipAnimation, 0);
}



clip.addIncident(threeClip, 0);