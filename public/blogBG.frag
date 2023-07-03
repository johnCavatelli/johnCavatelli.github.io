// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.14159265359
#define GHOST_MODE

float random (in vec2 st) {// 2D Random
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

mat2 rot(float a){//counterCW rotation matrix
    float ca= cos(a);
    float sa= sin(a);
    return mat2(ca,-sa,sa,ca);
}

void main()
{
    vec2 uv = (gl_FragCoord.xy * 2.672 - u_resolution.xy) / u_resolution.y;//scale UV
    vec2 ogUV = uv;//keep origional for noise
    uv *= 5.;//multiply UV space
    uv *= rot(u_time*0.0138);//rotate it
    uv = fract(uv);//many tiny boxes
    uv = uv*2. - 1.;//make space map from -1 to 1 
    
    vec3 col;
    #ifdef GHOST_MODE
    col = vec3(smoothstep(uv.x,uv.x-0.05,-0.95));//?
    #else
    col = vec3(smoothstep(0.9,0.95, uv.x));//only keep edges
    col += vec3(smoothstep(0.9,0.95, uv.y));
    col += vec3(step(uv.x,-.95));
    col += vec3(step(uv.y,-.95));
    #endif
    
    
    //use 2 layers of scrolling noise, giving what percent full each box should be
    float perc = noise(-0.340*u_time + (ogUV*10.));
    perc *= noise(0.3*u_time + (ogUV*3.));
    perc *= 1.8;
    perc = (2.*PI * perc) - PI;//scale from -pi to pi
    
    //if the angle of the pixel to the origin is greater than the percent full, then color it black
    col*=vec3(ogUV,1.);
    if(atan(uv.y,uv.x) > perc){col = vec3(1.);}
    

    gl_FragColor = vec4(col,1.0);
}