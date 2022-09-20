import kaboom from "kaboom"
const addObs = require('./obstacle')

let score = 0;

kaboom({
    background: [255, 255, 255],
})

loadSpriteAtlas('./sprites/dino.png', {
    "Dino": {
        x: 0,
        y: 0,
        width: 528,
        height: 94,
        sliceX: 6,
        anims: {
            idle: { from: 0, to: 0 },
            run: { from: 1, to: 3, loop: true, speed: 20 },
            dead: { from: 4, to: 5 }
        }
    }
})

loadSpriteAtlas('./sprites/obstacle.png', {
    "obstacle": {
        x: 0,
        y: 0,
        width: 300,
        height: 100,
        sliceX: 6,
        anims: {
            a: { from: 0, to: 0 },
            b: { from: 1, to: 1 },
            c: { from: 2, to: 2 },
            d: { from: 3, to: 3 },
            e: { from: 4, to: 4 },
        },
    }
})

scene("gameover", () => {
    add([
        text("Game Over\n" + "Score:" + score)
    ])

    keyPress("space", () => {
        go("game")
    })
})

scene("game", () => {
    score = 0

    const score_text = add([
        text(score)
    ])

    const dino = add([
        pos(100, 100),
        sprite("Dino", { anim: "run" }),
        area(),
        body()
    ])

    add([
        pos(0, height() / 2),
        rect(width(), height()),
        outline(2),
        area(),
        solid()
    ])

    keyPress('space', () => {
        dino.jump(800)
    })

    action("Object", (Object) => {
        Object.move(-400, 0)

        if (Object.passed === false && Object.pos.x < dino.pos.x) {
            Object.passed = true
            score += 1
            score_text.text = score
        }
    })

    dino.collides("Object", () => {
        go("gameover")
    })

    addObs()
})

go("game")