import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import axios from 'axios';

const Panel = ({ pitch }) => {
  const panelRef = useRef();

  useFrame(() => {
    if (panelRef.current) {
      panelRef.current.rotation.x = pitch;
    }
  });

  return (
    <mesh ref={panelRef} position={[0, 2.2, 0]}>
      <cylinderGeometry args={[1, 1, 0.2, 32]} /> 
      <meshStandardMaterial color="skyblue" />
    </mesh>
  );
};

const Base = ({ yaw, pitch }) => {
  const baseRef = useRef();

  useFrame(() => {
    if (baseRef.current) {
      baseRef.current.rotation.y = yaw;
    }
  });

  return (
    <group ref={baseRef}>
      {/* Base roja */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.2, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>

      {/* Marca blanca para notar la rotación */}
      <mesh position={[1.3, 0.15, 0]}>
        <boxGeometry args={[0.2, 0.05, 0.2]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Poste de soporte */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 2, 32]} />
        <meshStandardMaterial color="gray" />
      </mesh>

      {/* Panel solar */}
      <Panel pitch={pitch} />
    </group>
  );
};

const SolarTracker = () => {
  const [pitch, setPitch] = useState(0);
  const [yaw, setYaw] = useState(0);

  // Obtener datos de la API
  useEffect(() => {
    const interval = setInterval(() => {
      axios.get('https://backsolarflow-production.up.railway.app/api/metrics/latest')
        .then(({ data }) => {
          setPitch((data.pitch * Math.PI) / 180);
          setYaw((data.yaw * Math.PI) / 180);
        })
        .catch(console.error);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      
      <div style={{ width: '80vw', height: '100vh' }}>
        <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />
          <Base yaw={yaw} pitch={pitch} />
        </Canvas>
      </div>

      <div style={{ width: '20vw', padding: '20px', fontFamily: 'sans-serif' }}>
        <h2>Ángulos actuales</h2>
        <p><strong>Pitch:</strong> {(pitch * 180 / Math.PI).toFixed(2)}°</p>
        <p><strong>Yaw:</strong> {(yaw * 180 / Math.PI).toFixed(2)}°</p>
      </div>
    </div>
  );
};

export default SolarTracker;
