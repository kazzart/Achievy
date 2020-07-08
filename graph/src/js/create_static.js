import { fabric } from "fabric";
import {
  completed_node_shadow,
  active_node_shadow,
  default_node_shadow,
  completed_line_shadow,
  semi_completed_line_shadow,
  default_line_shadow,
  completed_font_shadow,
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
let hidden_pannel = document.getElementById("hidden_pannel");
let name_pannel = document.getElementById("Node_name");
let description_pannel = document.getElementById("Description");
hidden_pannel.style.display = "block";
function clearSelection() {
  if (window.getSelection) {
    if (window.getSelection().empty) {
      window.getSelection().empty();
    } else if (window.getSelection().removeAllRanges) {
      window.getSelection().removeAllRanges();
    }
  } else if (document.selection) {
    document.selection.empty();
  }
}

document.getElementById("cancel-button").onclick = () => {
  if (active != null) {
    active.setState("idle");
    active = null;
  }
  clearSelection();
  hidden_pannel.style.left = "-320px";
};

let state_btn = document.getElementById("state-btn");
state_btn.onclick = () => {
  if (active != null) {
    active.setCompleted(!active.completed);
    if (active.completed) {
      state_btn.innerHTML = "Undone";
      state_btn.style.backgroundColor = "rgb(139, 0, 0)";
      state_btn.style.borderColor = "rgb(115, 0, 0)";
    } else {
      state_btn.innerHTML = "Done";
      state_btn.style.backgroundColor = "#6c757d";
      state_btn.style.borderColor = "#545b62";
    }
  }
};

function create_node(x, y, size, id, label, description, completed, canvas) {
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
  node.lines_in = [];
  node.lines_out = [];
  if (completed) {
    node.label = new fabric.Text(label, {
      originX: "left",
      originY: "bottom",
      fontFamily: "Comic Sans",
      hoverCursor: "cursor",
      shadow: completed_font_shadow,
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
  } else {
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
  }
  node.canvas = canvas;
  node.state = "idle";
  node.addLineIn = (line) => {
    if (!node.lines_in.includes(line)) {
      node.lines_in.push(line);
    }
  };
  node.addLineOut = (line) => {
    if (!node.lines_out.includes(line)) {
      node.lines_out.push(line);
    }
  };
  node.setCompleted = (isCompleted) => {
    if (isCompleted == node.completed) {
      return;
    }
    if (isCompleted) {
      let canBeCompleted = false;
      node.lines_in.forEach((line) => {
        if (line.source.completed) {
          canBeCompleted = true;
        }
      });
      if (!canBeCompleted) {
        alert("Complete at least one node before!");
        return;
      }
      node.completed = isCompleted;
      node.label.set({ shadow: completed_font_shadow });
      node.lines_in.forEach((line) => {
        if (line.source.completed) {
          line.set({
            shadow: completed_line_shadow,
          });
        }
      });
      node.lines_out.forEach((line) => {
        if (line.target.completed) {
          line.set({
            shadow: completed_line_shadow,
          });
        } else {
          line.set({
            shadow: semi_completed_line_shadow,
          });
        }
      });
      node.set({
        shadow: completed_node_shadow,
        stroke: completed_circle_stroke,
      });
      if (node.state == "active") {
        node.set({ strokeWidth: default_circle_stroke_size * node.size });
      } else {
        node.set({ strokeWidth: hover_circle_stroke_size * node.size });
      }
    } else {
      let visited = [];
      let rollback = false;
      node.completed = isCompleted;

      node.lines_out.forEach((line) => {
        let n = line.target;
        if (n.completed && !visited.includes(n)) {
          visited.push(n);
          let has_other_active_lines = false;
          n.lines_in.forEach((li) => {
            if (li.source.completed) {
              has_other_active_lines = true;
            }
          });
          if (!has_other_active_lines) {
            rollback = true;
          }
        }
      });
      if (rollback) {
        alert(node.name + " have dependencies!!!!");
        node.completed = true;
      } else {
        node.label.set({ shadow: default_font_shadow });
        node.lines_in.forEach((line) => {
          if (line.source.completed) {
            line.set({
              shadow: semi_completed_line_shadow,
            });
          }
        });
        node.lines_out.forEach((line) => {
          line.set({
            shadow: default_line_shadow,
          });
        });
        node.set({
          shadow: active_node_shadow,
          stroke: active_circle_stroke,
        });
      }
    }
  };

  node.setState = (state) => {
    if (state == node.state) {
      return;
    }
    switch (state) {
      case "active":
        if (node.state == "idle") {
          node.animate("radius", node.size * circle_scale_coeff, {
            onChange: node.canvas.renderAll.bind(node.canvas),
            duration: 100,
          });

          if (node.completed) {
            node.set({
              strokeWidth: default_circle_stroke_size * node.size,
            });
          } else {
            node.set({
              stroke: active_circle_stroke,
              shadow: active_node_shadow,
            });
          }
        } else {
          node.set({
            strokeWidth: default_circle_stroke_size * node.size,
          });
          if (!node.completed) {
            node.set({
              shadow: active_node_shadow,
              stroke: active_circle_stroke,
            });
          }
        }
        node.state = state;
        break;

      case "hover":
        if (node.state == "idle") {
          node.animate("radius", node.size * circle_scale_coeff, {
            onChange: node.canvas.renderAll.bind(node.canvas),
            duration: 50,
          });

          if (!node.completed) {
            node.set({
              stroke: active_circle_stroke,
              strokeWidth: hover_circle_stroke_size * node.size,
            });
          }
        } else {
          node.set({
            strokeWidth: hover_circle_stroke_size * node.size,
          });
          if (!node.completed) {
            node.set({
              shadow: default_node_shadow,
              stroke: active_circle_stroke,
            });
          }
        }
        node.state = state;
        break;

      case "idle":
        if (node.state == "active") {
          node.setRadius(node.size);

          if (node.completed) {
            node.set({
              strokeWidth: hover_circle_stroke_size * node.size,
            });
          } else {
            node.set({
              stroke: default_circle_stroke,
              strokeWidth: default_circle_stroke_size * node.size,
              shadow: default_node_shadow,
            });
          }
        } else {
          node.animate("radius", node.size, {
            onChange: node.canvas.renderAll.bind(node.canvas),
            duration: 100,
          });
          node.set({
            strokeWidth: hover_circle_stroke_size * node.size,
          });
          if (node.completed) {
            node.set({
              strokeWidth: hover_circle_stroke_size * node.size,
            });
          } else {
            node.set({
              stroke: default_circle_stroke,
              strokeWidth: default_circle_stroke_size * node.size,
              shadow: default_node_shadow,
            });
          }
        }
        node.state = state;
        break;

      default:
        console.log("wrong state");
        break;
    }
  };

  node.on("mouseup", (event) => {
    if (active != event.target) {
      if (active != null) {
        active.setState("idle");
      }
      active = event.target;
      active.setState("active");
      active.canvas.renderAll();
      clearSelection();
      hidden_pannel.style.left = "0px";
      if (active.completed) {
        state_btn.innerHTML = "Undone";
        state_btn.style.backgroundColor = "rgb(139, 0, 0)";
        state_btn.style.borderColor = "rgb(115, 0, 0)";
      } else {
        state_btn.innerHTML = "Done";
        state_btn.style.backgroundColor = "#6c757d";
        state_btn.style.borderColor = "#545b62";
      }
      name_pannel.innerHTML = active.name;
      description_pannel.innerHTML = active.description;
    }
  });

  node.on("mouseout", (event) => {
    if (node != active) {
      node.setState("idle");
      node.canvas.renderAll();
    }
  });

  node.on("mouseover", (event) => {
    if (node != active) {
      node.setState("hover");
      node.canvas.renderAll();
    }
  });
  return node;
}

function create_line(coords, source, target) {
  let line = new fabric.Line(coords, {
    stroke: line_color,
    strokeWidth: 4.5,
    selectable: false,
    evented: false,
    shadow: default_line_shadow,
  });
  if (source.completed && target.completed) {
    line.set({
      shadow: completed_line_shadow,
    });
  }
  if (source.completed && !target.completed) {
    line.set({
      shadow: semi_completed_line_shadow,
    });
  }
  line.source = source;
  line.target = target;
  source.addLineOut(line);
  target.addLineIn(line);
  return line;
}

export { create_node, create_line };
