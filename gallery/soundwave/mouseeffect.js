let seed = 96

function hover() {
    const radius = 160
    const radiussquared = radius ** 2
    for (let i = -radius; i < radius; i += 1) {
        let y = Math.sqrt(radiussquared - i ** 2)
        let sinwave = seed * Math.sin(offset + (i) * 1000)
        ctx.fillRect(pixellate(cursorX + i), pixellate(sinwave + cursorY + y), pixel, pixel)
        ctx.fillRect(pixellate(cursorX + i), pixellate(sinwave + cursorY - y), pixel, pixel)
        ctx.fillRect(pixellate(sinwave + cursorX + y), pixellate(cursorY + i), pixel, pixel)
        ctx.fillRect(pixellate(sinwave + cursorX - y), pixellate(cursorY + i), pixel, pixel)
    }
    
    requestAnimationFrame(hover)
}

hover()