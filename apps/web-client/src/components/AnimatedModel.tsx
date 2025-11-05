/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AnimatedModelProps {
  action?: string;
  mousePosition: { x: number; y: number };
}

export default function AnimatedModel({
  action = "wave",
  mousePosition,
}: AnimatedModelProps) {
  const group = useRef<THREE.Group>(null);
  const previousAction = usePrevious(action);
  const { nodes, materials, animations } = useGLTF("/animated.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions[action]) {
      if (previousAction && actions[previousAction]) {
        actions[previousAction].fadeOut(0.2);
      }
      actions[action].reset();
      actions[action].play();
      actions[action].fadeIn(0.2);
    }
  }, [actions, action, previousAction]);

  // Modify skin tone to be fairer
  useEffect(() => {
    if (
      materials["Wolf3D_Skin.001"] &&
      "color" in materials["Wolf3D_Skin.001"]
    ) {
      (materials["Wolf3D_Skin.001"] as any).color.set("#ffd4b8"); // Fairer skin tone
    }
    if (
      materials["Wolf3D_Body.001"] &&
      "color" in materials["Wolf3D_Body.001"]
    ) {
      (materials["Wolf3D_Body.001"] as any).color.set("#ffd4b8"); // Fairer skin tone
    }
  }, [materials]);

  // Make the model follow the cursor
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        mousePosition.x * 0.3,
        0.1
      );
    }
  });

  return (
    <group ref={group} dispose={null}>
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <primitive object={nodes.mixamorigHips} />

        <skinnedMesh
          geometry={(nodes.Wolf3D_Outfit_Top001_1 as any).geometry}
          material={materials["Wolf3D_Outfit_Top.001"]}
          skeleton={(nodes.Wolf3D_Outfit_Top001_1 as any).skeleton}
          morphTargetDictionary={
            (nodes.Wolf3D_Outfit_Top001_1 as any).morphTargetDictionary
          }
          morphTargetInfluences={
            (nodes.Wolf3D_Outfit_Top001_1 as any).morphTargetInfluences
          }
        />
        <skinnedMesh
          geometry={(nodes.Wolf3D_Outfit_Top001_2 as any).geometry}
          material={materials["Wolf3D_Eye.001"]}
          skeleton={(nodes.Wolf3D_Outfit_Top001_2 as any).skeleton}
          morphTargetDictionary={
            (nodes.Wolf3D_Outfit_Top001_2 as any).morphTargetDictionary
          }
          morphTargetInfluences={
            (nodes.Wolf3D_Outfit_Top001_2 as any).morphTargetInfluences
          }
        />
        <skinnedMesh
          geometry={(nodes.Wolf3D_Outfit_Top001_3 as any).geometry}
          material={materials["Wolf3D_Skin.001"]}
          skeleton={(nodes.Wolf3D_Outfit_Top001_3 as any).skeleton}
          morphTargetDictionary={
            (nodes.Wolf3D_Outfit_Top001_3 as any).morphTargetDictionary
          }
          morphTargetInfluences={
            (nodes.Wolf3D_Outfit_Top001_3 as any).morphTargetInfluences
          }
        />
        <skinnedMesh
          geometry={(nodes.Wolf3D_Outfit_Top001_4 as any).geometry}
          material={materials["Wolf3D_Teeth.001"]}
          skeleton={(nodes.Wolf3D_Outfit_Top001_4 as any).skeleton}
          morphTargetDictionary={
            (nodes.Wolf3D_Outfit_Top001_4 as any).morphTargetDictionary
          }
          morphTargetInfluences={
            (nodes.Wolf3D_Outfit_Top001_4 as any).morphTargetInfluences
          }
        />
        <skinnedMesh
          geometry={(nodes.Wolf3D_Outfit_Top001_5 as any).geometry}
          material={materials["Wolf3D_Body.001"]}
          skeleton={(nodes.Wolf3D_Outfit_Top001_5 as any).skeleton}
          morphTargetDictionary={
            (nodes.Wolf3D_Outfit_Top001_5 as any).morphTargetDictionary
          }
          morphTargetInfluences={
            (nodes.Wolf3D_Outfit_Top001_5 as any).morphTargetInfluences
          }
        />
        <skinnedMesh
          geometry={(nodes.Wolf3D_Outfit_Top001_6 as any).geometry}
          material={materials["Wolf3D_Outfit_Bottom.001"]}
          skeleton={(nodes.Wolf3D_Outfit_Top001_6 as any).skeleton}
          morphTargetDictionary={
            (nodes.Wolf3D_Outfit_Top001_6 as any).morphTargetDictionary
          }
          morphTargetInfluences={
            (nodes.Wolf3D_Outfit_Top001_6 as any).morphTargetInfluences
          }
        />
        <skinnedMesh
          geometry={(nodes.Wolf3D_Outfit_Top001_7 as any).geometry}
          material={materials["Wolf3D_Outfit_Footwear.001"]}
          skeleton={(nodes.Wolf3D_Outfit_Top001_7 as any).skeleton}
          morphTargetDictionary={
            (nodes.Wolf3D_Outfit_Top001_7 as any).morphTargetDictionary
          }
          morphTargetInfluences={
            (nodes.Wolf3D_Outfit_Top001_7 as any).morphTargetInfluences
          }
        />
        <skinnedMesh
          geometry={(nodes.Wolf3D_Outfit_Top001_8 as any).geometry}
          material={materials["Wolf3D_Hair.001"]}
          skeleton={(nodes.Wolf3D_Outfit_Top001_8 as any).skeleton}
          morphTargetDictionary={
            (nodes.Wolf3D_Outfit_Top001_8 as any).morphTargetDictionary
          }
          morphTargetInfluences={
            (nodes.Wolf3D_Outfit_Top001_8 as any).morphTargetInfluences
          }
        />
        <skinnedMesh
          geometry={(nodes.Wolf3D_Outfit_Top001_9 as any).geometry}
          material={materials["Wolf3D_Glasses.001"]}
          skeleton={(nodes.Wolf3D_Outfit_Top001_9 as any).skeleton}
          morphTargetDictionary={
            (nodes.Wolf3D_Outfit_Top001_9 as any).morphTargetDictionary
          }
          morphTargetInfluences={
            (nodes.Wolf3D_Outfit_Top001_9 as any).morphTargetInfluences
          }
        />
      </group>
    </group>
  );
}

useGLTF.preload("/animated.glb");

function usePrevious(value: string) {
  const ref = useRef<string>(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
