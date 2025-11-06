"use strict";

let circles = [];
let offset = 25;
let radius = 2.5;
let cursorRadius = 6.25;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio || 1;
const mouse = { x: 0, y: 0 };
let sameSize = false;
let actionRadius = 75;
let circlesColor = "#000000";
let backgroundColor = "#ffffff";
let cursorColor = "#0a64d3";
let circlesFromCursorLerp = 0.4;
let circlesToInitialLerp = 0.02;
let timer;
let mouseTargetX;
let mouseTargetY;

const form = document.getElementById("form");
const offsetInput = document.getElementById("offset");
const radiusInput = document.getElementById("circles-radius");
const cursorRadiusInput = document.getElementById("cursor-radius");
const actionRadiusInput = document.getElementById("effect-radius");
const circlesFromCursorLerpInput = document.getElementById("from-cursor");
const circlesToInitialLerpInput = document.getElementById("to-initial");
const sameSizeInput = document.getElementById("same-size");
const cursorColorInput = document.getElementById("cursor-color");
const circlesColorInput = document.getElementById("circles-color");
const backgroundColorInput = document.getElementById("background-color");
const offsetSpan = document.getElementById("offset-value");
const radiusSpan = document.getElementById("circles-radius-value");
const cursorRadiusSpan = document.getElementById("cursor-radius-value");
const actionRadiusSpan = document.getElementById("effect-radius-value");
const circlesFromCursorLerpSpan = document.getElementById("from-cursor-value");
const circlesToInitialLerpSpan = document.getElementById("to-initial-value");

function init() {
  offsetInput.value = offset;
  radiusInput.value = radius;
  cursorRadiusInput.value = cursorRadius;
  actionRadiusInput.value = actionRadius;
  circlesFromCursorLerpInput.value = circlesFromCursorLerp;
  circlesToInitialLerpInput.value = circlesToInitialLerp;
  sameSizeInput.checked = sameSize;
  cursorColorInput.value = cursorColor;
  circlesColorInput.value = circlesColor;
  backgroundColorInput.value = backgroundColor;

  offsetSpan.textContent = offset;
  radiusSpan.textContent = radius;
  cursorRadiusSpan.textContent = cursorRadius;
  actionRadiusSpan.textContent = actionRadius;
  circlesFromCursorLerpSpan.textContent = circlesFromCursorLerp;
  circlesToInitialLerpSpan.textContent = circlesToInitialLerp;
}

function updateParams() {
  offset = parseFloat(offsetInput.value);
  radius = parseFloat(radiusInput.value);
  cursorRadius = parseFloat(cursorRadiusInput.value);
  actionRadius = parseFloat(actionRadiusInput.value);
  circlesFromCursorLerp = parseFloat(circlesFromCursorLerpInput.value);
  circlesToInitialLerp = parseFloat(circlesToInitialLerpInput.value);
  sameSize = sameSizeInput.checked;
  cursorColor = cursorColorInput.value;
  circlesColor = circlesColorInput.value;
  backgroundColor = backgroundColorInput.value;
}

function resizeCanvas() {
  canvas.width = window.innerWidth * dpr;
  canvas.height = document.documentElement.offsetHeight * dpr;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = document.documentElement.offsetHeight + "px";
  ctx.scale(dpr, dpr);
  initCircles();
}

function initCircles() {
  circles = [];
  for (let i = 0; i < canvas.height; i += offset) {
    for (let j = 0; j < canvas.width; j += offset) {
      circles.push({
        x: j,
        y: i,
        radius: sameSize ? radius : Math.floor((Math.random() + 0.5) * radius),
        baseX: j,
        baseY: i,
      });
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (mouseTargetX && mouseTargetY) {
    mouse.x += (mouseTargetX - mouse.x) * 0.1;
    mouse.y += (mouseTargetY - mouse.y) * 0.1;
  }
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, cursorRadius, 0, 2 * Math.PI);
  ctx.fillStyle = cursorColor;
  ctx.fill();
  ctx.fillStyle = circlesColor;

  circles.forEach((circle) => {
    let targetX = circle.baseX;
    let targetY = circle.baseY;

    const distance = Math.sqrt(
      Math.pow(mouse.x - circle.x, 2) + Math.pow(mouse.y - circle.y, 2)
    );
    if (distance < actionRadius) {
      targetX = mouse.x + (actionRadius / distance) * (circle.x - mouse.x);
      targetY = mouse.y + (actionRadius / distance) * (circle.y - mouse.y);
      circle.x += (targetX - circle.x) * circlesFromCursorLerp;
      circle.y += (targetY - circle.y) * circlesFromCursorLerp;
    } else {
      circle.x += (targetX - circle.x) * circlesToInitialLerp;
      circle.y += (targetY - circle.y) * circlesToInitialLerp;
    }

    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
    ctx.fill();

    canvas.style.backgroundColor = backgroundColor;
  });

  requestAnimationFrame(draw);
}

init();

window.addEventListener("resize", () => {
  clearTimeout(timer);
  timer = setTimeout(resizeCanvas, 200);
});

resizeCanvas();

document.addEventListener("mousemove", (e) => {
  mouseTargetX = e.clientX;
  mouseTargetY = e.pageY;
});

draw();

form.addEventListener("change", (e) => {
  updateParams();

  if (["offset", "circles-radius", "same-size"].includes(e.target.id))
    initCircles();
});

form.addEventListener("input", (e) => {
  if (e.target.type === "range") {
    console.log(e.target.id);
    document.getElementById(`${e.target.id}-value`).innerText = e.target.value;
  }
});
