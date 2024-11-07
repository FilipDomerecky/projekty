class Vektor {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    pricti(vektor) {
        this.x += vektor.x;
        this.y += vektor.y;
    }

    odecti(vektor) {
        this.x -= vektor.x;
        this.y -= vektor.y;
    }

    vynasobCislem(cislo) {
        this.x *= cislo;
        this.y *= cislo;
    }

    velikost() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalizuj() {
        let velikost = this.velikost();
        if (velikost == 0) return;
        this.x /= velikost;
        this.y /= velikost;
    }

    skalarniSoucin(vektor) {
        return this.x * vektor.x + this.y * vektor.y;
    }

    odraz(vektor) {
        let soucin = this.skalarniSoucin(vektor);
        vektor.vynasobCislem(soucin * 2);
        this.odecti(vektor);
    }
}

class Obdelnik {
    constructor (pozice, velikost) {
        this.pozice = pozice;
        this.velikost = velikost;
        this.barva = "white";
        this.rychlost = new Vektor(0, 0);
        this.dolniHranice = new Vektor(-Infinity, -Infinity);
        this.horniHranice = new Vektor(Infinity, Infinity);
    }

    nastavDolniHranice(hranice) {
        this.dolniHranice = hranice;
    }

    nastavHorniHranice(hranice) {
        this.horniHranice = hranice;
    }

    kolizeSHranicemi() {
        if (this.pozice.x < this.dolniHranice.x) {
            this.pozice.x = this.dolniHranice.x;
            this.rychlost.x = Math.abs(this.rychlost.x);
        } else if (this.pozice.x + this.velikost.x > this.horniHranice.x) {
            this.pozice.x = this.horniHranice.x - this.velikost.x;
            this.rychlost.x = -Math.abs(this.rychlost.x);
        }

        if (this.pozice.y < this.dolniHranice.y) {
            this.pozice.y = this.dolniHranice.y;
            this.rychlost.y = Math.abs(this.rychlost.y);
        } else if (this.pozice.y + this.velikost.y > this.horniHranice.y) {
            this.pozice.y = this.horniHranice.y - this.velikost.y;
            this.rychlost.y = -Math.abs(this.rychlost.y);
        }
    }

    kolizeSObdelnikem(obdelnik) {
        if (this.pozice.x + this.velikost.x > obdelnik.pozice.x &&
            obdelnik.pozice.x + obdelnik.velikost.x > this.pozice.x &&
            this.pozice.y + this.velikost.y > obdelnik.pozice.y &&
            obdelnik.pozice.y + obdelnik.velikost.y > this.pozice.y ) {
            let levaHrana = this.pozice.x;
            let pravaHrana = this.pozice.x + this.velikost.x;
            let levaHranaObdelniku = obdelnik.pozice.x;
            let pravaHranaObdelniku = obdelnik.pozice.x + obdelnik.velikost.x;

            let horniHrana = this.pozice.y;
            let dolniHrana = this.pozice.y + this.velikost.y;
            let horniHranaObdelniku = obdelnik.pozice.y;
            let dolniHranaObdelniku = obdelnik.pozice.y + obdelnik.velikost.y;

            let dx1 = pravaHrana - levaHranaObdelniku;
            let dy1 = dolniHrana - horniHranaObdelniku;
            
            let dx2 = pravaHranaObdelniku - levaHrana;
            let dy2 = dolniHranaObdelniku - horniHrana;

            if (dx1 < dx2 && dx1 < dy1 && dx1 < dy2) {
                this.pozice.x -= dx1;
            } else if (dx2 <dy1 && dx2 < dy2) {
                this.pozice.x += dx2;
            } else if (dy1 < dy2) {
                this.pozice.y -= dy1;
            } else {
                this.pozice.y += dy2;
            }

            let kolizniVektor = new Vektor(0,0);

            if (this.rychlost.x < 0) {
                if (levaHrana < pravaHranaObdelniku && pravaHrana > pravaHranaObdelniku) {
                    kolizniVektor.pricti(new Vektor(1,0));
                }
            } else {
                 if (levaHrana < levaHranaObdelniku && pravaHrana > levaHranaObdelniku) {
                kolizniVektor.pricti(new Vektor(-1,0));
                }
            }

            if (this.rychlost.y > 0) {
                if (horniHrana < horniHranaObdelniku && dolniHrana > horniHranaObdelniku) {
                    kolizniVektor.pricti(new Vektor(0,-1));
                }
            } else {
                if (horniHrana < dolniHranaObdelniku && dolniHrana > dolniHranaObdelniku) {
                    kolizniVektor.pricti(new Vektor(0,1));
                }
            }

            kolizniVektor.normalizuj();
            this.rychlost.odraz(kolizniVektor);
            return true;
        } else {
            return false;
        }
        
    }

    nastavRychlost(rychlost) {
        this.rychlost = rychlost;
    }

    pohyb() {
        this.pozice.pricti(this.rychlost);
    }

    nastavBarvu(barva) {
        this.barva = barva;
    }

    nakresli() {
        fill(this.barva);
        rect(this.pozice.x, this.pozice.y, this.velikost.x, this.velikost.y);
    }
}