const canvas = document.getElementById("main")
const ctx = canvas.getContext("2d")
const previewCanvas = document.getElementById("preview")
const preview = previewCanvas.getContext("2d")

const scale = 32
const pi = Math.PI
const twopi = 2 * pi
const color = document.getElementById("color")
let randomMode = false
let fractalMode = false

function reduceColor(hex, factor = 0.8) {
    hex = hex.replace(/^#/, '')
    let r = parseInt(hex.substring(0, 2), 16)
    let g = parseInt(hex.substring(2, 4), 16)
    let b = parseInt(hex.substring(4, 6), 16)
    r = Math.floor(r * factor)
    g = Math.floor(g * factor)
    b = Math.floor(b * factor)
    const toHex = (c) => c.toString(16).padStart(2, '0')
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

class Polygon {
	constructor(n = 3, x = 0, y = 0, c = color.value, parent = null, iterations = 0) {
		if (randomMode) {
			n = 3 + Math.floor(Math.random() * 100) % 6
		}
		
		this.n = n
		this.x = x
		this.y = y
		this.color = c
		this.parent = parent
		this.sides = []
		if (fractalMode && n > 3) {
			for (let i = 2; i < n; i++) {
				this.sides.push(null)
			}
			this.sides.push(new Polygon(n - 1, 0, 0, reduceColor(c), this, iterations + 1))
		}
		else {
			for (let i = 0; i < n; i++) {
				this.sides.push(null)
			}
		}
	}
}

class Side {
	constructor(x, y, path = []) {
		this.x = x
		this.y = y
		this.path = path
	}
	dist(x, y) {
		return Math.sqrt(
			(x - this.x) ** 2 +
			(y - this.y) ** 2
		)
	}
}

canvas.width = window.innerWidth
canvas.height = window.innerHeight
previewCanvas.width = window.innerWidth
previewCanvas.height = window.innerHeight

function getApothem(n) {
	const angle = Math.PI / n
	return scale / (2 * Math.tan(angle))
}

function getRadius(n) {
	const angle = Math.PI / n
	return scale / (2 * Math.sin(angle))
}

function getAngle(n, i, rot) {
	return (
		pi/2 +
		rot +
		i * (twopi / n)
	)
}

function drawPolygon(ctx, n, x, y, rot = 0) {
	const r = getRadius(n)
	const angle = (i) => getAngle(n, i, rot)
	
	const drawLine = (i) => {
		ctx.lineTo(
			x + r * Math.cos(angle(i)),
			y + r * Math.sin(angle(i)),
		)
	}
	const highlight = (i) => {
		ctx.fillRect(
			x + r * Math.cos(angle(i)),
			y + r * Math.sin(angle(i)),
			4,
			4,
		)
	}
	
	ctx.beginPath()
	for (let i = 0; i < n; i++) {
		drawLine(i - 0.5)
	}
	ctx.closePath()
	ctx.fill()
}

function buildPolygon(struct, ctx, x = struct.x, y = struct.y, rot = 0) {
	const n = struct.n
	const angle = (i) => getAngle(n, i, rot)
	
	ctx.fillStyle = struct.color
	drawPolygon(ctx, n, x, y, rot)
	
	for (let i = 0; i < n; i++) {
		const sideData = struct.sides[i]
		if (sideData != null) {
			let dist = getApothem(n) + getApothem(sideData.n) 
			let newX = x + dist * Math.cos(angle(i))
			let newY = y + dist * Math.sin(angle(i))
			buildPolygon(sideData, ctx, newX, newY, pi + rot + (i*twopi/n))
		}
	}
}

function fetchSides(struct, x = struct.x, y = struct.y, rot = 0, path = []) {
	let sides = []
	const n = struct.n
	const angle = (i) => getAngle(n, i, rot)
	
	for (let i = struct.parent ? 1 : 0; i < n; i++) {
		const sideData = struct.sides[i]
		
		if (sideData != null) {
			let dist = getApothem(n) + getApothem(sideData.n)
			let newX = x + dist * Math.cos(angle(i))
			let newY = y + dist * Math.sin(angle(i))
			sides = [...sides, ...fetchSides(sideData, newX, newY, pi + rot + (i*twopi/n), [...path, i])]
		} else {
			let dist = getApothem(n) + getApothem(3)
			let newX = x + dist * Math.cos(angle(i))
			let newY = y + dist * Math.sin(angle(i))
			sides.push(new Side(newX, newY, [...path, i]))
		}
	}
	
	return sides
}

let struct = null

function reformPolygon(polygon, path) {
	const first = path[0]
	if (path.length == 1) {
		polygon.sides[first] = new Polygon(selectedShape, 0, 0, color.value, polygon)
		return polygon
	}
	else {
		path.shift()
		polygon.sides[first] = reformPolygon(polygon.sides[first], path)
		return polygon
	}
}

function showPreview(e) {
	preview.clearRect(0, 0, canvas.width, canvas.height)
	const x = e.offsetX
	const y = e.offsetY
	
	if (struct == null) {
		buildPolygon(new Polygon(selectedShape, x, y), preview)
	}
	else {
		const sides = fetchSides(struct)
		
		let min = sides[0]
		for (let side of sides) {
			if (side.dist(x, y) < min.dist(x, y)) {
				min = side
			}
		}
		
		let structcopy = structuredClone(struct)
		buildPolygon(reformPolygon(structcopy, min.path), preview)
	}
}

function clickCanvas(e) {
	ctx.clearRect(0,0,canvas.width, canvas.height)
	const x = e.offsetX
	const y = e.offsetY
	
	if (struct == null) {
		struct = new Polygon(selectedShape, x, y)
	}
	else {
		const sides = fetchSides(struct)
		
		let min = sides[0]
		for (let side of sides) {
			if (side.dist(x, y) < min.dist(x, y)) {
				min = side
			}
		}
		
		struct = reformPolygon(struct, min.path)
	}
	buildPolygon(struct, ctx)
	showPreview(e)
}

document.addEventListener("mousemove", showPreview)

document.addEventListener("mousedown", (e) => {
	if (e.target.nodeName == "CANVAS") {
		clickCanvas(e)
	}
})


