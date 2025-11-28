const html = document.querySelector('html')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const pixel = 8

let cursorX = 1
let cursorY = 1

let yOffset = canvas.height / 2
let xOffset = canvas.width / 2
let frame = Math.min(canvas.height, canvas.width) / 2
let power = 2
let fractal = 2

resizeCanvas()

function pixellate(x) {
    return pixel * Math.round(x / pixel)
}

let escapeTime = strange

let zoom = 1
let zoomX = 0
let zoomY = 0
let increment = 1 / (64 * zoom)
let delta = 0

function changeDelta() {
    delta += 1
    if (escapeTime == william) {
        animate()
    }
    requestAnimationFrame(changeDelta)
}

function white (t, color = [0,0,0]) {
    if (t <= zoom) {
        return color
    }
    color[0] += 16
    color[1] += 16
    color[2] += 16
    return getColor(t - (color[0] / 8), color)
}
function recursive (t, color = [0,0,0], index = 0) {
    if (t <= zoom) {
        return color
    }
    color[index % 3] += 80
    index += t
    return getColor(t - (index / 8), color, index)
}
function custom (t) {
    if (t > zoom * 15) {
        return [255,255,255]
    }
    else if (t > zoom * 13) {
        return [255,190,11]
    }
    else if (t > zoom * 11) {
        return [251,86,7]
    }
    else if (t > zoom * 9) {
        return [255,0,110]
    }
    else if (t > zoom * 7) {
        return [131,56,236]
    }
    else if (t > zoom * 5) {
        return [58,134,255]
    }
    else {
        return [2, 125, 156]
    }
}

let getColor = custom

function setColors(which) {
    if (which == 1) {
        getColor = white
    }
    else if (which == 2) {
        getColor = recursive
    }
    else {
        getColor = custom
    }

    zoom = 1
    zoomX = 0
    zoomY = 0
    animate()
}

function animate() {
    increment = 1 / (32 * zoom)
    yOffset = canvas.height / 2
    xOffset = canvas.width / 2
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let x = zoomX - (2 / zoom); x < zoomX + (2 / zoom); x += increment) {
        for (let y = zoomY - (2 / zoom); y < zoomY + (2 / zoom); y += increment) {
            let time = escapeTime(x, y)
            let xVal = (xOffset + (x - zoomX) * frame * zoom)
            let yVal = (yOffset + (y - zoomY) * frame * zoom)

            let color = (time < zoom * 5) ? [2, 125, 156] : getColor(time)
            ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
            ctx.fillRect(xVal, yVal, pixel, pixel)
        }
    }
}

window.addEventListener('resize', resizeCanvas)
function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = Math.max(html.clientHeight, html.scrollHeight, html.offsetHeight)
}
document.addEventListener('mousemove', function(event) {
  cursorX = event.clientX
  cursorY = event.clientY
})
// document.addEventListener("mousedown", function() {
//   zoom *= 1.3
//   zoomX = zoomX + ((cursorX - xOffset) / (frame * zoom))
//   zoomY = zoomY + ((cursorY - yOffset) / (frame * zoom))
//   animate()
// })

document.addEventListener('keydown', function(event) {
    const key = event.key

    if (key === '+' || key === '=' || key === 'Add' || (event.shiftKey && key === '=')) {
        zoom *= 1.3
        
    } 
    else if (key === '-' || key === 'Subtract' || key === '_') {
        zoom *= 0.7
    }
    else if (key === 'w') {
        zoomY -= 1 / zoom
    }
    else if (key == 's') {
        zoomY += 1 / zoom
    }
    else if (key == 'a') {
        zoomX -= 1 / zoom
    }
    else if (key == 'd') {
        zoomX += 1 / zoom
    }

    animate()
})


function setEscapeTime(which) {
    zoom = 1
    zoomX = 0
    zoomY = 0
    escapeTime = which
    animate()
}





function multiply(x1, y1, x2, y2) {
    return [(x1 * x2 - y1 * y2), (x1 * y2 + x2 * y1)]
}

function raise(x, y, pow) {
    if (pow <= 1) {
        return [x, y]
    } else {
        pow--
        let z = raise(x, y, pow)
        return multiply(x, y, z[0], z[1])
    }
}

function god (x0, y0) {
    let counter = 0
    let x = 0
    let y = 0

    while ((x ** 2 + y ** 2) < 4 && counter < (zoom * 16)) {
        let _x = x
        x = Math.cos(x ** 2 - y ** 2 + x0) + Math.sin(x ** 2 - y ** 2 + x0)
        y = ((_x * y) - y0)

        counter += 1
    }

    return counter
}

function strange (x0, y0) {
    let counter = 0
    let x = x0
    let y = y0

    while (x ** 2 + y ** 2 < 16 && counter < (zoom * 16)) {
        let z = raise(x, y, 2)
        x += (z[0] - 0.99)
        y += (z[1] + 0.13)

        counter += 1
    }

    return counter
}

function flame (x0, y0) {
    let counter = 0
    let x = x0
    let y = y0

    while (x ** 7 + y ** 3 < 16 && counter < (zoom * 16)) {
        let z = raise(x, y, 2)
        x += (z[0] - 1)
        y += (z[1] + 0.2)

        counter += 1
    }

    return counter
}

function starburst (x0, y0) {
    let counter = 0
    let x = x0
    let y = y0

    while (x ** 2 + y ** 2 < 160 && counter < (zoom * 16)) {
        let z = raise(x, y, 2)
        x += z[0] - 0.63
        y += z[1] + 0.63

        counter += 1
    }

    return counter
}

function mendelbrot (x0, y0) {
    let counter = 0
    let x = 0
    let y = 0

    while ((x ** 2 + y ** 2) < 4 && counter < (zoom * 16)) {
        let _x = x
        x = (x ** power - y ** power + x0)
        y = ((fractal * _x * y) + y0)

        counter += 1
    }

    return counter
}

animate()
changeDelta()