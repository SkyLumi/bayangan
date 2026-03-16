// CURSOR
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX - 4 + 'px';
  cursor.style.top = mouseY - 4 + 'px';
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .expertise-card, .member-card, .social-link').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.style.transform = 'scale(2.5)');
  el.addEventListener('mouseleave', () => cursor.style.transform = 'scale(1)');
});

// SHADER HERO
if (window.THREE) {
  const container = document.getElementById('heroShader');
  const THREE = window.THREE;

  const camera = new THREE.Camera();
  camera.position.z = 1;
  const scene = new THREE.Scene();
  const geometry = new THREE.PlaneBufferGeometry(2, 2);

  const uniforms = {
    time: { type: "f", value: 1.0 },
    resolution: { type: "v2", value: new THREE.Vector2() },
  };

  const fragmentShader = `
    #define TWO_PI 6.2831853072
    #define PI 3.14159265359
    precision highp float;
    uniform vec2 resolution;
    uniform float time;
    float random(in float x) { return fract(sin(x)*1e4); }
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
    }
    void main(void) {
      vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
      vec2 fMosaicScal = vec2(4.0, 2.0);
      vec2 vScreenSize = vec2(256,256);
      uv.x = floor(uv.x * vScreenSize.x / fMosaicScal.x) / (vScreenSize.x / fMosaicScal.x);
      uv.y = floor(uv.y * vScreenSize.y / fMosaicScal.y) / (vScreenSize.y / fMosaicScal.y);
      float t = time*0.06+random(uv.x)*0.4;
      float lineWidth = 0.0008;
      vec3 color = vec3(0.0);
      for(int j = 0; j < 3; j++){
        for(int i=0; i < 5; i++){
          color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*1.0 - length(uv));
        }
      }
      gl_FragColor = vec4(color[2],color[1],color[0],1.0);
    }
  `;

  const vertexShader = `void main() { gl_Position = vec4(position, 1.0); }`;

  const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';

  function resize() {
    const rect = container.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height);
    uniforms.resolution.value.x = renderer.domElement.width;
    uniforms.resolution.value.y = renderer.domElement.height;
  }
  resize();
  window.addEventListener('resize', resize);

  (function animate() {
    requestAnimationFrame(animate);
    uniforms.time.value += 0.05;
    renderer.render(scene, camera);
  })();
}

// SCROLL REVEAL
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, entry.target.dataset.delay || 0);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal-card').forEach((el, i) => {
  el.dataset.delay = (i % 4) * 80;
  observer.observe(el);
});

// NAV ACTIVE STATE
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current
      ? 'var(--cyan)' : '';
  });
});
