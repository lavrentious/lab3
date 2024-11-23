import Toastify from "toastify-js";
import form from "./form";

const D = 100;

export enum PointColor {
  HIT = "#00FF00",
  MISS = "#FF0000",
  PREVIEW = "#FFFF00",
  OLD_HIT = "#009900",
  OLD_MISS = "#990000",
}

enum GraphStrokeLabelPosition {
  LEFT,
  RIGHT,
  TOP,
  BOTTOM,
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
}
type GraphStrokeLabel = {
  text: string;
  position: GraphStrokeLabelPosition;
};

class Graph {
  private ctx: CanvasRenderingContext2D | null;
  private canvas: HTMLCanvasElement;

  constructor() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    if (this.ctx == null) {
      throw new Error("canvas context null");
    }
    this.ctx.font = "18px monospace";
    this.ctx.translate(2 * D, 2 * D);
    this.drawShape();
  }

  private drawShape() {
    const ctx = this.ctx;
    ctx.fillStyle = "#1E90FF";
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
    this.labeledMark(0, -D / 2, "horizontal", {
      text: "R/2",
      position: GraphStrokeLabelPosition.TOP_LEFT,
    });
    this.labeledMark(0, D / 2, "horizontal", {
      text: "R/2",
      position: GraphStrokeLabelPosition.BOTTOM_RIGHT,
    });
    this.labeledMark(D / 2, 0, "vertical", {
      text: "R/2",
      position: GraphStrokeLabelPosition.TOP_RIGHT,
    });
    this.labeledMark(-D / 2, 0, "vertical", {
      text: "R/2",
      position: GraphStrokeLabelPosition.TOP_LEFT,
    });

    // R marks
    ctx.fillStyle = "black";
    this.labeledMark(0, -D, "horizontal", {
      text: "R",
      position: GraphStrokeLabelPosition.TOP_LEFT,
    });
    this.labeledMark(0, D, "horizontal", {
      text: "R",
      position: GraphStrokeLabelPosition.BOTTOM_RIGHT,
    });
    this.labeledMark(D, 0, "vertical", {
      text: "R",
      position: GraphStrokeLabelPosition.TOP_RIGHT,
    });
    this.labeledMark(-D, 0, "vertical", {
      text: "R",
      position: GraphStrokeLabelPosition.TOP_LEFT,
    });
  }

  private labelPositionToOffset(position: GraphStrokeLabelPosition): {
    xOffset: number;
    yOffset: number;
  } {
    const M = 0.2;
    switch (position) {
      case GraphStrokeLabelPosition.LEFT:
        return { xOffset: -D * M, yOffset: 0 };
      case GraphStrokeLabelPosition.RIGHT:
        return { xOffset: D * M, yOffset: 0 };
      case GraphStrokeLabelPosition.TOP:
        return { xOffset: 0, yOffset: -D * M };
      case GraphStrokeLabelPosition.BOTTOM:
        return { xOffset: 0, yOffset: D * M };
      case GraphStrokeLabelPosition.TOP_LEFT:
        return { xOffset: -D * M, yOffset: -D * M };
      case GraphStrokeLabelPosition.TOP_RIGHT:
        return { xOffset: D * M, yOffset: -D * M };
      case GraphStrokeLabelPosition.BOTTOM_LEFT:
        return { xOffset: -D * M, yOffset: D * M };
      case GraphStrokeLabelPosition.BOTTOM_RIGHT:
        return { xOffset: D * M, yOffset: D * M };
    }
  }

  private labeledMark(
    x: number,
    y: number,
    direction: "horizontal" | "vertical",
    label?: GraphStrokeLabel,
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
      const { text, position } = label;
      const { xOffset, yOffset } = this.labelPositionToOffset(position);
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight =
        textMetrics.actualBoundingBoxAscent +
        textMetrics.actualBoundingBoxDescent;
      ctx.fillText(
        text,
        x + xOffset - textWidth / 2,
        y + yOffset + textHeight / 2,
      );
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
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.addEventListener("click", (event) => {
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

      console.log(`submitting coords (${scaledX}, ${scaledY})`);

      submitFn(scaledX, scaledY, r);
    });
  }

  private getR() {
    return form.getR();
  }
}

const graph = new Graph();
export default graph;
