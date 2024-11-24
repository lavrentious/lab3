import Toastify from "toastify-js";
import form from "./form";

const D = 100;

export type LRecord = {
  id: number;
  x: number;
  y: number;
  r: number;
  createdAt: Date;
  isHit: boolean;
};

class RecordCache {
  private records: Record<number, LRecord>;
  constructor() {
    this.records = {};
  }
  add(record: LRecord) {
    this.records[record.id] = record;
  }
  getRecords() {
    return this.records;
  }

  getRecordsArray() {
    const arr = [];
    for (const key in this.records) {
      arr.push(this.records[key]);
    }
    return arr;
  }

  clear() {
    this.records = {};
  }
  getRecord(id: number) {
    return this.records[id];
  }
}

export enum PointColor {
  FIGURE_COLOR = "#80BFFF",
  HIT = "#00FF00",
  MISS = "#FF0000",
  PREVIEW = "#FF66CC",
  OLD_HIT = "#00AA00",
  OLD_MISS = "#AA0000",
}

enum GraphLabelPosition {
  LEFT,
  RIGHT,
  TOP,
  BOTTOM,
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
}
type GraphLabel = {
  text: string;
  position: GraphLabelPosition;
};

class Graph {
  private ctx: CanvasRenderingContext2D | null;
  private canvas: HTMLCanvasElement;
  private cache: RecordCache;
  private initTime: Date;

  constructor() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    if (this.ctx == null) {
      throw new Error("canvas context null");
    }
    this.ctx.font = "18px monospace";
    this.ctx.translate(2 * D, 2 * D);

    this.cache = new RecordCache();
    this.initTime = new Date();

    this.renderLegend();
    this.drawShape();
  }

  private drawShape() {
    const ctx = this.ctx;
    ctx.fillStyle = PointColor.FIGURE_COLOR;
    // 1. rect
    ctx.beginPath();
    ctx.rect(-D, 0, D, D / 2);
    ctx.fill();
    ctx.closePath();

    // 2. triangle
    ctx.moveTo(0, 0);
    ctx.beginPath();
    ctx.lineTo(0, -D);
    ctx.lineTo(D / 2, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    // 3. circle
    ctx.beginPath();
    ctx.arc(0, 0, D / 2, 0, Math.PI, false);
    ctx.closePath();
    ctx.fill();

    // graph outline
    ctx.beginPath();
    ctx.moveTo(-2 * D, 0);
    ctx.lineTo(2 * D, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -2 * D);
    ctx.lineTo(0, 2 * D);
    ctx.stroke();

    // R/2 marks
    ctx.fillStyle = "black";
    const r = +this.getR();
    const rHalfString = isNaN(r)
      ? "R/2"
      : parseFloat((r / 2).toFixed(2)).toString();
    this.labeledMark(0, -D / 2, "horizontal", {
      text: rHalfString,
      position: GraphLabelPosition.TOP_LEFT,
    });
    this.labeledMark(0, D / 2, "horizontal", {
      text: rHalfString,
      position: GraphLabelPosition.BOTTOM_RIGHT,
    });
    this.labeledMark(D / 2, 0, "vertical", {
      text: rHalfString,
      position: GraphLabelPosition.TOP_RIGHT,
    });
    this.labeledMark(-D / 2, 0, "vertical", {
      text: rHalfString,
      position: GraphLabelPosition.TOP_LEFT,
    });

    // R marks
    const rString = isNaN(r) ? "R" : parseFloat(r.toFixed(2)).toString();
    ctx.fillStyle = "black";
    this.labeledMark(0, -D, "horizontal", {
      text: rString,
      position: GraphLabelPosition.TOP_LEFT,
    });
    this.labeledMark(0, D, "horizontal", {
      text: rString,
      position: GraphLabelPosition.BOTTOM_RIGHT,
    });
    this.labeledMark(D, 0, "vertical", {
      text: rString,
      position: GraphLabelPosition.TOP_RIGHT,
    });
    this.labeledMark(-D, 0, "vertical", {
      text: rString,
      position: GraphLabelPosition.TOP_LEFT,
    });
  }

  private labelPositionToOffset(position: GraphLabelPosition): {
    xOffset: number;
    yOffset: number;
  } {
    const M = 0.2;
    switch (position) {
      case GraphLabelPosition.LEFT:
        return { xOffset: -D * M, yOffset: 0 };
      case GraphLabelPosition.RIGHT:
        return { xOffset: D * M, yOffset: 0 };
      case GraphLabelPosition.TOP:
        return { xOffset: 0, yOffset: -D * M };
      case GraphLabelPosition.BOTTOM:
        return { xOffset: 0, yOffset: D * M };
      case GraphLabelPosition.TOP_LEFT:
        return { xOffset: -D * M, yOffset: -D * M };
      case GraphLabelPosition.TOP_RIGHT:
        return { xOffset: D * M, yOffset: -D * M };
      case GraphLabelPosition.BOTTOM_LEFT:
        return { xOffset: -D * M, yOffset: D * M };
      case GraphLabelPosition.BOTTOM_RIGHT:
        return { xOffset: D * M, yOffset: D * M };
    }
  }

  private label(label: GraphLabel, x: number, y: number, r: number) {
    const ctx = this.ctx;
    const { text, position } = label;
    const { xOffset, yOffset } = this.labelPositionToOffset(position);
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight =
      textMetrics.actualBoundingBoxAscent +
      textMetrics.actualBoundingBoxDescent;
    ctx.fillText(
      text,
      (x * D) / r + xOffset - textWidth / 2,
      (-y * D) / r + yOffset + textHeight / 2,
    );
  }

  private labeledMark(
    x: number,
    y: number,
    direction: "horizontal" | "vertical",
    label?: GraphLabel,
  ) {
    const ctx = this.ctx;
    ctx.beginPath();
    if (direction === "horizontal") {
      ctx.moveTo(-D * 0.1, y);
      ctx.lineTo(D * 0.1, y);
    } else {
      ctx.moveTo(x, -D * 0.1);
      ctx.lineTo(x, D * 0.1);
    }
    ctx.stroke();

    if (label) {
      this.label(label, x, -y, D);
    }
  }

  public addPoint(x: number, y: number, r: number, color: PointColor) {
    const ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc((x * D) / r, (-y * D) / r, 2, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
  }

  public init(submitFn: (x: number, y: number, r: number) => void) {
    this.canvas.addEventListener("click", (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left - 2 * D;
      const y = -(event.clientY - rect.top - 2 * D);
      const r = +this.getR();
      if (r == null || r == undefined || isNaN(r)) {
        Toastify({
          text: "не указан параметр R",
          duration: 3000,
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "linear-gradient(to right, #c93d96, #b00015)",
            borderRadius: "5px",
          },
          onClick: function () {}, // Callback after click
        }).showToast();
        return;
      }
      const scaledX = (x / D) * r;
      const scaledY = (y / D) * r;

      submitFn(scaledX, scaledY, r);
    });

    // drag preview point
    let previewX: number | null = null;
    let previewY: number | null = null;
    let isDown = false;
    let interval: number | null = null;
    this.canvas.addEventListener("mousedown", (event) => {
      const r = this.getR();
      if (r == null || r == undefined) return;
      isDown = true;
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left - 2 * D;
      const y = -(event.clientY - rect.top - 2 * D);
      previewX = x;
      previewY = y;
      interval = setInterval(() => {
        if (previewX != null && previewY != null) {
          this.drawShape();
          this.setRecords(this.cache.getRecordsArray());
          const r = +this.getR();
          if (r == null || r == undefined || isNaN(r)) {
            return;
          }
          const scaledX = (previewX / D) * r;
          const scaledY = (previewY / D) * r;
          this.renderPreviewPoint(scaledX, scaledY, r);
        }
      }, 50);
    });
    this.canvas.addEventListener("mousemove", (event) => {
      if (isDown) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left - 2 * D;
        const y = -(event.clientY - rect.top - 2 * D);
        previewX = x;
        previewY = y;
      }
    });
    this.canvas.addEventListener("mouseup", () => {
      isDown = false;
      previewX = null;
      previewY = null;
      if (interval != null) clearInterval(interval);
    });
  }

  private getR() {
    return form.getR();
  }

  private getPointColor(record: LRecord) {
    if (this.initTime > record.createdAt) {
      return record.isHit ? PointColor.OLD_HIT : PointColor.OLD_MISS;
    }
    return record.isHit ? PointColor.HIT : PointColor.MISS;
  }

  public setRecords = (records: LRecord[]) => {
    console.log("RERENDER");

    for (const record of records) {
      if (!this.cache.getRecord(record.id)) {
        console.log(`adding record ${record.id}`);
        this.cache.add(record);
      }
    }

    this.clearVisual();

    // render preview point
    this.renderPreviewPoint(
      +form.getX(),
      form.getY() === "" ? NaN : +form.getY(),
      +form.getR(),
    );

    // render for current R
    console.log(
      "rendering for current R",
      this.cache.getRecordsArray(),
      +this.getR(),
    );
    for (const record of this.cache
      .getRecordsArray()
      .filter((r) => isNaN(+this.getR()) || r.r === +this.getR())) {
      console.log(`rendering record ${record.id}`);
      this.addPoint(record.x, record.y, record.r, this.getPointColor(record));
    }
  };

  private convenientPosition(x: number, y: number): GraphLabelPosition {
    if (x > 0 && y > 0) {
      return GraphLabelPosition.TOP_RIGHT;
    } else if (x < 0 && y > 0) {
      return GraphLabelPosition.TOP_LEFT;
    } else if (x > 0 && y < 0) {
      return GraphLabelPosition.BOTTOM_RIGHT;
    } else if (x < 0 && y < 0) {
      return GraphLabelPosition.BOTTOM_LEFT;
    } else if (x === 0 && y > 0) {
      return GraphLabelPosition.TOP;
    } else if (x === 0 && y < 0) {
      return GraphLabelPosition.BOTTOM;
    } else if (x > 0 && y === 0) {
      return GraphLabelPosition.RIGHT;
    } else if (x < 0 && y === 0) {
      return GraphLabelPosition.LEFT;
    }
    return GraphLabelPosition.TOP_RIGHT;
  }

  private renderPreviewPoint(x: number, y: number, r: number) {
    if (isNaN(x) || isNaN(y) || isNaN(r)) {
      return;
    }
    console.log("rendering preview at ", x, y, r);
    this.addPoint(x, y, r, PointColor.PREVIEW);
    const position: GraphLabelPosition = this.convenientPosition(x, y);
    this.label({ position, text: `preview` }, x, y, r);
  }

  public clearVisual() {
    this.ctx.clearRect(-2 * D, -2 * D, this.canvas.width, this.canvas.height);
    this.drawShape();
  }

  public clear = () => {
    console.log("clearing graph");
    this.cache.clear();
    this.clearVisual();
  };

  public renderLegend() {
    const legend = document.getElementById("graphLegend");
    if (!legend) {
      return;
    }

    legend.innerHTML = "";

    const colors = [
      ["hit", PointColor.HIT],
      ["hit (in the past)", PointColor.OLD_HIT],
      ["miss", PointColor.MISS],
      ["miss (in the past)", PointColor.OLD_MISS],
      ["preview", PointColor.PREVIEW],
    ];

    const list = document.createElement("ul");
    list.style.listStyle = "none";
    list.style.padding = "0";
    list.style.margin = "0";

    for (const [text, color] of colors) {
      const listItem = document.createElement("li");
      listItem.style.display = "flex";
      listItem.style.alignItems = "center";
      listItem.style.marginBottom = "0.5rem";

      const colorSquare = document.createElement("div");
      colorSquare.style.width = "1rem";
      colorSquare.style.height = "1rem";
      colorSquare.style.marginRight = "0.5rem";
      colorSquare.style.backgroundColor = color;

      const colorText = document.createElement("span");
      colorText.textContent = text;

      listItem.appendChild(colorSquare);
      listItem.appendChild(colorText);
      list.appendChild(listItem);
    }

    legend.appendChild(list);
  }
}

const graph = new Graph();

window["graph"] = graph;

window["confirmClear"] = () => {
  if (confirm("Confirm clearing history")) {
    if (window["graph"] && typeof window["graph"].clear === "function") {
      window["graph"].clear();
    }
    return true;
  }
  return false;
};

export default graph;
