import keysDown from "../CLIENT/util/controller.js";

function Player(scene, x, z) {
  this.mesh = BABYLON.MeshBuilder.CreateBox('box', { height: 2 }, scene);
  this.material = new BABYLON.StandardMaterial("Mat", scene);
  this.material.diffuseColor = new BABYLON.Color3(0, 1, 2);
  this.mesh.material = this.material;
  this.mesh.isPickable = false;
  this.mesh.position.y += 1;
  this.mesh.position.x += x;
  this.mesh.position.z += z;


  this._keyDown = new keysDown(scene);
  let prevFrameTime;
  const direction = new BABYLON.Vector3();
  const velocity = new BABYLON.Vector3();
  const ray = new BABYLON.Ray();
  const rayHelper = new BABYLON.RayHelper(ray);
  rayHelper.attachToMesh(this.mesh, new BABYLON.Vector3(0, -1, 0), new BABYLON.Vector3(0, -0.95, 0), 0.1);
  rayHelper.show(scene, new BABYLON.Color3.Red());
  let onObject = false;
  this.jump = () => {
    velocity.y = 0.15;
    onObject = false;
  }
  this.move = (command) => {
    if (prevFrameTime === undefined) {
      prevFrameTime = command.frameTime;
      return;
    }
    const delta = command.frameTime - prevFrameTime;

    // Raycast
    const pick = scene.pickWithRay(ray);
    if (pick) onObject = pick.hit;

    const viewAngleY = 2 * Math.PI - command.cameraAlpha;
    this.mesh.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(0, viewAngleY, 0);

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

    if (command.jumpKeyDown && onObject) this.jump();

    const rotationAxis = BABYLON.Matrix.RotationAxis(BABYLON.Axis.Y, viewAngleY);
    const rotatedVelocity = BABYLON.Vector3.TransformCoordinates(velocity, rotationAxis);
    this.mesh.moveWithCollisions(rotatedVelocity);

    prevFrameTime = command.frameTime;
  }

  return this;
}
export default Player;