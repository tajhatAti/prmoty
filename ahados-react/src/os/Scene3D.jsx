/* ============================================================
   AhadOs v2 — 3D background scene (Three.js)
   Floating glass shapes + glowing particles + soft fog
   ============================================================ */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Scene3D({ active }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // graceful fallback if WebGL unavailable (test envs / old devices)
    if (!(typeof WebGLRenderingContext !== 'undefined' && (() => {
      try {
        const c = document.createElement('canvas');
        return !!(window.WebGL2RenderingContext
          ? c.getContext('webgl2') || c.getContext('webgl')
          : c.getContext('webgl'));
      } catch { return false; }
    })())) {
      mount.style.background =
        'radial-gradient(60% 50% at 20% 20%, rgba(168,85,247,.22), transparent 60%),' +
        'radial-gradient(50% 40% at 80% 30%, rgba(34,211,238,.16), transparent 60%),' +
        'radial-gradient(60% 50% at 50% 90%, rgba(236,72,153,.12), transparent 60%)';
      return;
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05040c, 0.045);

    const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.4, 5.2);

    const group = new THREE.Group();
    scene.add(group);

    // --- glass shapes (icosahedron, torus, octahedron) ---
    const glassMat = (color, opacity = 0.16) => new THREE.MeshPhysicalMaterial({
      color, metalness: 0.1, roughness: 0.12, transparent: true, opacity,
      transmission: 0.6, thickness: 0.6, ior: 1.4,
      envMapIntensity: 1.2, clearcoat: 1, clearcoatRoughness: 0.15,
    });

    const shapes = [];
    const addShape = (geo, mat, x, y, z, s, spin = 0.4) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.scale.setScalar(s);
      group.add(m);
      shapes.push({ m, spin, baseY: y });
    };

    addShape(new THREE.IcosahedronGeometry(1, 1), glassMat(0xa855f7), -2.6, 0.9, -1.2, 0.55, 0.35);
    addShape(new THREE.TorusKnotGeometry(0.7, 0.22, 90, 14), glassMat(0x22d3ee), 2.7, 1.5, -1.6, 0.5, 0.28);
    addShape(new THREE.OctahedronGeometry(1, 0), glassMat(0xec4899), 0, -1.9, -2.4, 0.5, 0.22);
    addShape(new THREE.TorusGeometry(0.75, 0.26, 24, 60), glassMat(0x6366f1), -1.4, -1.5, -2.2, 0.55, 0.3);
    addShape(new THREE.IcosahedronGeometry(0.8, 0), glassMat(0xffffff, 0.08), 1.6, -0.6, -2.8, 0.6, 0.26);

    // wireframe accents
    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.4, 1),
      new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.12 })
    );
    wire.position.set(2.1, 1.1, -3);
    group.add(wire);

    // --- particles ---
    const pCount = 260;
    const positions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12;
      positions[i + 1] = (Math.random() - 0.5) * 8;
      positions[i + 2] = -Math.random() * 6;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x8b5cf6, size: 0.035, transparent: true, opacity: 0.55,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const points = new THREE.Points(pGeo, pMat);
    group.add(points);

    // --- lights ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const l1 = new THREE.PointLight(0xa855f7, 30, 20); l1.position.set(-3, 3, 4); scene.add(l1);
    const l2 = new THREE.PointLight(0x22d3ee, 26, 20); l2.position.set(3, -2, 3); scene.add(l2);
    const l3 = new THREE.PointLight(0xec4899, 18, 16); l3.position.set(0, 3, -2); scene.add(l3);

    // --- animate ---
    let raf;
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      shapes.forEach((s, i) => {
        s.m.rotation.x = t * s.spin * (i % 2 ? 1 : -1);
        s.m.rotation.y = t * s.spin * 0.8 + i;
        s.m.position.y = s.baseY + Math.sin(t * 0.7 + i * 1.7) * 0.28;
      });
      wire.rotation.y = t * 0.12;
      points.rotation.y = t * 0.02;
      camera.position.x = Math.sin(t * 0.12) * 0.35;
      camera.position.y = 0.4 + Math.cos(t * 0.1) * 0.2;
      camera.lookAt(0, 0, -1);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      shapes.forEach(s => { group.remove(s.m); s.m.geometry.dispose(); s.m.material.dispose(); });
      group.remove(wire, points);
      wire.geometry.dispose(); wire.material.dispose();
      pGeo.dispose(); pMat.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="three-canvas" />;
}
