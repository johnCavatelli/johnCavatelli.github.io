#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 u_resolution;
uniform float u_time;

//borrowed bayer funciton from https://www.shadertoy.com/view/7sfXDn
float Bayer2(vec2 a) {
    a = floor(a);
    return fract(a.x / 2. + a.y * a.y * .75);
}
#define Bayer4(a)   (Bayer2 (.5 *(a)) * .25 + Bayer2(a))
#define Bayer8(a)   (Bayer4 (.5 *(a)) * .25 + Bayer2(a))
#define Bayer16(a)  (Bayer8 (.5 *(a)) * .25 + Bayer2(a))
#define Bayer32(a)  (Bayer16(.5 *(a)) * .25 + Bayer2(a))
#define Bayer64(a)  (Bayer32(.5 *(a)) * .25 + Bayer2(a))

void main()
{
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / u_resolution.y;
    uv += (u_time * 0.03);//make it SCROLL up/down
    uv = fract(uv * .5);//scale the uv space, and clamp it from 0-1
    uv = sin(3.1415 * uv);//remap the 0-1 linear gradient to be the first hump of a sine wave
    vec3 topColor = vec3(.2,.0991,.196);
    vec3 bottomColor = vec3(.0034,.301,.29);
    float ditherScale = 0.2;//how big/small the dither is
    float ditherValue = Bayer64(gl_FragCoord.xy * ditherScale);
    float img = uv.y + 1.0;//offest for personal preference
    bool inDither = step(0.8, img * ditherValue) == 1.; 
    vec4 c = vec4(vec3(inDither ? topColor:bottomColor),1.0);

    gl_FragColor = c;
    //gl_FragColor = vec4(vec3(uv.y),1.0);//debug
}