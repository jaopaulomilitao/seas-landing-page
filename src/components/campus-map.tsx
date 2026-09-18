// src/components/campus-map.tsx
"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { useGLTF, CameraControls } from "@react-three/drei";

interface ScheduleItem {
  title: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
}

interface CampusMapProps {
  schedule: ScheduleItem[];
  activeLocation: string | null;
  onLocationSelect: (location: string | null) => void;
}

// é configurado o mapeamento baseado exatamente nos nós do seu Outliner do Blender
const locationNodesMapping: Record<string, { title: string; image: string; desc: string }> = {
  frente_campus: { 
    title: "Frente do Campus", 
    image: "https://placehold.co/600x400/150a25/ffffff?text=Frente+do+Campus",
    desc: "Entrada principal do campus da UFC Sobral."
  },
  recepcao_bloco_3: { 
    title: "Recepção do Bloco 3", 
    image: "https://placehold.co/600x400/150a25/ffffff?text=Recepcao",
    desc: ""
  },
  hall_salas: { 
    title: "Hall das Salas", 
    image: "https://placehold.co/600x400/150a25/ffffff?text=Hall",
    desc: ""
  },
  lab_simulacoes: { 
    title: "Laboratório de Simulações Numéricas", 
    image: "https://placehold.co/600x400/7e22ce/ffffff?text=Lab+Simulacoes",
    desc: "Local destinado para as oficinas práticas."
  },
  lab_audiovisual: { 
    title: "Sala de Audiovisual", 
    image: "https://placehold.co/600x400/22c55e/ffffff?text=Sala+Audiovisual",
    desc: "Palco principal das palestras e rodas de conversa."
  }
};

function MapScene({ schedule, activeLocation, onLocationSelect }: CampusMapProps) {
  const { scene, nodes } = useGLTF("/assets/blocos-ufc.glb");
  const cameraControlsRef = useRef<CameraControls>(null);

  // é calculado o centro matemático global de todo o modelo 3d importado
  const modelCenter = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    return center;
  }, [scene]);

  const nodeCenters = useMemo(() => {
    const centers: Record<string, THREE.Vector3> = {};
    scene.updateMatrixWorld(true);
    
    Object.keys(locationNodesMapping).forEach(key => {
      if (nodes[key]) {
        const box = new THREE.Box3().setFromObject(nodes[key]);
        const center = new THREE.Vector3();
        box.getCenter(center);
        centers[key] = center;
      }
    });
    return centers;
  }, [scene, nodes]);

  // POSIÇÃO INICIAL FORÇADA USANDO O CENTRO REAL DO MAPA
  useEffect(() => {
    if (cameraControlsRef.current && !activeLocation) {
      // Posiciona a câmera em relação ao centro exato do modelo (modelCenter)
      cameraControlsRef.current.setLookAt(
        modelCenter.x - 15, 
        modelCenter.y + 12, 
        modelCenter.z + 20, 
        modelCenter.x, 
        modelCenter.y, 
        modelCenter.z, 
        false
      );
    }
  }, [modelCenter, activeLocation]);

  // é acionado o voo da câmera sempre que um novo local é ativado
  useEffect(() => {
    if (!cameraControlsRef.current) return;

    if (activeLocation) {
      const targetKey = Object.keys(locationNodesMapping).find(
        (key) => locationNodesMapping[key].title === activeLocation
      );

      if (targetKey && nodeCenters[targetKey]) {
        const center = nodeCenters[targetKey];

        // a câmera voa e foca exatamente no centro calculado do bloco
        cameraControlsRef.current.setLookAt(
          center.x + 8, center.y + 6, center.z + 8, 
          center.x, center.y, center.z,                
          true                                         
        );
      }
    } else {
      // RETORNO À VISTA GERAL CENTRALIZADA NO MAPA
      cameraControlsRef.current.setLookAt(
        modelCenter.x - 15, 
        modelCenter.y + 12, 
        modelCenter.z + 20, 
        modelCenter.x, 
        modelCenter.y, 
        modelCenter.z, 
        true
      );
    }
  }, [activeLocation, nodeCenters, modelCenter]);

  return (
    <>
      <CameraControls 
        ref={cameraControlsRef} 
        makeDefault 
        minDistance={3} 
        maxDistance={80} 
        maxPolarAngle={Math.PI / 2.1} 
      />
      
      <group>
        <primitive object={scene} />

        {/* malhas invisíveis dedicadas apenas para interceptar os cliques do mouse */}
        {Object.entries(locationNodesMapping).map(([nodeName, locationData]) => {
          const mesh = nodes[nodeName] as THREE.Mesh;
          if (!mesh) return null;

          return (
            <mesh 
              key={nodeName} 
              position={mesh.position} 
              rotation={mesh.rotation} 
              scale={mesh.scale}
              onClick={(e) => {
                e.stopPropagation();
                onLocationSelect(locationData.title);
              }}
              onPointerOver={() => document.body.style.cursor = 'pointer'}
              onPointerOut={() => document.body.style.cursor = 'auto'}
              visible={false} 
            >
              <bufferGeometry attach="geometry" {...mesh.geometry} />
            </mesh>
          );
        })}
      </group>
    </>
  );
}

useGLTF.preload("/assets/blocos-ufc.glb");

export function CampusMapSection({ schedule, activeLocation, onLocationSelect }: CampusMapProps) {
  // estado para controlar a minimização do painel flutuante
  const [isMinimized, setIsMinimized] = useState(false);
  
  // são resgatados os dados do local ativo para exibir no painel 2D
  const activeData = activeLocation 
    ? Object.values(locationNodesMapping).find(l => l.title === activeLocation) 
    : null;

  const activeEvents = activeLocation 
    ? schedule.filter(item => item.location === activeLocation)
    : [];

  // Agrupamento dos eventos do local ativo por dia
  const groupedActiveEvents = activeEvents.reduce((acc, item) => {
    const dateKey = String(item.date).trim();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(item);
    return acc;
  }, {} as Record<string, ScheduleItem[]>);

  // é redefinido o estado de minimização caso o utilizador clique noutro local
  useEffect(() => {
    if (activeLocation) setIsMinimized(false);
  }, [activeLocation]);

  return (
    <section id="mapa" className="py-20 px-4 sm:px-6 lg:px-8 bg-seas-bgLight dark:bg-seas-bgDark transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-2xl md:text-4xl font-display font-bold mb-3">
            Onde tudo <span className="text-seas-teal">acontece</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm max-w-lg mx-auto md:mx-0">
            Navegue pelo mapa 3D do campus. Clique nos blocos ou nos links da programação para conhecer a UFC Sobral.
          </p>
        </div>

        {/* é garantida a propriedade relativa para ancorar os painéis flutuantes em cima do canvas */}
        <div className="w-full h-[500px] md:h-[600px] bg-seas-bgAltLight dark:bg-[#0a0f1d] rounded-[2rem] overflow-hidden relative border border-seas-borderLight dark:border-slate-800 shadow-xl flex flex-col">
          <Canvas camera={{fov: 40 }} className="w-full h-full">
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
            <MapScene schedule={schedule} activeLocation={activeLocation} onLocationSelect={onLocationSelect} />
          </Canvas>
          
          {/* aviso de interação flutuante */}
          {!activeLocation && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-lg text-xs font-medium text-gray-700 dark:text-gray-300 pointer-events-none flex items-center gap-2 border border-gray-200 dark:border-slate-700 z-10">
              <i className="ph-fill ph-hand-tap text-seas-green text-lg"></i> Toque nos Blocos
            </div>
          )}

          {/* painel de detalhes 2D sobreposto ao canvas */}
          {activeLocation && activeData && (
            <div className={`absolute z-20 bottom-0 left-0 w-full md:w-80 md:bottom-6 md:right-6 md:left-auto bg-white dark:bg-seas-cardDark shadow-2xl border-t md:border border-seas-borderLight dark:border-slate-700 transition-all duration-300 ease-in-out flex flex-col ${isMinimized ? 'rounded-t-2xl md:rounded-2xl h-auto' : 'rounded-t-3xl md:rounded-2xl max-h-[50%] md:max-h-[85%]'}`}>
              
              {/* cabeçalho fixo com controlos */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-700/50 shrink-0">
                <h4 className="font-display font-bold text-seas-purple text-sm leading-tight pr-2 truncate">
                  {activeData.title}
                </h4>
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="w-7 h-7 flex items-center justify-center bg-gray-100 dark:bg-slate-800 text-gray-500 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <i className={`ph-bold ${isMinimized ? 'ph-caret-up' : 'ph-caret-down'} text-xs`}></i>
                  </button>
                  <button 
                    onClick={() => onLocationSelect(null)}
                    className="w-7 h-7 flex items-center justify-center bg-gray-100 dark:bg-slate-800 text-gray-500 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <i className="ph-bold ph-x text-xs"></i>
                  </button>
                </div>
              </div>

              {/* conteúdo com scroll independente (escondido se minimizado) */}
              {!isMinimized && (
                <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
                  <img src={activeData.image} alt={activeData.title} className="w-full h-28 object-cover rounded-xl mb-4 shrink-0" />
                  
                  {Object.keys(groupedActiveEvents).length > 0 ? (
                    <div className="space-y-4">
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Eventos no Cronograma:</div>
                      {Object.entries(groupedActiveEvents).map(([date, events]) => (
                        <div key={date} className="space-y-2">
                          <span className="text-xs font-bold text-seas-green block border-b border-gray-100 dark:border-slate-700 pb-1">
                          {date}
                          </span>
                          {events.map((ev, i) => (
                            <div key={i} className="text-xs bg-gray-50 dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700">
                              <span className="font-bold text-seas-teal block mb-1">{ev.startTime} as {ev.endTime}</span>
                              <span className="text-gray-700 dark:text-gray-300 font-medium">{ev.title}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 bg-gray-50 dark:bg-slate-800 p-4 rounded-xl text-center">
                      <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">{activeData.desc}</p>
                      <p className="opacity-70 mt-2">Nenhuma atividade agendada neste local.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Informações adicionais pós-mapa com os textos ajustados */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-slate-800/30 p-4 rounded-xl border border-seas-borderLight dark:border-seas-borderDark/30">
          <div className="flex items-start gap-2">
            <i className="ph-fill ph-info text-seas-purple text-base mt-0.5"></i>
            <p className="max-w-xl">
              As proporções e medidas não são exatamente como a realidade, apenas uma aproximação para facilitar a locomoção no evento.
            </p>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap bg-seas-teal/10 px-3 py-1.5 rounded-lg text-seas-teal animate-pulse">
            <i className="ph-bold ph-mouse-left text-base"></i>
            Clique nos pontos do mapa para ver onde é!
          </div>
        </div>
      </div>
    </section>
  );
}