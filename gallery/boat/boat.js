const html = document.querySelector('html')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const boat = document.getElementById("boat")

resizeCanvas()

let cursorX = window.innerWidth / 2
let cursorY = window.innerHeight / 2

const tealbg = "#027D9C"
const orangbg = "#e07a5f"
const pixel = 8
let frequency = 1
let fill = "rgba(255, 255, 255, 0.1)"
let speedCoefficient = 1
let stretchCoefficient1 = 1
let stretchCoefficient2 = 1
let offset = 0
let size = 0

let velocity = 0

changebg(tealbg)

function changebg(color) {
    html.style.backgroundColor = color
    canvas.style.backgroundColor = color
}

function pixellate(x) {
    return pixel * Math.round(x / pixel)
}

function animate() {
    velocity = Math.max(0.3, velocity*0.98)
    offset += speedCoefficient
    size = Math.sin(offset) * Math.pow(pixel, 2)
    size += size > 0 ? 8 : -8

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < canvas.width; i += 1) {
        const absVelocity = Math.abs(velocity)
        
        if (velocity > 0) {
            const leftDist = ((i - cursorX) / (canvas.width/2))
            const leftStretch = (leftDist * canvas.height / 6)

            let v1 = leftStretch * 2 * absVelocity * Math.sin(-offset/10 + i) + canvas.height/2
            v1 = v1 < canvas.height/2 ? leftStretch * 1.5 * absVelocity * Math.sin(-offset/10 + i) + canvas.height/2 : v1

            let v2 = leftStretch * 4 * absVelocity * Math.sin(offset + i) + canvas.height/2
            v2 = v2 < canvas.height/2 ? leftStretch * 3 * absVelocity * Math.sin(offset + i) + canvas.height/2 : v2

            if (i < cursorX && i > cursorX - 600) {
                ctx.fillStyle = `rgba(255, 255, 255, ${absVelocity * Math.log(2 - (2 * (cursorX - i) / (600))) - 0.2})`
                ctx.fillRect(pixellate(i), pixellate(v1), pixel, pixel)
            }
            if (i < cursorX && i > cursorX - 300) {
                ctx.fillStyle = `rgba(255, 255, 255, ${absVelocity * Math.min(0.1, Math.log(2 - (2 * (cursorX - i) / (300))))})`
                ctx.fillRect(pixellate(i), pixellate(v2), pixel, pixel)
            }
        }
    }

    boat.style.left = `${pixellate(cursorX - 72)}px`
    boat.style.top = `${pixellate(canvas.height / 2 - 56)}px`
    
    requestAnimationFrame(animate)
}

animate()

window.addEventListener('resize', resizeCanvas)
function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = Math.max(html.clientHeight, html.scrollHeight, html.offsetHeight)
}

document.addEventListener('mousemove', function(event) {
    if (cursorX < event.clientX) {
        velocity = Math.min(velocity + 0.005 * (event.clientX - cursorX), 2)
    }

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