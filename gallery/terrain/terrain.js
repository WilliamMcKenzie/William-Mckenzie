const Application = PIXI.Application
const Texture = PIXI.Texture
const Assets = PIXI.Assets

let app = new Application
app.stage.scale = 6
globalThis.__PIXI_APP__ = app

const tileSize = 8
let tileSheet
let tiles = []
let tileQueue = []
let tileVariations = [
    10,
    6,
    3,
    13,
    8,
    6, 
    6,
    7,
]

let dragging = false
let lookupTable = []

for (var i = 0; i < 100000; i++) {
  lookupTable.push(Math.random() * 101|0)
}
function rand() {
    return lookupTable[--i % 100000]
}


function pixellate(x) {
    return Math.floor(x / 64)
}

function force2Digits(n) {
    let str = n.toString()
    return str.padStart(2, "0")
}

function codify(tileInt, variation = rand() % tileVariations[tileInt]) {
    let code = force2Digits(tileInt)
    return code + "_" + force2Digits(variation)
}

async function renderTiles() {
    if (tileQueue.length == 0) {
        return
    }

    const tileSheet = await Assets.load("tiles")
    const tilesContainer = new PIXI.ParticleContainer({
        dynamicProperties: {
            position: false,
            vertex: false,
            rotation: false,
            color: false,
        }
    })

    function addTile(x, y, tile) {
        const tileCode = codify(tile)
        
        const blend1 = new PIXI.Particle({
            texture: tileSheet.textures[codify(tile, 0)],
            x : x - 2,
            y : y - 2,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0.2,
        })
        const blend2 = new PIXI.Particle({
            texture: tileSheet.textures[codify(tile, 0)],
            x : x - 1,
            y : y - 1,
            scaleX: 1.25,
            scaleY: 1.25,
            alpha: 0.3,
        })
        const tileParticle = new PIXI.Particle({
            texture: tileSheet.textures[tileCode],
            x,
            y,
        })

        tilesContainer.addParticle(blend1)
        tilesContainer.addParticle(blend2)
        tilesContainer.addParticle(tileParticle)
        tiles[y/8][x/8] = [tile, blend1, blend2, tileParticle, tilesContainer]
    }

    for (let tile of tileQueue) {
        let x = tile[0]
        let y = tile[1]
        let which = tile[2]
        let add = tile[3]

        if (add && tiles[y]) {
            addTile(x * 8, y * 8, which)
        }
        else if (tiles[y] && tiles[y][x] != undefined) {
            let container = tiles[y][x][4]
            container.removeParticle(tiles[y][x][1], tiles[y][x][2], tiles[y][x][3])
            tiles[y][x] = undefined
        }
    }
    
    tileQueue = []
    app.stage.addChild(tilesContainer)
}

async function init(scale) {
    await app.init(
    {
        background : "#1f1f1f",
        width:  window.innerWidth,
        height: window.innerHeight,
    })
    document.body.appendChild(app.canvas)

    let tileSheet = await Assets.load("/gallery/terrain/assets/tiles.png")
    tileSheet.source.scaleMode = "nearest"
    Assets.add({
        alias: 'tiles',
        src: '/gallery/terrain/assets/tiles.json',
        data: { texture: tileSheet }
    })
    
    app.stage.scale = scale
    app.ticker.add(renderTiles)
}

async function resetCanvas() {
    let scale = 6
    if (app != undefined) {
        scale = app.stage.scale.x
        app.stage.destroy({
            children: true
        })
        app.stage = new PIXI.Container
    }
    dragging = false
    tiles = []
    await init(scale)
    resizeCanvas()
}

async function resizeCanvas() {
    const w = app.canvas.width
    const h = app.canvas.height

    for (let y = 0; y < h; y += 8) {
        const indexY = y/8
        const row = tiles[indexY]

        if (row == undefined) {
            tiles[indexY] = []
        }
        
        for (let x = 0; x < w; x += 8) {
            const indexX = x/8

            if (tiles[indexY][indexX] != undefined) {
                continue
            }
            else {
                tiles[indexY][indexX] = undefined
            }
        }
    }
}

resetCanvas()








window.addEventListener('resize', resetCanvas)
document.addEventListener("mousedown", (e) => {
    dragging = true
})
document.addEventListener("mouseup", (e) => {
    dragging = false

    let scale = (app.stage.scale.x * 8)
    let x = Math.floor(e.x / scale)
    let y = Math.floor(e.y / scale)

    if (e.target.nodeName == "CANVAS") {
        let tile = tiles[y][x]

        if (tile != undefined) {
            tileQueue.push([x, y, selectedTile, false])
        }
        tileQueue.push([x, y, selectedTile, true])
    }
})
document.addEventListener("mousemove", (e) => {
    let scale = (app.stage.scale.x * 8)
    let x = Math.floor(e.x / scale)
    let y = Math.floor(e.y / scale)

    if (dragging && (e.target.nodeName == "CANVAS")) {
        let tile = tiles[y][x]

        if (tile != undefined) {
            tileQueue.push([x, y, selectedTile, false])
        }
        tileQueue.push([x, y, selectedTile, true])
    }
})

document.addEventListener('keydown', function(event) {
    const key = event.key
    let scale = app.stage.scale.x

    if (key === '+' || key === '=' || key === 'Add' || (event.shiftKey && key === '=')) {
        app.stage.scale = Math.max(1, scale + 1)
    }
    else if (key === '-' || key === 'Subtract' || key === '_') {
        app.stage.scale = Math.max(1, scale - 1)
    }
})