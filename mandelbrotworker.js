function isBounded(c) {
    let seen = new Set()
    let counter = 0
    let z = [0,0]

    while (counter < 128) {

        let x = z[0]
        let y = z[1]
        let newX = (x ** 2) - (y ** 2) + c[0]
        let newY = (2 * x * y) + c[1]
        let w = [newX, newY]
        let identifer = `${w[0]},${w[1]}`

        if (seen.has(identifer)) {
            return true
        }
        if (isNaN(x) || isNaN(y)) {
            return false
        }
        if (x > 2 || y > 2) {
            return false
        }
        
        z = w
        counter += 1
        seen.add(identifer)
    }
    return false
}

onmessage = (e) => {
    console.log(e)
}