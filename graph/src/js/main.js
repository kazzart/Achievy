import "../scss/main.scss";
import "bootstrap";
import { fabric } from "fabric";
import {
  completed_node_shadow,
  active_node_shadow,
  default_node_shadow,
  default_line_shadow,
  default_font_shadow,
  default_font_fill,
  circle_fill,
  completed_circle_stroke,
  active_circle_stroke,
  default_circle_stroke,
  hover_circle_stroke_size,
  default_circle_stroke_size,
  circle_scale_coeff,
  line_color,
} from "./tagholder.js";
let active = null;
let nodes = [];
let canvas = new fabric.Canvas("c", {
  selection: false,
  backgroundColor: "rgb(40,40,40)",
});
let hidden_pannel = document.getElementById("hidden_pannel");
let name_pannel = document.getElementById("Node_name");
let description_pannel = document.getElementById("Description");
function clearSelection() {
  if (window.getSelection) {
    if (window.getSelection().empty) {
      // Chrome
      window.getSelection().empty();
    } else if (window.getSelection().removeAllRanges) {
      // Firefox
      window.getSelection().removeAllRanges();
    }
  } else if (document.selection) {
    // IE?
    document.selection.empty();
  }
}
document.getElementById("cancel-button").onclick = () => {
  if (active != null) {
    active.setRadius(active.size);
    if (active.completed) {
      active.set({
        strokeWidth: hover_circle_stroke_size * active.size,
      });
    } else {
      active.set({
        stroke: default_circle_stroke,
        shadow: default_node_shadow,
      });
    }
    active = null;
  }
  clearSelection();
  hidden_pannel.style.left = "-320px";
};

let viewportWidth = window.innerWidth;
let viewportHeight = window.innerHeight;

canvas.on("before:render", () => {
  viewportWidth = window.innerWidth;
  viewportHeight = window.innerHeight;
  canvas.setWidth(viewportWidth);
  canvas.setHeight(viewportHeight);
  canvas.calcOffset();
});

// Zoom
canvas.on("mouse:wheel", function (opt) {
  let delta = opt.e.deltaY;
  let zoom = canvas.getZoom();
  zoom = zoom - delta / 1000;
  if (zoom > 1.5) zoom = 1.5;
  if (zoom < 0.3) zoom = 0.3;
  canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  nodes.forEach((item) => {
    if (zoom < 0.6) {
      item.label.visible = false;
    } else {
      item.label.scale(1 / zoom);
      item.label.visible = true;
    }
  });
  opt.e.preventDefault();
  opt.e.stopPropagation();
});

// Pan
canvas.on("mouse:down", function (opt) {
  let evt = opt.e;
  if (opt.target == null) {
    canvas.isDragging = true;
    canvas.lastPosX = evt.clientX;
    canvas.lastPosY = evt.clientY;
  }
});

canvas.on("mouse:move", function (opt) {
  if (canvas.isDragging) {
    let evt = opt.e;
    canvas.viewportTransform[4] += evt.clientX - this.lastPosX;
    canvas.viewportTransform[5] += evt.clientY - this.lastPosY;
    canvas.lastPosX = evt.clientX;
    canvas.lastPosY = evt.clientY;
    canvas.forEachObject((obj) => {
      obj.setCoords();
    });
    canvas.requestRenderAll();
  }
});

canvas.on("mouse:up", function (opt) {
  canvas.isDragging = false;
});
// End pan

function create_node(x, y, size, id, label, description, completed) {
  let node = new fabric.Circle({
    left: x,
    top: y,
    strokeWidth: default_circle_stroke_size * size,
    radius: size,
    fill: circle_fill,
    stroke: default_circle_stroke,
    shadow: default_node_shadow,
    hoverCursor: "pointer",
    originX: "center",
    originY: "center",
    lockMovementX: true,
    lockMovementY: true,
    lockRotation: true,
    selectable: false,
    hasControls: false,
    hasBorders: false,
    hasRotatingPoint: false,
  });
  if (completed) {
    node.set({
      strokeWidth: hover_circle_stroke_size * size,
      stroke: completed_circle_stroke,
      shadow: completed_node_shadow,
    });
  }
  node.id = id;
  node.name = label;
  node.description = description;
  node.size = size;
  node.completed = completed;
  node.label = new fabric.Text(label, {
    originX: "left",
    originY: "bottom",
    fontFamily: "Comic Sans",
    hoverCursor: "cursor",
    shadow: default_font_shadow,
    left: node.left + node.radius * 1.2,
    top: node.top - node.radius * 0.6,
    fontSize: 22,
    lockMovementX: true,
    lockMovementY: true,
    selectable: false,
    hasControls: false,
    hasBorders: false,
    hasRotatingPoint: false,
    minScaleLimit: 1,
    fill: default_font_fill,
    ignoreZoom: true,
  });

  // node.on("mousedown", function () {
  //   canvas.renderAll();
  // });

  node.on("mouseup", (event) => {
    if (active != event.target) {
      if (active != null) {
        active.setRadius(active.size);
        if (active.completed) {
          active.set({
            strokeWidth: hover_circle_stroke_size * active.size,
          });
        } else {
          active.set({
            stroke: default_circle_stroke,
            shadow: default_node_shadow,
          });
        }
      }
      active = event.target;
      active.set({
        strokeWidth: default_circle_stroke_size * active.size,
      });
      if (!active.completed) {
        active.set({
          stroke: active_circle_stroke,
          shadow: active_node_shadow,
        });
      }
      canvas.renderAll();
      clearSelection();
      hidden_pannel.style.left = "0px";
      name_pannel.innerHTML = active.name;
      description_pannel.innerHTML = active.description;
    }
  });

  node.on("mouseout", (event) => {
    if (node != active) {
      if (!node.completed) {
        node.set({
          strokeWidth: default_circle_stroke_size * node.size,
          stroke: default_circle_stroke,
        });
      }
      node.animate("radius", node.size, {
        onChange: canvas.renderAll.bind(canvas),
        duration: 100,
      });
      canvas.renderAll();
    }
  });

  node.on("mouseover", (event) => {
    if (node != active) {
      if (!node.completed) {
        node.set({
          strokeWidth: hover_circle_stroke_size * node.size,
          stroke: active_circle_stroke,
        });
      }
      node.animate("radius", node.size * circle_scale_coeff, {
        onChange: canvas.renderAll.bind(canvas),
        duration: 100,
      });
      canvas.renderAll();
    }
  });
  nodes.push(node);
  return node;
}

function create_line(coords) {
  return new fabric.Line(coords, {
    stroke: line_color,
    strokeWidth: 4.5,
    selectable: false,
    evented: false,
    shadow: default_line_shadow,
  });
}

let node_dict = {};
function draw_graph(json_str) {
  let graph_info = JSON.parse(json_str);

  // Draw nodes
  graph_info["nodes"].forEach((item) => {
    node_dict[item["id"]] = { x: item["x"], y: item["y"] };
    let node = create_node(
      item["x"],
      item["y"],
      30,
      item["id"],
      item["label"],
      item["description"],
      item["completed"]
    );
    canvas.add(node);
    canvas.add(node.label);
  });

  // Draw lines
  graph_info["edges"].forEach((item) => {
    let target = node_dict[item["target"]];
    let source = node_dict[item["source"]];
    let line = create_line([
      target["x"],
      target["y"],
      source["x"],
      source["y"],
    ]);
    canvas.add(line);
    line.sendToBack();
  });
  canvas.renderAll();
}
let json_ex = `{
    "nodes": [
      {
        "id": 0,
        "x": 100,
        "y": 100,
        "completed": true,
        "label": "First node",
        "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus minus ut rerum quas corrupti ab?"
      },
      {
        "id": 1,
        "x": 250,
        "y": 320,
        "completed": true,
        "label": "Second node",
        "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt perferendis dolorum blanditiis."
      },
      {
        "id": 2,
        "x": 360,
        "y": 120,
        "completed": false,
        "label": "Third node",
        "description": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsam, pariatur."
      },
      {
        "id": 3,
        "x": 540,
        "y": 300,
        "completed": false,
        "label": "Fourth node",
        "description": "Some text"
      }
    ],
    "edges":[
      {
        "id": 0,
        "source": 0,
        "target": 1,
        "style": null
      },
      {
        "id": 1,
        "source": 0,
        "target": 2,
        "style": null
      },
      {
        "id": 2,
        "source": 1,
        "target": 3,
        "style": null
      },
      {
        "id": 3,
        "source": 2,
        "target": 3,
        "style": null
      }
    ]
  }`;

draw_graph(json_ex);
