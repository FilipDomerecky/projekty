let canvasWidth = 900;
let canvasHeight = 700;

let score = 0;

let pozice = new Vektor(0, canvasHeight / 5 * 4);
let velikost = new Vektor(canvasWidth / 10, canvasHeight / 20);
let podlozka = new Obdelnik(pozice, velikost);
podlozka.nastavBarvu("purple");
podlozka.nastavDolniHranice(new Vektor(0,0));
podlozka.nastavHorniHranice(new Vektor(canvasWidth, canvasHeight));

let mic = new Obdelnik(new Vektor(canvasWidth / 2, canvasHeight / 2), new Vektor(20,20));
mic.nastavBarvu("blue");
mic.nastavDolniHranice(new Vektor(0,0));
mic.nastavHorniHranice(new Vektor(canvasWidth, canvasHeight));
mic.nastavRychlost(new Vektor(3, -2));

let barvy = ["#ff4d4d", "#ff9900", "#669900"];
let bloky = new Array (30);
for (var i = 0; i < bloky.length; i++) {
    let velikostObdelniku = new Vektor(canvasWidth / 6, canvasHeight / 30);
    let poziceObdelniku = new Vektor((i % 5) * velikostObdelniku.x * 1.2, Math.floor(i / 5) * velikostObdelniku.y * 1.2);
    let obdelnik = new Obdelnik(poziceObdelniku, velikostObdelniku);
    obdelnik.nastavBarvu(barvy[barvy.length - 1]);
    bloky[i] = {obdelnik: obdelnik, zivoty: barvy.length};
}

function draw() {
    background(0);
    vyhodnotVstup();
    nakresliObjekty();
    pohybObjektu();
    kolizeSHranicemi();
    mic.kolizeSObdelnikem(podlozka)
    fill("#ff4d4d")
    textSize(35);
    text(score,400,canvasHeight - 10)
}

function nakresliObjekty() {
    podlozka.nakresli();
    mic.nakresli();
    for (var i = 0; i < bloky.length; i++) {
        let blok = bloky[i];
        if (blok.zivoty > 0) {
            blok.obdelnik.nakresli();
        }
    }
}

function pohybObjektu() {
    podlozka.pohyb();
    mic.pohyb();
}

function kolizeSHranicemi() {
    podlozka.kolizeSHranicemi();
    mic.kolizeSHranicemi();
    for (var i = 0; i < bloky.length; i++) {
        let blok = bloky[i];
        if (blok.zivoty > 0) {
            if (mic.kolizeSObdelnikem(blok.obdelnik)) {
                blok.zivoty--;
                score += 1;
                if (blok.zivoty > 0) {
                    blok.obdelnik.nastavBarvu(barvy[blok.zivoty - 1]);
                }
            }
        }  
    }
}

function vyhodnotVstup() {
    if (isKeyPressed("a")) {
        podlozka.nastavRychlost(new Vektor(-7, 0));
    } else if (isKeyPressed("d")) {
        podlozka.nastavRychlost(new Vektor(7,0));
    } else {
        podlozka.nastavRychlost(new Vektor(0,0));
    }
}