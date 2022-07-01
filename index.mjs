import Npc from "./assert/npc.js";
import Player from "./assert/player.js";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = function () {
  const scene = new BABYLON.Scene(engine);
  const camera = new BABYLON.ArcRotateCamera('camera', 0, Math.PI / 2, 5, new BABYLON.Vector3(), scene);
  camera.angularSensibilityX = 500;
  camera.angularSensibilityY = 500;
  camera.inertia = 0;
  camera.attachControl(canvas, false);

  let isLocked = false;
  scene.onPointerDown = evt => {
    if (!isLocked) {
      canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
      if (canvas.requestPointerLock) {
        canvas.requestPointerLock();
        return;
      }
    }
  }

  const pointerlockchange = () => {
    // @ts-ignore
    const controlEnabled = document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement || document.pointerLockElement || null;
    if (!controlEnabled) {
      isLocked = false;
    } else {
      isLocked = true;
    }
  };
  document.addEventListener('pointerlockchange', pointerlockchange, false);
  document.addEventListener('mspointerlockchange', pointerlockchange, false);
  document.addEventListener('mozpointerlockchange', pointerlockchange, false);
  document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

  //create Player
  const _player = new Player(scene, 0, 0);
  //create npc
  const _npc = new Npc(scene, -5, -4);
  _npc.mesh.checkCollisions = true;
  //create camera target (invisible)
  const cameraTargetMesh = BABYLON.MeshBuilder.CreateBox('box', { height: 2 }, scene);
  cameraTargetMesh.visibility = 0;
  cameraTargetMesh.setParent(_player.mesh);
  cameraTargetMesh.position = new BABYLON.Vector3(0, 0, 1);

  //Obstacles, ground
  const obstacles = new Array();
  //ground
  const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 50, height: 50 }, scene);
  const groundMaterial = new BABYLON.StandardMaterial('groundMaterial', scene);
  groundMaterial.diffuseColor = new BABYLON.Color3(0.55, 0.8, 0.35);
  ground.material = groundMaterial;
  ground.checkCollisions = true;
  obstacles.push(ground);
  //slide terrain
  const slide = BABYLON.MeshBuilder.CreateBox('slide', { width: 3, height: 20 }, scene);
  slide.position.x += -3;
  slide.position.y += 0;
  slide.rotation.x += Math.PI / 2.8;
  slide.checkCollisions = true;
  obstacles.push(slide);

  scene.registerBeforeRender(() => {
    // Update camera target
    const cameraTargetMeshOffsetPosition = cameraTargetMesh.absolutePosition.add(new BABYLON.Vector3(0, 1, 0));
    camera.target.copyFrom(cameraTargetMeshOffsetPosition);

    // Player move
    _player._keyDown.command.frameTime = Date.now();
    _player._keyDown.command.cameraAlpha = camera.alpha;
    _player._keyDown.command.cameraBeta = camera.beta;
    _player.move(_player._keyDown.command);
  });

  const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);

  return scene;
}
const scene = createScene();
engine.runRenderLoop(function () {
  scene.render();
});
