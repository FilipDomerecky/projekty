class Queue {
    constructor() {
      this.items = {};
      this.headIndex = 0;
      this.tailIndex = 0;
    }
    
    enqueue(item) {
      this.items[this.tailIndex] = item;
      this.tailIndex++;
    }
    
    dequeue() {
      const item = this.items[this.headIndex];
      delete this.items[this.headIndex];
      this.headIndex++;
      return item;
    }

    peek() {
      return this.items[this.headIndex];
    }

    get length() {
      return this.tailIndex - this.headIndex;
    }

}

class SketchPart {
    
    constructor(drawFunction, data) {
        this.drawFunction = drawFunction;
        this.data = data;
    }
}

class Sketch {
    #canvas;
    #context;
    #frameRate = 60;
    #interval;
    #fill;
    #stroke;
    #caching = true;
    #cachedSketchParts = new Queue();
    #PI2 = Math.PI * 2;
    #font = "serif";
    #fontSize = 17;
    #pressedKeys = [];
    
    constructor() {
        this.instance = this;
    }

    get sketchCanvas() {
        return this.#canvas;
    }

    get sketchContext() {
        return this.#context;
    }

    /**
     * @param {number} fps
     */
    set framesPerSecond(fps) {
        this.#frameRate = fps;
    }

    get height() {
        return this.#canvas.height;
    }

    get width() {
        return this.#canvas.width;
    }

    fill(data) {
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.fill, data));
        } else {
            this.#fill = true;
            this.#context.fillStyle = data.color;
        }
    }

    strokeColor(data) {
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.strokeColor, data));
        } else {
            this.#stroke = true;
            this.#context.strokeStyle = data.color;
        }
    }

    strokeWeight(data) {
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.strokeWeight, data));
        } else {
            this.#context.lineWidth = data.weight;
        }
    }

    noStroke() {
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.noStroke));
        } else {
            this.#stroke = false;
        }
    }

    noFill() {
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.noFill));
        } else {
            this.#fill = false;
        }
    }

    textSize(data) {
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.textSize, data));
        } else {
            this.#fontSize = data.size;
            this.#context.font = this.#fontSize + "px " + this.#font;
        }
    }

    font(data) {
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.font, data));
        } else {
            this.#font = data.font;
            this.#context.font = this.#fontSize + "px " + this.#font;
        }
    }

    setMousePosition(event) {
        let r = sketch.sketchCanvas.getBoundingClientRect();
        mouseX = event.clientX - r.left;
        mouseY = event.clientY - r.top;
        if (typeof mouseMoved === "function") {
            mouseMoved();
        }
    }

    mouseDown(event) {
        mouseIsPressed = true;
        if (typeof mouseClicked === "function") {
            mouseClicked();
        }
    }

    mouseUp(event) {
        mouseIsPressed = false;
    }

    createCanvas(width, height) {
        if (this.#canvas != undefined) return;
        if (width == undefined) {
            if (typeof canvasWidth != "undefined") width = canvasWidth;
            else width = 700;

            if (typeof canvasHeight != "undefined") height = canvasHeight;
            else height = 700;
        }
        clearInterval(this.#interval);
        let c = document.createElement("canvas");
        c.id = "canvas";
        c.onmousemove = this.setMousePosition;
        c.onmousedown = this.mouseDown;
        c.onmouseup = this.mouseUp;
        document.onkeydown = this.keyDown.bind(this);
        document.onkeyup = this.keyUp.bind(this);
        c.width = width;
        c.height = height;
        document.body.appendChild(c);
        this.#canvas = c;
        this.#context = c.getContext("2d");
        this.#context.fillStyle = "white";
        this.#context.font = this.#fontSize + "px " + this.#font;
        this.#context.lineCap = 'round';
        this.#stroke = true;
        this.#fill = true;
        this.#interval = setInterval(this.drawSketch.bind(this), 1000 / this.#frameRate);
    }

    keyDown(event) {
        this.#pressedKeys[event.key] = true;
        if (typeof onKeyDown === 'function') onKeyDown(event);
    }

    keyUp(event) {
        this.#pressedKeys[event.key] = false;
        if (typeof onKeyUp === 'function') onKeyUp(event);
    }

    isKeyPressed(key) {
        return this.#pressedKeys[key];
    }

    drawSketch() {
        this.drawFrame();
    }

    drawFrame() {
        if (this.#caching) {
            this.#caching = false;
            this.drawCachedSketches();
        } else if (typeof draw === 'function') {
            draw();
        }
    }

    drawCachedSketches() {
        let cachedSketches = this.#cachedSketchParts;
        this.#cachedSketchParts = new Queue();
        while(cachedSketches.length > 0) {
            let sketchPart =  cachedSketches.dequeue();
            sketchPart.drawFunction.bind(this)(sketchPart.data);
        }
    }

    removeCanvas() {
        document.body.removeChild(this.#canvas);
        this.#canvas = undefined;
    }

    background(data) {
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.background, data));
        } else {
            let fillStyle = this.#context.fillStyle;
            this.#context.fillStyle = data.color;
            this.#context.fillRect(0, 0, this.width, this.height);
            this.#context.fillStyle = fillStyle;
        }
    }

    line(data) {
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.line, data));
        } else {
            this.#context.beginPath();
            this.#context.moveTo(data.startX, data.startY);
            this.#context.lineTo(data.endX, data.endY);
            if (this.#stroke) this.#context.stroke();
        }
    }

    ellipse(data) {
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.ellipse, data));
        } else {
            this.#context.beginPath();
            this.#context.ellipse(data.centerX, data.centerY, data.width / 2, data.height / 2, 0, 0, this.#PI2);
            if (this.#fill) this.#context.fill();
            if (this.#stroke) this.#context.stroke();
        }
    }

    roundedRect(data) {
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.roundedRect, data));
        } else {
            if (data.width < 2 * data.radius) data.radius = data.width / 2;
            if (data.height < 2 * data.radius) data.radius = data.height / 2;
            this.#context.beginPath();
            this.#context.moveTo(data.x + data.radius, data.y);
            this.#context.arcTo(data.x + data.width, data.y, data.x + data.width, data.y + data.height, data.radius);
            this.#context.arcTo(data.x + data.width, data.y + data.height, data.x, data.y + data.height, data.radius);
            this.#context.arcTo(data.x, data.y + data.height, data.x, data.y, data.radius);
            this.#context.arcTo(data.x, data.y, data.x + data.width, data.y, data.radius);
            this.#context.closePath();
            if (this.#fill) this.#context.fill();
            if (this.#stroke) this.#context.stroke();
        }
    }

    rect(data) {
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.rect, data));
        } else {
            this.#context.beginPath();
            this.#context.rect(data.x, data.y, data.width, data.height);
            if (this.#fill) this.#context.fill();
            if (this.#stroke) this.#context.stroke();
        }
    }

    image(data) {
        if (!data.img.complete) this.#caching = true;
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.image, data));
        } else {
            this.#context.drawImage(data.img, data.x, data.y);
        }
    }

    resizedImage(data) {
        if (!data.img.complete) this.#caching = true;
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.resizedImage, data));
        } else {
            this.#context.drawImage(data.img, data.x, data.y, data.width, data.height);
        }
    }

    resizedRotatedImage(data) {
        if (!data.img.complete) this.#caching = true;
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.resizedRotatedImage, data));
        } else {
            let w = data.width / 2;
            let h = data.height / 2;
            let x = w + data.x; 
            let y = h + data.y;
            this.#context.translate(x, y);
            this.#context.rotate(data.angle);
            this.#context.drawImage(data.img, -w, -h, data.width, data.height);
            this.#context.resetTransform();
        }
    }

    partOfImage(data) {
        if (!data.img.complete) this.#caching = true;
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.partOfImage, data));
        } else {
            this.#context.drawImage(data.img, data.sx, data.sy, data.sWidth, data.sHeight, data.dx, data.dy, data.dWidth, data.dHeight);
        }
    }

    text(data) {
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.text, data));
        } else {
            this.#context.textAlign = "start";
            this.#context.fillText(data.text, data.x, data.y);
        }
    }

    triangle(data) {
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.triangle, data));
        } else {
            this.#context.beginPath();
            this.#context.moveTo(data.x1, data.y1);
            this.#context.lineTo(data.x2, data.y2);
            this.#context.lineTo(data.x3, data.y3);
            this.#context.lineTo(data.x1, data.y1);
            this.#context.closePath();
            if (this.#fill) this.#context.fill();
            if (this.#stroke) this.#context.stroke();
        }
    }

    point(data) {
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.point, data));
        } else {
            this.#context.beginPath();
            this.#context.arc(data.x, data.y, 0, 0, this.#PI2);
            this.#context.stroke();
        }
    }

    bezier(data) {
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.bezier, data));
        } else {
            this.#context.beginPath();
            this.#context.moveTo(data.x, data.y);
            this.#context.bezierCurveTo(data.cx1, data.cy1, data.cx2, data.cy2, data.x2, data.y2);
            if (this.#fill) this.#context.fill();
            if (this.#stroke) this.#context.stroke();
        }
    }

    arc(data) {
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.arc, data));
        } else {
            let c = this.#PI2 / 360;
            this.#context.beginPath();
            this.#context.moveTo(data.x, data.y);
            this.#context.ellipse(data.x, data.y, data.w / 2, data.h / 2, 0, data.start * c, data.end * c);
            if (this.#fill) this.#context.fill();
            this.#context.beginPath();
            this.#context.ellipse(data.x, data.y, data.w / 2, data.h / 2, 0, data.start * c, data.end * c);
            if (this.#stroke) this.#context.stroke();
        }
    }

    quad(data) {
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.quad, data));
        } else {
            this.#context.beginPath();
            this.#context.moveTo(data.x1, data.y1);
            this.#context.lineTo(data.x2, data.y2);
            this.#context.lineTo(data.x3, data.y3);
            this.#context.lineTo(data.x4, data.y4);
            this.#context.lineTo(data.x1, data.y1);
            this.#context.closePath();
            if (this.#fill) this.#context.fill();
            if (this.#stroke) this.#context.stroke();
        }
    }

    rotate(data) {
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.rotate, data));
        } else {
            this.#context.rotate(data.angle);
        }
    }

    translate(data) {
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.translate, data));
        } else {
            this.#context.translate(data.x, data.y);
        }
    }

    resetTransform() {
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.resetTransform));
        } else {
            this.#context.resetTransform();
        }
    }

    rotatedImage(data) {
        if (!data.img.complete) this.#caching = true;
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.rotatedImage, data));
        } else {
            let w = data.img.width / 2;
            let h = data.img.height / 2;
            let x = w + data.x; 
            let y = h + data.y;
            this.#context.translate(x, y);
            this.#context.rotate(data.angle);
            this.#context.drawImage(data.img, -w, -h);
            this.#context.resetTransform();
        }
    }

    centeredText(data) {
        if (this.#caching) {
            this.#cachedSketchParts.enqueue(new SketchPart(this.centeredText, data));
        } else {
            this.#context.textAlign = "center";
            this.#context.fillText(data.text, data.x, data.y);
        }
    }
}

let mouseX = 0;
let mouseY = 0;
let mouseIsPressed = false;
const sketch = new Sketch();

window.onload = function() {
    if (typeof setup === 'function') {
        sketch.removeCanvas();
        setup();
        if (typeof canvasWidth != "undefined") canvasWidth = sketch.width;
        if (typeof canvasHeight != "undefined") canvasHeight = sketch.height;
    } else {
        sketch.createCanvas();
        if (typeof canvasWidth != "undefined") canvasWidth = sketch.width;
        if (typeof canvasHeight != "undefined") canvasHeight = sketch.height;
    }
};

function createCanvas(width, height) {
    sketch.createCanvas(width, height);
    canvasWidth = width;
    canvasHeight = height;
}

function color(red, green, blue) {
    if (typeof red === "string") return red;
    if (isNaN(red)) return "rgb(0, 0, 0)";
    if (isNaN(green) || isNaN(blue)) return "rgb(" + red + "," + red + "," + red + ")"
    return "rgb(" + red + "," + green + "," + blue + ")";
}

function background(red, green, blue) {
    sketch.background({color: color(red, green, blue)});
}

function line(startX, startY, endX, endY) {
    sketch.line({startX: startX, startY: startY, endX: endX, endY: endY});
}

function ellipse(centerX, centerY, width, height) {
    sketch.ellipse({centerX: centerX, centerY: centerY, width: width, height: height});
}

function rect(x, y, width, height, radius) {
    if (typeof radius !== "undefined") {
        sketch.roundedRect({x: x, y: y, width: width, height: height, radius: radius});
    } else {
        sketch.rect({x: x, y: y, width: width, height: height});
    }
}

function stroke(red, green, blue) {
    sketch.strokeColor({color: color(red, green, blue)});
}

function fill(red, green, blue) {
    sketch.fill({color: color(red, green, blue)});
}

function noStroke() {
    sketch.noStroke();
}

function noFill() {
    sketch.noFill();
}

function strokeWeight(weight) {
    sketch.strokeWeight({weight: weight});
}

function getImage(path) {
    let img = new Image();
    img.src = path;
    return img;
}

function image(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
    if (typeof dHeight !== "undefined") {
        sketch.partOfImage({img: img, sx: sx, sy: sy, sWidth: sWidth, sHeight: sHeight, dx: dx, dy: dy, dWidth: dWidth, dHeight: dHeight});
    } else if (typeof sHeight !== "undefined") {
        sketch.resizedImage({img: img, x: sx, y: sy, width: sWidth, height: sHeight});
    } else {
        sketch.image({img: img, x: sx, y: sy});
    }
}

function text(text, x, y) {
    sketch.text({text: text, x: x, y: y});
}

function textSize(size) {
    sketch.textSize({size: size});
}

function random(low, high) {
    high -= low;
    return Math.random() * high + low;
}

function round(number) {
    return Math.round(number);
}

function floor(number) {
    return Math.floor(number);
}

function triangle(x1, y1, x2, y2, x3, y3) {
    sketch.triangle({x1: x1, y1: y1, x2: x2, y2: y2, x3: x3, y3: y3});
}

function println(text) {
    console.log(text);
}

function isKeyPressed(key) {
    return sketch.isKeyPressed(key);
}

function point(x, y) {
    sketch.point({x: x, y: y});
}

function bezier(x, y, cx1, cy1, cx2, cy2, x2, y2) {
    sketch.bezier({x: x, y: y, cx1: cx1, cy1: cy1, cx2: cx2, cy2: cy2, x2: x2, y2: y2});
}

function arc(x, y, w, h, start, end) {
    sketch.arc({x: x, y: y, w: w, h: h, start: start, end: end});
}

function quad(x1, y1, x2, y2, x3, y3, x4, y4) {
    sketch.quad({x1: x1, y1: y1, x2: x2, y2: y2, x3: x3, y3: y3, x4: x4, y4: y4});
}

function textFont(font) {
    sketch.font({font: font});
}

function rotate(angle) {
    sketch.rotate({angle: angle / 180 * Math.PI});
}

function resetTransform() {
    sketch.resetTransform();
}

function translate(x, y) {
    sketch.translate({x: x, y: y});
}

function rotatedImage(img, x, y, angle, width, height) {
    if (width && height) sketch.resizedRotatedImage({img: img, x: x, y: y, angle: angle / 180 * Math.PI, width: width, height: height});
    else sketch.rotatedImage({img: img, x: x, y: y, angle: angle / 180 * Math.PI});
}

function centeredText(text, x, y) {
    sketch.centeredText({text: text, x: x, y: y});
}