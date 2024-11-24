import form from "./form";
import graph from "./graph";

function onInit() {
  form.init(() => {});

  // TODO: draw old points
  graph.init((x, y, r) => {
    console.log(`received coords (${x}, ${y}) with radius ${r}`);
    form.submit(x, y, r);
  });
}

onInit();
