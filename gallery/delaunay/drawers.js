function drawLine(to, from) {
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
}

function drawPoint(pt) {
    ctx.fillRect(pt.x - 4, pt.y - 4, pixel, pixel)
}

function drawTriangles() {
    let i = 0
    for(let triangle of triangles) {
        if (i == which) {
            ctx.strokeStyle = "#e07a5f"
            ctx.beginPath()
            ctx.arc(triangle.center.x, triangle.center.y, triangle.radius, 0, 2 * Math.PI)
            ctx.stroke()

            ctx.fillStyle = "#e07a5f"
            ctx.fillRect(triangle.center.x - 4, triangle.center.y - 4, pixel, pixel)
            for(let i = 0; i < triangle.points.length; i++) {
                let pt = triangle.points[i]
                drawPoint(pt)
            }
        }
        i += 1

        ctx.strokeStyle = "white"
        ctx.beginPath()
        let prevPoint = triangle.points[2]
        for(let pt of triangle.points) {
            drawLine(pt, prevPoint)
            prevPoint = pt
        }
    }
}

function drawPoints() {
    for(let i = 0; i < points.length; i++) {
        let pt = points[i]
        ctx.fillStyle = "white"
        ctx.fillRect(pt.x - 4, pt.y - 4, pixel, pixel)
    }
}

function drawAll() {
    ctx.clearRect(0,0,canvas.width, canvas.height)

    drawPoints()
    drawTriangles()
}