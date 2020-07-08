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
import { create_node, create_line } from "./create_static.js";

let node_dict = new Map();
let canvas = new fabric.Canvas("c", {
  selection: false,
  backgroundColor: "rgb(40,40,40)",
});

let viewportWidth = window.innerWidth;
let viewportHeight = window.innerHeight;
let descr = document.getElementById("Description-wrapper");
let lbl = document.getElementById("Label-wrapper");
let btn = document.getElementById("Button-wrapper");
canvas.on("before:render", () => {
  viewportWidth = window.innerWidth;
  viewportHeight = window.innerHeight;
  canvas.setWidth(viewportWidth);
  canvas.setHeight(viewportHeight);
  descr.style.maxHeight =
    Math.floor(
      0.96 * viewportHeight - lbl.offsetHeight - btn.offsetHeight - 30
    ).toString() + "px";
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
  node_dict.forEach((item) => {
    if (zoom < 0.5) {
      item.label.visible = false;
    } else {
      // item.label.scale(1 / zoom);
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
  var pointer = canvas.getPointer(event.e);
  // var posX = pointer.x;
  // var posY = pointer.y;
  // console.log(posX + ", " + posY);
});
// End pan

function draw_graph(json_str) {
  let graph_info = JSON.parse(json_str);

  // Draw nodes
  graph_info["nodes"].forEach((item) => {
    let node = create_node(
      item["x"],
      item["y"],
      30,
      item["id"],
      item["label"],
      item["description"],
      item["completed"]
    );
    node_dict.set(node.id, node);
    canvas.add(node);
    canvas.add(node.label);
  });

  // Draw lines
  graph_info["edges"].forEach((item) => {
    let target = node_dict.get(item["target"]);
    let source = node_dict.get(item["source"]);
    let line = create_line(
      [source.left, source.top, target.left, target.top],
      source,
      target
    );
    canvas.add(line);
    line.sendToBack();
  });
  node_dict.forEach((item) => {
    item.label.bringToFront();
  });
  canvas.renderAll();
}
let json_ex = `{
  "nodes": [
    {
      "id": 0,
      "x": 840,
      "y": 840,
      "completed": true,
      "label": "Согласие супруга",
      "description": "Очевидно, в современном цивилизованном обществе нельзя заключить брак без обоюдного желания, как это было в средние века. Поэтому прежде всего прочего необходимо получить согласие предполагаемого будущего супруга. Существует огромное количество разных способов сделать это, от простого высказывания своих намерений в непринужденной обстановке до изощренных трюков вроде помещения обручального кольца в бокал с шампанским на свидании или не совсем законных вещей вроде нанесения краской послания на асфальте под окнами супруга (пожалуйста, не делайте так)."
    },
    {
      "id": 1,
      "x": 840,
      "y": 700,
      "completed": false,
      "label": "Выбрать дату",
      "description": "После получения согласия нужно выбрать дату регистрации брака. Вы можете выбрать какую-либо символичную дату, или, может, наиболее комфортную дату (по погоде, загруженности дорог и т.д.)."
    },
    {
      "id": 2,
      "x": 840,
      "y": 560,
      "completed": false,
      "label": "Подать заявление",
      "description": "В настоящее время существует два способа подачи заявления на регистрацию брака: во время непосредственного визита в ЗАГС обоими заявителями и подача онлайн-заявления на портале Госуслуг. Онлайн-заявление не требует никаких визитов в учреждения до непосредственного дня регистрации брака. Необходимы лишь некоторые личные данные заявителей и, конечно, свободное время в выбранную дату в выбранном ЗАГСе. К тому же, подача заявления платная, но при подаче заявления через портал Госуслуг применяется скидка.<br>---------------------<br>Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. Которое вскоре предупредила языком маленькая раз одна заголовок власти города семь большой решила проектах буквенных там рыбного, не ipsum злых свое! Вдали агентство проектах единственное лучше приставка силуэт которое безопасную даль города, вскоре гор последний, рекламных они жаренные предложения что своих? Грамматики, взгляд пор инициал силуэт переписали своих предупреждал заманивший своего города жизни вопроса то первую составитель подзаголовок власти продолжил, использовало запятой буквоград! Текст инициал последний вопрос деревни лучше! Парадигматическая, буквенных за. Не коварный деревни взобравшись жизни, своих страна всемогущая сбить, имени, путь лучше языкового. Рекламных сбить мир силуэт предупреждал точках безопасную которой переписали диких родного, жаренные если толку маленькая заглавных речью вопроса! Он свой алфавит осталось моей щеке подзаголовок снова жизни вершину, гор выйти текста родного вопрос большого. Маленькая реторический ведущими текстами бросил текст прямо живет семантика возвращайся подзаголовок коварных толку вдали они продолжил рекламных запятых использовало курсивных, обеспечивает свой составитель если что. Не, они! Рыбного семь предложения не журчит рукописи большой путь меня они встретил, инициал страна диких ведущими живет. Ему взгляд букв что запятой парадигматическая текстами он то большого свое инициал сбить предложения маленький правилами строчка единственное пояс домах рот, над лучше речью осталось коварный взобравшись? Залетают?" 
    },
    {
      "id": 3,
      "x": 840,
      "y": 420,
      "completed": false,
      "label": "Определиться с бюджетом",
      "description": "Оцените свои возможности и желания. Пышные наряды или скромная повседневная одежда? Ресторан или чья-нибудь квартира? Банкет или домашний пир? Решать Вам."
    },
    {
      "id": 4,
      "x": 640,
      "y": 280, 
      "completed": false,
      "label": "Найти одежду",
      "description": "С маленьким бюджетом не получится купить наряды мечты, поэтому придется надевать свою повседневную одежду либо стараться найти, у кого можно одолжить наряд."
    },
    {
      "id": 5,
      "x": 1040,
      "y": 280,
      "completed": false,
      "label": "Купить наряд",
      "description": "Традиционный вариант с белым платьем для невесты и черным костюмом для жениха, или, может, что-то цветное и оригинальное? Не жалейте своих денег на реализацию Ваших желанных образов."
    },
    {
      "id": 6,
      "x": 440,
      "y": 140,
      "completed": false,
      "label": "Одолжить прикид",
      "description": "Возможно, кто-то из ваших женатых и замужних знакомых, друзей, родственников сохранил свой свадебный наряд. Вам повезет, если размеры совпадут и вы сможете одолжить одежду для свадьбы."
    },
    {
      "id": 7,
      "x": 640,
      "y": 0,
      "completed": false,
      "label": "Накрыть стол",
      "description": "Ограниченный бюджет = ограниченные варианты. Можно потратить кучу сил на приготовление банкета из домашней еды или заказать пиццу или другой фастфуд."
    },
    {
      "id": 8,
      "x": 840,
      "y": 140,
      "completed": false,
      "label": "Яхта?",
      "description": "В городах с доступом к воде часто есть яхты, владельцы которых готовы предложить свои услуги молодоженам. Добавление аренды яхты ко всем событиям свадьбы может сделать этот праздник настоящим приключением."
    },
    {
      "id": 9,
      "x": 1040,
      "y": 140,
      "completed": false,
      "label": "Заказать ресторан",
      "description": "Большинство свадеб проводятся на застолье в ресторане (если ресторан маленький) или арендованном отдельном зале."
    },
    {
      "id": 10,
      "x": 1240,
      "y": 140,
      "completed": false,
      "label": "Арендовать коттедж",
      "description": "Что может быть веселее чем вечеринка в коттедже? Бассейн, много пространства для шумной компании, никаких соседей и вечеринка до рассвета!"
    },
    {
      "id": 11,
      "x": 1040,
      "y": 0,
      "completed": false,
      "label": "Оплатить фотографа",
      "description": "Если есть деньги на фотографа, почему бы не воспользоваться возможностью? С профессиональной съемкой свадьбы воспоминания о празднике жизни сохранятся навсегда."
    },
    {
      "id": 12,
      "x": 840,
      "y": -140,
      "completed": false,
      "label": "Регистрация",
      "description": "Необходимо прибыть в ЗАГС в назначенное время и зарегистрировать брак."
    },
    {
      "id": 13,
      "x": 840,
      "y": -280,
      "completed": false,
      "label": "Свадьба",
      "description": "Поздравляем! Теперь Вы заключили брак. Всё, что осталось сделать - отпраздновать, но с этим Вы уже справитесь и сами."
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
      "source": 1,
      "target": 2,
      "style": null
    },
    {
      "id": 2,
      "source": 2,
      "target": 3,
      "style": null
    },
    {
      "id": 3,
      "source": 3,
      "target": 4,
      "style": null
    },
    {
      "id": 4,
      "source": 3,
      "target": 5,
      "style": null
    },
    {
      "id": 5,
      "source": 4,
      "target": 6,
      "style": null
    },
    {
      "id": 6,
      "source": 4,
      "target": 7,
      "style": null
    },
    {
      "id": 7,
      "source": 7,
      "target": 12,
      "style": null
    },
    {
      "id": 8,
      "source": 6,
      "target": 7,
      "style": null
    },
    {
      "id": 9,
      "source": 5,
      "target": 8,
      "style": null
    },
    {
      "id": 10,
      "source": 5,
      "target": 9,
      "style": null
    },
    {
      "id": 11,
      "source": 5,
      "target": 10,
      "style": null
    },
    {
      "id": 12,
      "source": 8,
      "target": 11,
      "style": null
    },
    {
      "id": 13,
      "source": 9,
      "target": 11,
      "style": null
    },
    {
      "id": 14,
      "source": 10,
      "target": 11,
      "style": null
    },
    {
      "id": 15,
      "source": 11,
      "target": 12,
      "style": null
    },
    {
      "id": 16,
      "source": 12,
      "target": 13,
      "style": null
    }
  ]
}`;

draw_graph(json_ex);
