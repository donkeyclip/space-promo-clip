import MotorCortex from '@kissmybutton/motorcortex';
import MyPluginDefinition from "@kissmybutton/motorcortex-threejs";
import * as THREE from "three";
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
      width: '1280px',
      height: '720px'
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
    file: "./assets/test/glb/spa.glb",
  },
  children:["Astronaut_2_Body_Flying","Spaceship_Baked"]
};

const starsAnimation = {
  id: "stars",
  model: {
    loader: "GLTFLoader",
    file: "./assets/stars1.glb",
  },
};

const box = {
  geometry: { type: "SphereGeometry", parameters: [12, 50, 50] },
  material: {
    type: "ShaderMaterial",
    parameters: [{
      uniforms: {},
      vertexShader: `
      varying vec3 vertexNormal;

      void main() {
        vertexNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, .9 );
      }
    `,
      fragmentShader: `
      varying vec3 vertexNormal; // (0, 0, 0)
      void main() {
        float intensity = pow(0.9 - dot(vertexNormal, vec3(0, 0, 1.0)), 2.0);
        gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
      }
    `,
      // side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    }]
  },
  settings: { position: { x: 39, y: 0, z: 34}}
};


const entities = [planetAnimation,spaceShipAnimation,starsAnimation,box];

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
        position: { x: -53, y: -2, z: -10 },
        lookAt: [-174, -86, -174],
      },
    },
    entities,
    controls: { enable: true, enableEvents: true, maxPolarAngle: Math.PI },
  },
  {
    selector: "#scene",
    containerParams: { width: "1280px", height: "720px" }
  }
);

for (let index = 0; index <= 258; index++) {
  const planetAnimation = new threejsPlugin.MorphAnimation(
    {
      attrs: {
        singleLoopDuration: 3000,
        animationName: `Cell_0.${pad(index, 3)}Action`,
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
}

// for (let index = 0; index <= 13; index++) {
//   const spaceshipAnimation = new threejsPlugin.MorphAnimation(
//     {
//       attrs: {
//         singleLoopDuration: 3000,
//         animationName: `Action.${pad(index, 3)}`,
//       },
//       animatedAttrs: {
//         [`time_${index}`]: 3000,
//       },
//     },
//     {
//       selector: "!#spaceship",
//       duration: 3000,
//     }
//   );
//   threeClip.addIncident(spaceshipAnimation, 0);
// }


const spaceshipAnimation = new threejsPlugin.MorphAnimation(
      {
        attrs: {
          singleLoopDuration: 3000,
          animationName: `Spaceship_Flight`,
        },
        animatedAttrs: {
          [`time`]: 3000,
        },
      },
      {
        selector: "!#spaceship",
        duration: 3000,
      }
    );
threeClip.addIncident(spaceshipAnimation, 0);

const flamesAnimation = new threejsPlugin.MorphAnimation(
  {
    attrs: {
      singleLoopDuration: 3000,
      animationName: `Flames`,
    },
    animatedAttrs: {
      [`time`]: 3000,
    },
  },
  {
    selector: "!#spaceship",
    duration: 3000,
  }
);
threeClip.addIncident(flamesAnimation, 0);


const Astronaut2 = new threejsPlugin.MorphAnimation(
  {
    attrs: {
      singleLoopDuration: 3000,
      animationName: `Asronaut_2_RIG_Flying`,
    },
    animatedAttrs: {
      [`time`]: 3000,
    },
  },
  {
    selector: "!#spaceship",
    duration: 3000,
  }
);
threeClip.addIncident(Astronaut2, 0);

const cameraAnimation = new threejsPlugin.ObjectAnimation(
  {
    animatedAttrs: {
      followEntity: {
        offsetX: -10, 
        offsetY: -0, 
        offsetZ: -10,
        entity: "!#spaceship.Spaceship_Baked"
      },
      targetEntity: "!#spaceship.Spaceship_Baked",
    },
  },
  {
    selector: "!#camera_1",
    duration: 3000,
  }
);
threeClip.addIncident(cameraAnimation,0);

console.log(threeClip,"CLIP")

window.clip= threeClip
clip.addIncident(threeClip, 0);