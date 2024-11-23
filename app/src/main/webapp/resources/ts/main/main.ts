import form from "./form";
import graph, { PointColor } from "./graph";

function onInit() {
  form.init(() => {});

  // TODO: draw old points
  graph.init((x, y, r) => {
    console.log(`received coords (${x}, ${y}) with radius ${r}`);
    graph.addPoint(x, y, r, PointColor.MISS);
    window.location.replace(`./controller?x=${x}&y=${y}&r=${r}`);
  });
}

onInit();
