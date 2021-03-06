import Npc from "../CLIENT/assets/npc.js";
import Player from "../CLIENT/assets/player.js";
import Able from "./assets/abel.js";
import Stairs from "./assets/stairs.js";
import addCrosshair from "./util/crosshair.js";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = function () {
  const scene = new BABYLON.Scene(engine);
  const camera = new BABYLON.ArcRotateCamera('camera', 0, Math.PI / 2, 5, new BABYLON.Vector3(), scene);
  camera.angularSensibilityX = 1000;
  camera.angularSensibilityY = 2000;
  camera.lowerRadiusLimit = 3;
  camera.upperRadiusLimit = 20;
  camera.inertia = 0;
  camera.attachControl(canvas, true);

  let isLocked = false;
  scene.onKeyboardObservable.add((kbInfo) => {
    if (kbInfo.type == BABYLON.KeyboardEventTypes.KEYDOWN && kbInfo.event.key == 'v') {
      switch (document.pointerLockElement) {
        case null:
          canvas.requestPointerLock();
          isLocked = true;
          break;
        case canvas:
          document.exitPointerLock();
          isLocked = false;
          break;
      }
    }
  })
  //create crosshair
  const _crosshair = addCrosshair(scene, camera);

  //create Player
  const _player = new Player(scene, 0, 0);

  const _abel = Able(scene);

  //create camera target (invisible)
  const cameraTargetMesh = BABYLON.MeshBuilder.CreateBox('box', { height: 1 }, scene);
  cameraTargetMesh.visibility = 0;
  cameraTargetMesh.setParent(_player.mesh);
  //camera position
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
  //create stairs
  const _stairs = new Stairs(scene, 3, 14, 0.5, -4, 0, Math.PI / 2.8);
  obstacles.push(_stairs);

  //create npc
  const _npc = new Npc(scene, -5, -4);
  obstacles.push(_npc.mesh);

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