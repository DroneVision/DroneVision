import * as THREE from 'three';

export const createSceneObjs = (objList, selectedObjId) => {
  const allObjs = new THREE.Group();
  objList
    .filter(obj => obj.visible)
    .forEach(obj => {
      obj.selected = obj.id === selectedObjId;
      const objGroup = createCube(obj);
      allObjs.add(objGroup);
    });
  return allObjs;
};

const createCube = ({ id, length, width, height, position, selected }) => {
  const { x, y, z } = position;
  const objGeometry = new THREE.CubeGeometry(width, height, length);
  const objMaterial = new THREE.MeshPhongMaterial({
    color: 0x6666ff,
    flatShading: false,
  });
  const objEdges = new THREE.EdgesGeometry(objGeometry);
  const objLines = new THREE.LineSegments(
    objEdges,
    new THREE.LineBasicMaterial({ color: selected ? 0xccff00 : 0x000000 })
  );
  const obj = new THREE.Mesh(objGeometry, objMaterial);
  obj.position.set(x, y, z);
  objLines.position.set(x, y, z);
  obj.name = `${id}`;
  objLines.name = `${id}-lines`;

  const objGroup = new THREE.Group();
  objGroup.add(obj);
  objGroup.add(objLines);
  objGroup.name = `${id}-group`;
  return objGroup;
};

// // need to get reference to the object in order to remove it
// const objToRemove = canvasScene.getObjectByName(sceneObj.ref.name);
// const lineToRemove = canvasScene.getObjectByName(sceneObj.lineRef.name);
// canvasScene.remove(objToRemove.name);
// canvasScene.remove(lineToRemove.name);
