"use strict";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio;
let timeout;
const graph = { x0: 0, x1: 0, y0: 0, y1: 0 };
const ball = { x: 0, y: 0 };
const xAxisLength = 800;
const yAxisLength = 600;
let cx;
let cy;
let time = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.scale(dpr, dpr);

  initGraph();
}

function initGraph() {
  cx = window.innerWidth / 2;
  cy = window.innerHeight / 2;
  graph.x0 = cx - xAxisLength / 2;
  graph.x1 = cx + xAxisLength / 2;
  graph.y0 = cy - yAxisLength / 2;
  graph.y1 = cy + yAxisLength / 2;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(graph.x0, cy);
  ctx.lineTo(graph.x1, cy);
  ctx.lineTo(
    graph.x1 + 20 * Math.cos((120 * Math.PI) / 180),
    cy + 20 * Math.cos((120 * Math.PI) / 180)
  );
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(cx, graph.y1);
  ctx.lineTo(cx, graph.y0);
  ctx.lineTo(
    cx - 20 * Math.cos((120 * Math.PI) / 180),
    graph.y0 - 20 * Math.cos((120 * Math.PI) / 180)
  );
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(graph.x1, cy);
  ctx.lineTo(
    graph.x1 + 20 * Math.cos((120 * Math.PI) / 180),
    cy - 20 * Math.cos((120 * Math.PI) / 180)
  );
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(cx, graph.y0);
  ctx.lineTo(
    cx + 20 * Math.cos((120 * Math.PI) / 180),
    graph.y0 - 20 * Math.cos((120 * Math.PI) / 180)
  );
  ctx.stroke();
  ctx.closePath();

  const targetX = cx + (time * yAxisLength) / 8;

  // sin
  // const targetY = cy - (Math.sin(time) * yAxisLength) / 8;

  // cos
  const targetY = cy - (Math.cos(time) * yAxisLength) / 8;

  // tan
  // const targetY = cy - (Math.tan(time) * yAxisLength) / 8;

  // cotan
  // const targetY =
  //   Math.sin(time) !== 0
  //     ? cy - ((Math.cos(time) / Math.sin(time)) * yAxisLength) / 8
  //     : 0;

  ball.x += targetX - ball.x;
  ball.y += targetY - ball.y;

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, 5, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();

  time += 0.05;
  if (time > 6.5) time = -6;
  requestAnimationFrame(draw);
}

resizeCanvas();
window.addEventListener("resize", () => {
  clearTimeout(timeout);
  timeout = setTimeout(resizeCanvas, 200);
});

draw();
