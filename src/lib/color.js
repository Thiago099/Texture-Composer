
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
    ]
}

function RGBtoHSV(r, g, b) {
    if (arguments.length === 1) {
        g = r.g, b = r.b, r = r.r;
    }
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return [
        h,
        s,
        v
    ];
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b, a) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function rgbaToHex(r, g, b, a) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b) + componentToHex(a) ;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if(result == null){
        return null
    }

    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ]
}
function hexToRgba(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if(result == null){
        return null
    }

    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
      parseInt(result[4], 16)
    ]
}
function isNumeric(str) {
    if (typeof str != "string") return false 
    return !isNaN(str) && 
           !isNaN(parseFloat(str)) 
  }

function clamp(value, min, max){

    if(typeof value != "number"){
        if(!isNumeric(value)){
            value = Number(value)
        }
    }

    if(isNaN(value)){
        return null
    }


    if(value < min){
        return min
    }
    if(value > max){
        return max
    }
    
    return value
}

export {HSVtoRGB, RGBtoHSV, hexToRgb, rgbToHex, clamp, rgbaToHex, hexToRgba}