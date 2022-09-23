import kaboom from "kaboom"
import { connect } from "@tableland/sdk"
import UAuth from '@uauth/js'

const addObs = require('./obstacle')

const uauth = new UAuth({
    clientID: "",
    redirectUri: "http://localhost:1234",
})

let domain_sub = '';
let wallet_address = '';
let score = 0;
let table_name = "";

window.login = async () => {
    try {
        const authorization = await uauth.loginWithPopup()
        console.log(authorization)

        const header = document.getElementById("name")
        header.innerText = authorization.idToken.sub
        domain_sub = authorization.idToken.sub
        wallet_address = authorization.wallet_address
        
        const login = document.getElementById("login")
        login.className = "none"
        go("game")
    } catch (error) {
        console.error(error)
    }
}

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

    addObs(score)
})

window.addScore = async () => {
    const tableland = connect({ network: "testnet", chain: "polygon-mumbai" })
    await tableland.siwe()

    const name = await tableland.list()

    if (name.length) {
        table_name = name[0].name
    } else {
        const { name } = await tableland.create(
            `id integer primary key, score text`,
        )
        table_name = name
    }
    
    const writeRes = await tableland.write(`INSERT INTO ${table_name} (id, score) VALUES (0, '${score}');`)
    console.log(writeRes)
}

function currentUser() {
    uauth
      .user()
      .then(user => {
        if(user){
            const header = document.getElementById("name")
            header.innerText = user.sub
            domain_sub = user.sub
            wallet_address = user.wallet_address
            
            const login = document.getElementById("login")
            login.className = "none"
            go("game")
        }
        console.log(user)
      })
}

function mintNFT() {
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: ''},
        body: '{"chain":"polygon","name":${domain_sub},"description":"Got ${score} scores","file_url":"Add your file URL here","mint_to_address":${wallet_address}}'
      };
      
      fetch('https://api.nftport.xyz/v0/mints/easy/urls', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}

currentUser()