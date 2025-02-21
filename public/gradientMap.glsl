#Fragment Shader

precision mediump float;

uniform sampler2D u_gradient_map_texture;
uniform vec2 u_gradient_map_size;





vec4 gradientMap2(vec2 originalColor)
{

    float gray = clamp(originalColor.r,0.0,1.0);


    if(u_gradient_map_size.g == 0.0){
        vec4 color = texture(u_gradient_map_texture, vec2(0.0, 0.0) / u_gradient_map_size);
        color.a = min(color.a, originalColor.y);
        return color;
    }

    for (float i = 0.0; i < u_gradient_map_size.g; i += 1.0) {

        float position = texture(u_gradient_map_texture, vec2(1.0, i) / u_gradient_map_size).r;

        float position2 = texture(u_gradient_map_texture, vec2(1.0, i+1.0) / u_gradient_map_size).r;

        if (gray >= position && gray <= position2) {

            vec4 color = texture(u_gradient_map_texture, vec2(0.0, i) / u_gradient_map_size);
            vec4 color2 = texture(u_gradient_map_texture, vec2(0.0, i+1.0) / u_gradient_map_size);

            float t = (gray - position) / (position2 - position);
            vec4 result = mix(color, color2, t);
            result.a =  min(originalColor.y, result.a);
            return result;
        }
        

        if (i == 0.0 && gray <= position) {
            vec4 color = texture(u_gradient_map_texture, vec2(0.0, i) / u_gradient_map_size);
            color.a = min(color.a, originalColor.y);
            return color;
        }

        if (i+1.0 == u_gradient_map_size.g && gray >= position) {
            vec4 color = texture(u_gradient_map_texture, vec2(0.0, i+1.0) / u_gradient_map_size);
            color.a = min(color.a, originalColor.y);
            return color;
        }
    }
}
vec4 gradientMap(vec4 originalColor){
    float gray = dot(originalColor.rgb, vec3(0.299, 0.587, 0.114));
    return gradientMap2(vec2(gray, originalColor.a));
}