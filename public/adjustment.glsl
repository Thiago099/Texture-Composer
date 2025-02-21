#Fragment Shader
precision mediump float;

vec3 saturation(vec3 color, float value) {
    float gray = dot(color.rgb, vec3(0.3, 0.59, 0.11));
    vec3 result = color.rgb;
    return mix(vec3(gray), result, value);
}

vec3 contrast(vec3 color, float value) {
    float contrast = value;
    return (color - 0.5) * contrast + 0.5;
}

vec3 brightness(vec3 color, float value) {
    return color + value;
}

const float kernel[9] = float[9](0.0625, 0.125, 0.0625, 0.125, 0.25, 0.125, 0.0625, 0.125, 0.0625);

float p = 1.0 / 30.0;
vec4 blur(sampler2D image, vec2 uv, vec2 resolution, float r) {
     if (r <= 0.0) {
        return texture(image, uv); // Return the original color if r = 0
    }
    float rr = r * r;
    float w0 = 0.3780 / pow(r, 1.975);

    vec2 stepSize = 1.0 / resolution;

    vec4 col = vec4(0.0);
    float totalWeight = 0.0;
    for (float x = -r; x <= r; x+=r * p) {
        for (float y = -r; y <= r; y+=r * p) {
            vec2 offset = uv + vec2(x, y) * stepSize;

            float distanceSquared = x * x + y * y;

            if (distanceSquared <= rr) {
                float weight = w0 * exp(-distanceSquared / (2.0 * rr));
                col += texture(image, offset) * weight;
                totalWeight += weight;
            }
        }
    }

    return col / totalWeight;
}

vec3 rgb2hsv(vec3 color) {
    float maxVal = max(color.r, max(color.g, color.b));
    float minVal = min(color.r, min(color.g, color.b));
    float delta = maxVal - minVal;
    float hue = 0.0;
    float saturation = (maxVal == 0.0) ? 0.0 : delta / maxVal;
    float value = maxVal;

    if (delta > 0.0) {
        if (maxVal == color.r) {
            hue = (color.g - color.b) / delta;
        } else if (maxVal == color.g) {
            hue = (color.b - color.r) / delta + 2.0;
        } else {
            hue = (color.r - color.g) / delta + 4.0;
        }
        hue /= 6.0;
        if (hue < 0.0) hue += 1.0;
    }

    return vec3(hue, saturation, value);
}

vec3 hsv2rgb(vec3 hsv) {
    float h = hsv.x * 6.0;
    float s = hsv.y;
    float v = hsv.z;

    int i = int(floor(h));
    float f = h - float(i);
    float p = v * (1.0 - s);
    float q = v * (1.0 - f * s);
    float t = v * (1.0 - (1.0 - f) * s);

    if (i == 0) return vec3(v, t, p);
    else if (i == 1) return vec3(q, v, p);
    else if (i == 2) return vec3(p, v, t);
    else if (i == 3) return vec3(p, q, v);
    else if (i == 4) return vec3(t, p, v);
    else return vec3(v, p, q);
}

vec3 changeHue(vec3 color, float hueShift) {
    vec3 hsv = rgb2hsv(color);
    hsv.x += hueShift;  
    if (hsv.x > 1.0) hsv.x -= 1.0;
    if (hsv.x < 0.0) hsv.x += 1.0;
    return hsv2rgb(hsv);
}

vec3 setHueSat(vec3 color, float hue, float sat) {
    vec3 hsv = rgb2hsv(color);
    hsv.x = hue;  
    hsv.y = sat;
    return hsv2rgb(hsv);
}
vec3 changeLuma(vec3 color, float hueShift) {
    vec3 hsv = rgb2hsv(color);
    hsv.z += hueShift;  
    return hsv2rgb(hsv);
}