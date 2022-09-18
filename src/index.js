import kaboom from "kaboom"
const addObs = require('./obstacle')

kaboom({
    background: [60, 60, 60],
})

scene("gameover", () => {
    add([
        text("Game Over")
    ])

    keyPress("space", () => {
        go("game")
    })
})

scene("game", () => {

    const dino = add([
        pos(100, 100),
        rect(70, 70),
        color(0, 0, 255),
        area(),
        body()
    ])

    add([
        pos(0, height() / 2),
        rect(width(), height()),
        area(),
        solid()
    ])

    keyPress('space', () => {
        if (dino.pos.y > 250) {
            dino.jump(800)
        }
    })

    action("Object", (Object) => {
        Object.move(-200, 0)
    })

    dino.collides("Object", () => {
        go("gameover")
    })

    addObs()
})

go("game")