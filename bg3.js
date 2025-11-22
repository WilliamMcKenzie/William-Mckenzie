const html = document.querySelector('html')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const pixel = 8
const frequency = 1
let offset = 0
let size = 0

function pixellate(x) {
    return pixel * Math.round(x / pixel)
}

function renderPoint(x) {
    const base = Math.sin((offset + x / 20))
    return 8 * Math.round((base * size) / 8)
} 

function animate() {
    offset += 0.1
    size = Math.sin(offset) * Math.pow(pixel, 4)

    ctx.fillStyle = "white"
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const heightOffset = Math.round(window.innerHeight / 2)

    for (let i = 0; i < canvas.width; i += 1) {
        ctx.fillRect(pixellate(i), renderPoint(i) + heightOffset, pixel, pixel)
    }

    requestAnimationFrame(animate)
}

animate()
resizeCanvas()

window.addEventListener('resize', resizeCanvas)
function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = Math.max(html.clientHeight, html.scrollHeight, html.offsetHeight)
}