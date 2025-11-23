const html = document.querySelector('html')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

resizeCanvas()

let cursorX = window.innerWidth / 2
let cursorY = window.innerHeight / 2

const tealbg = "#027D9C"
const orangbg = "#e07a5f"
const pixel = 8
const frequency = 4
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
    let base = Math.sin((offset + x / 20))
    return stretchCoefficient2 * stretchCoefficient1 * 8 * Math.round((base * size) / 8)
} 

function animate() {
    offset += speedCoefficient * (frequency / 80)
    size = Math.sin(offset) * Math.pow(pixel, 2)
    size += size > 0 ? 8 : -8

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = fill

    for (let i = 0; i < canvas.width; i += 1) {
        const scale = cursorX  - i
        stretchCoefficient1 = (cursorX - i) / (canvas.width / 2)

        ctx.fillRect(pixellate(i), renderPoint(i * 100) + cursorY, pixel, pixel)
        ctx.fillRect(pixellate(i), 6 * renderPoint(i * 100) - (scale * 2) + cursorY, pixel, pixel)
        ctx.fillRect(pixellate(i), (scale * 2) + 6 * renderPoint(i * 100) + cursorY, pixel, pixel)
        
    }

    // for (let x = -1000; x < 1000; x += 8) {
    //     for (let y = -250; y < 250; y += 8) {
    //         const opacity = (800 - (Math.abs(x) + Math.abs(y))) / 1000
    //         ctx.fillStyle = `rgba(255, 255, 255, ${opacity + (Math.random() / 100)})`
    //         ctx.fillRect(x + widthOffset, y + heightOffset, pixel, pixel)
    //     }
    // }
    
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

const urls = document.querySelectorAll("a")

for (url of urls) {
    url.addEventListener("mouseenter", (_) => {
        changebg(orangbg)
        fill = "rgba(2, 125, 156, 0.3)"
        setTimeout(() => {
            stretchCoefficient2 = 1.25
            speedCoefficient = 1.5
            setTimeout(() => {
                stretchCoefficient2 = 3
                speedCoefficient = 2
            }, 50)
        }, 50)
    })
    url.addEventListener("mouseleave", (_) => {
        changebg(tealbg)
        fill = "rgba(255, 255, 255, 0.1)"
        setTimeout(() => {
            stretchCoefficient2 = 1.25
            speedCoefficient = 1.5
            setTimeout(() => {
                stretchCoefficient2 = 1
                speedCoefficient = 1
            }, 50)
        }, 50)
    })
}