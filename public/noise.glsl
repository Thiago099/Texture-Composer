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

uniform int u_noise_type;

uniform float u_scale;
uniform float u_time;
uniform int u_octaves;
uniform float u_persistence;

uniform float u_disturbance;
uniform float u_contrast;


float hash(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
	float noise = 0.0;

	if(u_noise_type == 0){
		noise = perlin(v_texCoord, u_scale, u_time, u_octaves, u_persistence);
	}
	else if (u_noise_type == 1){
		noise = voronoi(v_texCoord, u_disturbance, u_contrast, u_scale);
	}
	else if (u_noise_type == 2){
		noise = hash(v_texCoord);
	}


	fragColor = gradientMap2(vec2(noise, 1.0));
}