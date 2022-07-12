import Npc from "../CLIENT/assets/npc.js";
import Player from "../CLIENT/assets/player.js";
import Stairs from "./assets/stairs.js";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
// const socket = new WebSocket("wss://65loa4x8k0.execute-api.ap-northeast-1.amazonaws.com/production");
// //连接建立时触发
// socket.onopen = function () {
//   //调用LAMBDA的$connect发送“已进入房间”
//   socket.send(`"action":"$connect"`);
// }
// //收到消息时触发
// socket.onmessage = function (event) {
//   console.log(event.data);
// };
const createScene = function () {
  const scene = new BABYLON.Scene(engine);
  const camera = new BABYLON.ArcRotateCamera('camera', 0, Math.PI / 2, 5, new BABYLON.Vector3(), scene);
  camera.angularSensibilityX = 1000;
  camera.angularSensibilityY = 2000;
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
  //highlight
  var hl = new BABYLON.HighlightLayer("hl1", scene, {
    isStroke: true,
  });
  hl.blurHorizontalSize = 0.1;
  hl.blurVerticalSize = 0.1;
  //create npc
  const _npc = new Npc(scene, -5, -4);
  obstacles.push(_npc.mesh);

  //TODO=============================
  if (_npc.mesh.position.subtract(_player.mesh.position).length() >= 2) {
    hl.addMesh(_npc.mesh, BABYLON.Color3.Green());
    console.log('close to npc')
  }

  // _npc.area.actionManager = new BABYLON.ActionManager(scene);
  // _npc.area.actionManager.registerAction(new BABYLON.ExecuteCodeAction({ trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: _player.mesh }, function (ev) {
  //   scene.hoverCursor = "pointer";
  // }));
  // _npc.area.actionManager.registerAction(new BABYLON.ExecuteCodeAction({ trigger: BABYLON.ActionManager.OnIntersectionExitTrigger, parameter: _player.mesh }, function (ev) {
  //   hl.removeMesh(_npc.mesh, BABYLON.Color3.Green());
  // }));

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