const html = document.querySelector('html')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

resizeCanvas()

const tealbg = "#027D9C"
const orangbg = "#e07a5f"
const pixel = 8
let frequency = 20
let fill = "rgba(255, 255, 255, 0.1)"
let speedCoefficient = 1
let stretchCoefficient1 = 2
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
    base += Math.sin((offset + x / frequency)) > 0 ? 1 : -1
    return 4 * stretchCoefficient1 * 8 * Math.round((base * size) / 8)
} 

function animate() {
    offset += speedCoefficient / 20
    size = Math.sin(offset) * Math.pow(pixel, 2)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const heightOffset = Math.round(window.innerHeight / 2)
    const widthOffset = Math.round(window.innerWidth / 2)
    const scaleFactor = (canvas.width / 2)

    ctx.fillStyle = fill

    for (let i = 0; i < canvas.width; i += 1) {
        const scale = scaleFactor - i
        stretchCoefficient1 = (scaleFactor - i) / scaleFactor

        ctx.fillRect(pixellate(i), renderPoint(i * 100) + heightOffset, pixel, pixel)
        ctx.fillRect(pixellate(i), renderPoint(i * 100) - scale + heightOffset, pixel, pixel)
        ctx.fillRect(pixellate(i), scale + renderPoint(i * 100) + heightOffset, pixel, pixel)
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

const urls = document.querySelectorAll("a")

for (url of urls) {
    url.addEventListener("mouseenter", (_) => {
        changebg(orangbg)
        fill = "rgba(2, 125, 156, 0.3)"
        setTimeout(() => {
            stretchCoefficient2 = 1.25
            speedCoefficient = 1.25
            setTimeout(() => {
                stretchCoefficient2 = 1.3
                speedCoefficient = 1.5
            }, 50)
        }, 50)
    })
    url.addEventListener("mouseleave", (_) => {
        changebg(tealbg)
        fill = "rgba(255, 255, 255, 0.1)"
        setTimeout(() => {
            stretchCoefficient2 = 1.25
            speedCoefficient = 1.25
            setTimeout(() => {
                stretchCoefficient2 = 1
                speedCoefficient = 1
            }, 50)
        }, 50)
    })
}