function addObs(score) {
    loop(1.7, () => {
        add([
            pos(width(), 210),
            sprite("obstacle", { anim: "a" }),
            area(),
            body(),
            "Object",
            { passed: false }
        ])
    })
}

module.exports = addObs