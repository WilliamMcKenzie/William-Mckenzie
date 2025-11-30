const html = document.querySelector('html')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

resizeCanvas()

let cursorX = window.innerWidth / 2
let cursorY = window.innerHeight / 2

const tealbg = "#027D9C"
const orangbg = "#e07a5f"
const pixel = 8
let count = 10
let points = []
let boundaries = {}
let colors = {
    undefined : "rgb(0, 0, 0)"
}

function changebg(color) {
    html.style.backgroundColor = color
    canvas.style.backgroundColor = color
}

function pixellate(x) {
    return pixel * Math.round(x / pixel)
}

function renderPoint(x) {
    let y = Math.sin((offset + x * frequency))
    y *= stretchCoefficient
    return y
}

function makePoints() {
    for (let i = 0; i < count; i++) {
        let x = Math.round(Math.random() * canvas.width)
        let y = Math.round(Math.random() * canvas.height)
        points.push([x,y])
        boundaries[[x,y]] = []
        colors[[x,y]] = `rgb(${(x % 6) * 40}, ${(y % 6) * 40}, ${((x + y) % 5) * 40})`
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let x = 0; x < canvas.width; x += 8) {
        for (let y = 0; y < canvas.height; y += 8) {
            let closest = undefined
            let distance = Infinity

            for (let point of points) {
                let pointDist = (Math.sqrt(
                    Math.pow(x - point[0], 2) +
                    Math.pow(y - point[1], 2)
                ))

                if (pointDist < distance) {
                    distance = pointDist
                    closest = point
                }
            }

            ctx.fillStyle = colors[closest]
            ctx.fillRect(pixellate(x), pixellate(y), pixel, pixel)
        }
    }

    ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
    for (let point of points) {
        ctx.fillRect(pixellate(point[0]), pixellate(point[1]), pixel, pixel)
    }
}

function reset() {
    points = []
    boundaries = {}
    colors = {
        undefined : "rgb(0, 0, 0)"
    }
}

window.addEventListener('resize', resizeCanvas)
function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = Math.max(html.clientHeight, html.scrollHeight, html.offsetHeight)
}