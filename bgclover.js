const html = document.querySelector('html')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

resizeCanvas()

let cursorX = window.innerWidth / 2
let cursorY = window.innerHeight / 2

const tealbg = "#027D9C"
const orangbg = "#e07a5f"
const pixel = 8
let fill = "rgba(255, 255, 255, 0.1)"
let speedCoefficient = 1
let stretchCoefficient = 1
let offset = 0
let seed = 128

changebg(tealbg)

function changebg(color) {
    html.style.backgroundColor = color
    canvas.style.backgroundColor = color
}

function pixellate(x) {
    return pixel * Math.round(x / pixel)
}

function animate() {
    let coefficient = seed == 256 ? 1 : 1
    offset += coefficient / 2

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = fill

    const radius = 128
    const radiussquared = radius ** 2
    for (let i = -radius; i < radius; i += 1) {
        let y = Math.sqrt(radiussquared - i ** 2)
        let sinwave = seed * Math.sin(offset + (i) * 1000)

        ctx.fillRect(pixellate(cursorX + i), pixellate(sinwave + cursorY + y), pixel, pixel)
        ctx.fillRect(pixellate(cursorX + i), pixellate(sinwave + cursorY - y), pixel, pixel)
        ctx.fillRect(pixellate(sinwave + cursorX + y), pixellate(cursorY + i), pixel, pixel)
        ctx.fillRect(pixellate(sinwave + cursorX - y), pixellate(cursorY + i), pixel, pixel)
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
})

const urls = document.querySelectorAll("a")

for (url of urls) {
    url.addEventListener("mouseenter", (_) => {
        changebg(orangbg)
        fill = "rgba(2, 125, 156, 0.3)"
        seed = 128
    })
    url.addEventListener("mouseleave", (_) => {
        changebg(tealbg)
        fill = "rgba(255, 255, 255, 0.1)"
        seed = 128
    })
}