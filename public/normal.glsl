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
uniform float u_normal_strength;
uniform vec2 resolution;
uniform sampler2D u_group_texture;
uniform vec2 u_group_texture_ratio;

vec3 computeNormalFromHeightMap(sampler2D heightMap, vec2 uv, float scale, vec2 texelSize) {
    
    float heightL = texture(heightMap, uv - vec2(texelSize.x, 0.0)).r;
    float heightR = texture(heightMap, uv + vec2(texelSize.x, 0.0)).r;
    float heightD = texture(heightMap, uv - vec2(0.0, texelSize.y)).r;
    float heightU = texture(heightMap, uv + vec2(0.0, texelSize.y)).r;
    
    float dx = (heightR - heightL) * scale;
    float dy = (heightU - heightD) * scale;
    
    vec3 normal = normalize(vec3(-dx, -dy, 1.0));

    return normal;
}


void main() {
    vec2 texelSize = 1.0  / vec2(textureSize(u_group_texture, 0));
    vec3 normal = computeNormalFromHeightMap(u_group_texture, v_texCoord, u_normal_strength, texelSize);
    fragColor.rgb = normal * 0.5 + 0.5;
    fragColor.a = 1.0;
}