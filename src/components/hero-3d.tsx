// src/components/hero-3d.tsx
"use client";

import { useRef, useEffect, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScrollControls, Scroll, useGLTF, useAnimations } from "@react-three/drei";

function PaperModel() {
  const meshRef = useRef<THREE.Mesh>(null);

  // é aplicada uma rotação contínua para exibir a volumetria
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
  });

  return (
    <mesh ref={meshRef} position={[-2.5, 0, 0]}>
      <torusKnotGeometry args={[1.5, 0.5, 128, 32]} />
      {/* é utilizado um material nativo com wireframe para garantir a visibilidade */}
      <meshStandardMaterial color="#7e22ce" wireframe={true} />
    </mesh>
  );
}

function RobotModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // é carregado o arquivo glb e as suas animações nativas
  const { scene, animations } = useGLTF('/assets/robotic_arm.glb');
  const { actions } = useAnimations(animations, groupRef);

  // é iniciada a primeira animação disponível no modelo
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstActionName = Object.keys(actions)[0];
      actions[firstActionName]?.play();
    }
  }, [actions]);

  // é substituído o material por wireframe respeitando as malhas animadas (skinnedmesh)
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh || child instanceof THREE.SkinnedMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#22c55e",
          wireframe: true,
        });
      }
    });
  }, [scene]);

  // é mantida a rotação de apresentação
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
  });

  return (
    <group ref={groupRef} position={[2.5, -viewport.height, 0]}>
      {/* é definida a escala inicial do modelo */}
      <primitive object={scene} scale={[1, 1, 1]} />
    </group>
  );
}

// é feito o pré-carregamento do modelo
useGLTF.preload('/assets/robotic_arm.glb');

export function Hero3D() {
  return (
    <section className="relative h-[200vh] w-full bg-seas-bgLight dark:bg-seas-bgDark">
      <div className="sticky top-0 h-screen w-full">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          {/* são injetadas luzes globais e direcionais para iluminar os materiais nativos */}
          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 10]} intensity={2} />

          {/* é gerenciado o carregamento do glb para evitar tela branca */}
          <Suspense fallback={null}>
            <ScrollControls pages={2} damping={0.1}>
              <PaperModel />
              <RobotModel />
              
              <Scroll html>
                <div className="w-full">
                  <div className="flex h-screen w-full items-center justify-end px-6 sm:px-10 lg:px-32">
                    <h2 className="max-w-2xl font-display text-5xl font-bold tracking-tight text-gray-900 dark:text-white md:text-7xl lg:text-8xl">
                      vamos tirar <br/>suas ideias <br />
                      <span className="text-seas-purple">do papel</span>
                    </h2>
                  </div>
                  <div className="flex h-screen w-full items-center justify-start px-6 sm:px-10 lg:px-32">
                    <h2 className="max-w-2xl font-display text-5xl font-bold tracking-tight text-gray-900 dark:text-white md:text-7xl lg:text-8xl">
                      direto para o <br />
                      <span className="text-seas-green">mundo real!</span>
                    </h2>
                  </div>
                </div>
              </Scroll>
            </ScrollControls>
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
}