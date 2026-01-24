const terrainLayer = new PIXI.RenderLayer()
const entityLayer = new PIXI.RenderLayer()
const app = new PIXI.Application
app.stage.addChild(terrainLayer)
app.stage.addChild(entityLayer)

let character
const TILE = 64
const COLOR = {
	3 : "#FC8C00",
	4 : "#0F82F1",
	5 : "#21AA25",
	6 : "#CD0D65",
	7 : "#009EA5",
	8 : "#6C3BBF",

}
const triangle = {
	sides: [
		null,null,null
	]
}
const square = {
	sides: [
		null,null,null,null
	]
}
const pentagon = {
	sides: [
		null,null,null,null,null
	]
}
const hexagon = {
	sides: [
		null,null,null,null,null,null
	]
}
const body = {
	sides : [
		hexagon, null, null, null
	]
}

async function init() {
    await app.init({
        background : "#eee",
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        width:  window.innerWidth,
        height: window.innerHeight,
    })
    
    character = drawBody(body)
    character.x = 500
    character.y = 500
    app.stage.addChild(character)
    entityLayer.attach(character)
    
    document.body.appendChild(app.canvas)
}

function getApothem(n) {
	const angle = Math.PI / n
	return TILE / (2 * Math.tan(angle))
}

function getRadius(n) {
	const angle = Math.PI / n
	return TILE / (2 * Math.sin(angle))
}

function drawBody(body) {
	let n = body.sides.length
	let core = drawPolygon(n)
	let rotation = 0
	let step = 2 * Math.PI / n
	
	for (let side of body.sides) {
		rotation += step
		if (side) {
			let avgangle = (rotation - step + rotation) / 2
			let component = drawBody(side)
			let dist = getApothem(n) + getApothem(side.sides.length)
			
			component.rotation += avgangle
			component.x = dist * Math.cos(avgangle)
			component.y = dist * Math.sin(avgangle)
			core.addChild(component)
		}
	}
	return core
}

function drawPolygon(n) {
	let shape = new PIXI.Graphics()
	let angle = 2 * Math.PI / n
	let radius = getRadius(n)
	console.log(radius, n)
	
	for (i = 0; i < (n + 1); i++) {
		x = radius * Math.cos(i * angle)
		y = radius * Math.sin(i * angle)
		shape.lineTo(x, y)
	}
	shape.closePath()
	shape.fill(COLOR[n])
	shape.anchor = radius
	shape.rotation = n % 2 == 0 ? Math.PI/4 : Math.PI/2
	return shape
}

init()
