const Application = PIXI.Application
const Texture = PIXI.Texture
const Assets = PIXI.Assets

const app = new Application
globalThis.__PIXI_APP__ = app

const tileSize = 8
let tileSheet
let tiles = []
let tileQueue = []

let tileVariations = [
    4,
    4,
    3,
    7,
    8,
    6, 
    6,
    7,
]

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

function codify(tileInt, variation = rand(5) % tileVariations[tileInt]) {
    let code = force2Digits(tileInt)
    return code + "_" + force2Digits(variation)
}

function checkAdjacentTiles(x, y) {
    const tile = tiles[y][x]

    if (tiles[y][x - 1] == tile) {
        return false
    }
    if (tiles[y - 1][x] == tile) {
        return false
    }
    if (tiles[y][x + 1] == tile) {
        return false
    }
    if (tiles[y + 1][x] == tile) {
        return false
    }

    return true
}

async function renderTiles() {
    const tileSheet = await Assets.load("tiles")
    const tilesContainer = new PIXI.ParticleContainer()

    function addTile(y, x, tile) {
        const tileCode = codify(tile)

        if (checkAdjacentTiles(x/8, y/8)) {
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
            tilesContainer.addParticle(blend1)
            tilesContainer.addParticle(blend2)
        }

        const tileParticle = new PIXI.Particle({
            texture: tileSheet.textures[tileCode],
            x,
            y,
        })
        tilesContainer.addParticle(tileParticle)
    }

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
                addTile(y, x, tiles[indexY][indexX])
                tiles[indexY][indexX] = undefined
            } else {
                tiles[indexY][indexX] = undefined
            }
        }
    }
    app.stage.addChild(tilesContainer)
}

async function init() {
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
    
    app.stage.scale = 6
    app.ticker.add(renderTiles)
}

init()


let dragging = false
document.addEventListener("mousedown", () => {
    dragging = true
})
document.addEventListener("mouseup", () => {
    dragging = false
})
document.addEventListener("mousemove", (e) => {
    let x = Math.floor(e.x / 48)
    let y = Math.floor(e.y / 48)

    if (dragging && (tiles[y][x] != selectedTile)) {
        if (e.target.nodeName == "CANVAS") {
            tileQueue.push([x,y,selectedTile])
        }
    }
})
