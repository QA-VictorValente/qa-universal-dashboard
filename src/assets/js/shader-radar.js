/**
 * WebGL Tactical Radar Scanner
 * Renderiza o radar interativo de telemetria QA no canvas com nós reativos ao mouse e feixe contínuo.
 * Suporta alternância dinâmica entre Dark Mode (Obsidian Stealth) e Light Mode (Soft Sand/Cream).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.TacticalRadarShader = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  let gl = null;
  let canvas = null;
  let prog = null;
  let animFrameId = null;
  let currentTheme = 'dark'; // 'dark' ou 'light'

  const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

  const fsDark = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 v_texCoord;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= u_resolution.x / u_resolution.y;

    vec2 mouseNorm = u_mouse / u_resolution.xy;
    vec2 mouseP = mouseNorm * 2.0 - 1.0;
    mouseP.x *= u_resolution.x / u_resolution.y;

    float t = u_time;

    vec3 colBase = vec3(0.012, 0.012, 0.015);         
    vec3 colSubtleGray = vec3(0.28, 0.30, 0.35);      
    vec3 colSoftSilver = vec3(0.55, 0.58, 0.64);      
    
    vec3 colDarkRedBase = vec3(0.42, 0.05, 0.08);     
    vec3 colDarkRedBright = vec3(0.85, 0.10, 0.15);   
    vec3 colDarkRedGlow = vec3(0.62, 0.06, 0.10);     

    vec3 color = colBase;

    vec2 radarCenter = vec2(0.0, -0.05);
    vec2 toRadar = p - radarCenter;
    float distRadar = length(toRadar);
    float angleRadar = atan(toRadar.y, toRadar.x);

    float sweepSpeed = 0.85;
    float currentAngle = mod(t * sweepSpeed, 6.2831853) - 3.1415926;
    float angleDiff = mod(angleRadar - currentAngle + 6.2831853, 6.2831853);
    
    float sweepTrail = smoothstep(2.5, 0.0, angleDiff) * smoothstep(1.35, 0.04, distRadar);
    color += colSubtleGray * sweepTrail * 0.13;
    
    float sweepEdge = smoothstep(0.038, 0.0, angleDiff) * smoothstep(1.35, 0.02, distRadar);
    color += colSoftSilver * sweepEdge * 0.26;

    for (int r = 1; r <= 3; r++) {
        float fr = float(r);
        float ringRadius = fract(t * 0.12 + fr * 0.33) * 1.35;
        float ringThickness = 0.009;
        float ringDist = abs(distRadar - ringRadius);
        float ringGlow = smoothstep(ringThickness, 0.0, ringDist);
        float ringFade = smoothstep(1.35, 0.1, ringRadius);
        color += colSubtleGray * ringGlow * ringFade * 0.14;
    }

    float ring1 = abs(distRadar - 0.3);
    float ring2 = abs(distRadar - 0.65);
    float ring3 = abs(distRadar - 1.0);
    float ringsStatic = smoothstep(0.0045, 0.0, min(min(ring1, ring2), ring3));
    color += colSubtleGray * ringsStatic * 0.14;

    float crossLines = min(abs(toRadar.x), abs(toRadar.y));
    float crossGlow = smoothstep(0.0035, 0.0, crossLines) * smoothstep(1.15, 0.04, distRadar);
    color += colSubtleGray * crossGlow * 0.13;

    const int NUM_BLIPS = 16;
    for (int b = 0; b < NUM_BLIPS; b++) {
        float fb = float(b);
        float blipDist = 0.22 + mod(fb * 0.147 + 0.1, 0.88);
        float blipBaseAng = fb * (6.2831853 / float(NUM_BLIPS)) + sin(fb * 3.7) * 0.35;
        vec2 blipPos = radarCenter + vec2(cos(blipBaseAng), sin(blipBaseAng)) * blipDist;
        
        float distToBlip = length(p - blipPos);
        float blipAngle = atan(blipPos.y - radarCenter.y, blipPos.x - radarCenter.x);
        float diffBlip = mod(currentAngle - blipAngle + 6.2831853, 6.2831853);
        
        float blipEcho = exp(-diffBlip * 4.0);
        float blipCore = smoothstep(0.017, 0.002, distToBlip);
        float blipGlow = smoothstep(0.060, 0.004, distToBlip);

        vec3 blipRestColor = colSubtleGray * 0.38;
        vec3 blipActiveColor = mix(colDarkRedBase, colDarkRedBright, blipEcho);

        vec3 blipColor = mix(blipRestColor, blipActiveColor, blipEcho);
        
        color += blipColor * blipCore * (0.5 + 1.8 * blipEcho);
        color += colDarkRedGlow * blipGlow * blipEcho * 1.05;
    }

    float distToMouse = length(p - mouseP);
    float mouseWave = abs(fract(distToMouse * 4.0 - t * 0.9) - 0.5);
    float mouseGlow = smoothstep(0.05, 0.002, mouseWave) * smoothstep(0.45, 0.0, distToMouse);
    color += colSoftSilver * mouseGlow * 0.09;

    float vignette = smoothstep(1.9, 0.4, length(p));
    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
}`;

  const fsLight = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 v_texCoord;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= u_resolution.x / u_resolution.y;

    vec2 mouseNorm = u_mouse / u_resolution.xy;
    vec2 mouseP = mouseNorm * 2.0 - 1.0;
    mouseP.x *= u_resolution.x / u_resolution.y;

    float t = u_time;

    vec3 colBase = vec3(0.96, 0.95, 0.92);
    vec3 colSubtleGray = vec3(0.72, 0.69, 0.64);
    vec3 colSoftSilver = vec3(0.55, 0.52, 0.48);

    vec3 colDarkRedBase = vec3(0.55, 0.12, 0.14);
    vec3 colDarkRedBright = vec3(0.85, 0.14, 0.18);
    vec3 colDarkRedGlow = vec3(0.75, 0.15, 0.18);

    vec3 color = colBase;

    vec2 radarCenter = vec2(0.0, -0.05);
    vec2 toRadar = p - radarCenter;
    float distRadar = length(toRadar);
    float angleRadar = atan(toRadar.y, toRadar.x);

    float sweepSpeed = 0.85;
    float currentAngle = mod(t * sweepSpeed, 6.2831853) - 3.1415926;
    float angleDiff = mod(angleRadar - currentAngle + 6.2831853, 6.2831853);

    float sweepTrail = smoothstep(2.5, 0.0, angleDiff) * smoothstep(1.35, 0.04, distRadar);
    color = mix(color, colSubtleGray, sweepTrail * 0.14);

    float sweepEdge = smoothstep(0.038, 0.0, angleDiff) * smoothstep(1.35, 0.02, distRadar);
    color = mix(color, colSoftSilver, sweepEdge * 0.22);

    for (int r = 1; r <= 3; r++) {
        float fr = float(r);
        float ringRadius = fract(t * 0.12 + fr * 0.33) * 1.35;
        float ringThickness = 0.008;
        float ringDist = abs(distRadar - ringRadius);
        float ringGlow = smoothstep(ringThickness, 0.0, ringDist);
        float ringFade = smoothstep(1.35, 0.1, ringRadius);
        color = mix(color, colSubtleGray, ringGlow * ringFade * 0.16);
    }

    float ring1 = abs(distRadar - 0.3);
    float ring2 = abs(distRadar - 0.65);
    float ring3 = abs(distRadar - 1.0);
    float ringsStatic = smoothstep(0.0045, 0.0, min(min(ring1, ring2), ring3));
    color = mix(color, colSubtleGray, ringsStatic * 0.18);

    float crossLines = min(abs(toRadar.x), abs(toRadar.y));
    float crossGlow = smoothstep(0.0035, 0.0, crossLines) * smoothstep(1.15, 0.04, distRadar);
    color = mix(color, colSubtleGray, crossGlow * 0.14);

    const int NUM_BLIPS = 16;
    for (int b = 0; b < NUM_BLIPS; b++) {
        float fb = float(b);
        float blipDist = 0.22 + mod(fb * 0.147 + 0.1, 0.88);
        float blipBaseAng = fb * (6.2831853 / float(NUM_BLIPS)) + sin(fb * 3.7) * 0.35;
        vec2 blipPos = radarCenter + vec2(cos(blipBaseAng), sin(blipBaseAng)) * blipDist;

        float distToBlip = length(p - blipPos);
        float blipAngle = atan(blipPos.y - radarCenter.y, blipPos.x - radarCenter.x);
        float diffBlip = mod(currentAngle - blipAngle + 6.2831853, 6.2831853);

        float blipEcho = exp(-diffBlip * 4.0);
        float blipCore = smoothstep(0.016, 0.002, distToBlip);
        float blipGlow = smoothstep(0.055, 0.004, distToBlip);

        vec3 blipRestColor = colSubtleGray * 0.85;
        vec3 blipActiveColor = mix(colDarkRedBase, colDarkRedBright, blipEcho);

        vec3 blipColor = mix(blipRestColor, blipActiveColor, blipEcho);

        color = mix(color, blipColor, blipCore * (0.35 + 1.6 * blipEcho));
        color = mix(color, colDarkRedGlow, blipGlow * blipEcho * 0.7);
    }

    float distToMouse = length(p - mouseP);
    float mouseWave = abs(fract(distToMouse * 4.0 - t * 0.9) - 0.5);
    float mouseGlow = smoothstep(0.05, 0.002, mouseWave) * smoothstep(0.45, 0.0, distToMouse);
    color = mix(color, colSoftSilver, mouseGlow * 0.10);

    gl_FragColor = vec4(color, 1.0);
}`;

  function compileShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  function initProgram(theme) {
    currentTheme = theme;
    const fsSource = theme === 'light' ? fsLight : fsDark;

    if (prog) {
      gl.deleteProgram(prog);
    }

    prog = gl.createProgram();
    gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
  }

  function init(canvasId = 'shader-canvas', initialTheme = 'dark') {
    canvas = document.getElementById(canvasId);
    if (!canvas) return;

    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL não suportado no navegador.');
      return;
    }

    function syncSize() {
      const w = canvas.clientWidth || window.innerWidth || 1280;
      const h = canvas.clientHeight || window.innerHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(syncSize).observe(canvas);
    }
    syncSize();

    initProgram(initialTheme);

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    window.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    });

    function render(t) {
      if (typeof ResizeObserver === 'undefined') syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);

      const uTime = gl.getUniformLocation(prog, 'u_time');
      const uRes = gl.getUniformLocation(prog, 'u_resolution');
      const uMouse = gl.getUniformLocation(prog, 'u_mouse');

      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animFrameId = requestAnimationFrame(render);
    }

    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(render);
  }

  function setTheme(theme) {
    if (gl && canvas) {
      initProgram(theme);
    }
  }

  return { init, setTheme };
});
