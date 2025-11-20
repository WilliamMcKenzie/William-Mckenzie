const html = document.querySelector('html')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
html.style.background = "#3C6A79"

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


function noise() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const heightOffset = Math.round(window.innerHeight / 2)
    const widthOffset = Math.round(window.innerWidth / 2)

    for (let x = -1000; x < 1000; x += 8) {
        for (let y = -1000; y < 1000; y += 8) {
            const opacity = (800 - (Math.abs(x) + Math.abs(y))) / 1000
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity + (Math.random() / 10)})`
            ctx.fillRect(x + widthOffset, y + heightOffset, pixel, pixel)
        }
    }
    setTimeout(noise, 50)
}

function animate() {
    offset += frequency / 80
    size = Math.sin(offset) * Math.pow(pixel, 2)


    const heightOffset = Math.round(window.innerHeight / 2)
    const widthOffset = Math.round(window.innerWidth / 2)
    const scaleFactor = (canvas.width / 2)
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)"

    for (let i = 0; i < canvas.width; i += 1) {
        const scale = Math.abs(scaleFactor - i)

        ctx.fillRect(pixellate(i), renderPoint(i * 100) + heightOffset, pixel, pixel)
        ctx.fillRect(pixellate(i), renderPoint(i * 100) - scale + heightOffset, pixel, pixel)
        ctx.fillRect(pixellate(i), scale + renderPoint(i * 100) + heightOffset, pixel, pixel)
    }

    requestAnimationFrame(animate)
}

noise()
animate()

window.addEventListener('resize', resizeCanvas)
function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = Math.max(html.clientHeight, html.scrollHeight, html.offsetHeight)
}