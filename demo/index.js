import { utils } from "@donkeyclip/motorcortex";
import Player from "@donkeyclip/motorcortex-player";
import { clip } from "../clip/clip";
import clipId from "../clip/id";
import initParamsApply from "./scripts/initParamsApply";

const liveDef = clip.exportLiveDefinition();
liveDef.props.id = clip.id;

const clipDef = clip.exportDefinition();
window.top.postMessage(
  {
    what: "clipLoaded",
    clipDims: clip.props.containerParams,
    clipDef: JSON.parse(JSON.stringify(clipDef)),
    clipId,
  },
  "*"
);

window.addEventListener("message", (event) => {
  if (event.data.what === "initParamsChange") {
    const newLiveDef = initParamsApply(liveDef, event.data.initParams);
    document.getElementById("projector").innerHTML = "<div id='clip'></div>";
    const clipContainer = document.getElementById("clip");
    // set clip container's dimensions
    clipContainer.style.width = clip.props.containerParams.width;
    clipContainer.style.height = clip.props.containerParams.height;
    newLiveDef.props.host = clipContainer;
    const newclip = utils.clipFromDefinition(newLiveDef);
    if (newclip.nonBlockingErrorClip) {
      // if the initParams validation has failed
      return alert("Error with init params");
    }
    window.mc = { Player: new Player({ clip: newclip, timeFormat: "ms" }) };
  }
});

const clipContainer = document.getElementById("clip");
// set clip container's dimensions
clipContainer.style.width = clip.props.containerParams.width;
clipContainer.style.height = clip.props.containerParams.height;
new Player({ clip, pointerEvents: true, timeFormat: "ms" });
