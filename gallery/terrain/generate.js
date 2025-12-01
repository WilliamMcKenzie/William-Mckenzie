function randomBetween(x, y) {
    return x + Math.round(Math.random() * (y - x))
}

function randi() {
    return Math.floor(Math.random() * 999)
}

function distanceFrom(x, y) {
    return Math.sqrt(
        Math.pow(x[0] - y[0], 2) +
        Math.pow(x[1] - y[1], 2)
    )
}

function checkAdjacent(container, x, y, execute) {
    let left = x-1
    let right = x+1
    let up = y+1
    let down = y-1

    if (!container[[left,y]]) {
        execute(left,y)
    }
    if (!container[[right,y]]) {
        execute(right,y)
    }
    if (!container[[x,up]]) {
        execute(x,up)
    }
    if (!container[[x,down]]) {
        execute(x,down)
    }
}

function applyOutline(outliner, tiles) {
    for (let tile of Object.values(tiles)) {
        let x = tile[0]
        let y = tile[1]

        checkAdjacent(tiles, x, y, outliner)
    }
}

async function generateIsland() {
    await resetCanvas()
    const app = globalThis.__PIXI_APP__
    const scale = app.stage.scale.x
    const w = app.canvas.width / (scale * 8)
    const h = app.canvas.height / (scale * 8)

    let centerPoint = [w/2, h/2]
    let points = []

    for (let i = 0; i < 40; i++) {
        let x = Math.random() * w
        let y = Math.random() * h

        points.push([x,y])
    }

    let tiles = {}
    for (let y = 0; y < h; y += 1) {
        for (let x = 0; x < w; x += 1) {
            let closest = [-1,-1]
            let closestDist = h + w

            for (let point of points) {
                let dist = distanceFrom([x,y], point)
                if (dist < closestDist) {
                    closest = point
                    closestDist = dist
                }
            }

            const closeEnough = distanceFrom(closest, centerPoint) < (32 / scale)
            
            if (closeEnough) {
                tiles[[x,y]] = [x,y]
                tileQueue.push([x, y, 3, false])
                tileQueue.push([x, y, 3, true])
            } else {
                tileQueue.push([x, y, 0, false])
                tileQueue.push([x, y, 0, true])
            }
        }
    }
    
    const addSand = (x,y) => {
        tileQueue.push([x, y, 2, false])
        tileQueue.push([x, y, 2, true])
        tiles[[x,y]] = [x,y]
    }
    const addWater = (x,y) => {
        tileQueue.push([x, y, 1, false])
        tileQueue.push([x, y, 1, true])
        tiles[[x,y]] = [x,y]
    }

    applyOutline(addSand, tiles)
    applyOutline(addSand, tiles)
    applyOutline(addWater, tiles)
    applyOutline(addWater, tiles)
}

async function generateDune() {
    await resetCanvas()
    const app = globalThis.__PIXI_APP__
    const scale = app.stage.scale.x
    const w = app.canvas.width / (scale * 8)
    const h = app.canvas.height / (scale * 8)

    let points = []
    let chunks = {}

    for (let i = 0; i < 40; i++) {
        let x = Math.random() * w
        let y = Math.random() * h

        points.push([x,y])
        chunks[[x,y]] = [2,2,4,4,5][randi() % 5]
    }

    let tiles = {}
    for (let y = 0; y < h; y += 1) {
        for (let x = 0; x < w; x += 1) {
            let closest = [-1,-1]
            let closestDist = w + h

            for (let point of points) {
                let dist = distanceFrom([x,y], point)
                if (dist < closestDist) {
                    closest = point
                    closestDist = dist
                } 
            }

            if (chunks[closest] == 5) {
                tiles[[x,y]] = [x,y]
            }

            tileQueue.push([x, y, chunks[closest], false])
            tileQueue.push([x, y, chunks[closest], true])
        }
    }

    const addSandstone = (x,y) => {
        if (randi() > 200) {
            tileQueue.push([x, y, 4, false])
            tileQueue.push([x, y, 4, true])
            tiles[[x,y]] = [x,y]
        }
    }

    applyOutline(addSandstone, tiles)
}