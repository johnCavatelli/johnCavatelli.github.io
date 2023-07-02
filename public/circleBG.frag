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
    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);
    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float circle(in vec2 _st, in float _radius, in float _pow){
    float dist = length( abs(_st)-.5 );
    if(dist > _radius){return 0.;}
    float c0 = fract(dist*_pow);
    float c1 = step(0.5,c0);
    float offset = sin((u_time * 1.5) + (_pow * _radius));
    float c2 = noise((_st*90. + offset + (_radius * _pow)));
    float c3 = 0.5 * c1 + 0.2 * c2 + c0 * 0.6;
    float c4 = step(0.95, c3);
    return c4;
}
vec3 renderWavyCircle(in vec2 _uv, in float _rad,in float _waveMult, in vec2 _translate, inout vec3 _prevCircleColor){
    vec2 st = _uv + _translate; 
    float r = _rad;
    if(length( abs(st)-.5) < r && st.x > 0. && st.x < 1.){_prevCircleColor = vec3(0);}
    vec3 col = vec3(circle(st,r,_waveMult));
    if(st.x < 0. || st.x > 1.){col = vec3(0.);}
    return col;
}
void main()
{
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    float aspect = u_resolution.y / u_resolution.x;
    uv.x = uv.x / aspect;
    vec2 ogUV = uv;    
    vec3 c0 = vec3(0);
    vec3 c0a = renderWavyCircle(ogUV,0.6,10.,vec2(-1.2,0),c0);
    vec3 c1 = renderWavyCircle(ogUV,0.5,13.,vec2(-0.5,0),c0a) + c0a;
    vec3 c2 = renderWavyCircle(ogUV,0.5,17.,vec2(0,0.5),c1) + c1;
    vec3 c3 = renderWavyCircle(ogUV,0.5,27.,vec2(-0.99,0.5),c2) + c2;
    vec3 c4 = renderWavyCircle(ogUV,0.3,17.,vec2(-1.,-0.2),c3) + c3;
    vec3 c5 = renderWavyCircle(ogUV,0.5,37.,vec2(0.2,-1.3),c4) + c4;
    vec3 c6 = renderWavyCircle(ogUV,0.3,27.,vec2(0.4,0.3),c5) + c5;
    vec3 c7 = renderWavyCircle(ogUV,0.3,17.,vec2(-0.5,-0.5),c6) + c6;
    vec3 c8 = renderWavyCircle(ogUV,0.2,90.,vec2(-1.3,0.),c7) + c7;        
    gl_FragColor = vec4( c8,1.0);
}