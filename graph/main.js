let canvas = new fabric.Canvas("c", { selection: false });

function draw_node(x, y, radius, id) {
  let node = new fabric.Circle({
    left: x,
    top: y,
    strokeWidth: 0.25 * size,
    radius: size,
    fill: "#eee",
    stroke: "#777",
  });
  node.originX = node.originY = "center";
  node.lockMovementX = node.lockMovementY = node.lockRotation = true;
  node.hasControls = node.hasRotatingPoint = node.hasBorders = false;
  node.id = id;
  return node;
}
canvas.add(draw_node(5, 5, 3, 0));
canvas.renderAll();
let json_ex = {
  nodes: [
    {
      id: "n0",
      label: "A node",
      x: 0,
      y: 0,
      type: 3,
      completed: true,
    },
    {
      id: "n1",
      label: "Another node",
      x: 3,
      y: 1,
      type: 2,
      completed: true,
    },
    {
      id: "n2",
      label: "And a last one",
      x: 1,
      y: 3,
      type: 1,
      completed: false,
    },
  ],
  edges: [
    {
      id: "e0",
      source: "n0",
      target: "n1",
    },
    {
      id: "e1",
      source: "n1",
      target: "n2",
    },
    {
      id: "e2",
      source: "n2",
      target: "n0",
    },
  ],
};

let graph = JSON.parse(json_ex);
