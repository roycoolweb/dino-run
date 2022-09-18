function addObs() {
    loop(1.7, () => {
        add([
            pos(500, 100),
            rect(20, 70),
            color(255, 0, 0),
            area(),
            body(),
            "Object"
        ])
    })
}

module.exports = addObs