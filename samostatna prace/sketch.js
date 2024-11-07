let canvasWidth = 600;
let canvasHeight = 600;

let poziceHrace = [0, canvasHeight / 9 * 7];
let velikostHrace = [canvasWidth / 7, canvasWidth / 10]
let rychlostHrace = 3;

let poziceProjektiluHrace = [0, -1000];
let velikostProjektilu = [canvasWidth / 40, canvasHeight / 20]
let rychlostProjektilu = 7;

let velikostNepratel = [canvasWidth / 20, canvasHeight / 20];
let poziceNepratel = new Array(30);
let rychlostNepratel = 0.3;

let poziceProjektiluNepritele= [0, canvasHeight + 1000];

let playerscore = 0;
let playerskin = getImage("lod.png");
let nepritelskin = getImage("nepritel.png")

for (var i = 0; i < poziceNepratel.length; i++) {
    poziceNepratel[i] = [(i % 10) * (velikostNepratel[0] * 1.7),
        Math.floor(i / 10) * (velikostNepratel[1] *1.7)];
}

function nakresliNepratele() {
    for (var i = 0; i < poziceNepratel.length; i++) {
        image(nepritelskin, poziceNepratel[i][0], poziceNepratel[i][1], velikostNepratel[0], velikostNepratel[1])
    }
}

function vykresliProjektilHrace() {
    if (poziceProjektiluHrace[1] > - velikostProjektilu[1]) {
    fill("green")
    rect(poziceProjektiluHrace[0], poziceProjektiluHrace[1], velikostProjektilu[0], velikostProjektilu[1]);
    }
}

function nakresliHrace() {
    //fill("#FF0000")
    //rect(poziceHrace[0], poziceHrace[1], velikostHrace[0], velikostHrace[1]);
    image(playerskin, poziceHrace[0], poziceHrace[1], velikostHrace[0], velikostHrace[1])
}

function pohybHrace() {
    if (isKeyPressed("a")) {
        poziceHrace[0] -= rychlostHrace;
    }
    if (isKeyPressed("d")) {
        poziceHrace[0] += rychlostHrace;
    }
}

function pohybProjektiluHrace() {
    poziceProjektiluHrace[1] -= rychlostProjektilu;
}

function vystrelProjektilHrace() {
    if (isKeyPressed(" ") && poziceProjektiluHrace[1] < -velikostProjektilu[1]) {
        poziceProjektiluHrace[0] = poziceHrace[0] + (velikostHrace[0] - velikostProjektilu[0]) /2;
        poziceProjektiluHrace[1] = poziceHrace[1];
    }
}

function pohybNepratel() {
    let zmenaSmeru = false;
    for (var i = 0; i < poziceNepratel.length; i++) {
        poziceNepratel[i][0] += rychlostNepratel;
        if (poziceNepratel[i][0] < 0 || poziceNepratel[i][0] + velikostNepratel[0] > canvasWidth) {
            zmenaSmeru = true;
        }
    }
    if (zmenaSmeru == true) {
        for (var i = 0; i < poziceNepratel.length; i++) {
            poziceNepratel[i][1] += velikostNepratel[1];
        }
        rychlostNepratel *= -1.1;
    }
}

function kolizeObdelniku(pozice1, velikost1, pozice2, velikost2) {
    return pozice1[0] + velikost1[0] > pozice2[0] &&
        pozice2[0] + velikost2[0] > pozice1[0] &&
        pozice1[1] + velikost1[1] > pozice2[1] &&
        pozice2[1] + velikost2[1] > pozice1[1];
}

function odstranNepritele(index) {
    poziceNepratel.splice(index, 1);
}

function restart() {
    poziceHrace = [0, canvasHeight / 9 * 7];
    poziceProjektiluHrace = [0, -1000];
    rychlostNepratel = 0.3;
    poziceNepratel = new Array(30);
    for (let i = 0; i < poziceNepratel.length; i++) {
        poziceNepratel[i] = [(i % 10) * velikostNepratel[0] * 1.7, Math.floor(i / 10) * velikostNepratel[1] * 1.2];
    }
    playerscore = 0;
}

function kolizeProjektiluANepratel() {
    for (var i = 0; i < poziceNepratel.length; i++) {
        if (kolizeObdelniku(poziceNepratel[i], velikostNepratel, poziceProjektiluHrace, velikostProjektilu)) {
            odstranNepritele(i);
            poziceProjektiluHrace = [0, -1000];
            if (poziceNepratel === 0) {
                restart();
            }
            playerscore += 1
        }
    }
}

function nakresliProjektilNepritele() {
    rect(poziceProjektiluNepritele[0], poziceProjektiluNepritele[1], velikostProjektilu[0], velikostProjektilu[1])
}

function pohybProjektiluNepratel() {
    if (poziceProjektiluNepritele[1] < canvasHeight) {
        poziceProjektiluNepritele[1] += rychlostProjektilu;
    }
}

function vystrelProjektilNepritele() {
    if (poziceProjektiluNepritele[1] > canvasHeight ) {
        let index = Math.floor(random(0, poziceNepratel.length));
        poziceProjektiluNepritele[0] = poziceNepratel[index][0] + velikostNepratel[0] / 2 - velikostProjektilu[0] / 2
        poziceProjektiluNepritele[1] = poziceNepratel[index][1]
    }
}

function kolizeProjektiluAHrace() {
    if (kolizeObdelniku(poziceHrace, velikostHrace, poziceProjektiluNepritele, velikostProjektilu)) {
        restart();
    }
}

function draw () {
    background(255);
    vykresliProjektilHrace();
    nakresliHrace();
    pohybHrace();
    pohybNepratel();
    vystrelProjektilHrace();
    pohybProjektiluHrace();
    kolizeProjektiluANepratel();
    nakresliNepratele();
    nakresliProjektilNepritele();
    pohybProjektiluNepratel();
    vystrelProjektilNepritele();
    kolizeProjektiluAHrace();
    textSize(35);
    text(playerscore,320,canvasHeight)
    if (poziceHrace[0] > canvasWidth - canvasWidth / 7) {
        poziceHrace[0] -= rychlostHrace;
    }
    if (poziceHrace[0] < 0) {
        poziceHrace[0] += rychlostHrace;
    }
} 