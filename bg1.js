const html = document.querySelector('html')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
html.style.background = "#3C6A79"

const size = 6
const white = "#458e9d"

let sentients = []

class Creature {
    constructor(x, y, xVel, yVel, maxDist) {
        this.x = x
        this.y = y
        this.xVel = xVel
        this.yVel = yVel
        this.dist = 0
        this.distFromCenter = 0
        this.maxDist = maxDist
    }
    update() {
        this.x += this.xVel
        this.y += this.yVel
        this.dist++
        this.distFromCenter += this.xVel

        if (this.dist > this.maxDist) {
            let temp = this.xVel
            this.xVel = this.xVel * getSign()
            this.yVel = this.yVel * getSign()
            this.maxDist = 8 * getModifier()
            this.dist = 0
        }
    }
    draw() {
        let color = white

        ctx.fillStyle = color
        ctx.fillRect(this.x - size, this.y - size, size, size)

        return [this.x - size, this.y - size]
    }
}

function getSign() {
    return Math.random() - 0.5 > 0 ? 1 : -1
}

function getModifier() {
    return Math.random() - 0.5 > 0 ? 2 : 1
}

function makeSentient(quantity) {
    for (let i = 0; i < quantity; i++) { 
        let x, y
        x = Math.round(canvas.width / 2)
        y = Math.round(canvas.height / 2)
        xVel = getSign() * 6
        yVel = getSign() * 6
        sentients.push(new Creature(x, y, xVel, yVel, 8 * getModifier()))
    }
}

let frames = 0
var tiles = new Set()

function start() {
    frames = 0
    sentients = []
    tiles = new Set()
    makeSentient(512)
    animate()
}

function paintAllTiles(color) {
    ctx.fillStyle = color
    tiles.forEach((tile, _) => {
        ctx.fillRect(tile[0], tile[1], size, size)
    })
}

function animate() {
    frames += 1
    for (let i = 0; i < sentients.length; i++) {
        sentients[i].update()
        tiles.add(sentients[i].draw())
        
        if (sentients[i].x < 0 || sentients[i].x > canvas.width || sentients[i].y < 0 || sentients[i].y > canvas.height) {
            sentients.splice(i, 1)
            i--
        }
    }

    if (frames > 256) {
        paintAllTiles("#fff")

        setTimeout(() => paintAllTiles("#eee"), 100)

        setTimeout(() => paintAllTiles("#ddd"), 200)

        setTimeout(() => paintAllTiles("#74a8b3"), 300)
        setTimeout(() => paintAllTiles("#458e9d"), 400)

        return
    }
    requestAnimationFrame(animate)
}

resizeCanvas()

window.addEventListener('resize', resizeCanvas)
function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = Math.max(html.clientHeight, html.scrollHeight, html.offsetHeight )
    start()
}