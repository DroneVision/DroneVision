import * as THREE from 'three';

export const createObjGroup = objList => {
  const objGroup = new THREE.Group();
  objList
    .filter(obj => obj.visible)
    .forEach(obj => {
      const clonedObj = obj.ref.clone();
      objGroup.add(clonedObj);
      const clonedEdges = obj.lineRef.clone();
      objGroup.add(clonedEdges);
    });
  return objGroup;
};
