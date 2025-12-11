class Point {
    constructor (x, y) {
        this.x = x
        this.y = y
    }
}

class Triangle {
    constructor (p1, p2, p3) {
        this.points = [p1, p2, p3]
        this.center = circumcenter(p1, p2, p3)
        this.radius = dist(p1, this.center)
    }
    
    inside(pt) {
        return dist(pt, this.center) < this.radius
    }

    validDelauny(pts) {
        for(let pt of pts) {
            if(this.inside(pt) && !this.points.includes(pt)) {
                return false
            }
        }
        return true
    }
}

function circumcenter(p1, p2, p3) {
    // We want to find intersection
    // So ax + b = cx + d
    // x(a - c) = d - b
    // x = (d - b) / (a - c)
    let a = -(p2.x - p1.x) / (p2.y - p1.y)
    let c = -(p3.x - p2.x) / (p3.y - p2.y)
    let b = ((p2.y + p1.y) / 2) - (a * (p2.x + p1.x) / 2)
    let d = ((p3.y + p2.y) / 2) - (c * (p3.x + p2.x) / 2)

    let x = (d - b) / (a - c)
    let y = a * x + b

    if (!x || !y) {
        return circumcenter(p3, p1, p2)
    }

    return new Point(x, y)
}



const html = document.querySelector('html')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const pixel = 8

resizeCanvas()
let bound = Math.min(canvas.width, canvas.height) - 8
let points = []
let triangles = []
let addedPoints = []
let cursorX = 0
let cursorY = 0


function dist(p1, p2) {
    return Math.sqrt(
        ((p1.x - p2.x) ** 2) +
        ((p1.y - p2.y) ** 2)
    )
}

function randi() {
    return Math.floor(Math.random() * 999)
}

async function sleep(ms) {
    await new Promise((resolve)=>{setTimeout(resolve, ms)})
}

function pixellate(x) {
    return pixel * Math.round(x / pixel)
}




function superTriangle() {
    points = [
        new Point(bound, bound),
        new Point(bound/2, 0),
        new Point(0, bound),
    ]
    triangles = [
        new Triangle(...points)
    ]
}



function connectPoint(pt) {
    let temp = []
    let alterations = 0
    const newTriangles = (p1, p2, p3) => {
        return [
            new Triangle(p1,p2,pt),
            new Triangle(p1,p3,pt),
            new Triangle(p2,p3,pt),
        ]
    }

    for(let triangle of triangles) {
        if (!triangle.inside(pt)) {
            temp.push(triangle)
        } else {
            for(let newTriangle of newTriangles(...triangle.points)) {
                if(newTriangle.validDelauny(points)) {
                    temp.push(newTriangle)
                    alterations += 1
                }
            }
        }
    }
    
    if (alterations > 0) {
        points.push(pt)
        triangles = temp
    }
}

async function start() {
    superTriangle()
    drawAll()
}

async function step(n) {
    for(let i = 0; i < n; i++) {
        const randX = () => bound/4 + Math.random() * (bound/2)
        const randY = () => bound/2 + Math.random() * (bound/2)
        connectPoint(new Point(randX(), randY()))
    }
    drawAll()
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

document.addEventListener("mousedown", (e) => {
    if (e.target.nodeName == "CANVAS") {
        connectPoint(new Point(cursorX, cursorY))
        drawAll()
    }
})