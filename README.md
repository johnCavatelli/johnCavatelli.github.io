# AJ's Super Cool Personal Website
### Version 2.0
Most websites are pretty boring... spending 3 hours centering a div so that "The Man" is happy is NOT what I want to do. If modern browsers are supporting WebGl, why not make use of it?

## Built using Three.js and shaders written in GLSL


To Run Locally:
Clone Repo > open folder > npm i > npm run dev <3
Utilizes Vite for runs/builds. See deployment action .github/workflows/action.yml
To deploy simply push up code and trigger github action. Vite packages it all up for you.

Notes (For future AJ):
The 'public' folder holds assets that need to be included, but aren't detected by Vite to include.

To Add New Page:
Create named folder with index.html file. Add name of folder to vite.config.ts

Credits (Assets Used):
Skeleton Model: https://opengameart.org/content/skeleton-with-rig



BackLog
-Math for equally distributing eyes around the head
-arrow key compatibility()
-Scaling Of the eyes
-Hover Effects
-Zoom in at start
-About Page Background Shader
-About Page Body
-Blog Background Shader
-Blog Page
-Add Tutorial Texture About Click and drag that disappears after rotate
TODO:
-Touch support for Garden