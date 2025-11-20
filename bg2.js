const html = document.querySelector('html')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
html.style.backgroundColor = "#027D9C"

resizeCanvas()

const pixel = 8
const frequency = 4
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
    offset += frequency / 80
    size = Math.sin(offset) * Math.pow(pixel, 2)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const heightOffset = Math.round(window.innerHeight / 2)
    const widthOffset = Math.round(window.innerWidth / 2)
    const scaleFactor = (canvas.width / 2)
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)"

    for (let i = 0; i < canvas.width; i += 1) {
        const scale = Math.abs(scaleFactor - i)

        // ctx.fillStyle = "rgba(255, 255, 255, 1)"
        // ctx.fillRect(renderPoint(i * 1) + widthOffset - 512, pixellate(i), pixel, pixel)
        // ctx.fillRect(renderPoint(i * 1) + widthOffset + 512, pixellate(i), pixel, pixel)

        // ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
        ctx.fillRect(pixellate(i), renderPoint(i * 100) + heightOffset, pixel, pixel)
        ctx.fillRect(pixellate(i), renderPoint(i * 100) - scale + heightOffset, pixel, pixel)
        ctx.fillRect(pixellate(i), scale + renderPoint(i * 100) + heightOffset, pixel, pixel)
    }

    for (let x = -500; x < 500; x += 8) {
        const opacityX = (400 -  Math.abs(x)) / 100
        for (let y = -400; y < 500; y += 8) {
            const opacityY = (350 -  Math.abs(y)) / 100
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(opacityX, opacityY)})`
            ctx.fillRect(x + widthOffset, y + heightOffset + 50, pixel, pixel)
        }
    }

    requestAnimationFrame(animate)
}

animate()

window.addEventListener('resize', resizeCanvas)
function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = Math.max(html.clientHeight, html.scrollHeight, html.offsetHeight)
}