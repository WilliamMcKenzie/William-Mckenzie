const html = document.querySelector("html")
const canvas = document.querySelector("canvas")
const gl = canvas.getContext("webgl", { premultipliedAlpha: false })

const pixel = 7
let fill = [255, 255, 255]
let angles = 11
let offset = 0
let speed = 0.3
let modifier = 0
let cap = 0.5
let spotlightSize = 300 // radius of the cursor spotlight, in pixels

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

// Fragment shader: the old getColor() pattern, now computed per-pixel on the GPU.
// The grid coordinate matches the old loop: gx = floor(px / pixel) - round(width / (2 * pixel)).
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uPixel;
uniform float uAngles;
uniform float uOffset;
uniform float uModifier;
uniform float uCap;
uniform vec3 uFill;
uniform vec2 uMouse;
uniform float uRadius;

const float PI = 3.141592653589793;
const int MAX_ITERS = 64;

float getOpacity(float x, float y, float angle, float bonus) {
  float angledX = cos(angle - 2.0 * (uModifier * bonus)) * x;
  float angledY = sin(angle + 2.0 * (uModifier * bonus)) * y;
  return 100.0 * cos(angledX + angledY + uOffset);
}

void main() {
  // Match the old canvas-2D pixelation and top-down Y orientation.
  float py = uRes.y - gl_FragCoord.y;
  float gx = floor(gl_FragCoord.x / uPixel) - floor(uRes.x / (2.0 * uPixel) + 0.5);
  float gy = floor(py / uPixel) - floor(uRes.y / (2.0 * uPixel) + 0.5);

  float opacity = 0.0;
  float angle = 2.0 * PI;
  float delta = (2.0 * PI) / uAngles;
  for (int i = 0; i < MAX_ITERS; i++) {
    if (float(i) >= uAngles) break;
    opacity += getOpacity(gx, gy, angle, (PI / uAngles) * float(i));
    angle -= delta;
  }

  opacity = min(opacity / uAngles, uCap);
  opacity = clamp(opacity, 0.0, uCap);

  // Highest opacity at the mouse cursor, fading out with distance.
  // uMouse is in top-down screen coords, like py.
  float dist = distance(vec2(gl_FragCoord.x, py), uMouse);
  float falloff = 1.0 - smoothstep(0.0, uRadius, dist);
  opacity *= falloff;

  gl_FragColor = vec4(uFill / 255.0, opacity);
}
`

function compile(type, src) {
  const s = gl.createShader(type)
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(s))
  }
  return s
}

const program = gl.createProgram()
gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT))
gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG))
gl.linkProgram(program)
gl.useProgram(program)

// Full-screen triangle.
const buffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
const aPos = gl.getAttribLocation(program, "aPos")
gl.enableVertexAttribArray(aPos)
gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

const u = {
  res: gl.getUniformLocation(program, "uRes"),
  pixel: gl.getUniformLocation(program, "uPixel"),
  angles: gl.getUniformLocation(program, "uAngles"),
  offset: gl.getUniformLocation(program, "uOffset"),
  modifier: gl.getUniformLocation(program, "uModifier"),
  cap: gl.getUniformLocation(program, "uCap"),
  fill: gl.getUniformLocation(program, "uFill"),
  mouse: gl.getUniformLocation(program, "uMouse"),
  radius: gl.getUniformLocation(program, "uRadius"),
}

// Mouse position in top-down screen pixels; start at center.
let mouseX = window.innerWidth / 2
let mouseY = window.innerHeight / 2
window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX
  mouseY = e.clientY
})

// No GL blending: the full-screen triangle writes each pixel exactly once, so
// there's nothing to blend against inside the buffer. Output straight white +
// alpha and let the browser composite the canvas over the <img> (the context
// uses premultipliedAlpha: false, i.e. straight-alpha compositing).

resizeCanvas()

function changebg(color) {
  html.style.backgroundColor = color
  canvas.style.backgroundColor = color
}

function animate() {
  offset += speed / 16
  angles = 5 + (Math.cos(offset / 64) * 2)

  gl.uniform2f(u.res, canvas.width, canvas.height)
  gl.uniform1f(u.pixel, pixel)
  gl.uniform1f(u.angles, angles)
  gl.uniform1f(u.offset, offset)
  gl.uniform1f(u.modifier, modifier)
  gl.uniform1f(u.cap, cap)
  gl.uniform3f(u.fill, fill[0], fill[1], fill[2])
  gl.uniform2f(u.mouse, mouseX, mouseY)
  gl.uniform1f(u.radius, spotlightSize)

  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, 3)

  requestAnimationFrame(animate)
}
animate()

window.addEventListener("resize", resizeCanvas)
function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = Math.max(
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight,
  )
  gl.viewport(0, 0, canvas.width, canvas.height)
}
