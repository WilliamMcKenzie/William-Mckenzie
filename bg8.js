const html = document.querySelector('html')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

resizeCanvas()

let cursorX = window.innerWidth / 2
let cursorY = window.innerHeight / 2

const tealbg = "#027D9C"
const orangbg = "#e07a5f"
const pixel = 8
let frequency = 20
let fill = "rgba(255, 255, 255, 0.1)"
let speedCoefficient = 1
let stretchCoefficient1 = 1
let stretchCoefficient2 = 1
let offset = 0
let size = 0

changebg(tealbg)

function changebg(color) {
    html.style.backgroundColor = color
    canvas.style.backgroundColor = color
}

function pixellate(x) {
    return pixel * Math.round(x / pixel)
}

function renderPoint(x) {
    let base = Math.sin((offset + x / frequency))
    return stretchCoefficient2 * stretchCoefficient1 * 8 * Math.round((base * size) / 8)
} 

function animate() {
    offset = 5
    size = Math.sin(offset) * Math.pow(pixel, 2)
    size += size > 0 ? 8 : -8

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = fill

    for (let i = 0; i < canvas.width; i += 1) {
        const scale = cursorX - i
        const scaleFactor = cursorX 
        stretchCoefficient1 = (scaleFactor - i) / (canvas.width / 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(10/(cursorX - i))})`
        
        const power = frequency == 1000 ? 1 : 2

        ctx.fillRect(pixellate(i), renderPoint(i * 100) + cursorY, pixel, pixel)
        ctx.fillRect(pixellate(i), Math.pow(renderPoint(i * 100), power) - (scale * 2) + cursorY, pixel, pixel)
        ctx.fillRect(pixellate(i), (scale * power) + Math.pow(renderPoint(i * 100), power) + cursorY, pixel, pixel)
        ctx.fillRect(pixellate(i), -(Math.pow(renderPoint(i * 100), power) - (scale * 2)) + cursorY, pixel, pixel)
        ctx.fillRect(pixellate(i), -((scale * power) + Math.pow(renderPoint(i * 100), power)) + cursorY, pixel, pixel)
    }
    
    requestAnimationFrame(animate)
}

animate()

window.addEventListener('resize', resizeCanvas)
function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = Math.max(html.clientHeight, html.scrollHeight, html.offsetHeight)
}

document.addEventListener('mousemove', function(event) {
  cursorX = event.clientX
  cursorY = event.clientY
});

let urls = document.querySelectorAll("a")

for (url of urls) {
    url.addEventListener("mouseenter", (_) => {
        changebg(orangbg)
        fill = "rgba(2, 125, 156, 0.3)"
        setTimeout(() => {
            stretchCoefficient2 = 2
            speedCoefficient = 1.25
            setTimeout(() => {
                stretchCoefficient2 = 3
                speedCoefficient = 1.5
            }, 50)
        }, 50)
    })
    url.addEventListener("mouseleave", (_) => {
        changebg(tealbg)
        fill = "rgba(255, 255, 255, 0.1)"
        setTimeout(() => {
            stretchCoefficient2 = 2
            speedCoefficient = 1.25
            setTimeout(() => {
                stretchCoefficient2 = 1
                speedCoefficient = 1
            }, 50)
        }, 50)
    })
}