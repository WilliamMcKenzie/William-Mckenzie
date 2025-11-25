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

    let q = Math.tan(Math.cos(offset + Math.PI * 1.2) + Math.sin(offset))

    function squareComplex(z) {
        let x = z[0]
        let y = z[1]
        let newX = (x ** speedster - y ** speedster + c[0]) 
        let newY = ((q * x * y) + c[1]) 

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

let mode = false
let domain = 2
function animate() {
    const yOffset = canvas.height / 2
    const xOffset = canvas.width / 2
    offset += Math.PI / 100
    domain += Math.sin(Math.cos(offset))/16
    fractalCoefficient = 2 - Math.sin(offset) - Math.tan(offset)

    let frame = Math.max(canvas.height, canvas.width) / 2
    let rangeRatio = canvas.height / canvas.width
    let range = domain * rangeRatio
    
    let increment = 1/(90 / domain)
    
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let x = -domain; x < domain; x += increment) {
        for (let y = -range; y < range; y += increment) {
            let counter = isBounded([x,y])
            if (counter != 1) {
                ctx.fillStyle = mode ? `rgba(2, 125, 156, ${!mode ? 5/counter : 0.7 - 1/counter}`
                                    :`rgba(255, 255, 255, ${!mode ? 1/counter : 0.7 - 1/counter}`
            ctx.fillRect(pixellate(xOffset + x * frame / domain), pixellate(yOffset + y * frame / domain), pixel, pixel)   
            }
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
            domain = 3
            offset = 98
            speedster = 3
            mode = true
    })
    url.addEventListener("mouseleave", (_) => {
        changebg(tealbg)
            fill = "rgba(255, 255, 255, 0.1)"
            domain = 2.5
            offset = 3
            speedster = 2
            mode = false
    })
}