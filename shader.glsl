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

uniform sampler2D u_group_texture;
uniform sampler2D u_mask_texture;
uniform sampler2D u_last_texture;
uniform sampler2D u_file_mask_texture;
uniform sampler2D u_blur_mask_texture;

uniform vec2 u_group_texture_ratio;
uniform vec2 u_mask_texture_ratio;
uniform vec2 u_last_texture_ratio;
uniform vec2 u_file_mask_ratio;
uniform vec2 u_blur_mask_ratio;

uniform float u_alpha;
uniform bool u_has_mask;
uniform vec3 u_mask_color;
uniform vec2 resolution;
uniform float threshold;

uniform float u_saturation;
uniform float u_contrast;
uniform float u_brightens;
uniform float u_blur_amount;
uniform float u_scale;
uniform float u_hue;
uniform bool u_colorize;
uniform bool u_invert;
uniform bool u_has_last;
uniform bool u_has_file_mask;
uniform bool u_has_blur_mask;
uniform int u_blend_mode;

uniform bool u_enable_r;
uniform bool u_enable_g;
uniform bool u_enable_b;

uniform bool u_enable_hue;
uniform bool u_enable_saturation;
uniform bool u_enable_brightens;

uniform bool u_enable_gradient_map;


uniform int u_horizontal_alignment;
uniform int u_vertical_alignment;
uniform bool u_tile;
uniform vec2 u_offset;


float GetMask(sampler2D image, vec2 uv, vec2 resolution, float r) {
    float rr = r * r;
    float w0 = 0.3780 / pow(r, 1.975);

    vec2 stepSize = 1.0 / resolution;

    float col = 1.0;

    for (float x = -r; x <= r; x++) {
        for (float y = -r; y <= r; y++) {
            vec2 offset = uv + vec2(x, y) * stepSize;

            float distanceSquared = x * x + y * y;

            if (distanceSquared <= rr) {
                vec4 sampleColor =texture(image, offset);
                col = min(col, length(sampleColor.rgb - u_mask_color));
            }
        }
    }

    return col;
}





void main() {

    float blur_amount = u_blur_amount;

    if(u_has_blur_mask){
        vec4 blurMask = texture(u_blur_mask_texture, v_texCoord * resolution / u_blur_mask_ratio);
        blur_amount = min((blurMask.r + blurMask.g + blurMask.b) / 3.0, blurMask.a) * blur_amount;
    }


    vec2 size = resolution / (u_group_texture_ratio * max(u_scale, 0.001));
    vec2 coordinates = v_texCoord * size;

    if(u_vertical_alignment == 2){
        coordinates.y += (1.0 - size.y);
    }
    else if (u_vertical_alignment == 1){
        coordinates.y += (1.0 - size.y) * 0.5;
    }

    if(u_horizontal_alignment == 2){
        coordinates.x += (1.0 - size.x);
    }
    else if (u_horizontal_alignment == 1){
        coordinates.x += (1.0 - size.x) * 0.5;
    }

    coordinates -= u_offset / max(u_scale, 0.001);

    vec4 color =  blur(u_group_texture, coordinates, u_group_texture_ratio, blur_amount);

    if(!u_tile){
        if(coordinates.y < 0.0 || coordinates.y > 1.0){
            color = vec4(0.0);
        }
        if(coordinates.x < 0.0 || coordinates.x > 1.0){
            color = vec4(0.0);
        }
    }

    float alpha;

    if(u_has_mask){
        float mask = GetMask(u_mask_texture, v_texCoord * resolution / u_mask_texture_ratio, resolution, 1.0);
        alpha = mask == 0.0 ? min(u_alpha, color.a) : 0.0;
    }
    else{
        alpha = min(color.a, u_alpha);
    }

    if(u_has_file_mask){
        vec4 fileMask = texture(u_file_mask_texture, v_texCoord * resolution / u_file_mask_ratio);
        alpha = min(min(alpha, (fileMask.r + fileMask.g + fileMask.b) / 3.0), fileMask.a);
    }
    
    if(u_enable_gradient_map){
        color = gradientMap(vec4(color.rgb, alpha));
    }
    else{
        color.a = alpha;
    }
    
    vec3 result = color.rgb;

    if(u_invert){
        result = 1.0 - result;
    }

    if(!u_colorize){
        result = saturation(result, u_saturation);
    }

    result = contrast(result, u_contrast);
    result = brightness(result, u_brightens);

    if(u_colorize){
        result = setHueSat(result, u_hue, u_saturation);
    }
    else{
        result = changeHue(result, u_hue);
    }
    

    color.rgb = result;

    color = clamp(color, 0.0, 1.0);


    if(u_has_last){
        vec4 lastColor = texture(u_last_texture, v_texCoord * resolution / u_last_texture_ratio);


        if(u_enable_hue || u_enable_saturation || u_enable_brightens){
            vec3 lastHSV = rgb2hsv(lastColor.rgb);
            vec3 currentHSV = rgb2hsv(color.rgb);

            if(u_enable_hue){
                lastHSV.r = (currentHSV.r * color.a) + (lastHSV.r * (1.0 - color.a));
            }
            if(u_enable_saturation){
                lastHSV.g = (currentHSV.g * color.a) + (lastHSV.g * (1.0 - color.a));
            }
            if(u_enable_brightens){
                lastHSV.b = (currentHSV.b * color.a) + (lastHSV.b * (1.0 - color.a));
            }
            float blendedAlpha = color.a + lastColor.a * (1.0 - color.a);
            vec3 resultRGB = hsv2rgb(lastHSV);
            fragColor = vec4(resultRGB, blendedAlpha);
        }
        else{
            float blendedAlpha = color.a + lastColor.a * (1.0 - color.a);
            fragColor = vec4(blendMode(u_blend_mode, lastColor.rgb * blendedAlpha, color.rgb, color.a), blendedAlpha);
        }
        if(!u_enable_r){
            fragColor.r = lastColor.r;
        }

        if(!u_enable_g){
            fragColor.g = lastColor.g;
        }

        if(!u_enable_b){
            fragColor.b = lastColor.b;
        }
    }
    else{
        fragColor = color;
        
        if(!u_enable_r){
            fragColor.r = 0.0;
        }

        if(!u_enable_g){
            fragColor.g = 0.0;
        }
        
        if(!u_enable_b){
            fragColor.b = 0.0;
        }
    }


}