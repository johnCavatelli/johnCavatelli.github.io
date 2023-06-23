#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform float u_time;
float random (in vec2 st) {// 2D Random
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f*f*(3.0-2.0*f);
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
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / u_resolution.y;    
    vec2 pos = uv * 20.;// Scale the coordinate system 

    float n2 = noise(pos * rot(0.1*u_time));
    float n = noise(pos - n2);    
    
    n *= 1. + 0.3 * sin(u_time * 0.2);//make it BREATHE
    vec2 colUV = uv * rot(-1.1*u_time);//rotate colors background
    vec3 col = vec3(colUV, 0.5);
    col *= (step(0.5,n)) - (step(0.6,n));
    gl_FragColor = vec4(col, 1.0);     
}