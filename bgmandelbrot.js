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

changebg(tealbg)

function changebg(color) {
    html.style.backgroundColor = color
    canvas.style.backgroundColor = color
}

function pixellate(x) {
    return pixel * Math.round(x / pixel)
}


let offset = 0
let speedster = 2
let fractalCoefficient = 5

function isBounded(c) {
    let seen = new Set()
    let counter = 0
    let z = [0,0]

    function squareComplex(z) {
        let x = z[0]
        let y = z[1]
        let newX = (x ** speedster - y ** speedster + c[0]) 
        let newY = ((fractalCoefficient * x * y) + c[1]) 

        return [newX, newY]
    }

    function cubeComplex(z) {
        let w = squareComplex(z)
        return squareComplex(w)
    }

    function quadComplex(z) {
        let w = squareComplex(z)
        w = squareComplex(z)
        return cubeComplex(squareComplex(w))
    }

    while (counter < 32) {
        let x = z[0]
        let y = z[1]
        let w = quadComplex(z)
        let identifer = `${w[0]},${w[1]}`

        if (seen.has(identifer)) {
            return counter
        }
        if (isNaN(x) || isNaN(y)) {
            return counter
        }
        if (x > 2 || y > 2) {
            return counter
        }
        
        z = w
        counter += 1
        seen.add(identifer)
    }
    return counter
}

function animate() {
    const yOffset = canvas.height / 2
    const xOffset = canvas.width / 2
    offset += 1/20
    offset = Math.sin(offset)
    fractalCoefficient = 2 - Math.sin(offset)

    let frame = Math.min(canvas.height, canvas.width) /2
    let range = [-1.5, 1]
    let increment = (range[1] - range[0]) / 128
    
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let x = range[0]; x < range[1]; x += increment) {
        for (let y = range[0]; y < range[1]; y += increment) {
            let counter = isBounded([x,y])
            if (counter != 1) {
                ctx.fillStyle = `rgba(255, 255, 255, ${1/counter}`
            ctx.fillRect(pixellate(2*frame + x * frame), pixellate(yOffset + y * frame), pixel, pixel)   
            }
        }
    }

    setTimeout(requestAnimationFrame(animate), 2000)
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
        frequency = 22
    })
    url.addEventListener("mouseleave", (_) => {
        changebg(tealbg)
        fill = "rgba(255, 255, 255, 0.1)"
        frequency = 77
    })
}