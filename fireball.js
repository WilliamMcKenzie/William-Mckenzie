
const html = document.querySelector('html')
const body = document.querySelector('body')
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
const color = '#fafafa'
const seed = 7.9
body.appendChild(canvas)
canvas.style = 'position: absolute; top: 0; left: 0; z-index: -1;'

let pixel = 18
let zoom = 1
let speed = 26

let cursorX = window.innerWidth / 2
let cursorY = window.innerHeight / 2

let offset = 0

function randi() {
    return Math.floor(Math.random() * 999)
}

function pixellate(x) {
    return pixel * Math.round(x / pixel)
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    offset += (speed/128)
    backgroundLoop()
    requestAnimationFrame(animate)
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






	

function getOpacity(x, y, angle) {
	let angledX = Math.cos(angle) * x
	let angledY = Math.sin(angle) * y
	return Math.cos(angledX + angledY + offset) * 100
}

function getColor(x, y) {
	let opacity = 0
	let angle = 2 * Math.PI
	let delta = angle / seed
	for (let i = 0; i < seed; i++) {
		opacity += getOpacity(x, y, angle)
		angle -= delta
	}

	return (opacity / seed > 0.5) ? color : "transparent"
}


function backgroundLoop() {
    for (let x = -canvas.width/2; x < canvas.width/2; x += pixel) {
        for (let y = -canvas.height/2; y < canvas.height/2; y += pixel) {
            ctx.fillStyle = getColor((x / zoom), (y / zoom))
            ctx.fillRect(pixellate(x + canvas.width/2), pixellate(y + canvas.height/2), pixel, pixel)
        }
    }
}

resizeCanvas()
animate()

		