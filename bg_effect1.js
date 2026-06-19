const html = document.querySelector('html')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

resizeCanvas()

let cursorX = window.innerWidth / 2
let cursorY = window.innerHeight / 2

const tealbg = "#027D9C"
const orangbg = "#e07a5f"
const pixel = 8
let frequency = 100
let fill = "rgba(255, 0, 0, 0.2)"
let speedCoefficient = 1
let stretchCoefficient = 1
let offset = 0

function pixellate(x) {
    return pixel * Math.round(x / pixel)
}

function renderPoint(x) {
    let y = Math.sin((offset + x * frequency))
    y *= stretchCoefficient
    return y
} 

function animate() {
    offset += speedCoefficient / 32

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = fill

    for (let i = 0; i < canvas.width; i += 1) {
        const baseHeight = canvas.height/2
        const leftBase = Math.max(cursorX - 300, 16)
        const rightBase = Math.max(cursorX + 300, 16)

        const leftDist = 1 - (i / leftBase)
        let leftStretch = (leftDist * baseHeight)
        let leftBaseValue = baseHeight + leftStretch * renderPoint(i)
        let leftValue = (leftBaseValue * (leftDist)) + (cursorY * (1 - leftDist))

        const rightDist = ((i - rightBase)) / (canvas.width - rightBase)
        let rightStretch = (rightDist * baseHeight)
        let rightBaseValue = baseHeight + rightStretch * renderPoint(i)
        let rightValue = (rightBaseValue * (rightDist)) + (cursorY * (1 - rightDist))

        if (Math.abs(cursorX - i) < 300 ) {
            continue
        }
        else if (i < cursorX) {
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
})

const urls = document.querySelectorAll("a")

for (url of urls) {
    url.addEventListener("mouseenter", (_) => {
        changebg(orangbg)
        fill = "rgba(2, 125, 156, 0.3)"
        frequency = 145
    })
    url.addEventListener("mouseleave", (_) => {
        changebg(tealbg)
        fill = "rgba(255, 255, 255, 0.1)"
        frequency = 100
    })
}

