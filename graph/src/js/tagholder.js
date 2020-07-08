import { fabric } from "fabric";

// Shadows
let completed_node_shadow = new fabric.Shadow({
  color: "rgba(57, 255, 20, 1)",
  blur: 18,
});
let active_node_shadow = new fabric.Shadow({
  color: "rgba(255, 100, 255, 1)",
  blur: 18,
});
let default_node_shadow = new fabric.Shadow({
  color: "rgba(15, 15, 15, 0.9)",
  blur: 10,
});
let completed_line_shadow = new fabric.Shadow({
  color: "rgba(57, 255, 20, 0.65)",
  blur: 12,
});
let semi_completed_line_shadow = new fabric.Shadow({
  color: "rgba(255, 211, 25, 0.7)",
  blur: 12,
});
let default_line_shadow = new fabric.Shadow({
  color: "rgba(255, 100, 255, 0.7)",
  blur: 12,
});
let completed_font_shadow = "rgba(57, 255, 20, 0.9) 2px 2px 2px";
let default_font_shadow = "rgba(255, 100, 255, 0.9) 2px 2px 2px";

// Colors
let default_font_fill = "rgb(220, 220, 220)";
let circle_fill = "rgb(30, 30, 30)";
let completed_circle_stroke = "rgba(57, 255, 20, 1)";
let active_circle_stroke = "rgba(245, 90, 245, 1)";
let default_circle_stroke = "rgba(245, 90, 245, 0)";
let hover_circle_stroke_size = 0.025;
let default_circle_stroke_size = 0.1;
let circle_scale_coeff = 1.3;
let line_color = "rgb(255, 255, 255)";
export {
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
};
// // // Colors and shadows
// // let active_node_shadow = new fabric.Shadow({
// //   color: "rgba(255, 100, 255, 1)",
// //   blur: 15,
// // });
// // let default_node_shadow = new fabric.Shadow({
// //   color: "rgba(15, 15, 15, 0.9)",
// //   blur: 10,
// // });
// // let default_line_shadow = new fabric.Shadow({
// //   color: "rgba(255, 100, 255, 0.65)",
// //   blur: 12,
// // });

// // let default_font_shadow = "rgba(255, 100, 255, 0.9) 2px 2px 2px";
// // let default_font_fill = "rgb(220, 220, 220)";
// // let circle_fill = "rgb(255, 240, 254)";
// // let active_circle_stroke = "rgba(245, 90, 245, 1)";
// // let default_circle_stroke = "rgba(245, 90, 245, 0)";
// // let hover_circle_stroke_size = 0.025;
// // let default_circle_stroke_size = 0.1;
// // let circle_scale_coeff = 1.3;
// // let line_color = "rgb(255, 255, 255)";
