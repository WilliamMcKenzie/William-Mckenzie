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
    return stretchCoefficient2 * stretchCoefficient1 * Math.round((base * size) / 8)
} 

function animate() {
    offset += speedCoefficient / 20
    size = Math.sin(offset) * Math.pow(pixel, 2)
    size += size > 0 ? 8 : -8

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = fill

    for (let i = 0; i < canvas.width; i += 1) {
        const baseHeight = canvas.height/2

        const leftDist = 1 - (i / cursorX)
        let leftStretch = (leftDist * baseHeight)
        let leftBaseValue = baseHeight + leftStretch * renderPoint(i)
        let leftCenterValue = cursorY
        let leftValue = (leftBaseValue * (leftDist)) + (leftCenterValue * (1 - leftDist))

        const rightDist = ((i - cursorX)) / (canvas.width - cursorX)
        let rightStretch = (rightDist * baseHeight)
        let rightBaseValue = baseHeight + rightStretch * renderPoint(i)
        let rightCenterValue = cursorY
        let rightValue = (rightBaseValue * (rightDist)) + (rightCenterValue * (1 - rightDist))

        if (i < cursorX) {
            ctx.fillRect(pixellate(i), pixellate(leftValue), pixel, pixel)
        }
        else {
            ctx.fillRect(pixellate(i), pixellate(rightValue), pixel, pixel)
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