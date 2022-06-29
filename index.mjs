import { Player } from "./player.js";

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
  const _player = new Player(scene);
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

  const command = {
    frameTime: 0,
    moveForwardKeyDown: false,
    moveBackwardKeyDown: false,
    moveLeftKeyDown: false,
    moveRightKeyDown: false,
    jumpKeyDown: false,
    cameraAlpha: 0,
    cameraBeta: 0
  }

  scene.onKeyboardObservable.add(kbInfo => {
    switch (kbInfo.type) {
      case BABYLON.KeyboardEventTypes.KEYDOWN:
        switch (kbInfo.event.key) {
          case 'w':
          case 'W':
            command.moveForwardKeyDown = true;
            break;
          case 'a':
          case 'A':
            command.moveLeftKeyDown = true;
            break;
          case 's':
          case 'S':
            command.moveBackwardKeyDown = true;
            break;
          case 'd':
          case 'D':
            command.moveRightKeyDown = true;
            break;
          case ' ':
            command.jumpKeyDown = true;
            break;
        }
        break;
      case BABYLON.KeyboardEventTypes.KEYUP:
        switch (kbInfo.event.key) {
          case 'w':
          case 'W':
            command.moveForwardKeyDown = false;
            break;
          case 'a':
          case 'A':
            command.moveLeftKeyDown = false;
            break;
          case 's':
          case 'S':
            command.moveBackwardKeyDown = false;
            break;
          case 'd':
          case 'D':
            command.moveRightKeyDown = false;
            break;
          case ' ':
            command.jumpKeyDown = false;
            break;
        }
        break;
    }
  });

  scene.registerBeforeRender(() => {
    // Update camera target
    const cameraTargetMeshOffsetPosition = cameraTargetMesh.absolutePosition.add(new BABYLON.Vector3(0, 1, 0));
    camera.target.copyFrom(cameraTargetMeshOffsetPosition);

    // Player move
    command.frameTime = Date.now();
    command.cameraAlpha = camera.alpha;
    command.cameraBeta = camera.beta;
    move(command);
  });

  let prevFrameTime;
  const direction = new BABYLON.Vector3();
  const velocity = new BABYLON.Vector3();
  // @ts-ignore
  const ray = new BABYLON.Ray();
  const rayHelper = new BABYLON.RayHelper(ray);
  rayHelper.attachToMesh(_player.mesh, new BABYLON.Vector3(0, -0.995, 0), new BABYLON.Vector3(0, -1, 0), 0.1);
  rayHelper.show(scene, new BABYLON.Color3(1, 0, 0));
  let onObject = false;
  const jump = () => {
    velocity.y = 0.15;
    onObject = false;
  }
  const move = (command) => {
    if (prevFrameTime === undefined) {
      prevFrameTime = command.frameTime;
      return;
    }

    const delta = command.frameTime - prevFrameTime;

    // Raycast Method 1
    const pick = scene.pickWithRay(ray);
    if (pick) onObject = pick.hit;

    const viewAngleY = 2 * Math.PI - command.cameraAlpha;
    _player.mesh.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(0, viewAngleY, 0);

    direction.x = -(Number(command.moveForwardKeyDown) - Number(command.moveBackwardKeyDown));
    direction.z = Number(command.moveRightKeyDown) - Number(command.moveLeftKeyDown);
    direction.normalize();

    velocity.x = 0;
    velocity.z = 0;
    if (command.moveRightKeyDown || command.moveLeftKeyDown) velocity.z = direction.z * delta / 300;
    if (command.moveForwardKeyDown || command.moveBackwardKeyDown) velocity.x = direction.x * delta / 300;

    // velocity.y = command.startVelocityY;
    velocity.y -= delta / 3000;
    if (onObject) velocity.y = Math.max(0, velocity.y);

    if (command.jumpKeyDown && onObject) jump();

    const rotationAxis = BABYLON.Matrix.RotationAxis(BABYLON.Axis.Y, viewAngleY);
    const rotatedVelocity = BABYLON.Vector3.TransformCoordinates(velocity, rotationAxis);
    _player.mesh.moveWithCollisions(rotatedVelocity);

    prevFrameTime = command.frameTime;
  }

  const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);

  return scene;
}
const scene = createScene();
engine.runRenderLoop(function () {
  scene.render();
});
