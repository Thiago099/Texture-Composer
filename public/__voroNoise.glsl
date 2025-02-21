in vec4 a_position;
in vec2 a_texCoord;
out vec2 v_texCoord;

void main() {
    gl_Position = a_position;
    v_texCoord = a_texCoord;
}

#Fragment Shader

precision mediump float;

in vec2 v_texCoord;
out vec4 fragColor;


#define OCTAVES 1

vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
}

float voronoi(vec2 x, float time, float distance_type, float function, bool multiply_by_F1, bool inverse) {
    vec2 n = floor(x);
    vec2 f = fract(x);

    float F1 = 8.0;
    float F2 = 8.0;

    for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
            vec2 g = vec2(i, j);
            vec2 o = hash(n + g);

            o = 0.5 + 0.41 * sin(time + 6.2831 * o);
            vec2 r = g - f + o;

            float d = distance_type < 1.0 ? dot(r, r) :              
                      distance_type < 2.0 ? sqrt(dot(r, r)) :       
                      distance_type < 3.0 ? abs(r.x) + abs(r.y) :   
                      distance_type < 4.0 ? max(abs(r.x), abs(r.y)) : 
                      0.0;

            if (d < F1) {
                F2 = F1;
                F1 = d;
            } else if (d < F2) {
                F2 = d;
            }
        }
    }

    float c = function < 1.0 ? F1 :
              function < 2.0 ? F2 :
              function < 3.0 ? F2 - F1 :
              function < 4.0 ? (F1 + F2) / 2.0 :
              0.0;

    if (multiply_by_F1) c *= F1;
    if (inverse) c = 1.0 - c;

    return c;
}

float fbm(vec2 p, float time, float switchTime, float power, float bias) {
    float t = time / switchTime;

    float function = mod(t, 4.0);
    bool multiply_by_F1 = mod(t, 8.0) >= 4.0;
    bool inverse = mod(t, 16.0) >= 8.0;
    float distance_type = mod(t / 16.0, 4.0);

    float s = 0.0;
    float m = 0.0;
    float a = 0.5;

    for (int i = 0; i < OCTAVES; i++) {
        s += a * voronoi(p, time, distance_type, function, multiply_by_F1, inverse);
        m += a;
        a *= 0.5;
        p *= 2.0;
    }

    return power * (s / m) + bias;
}




void main() {
  	vec2 uv = v_texCoord; 
	float time = 10.0;        
	float switchTime = 60.0;  
	float power = 1.0;        
	float scale = 10.0;       
	float bias = 0.5;         

	float c = fbm(uv* scale, time, switchTime, power, bias);

    fragColor = vec4(c,c,c, 1.0); 
}