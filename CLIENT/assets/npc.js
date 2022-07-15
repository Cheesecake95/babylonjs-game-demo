function Npc(scene, x, z) {
  this.mesh = BABYLON.MeshBuilder.CreateBox('box', { height: 2 }, scene);
  this.material = new BABYLON.StandardMaterial("Mat", scene);
  this.material.diffuseColor = new BABYLON.Color3(0.3, 0.9, 0.4);
  this.mesh.material = this.material;
  this.mesh.isPickable = true;
  this.mesh.position.y += 1;
  this.mesh.position.x += x;
  this.mesh.position.z += z;
  this.mesh.checkCollisions = true;

  var hl = new BABYLON.HighlightLayer("hl1", scene, {
    isStroke: true,
  });
  hl.blurHorizontalSize = 0.1;
  hl.blurVerticalSize = 0.1;

  this.mesh.actionManager = new BABYLON.ActionManager(scene);
  this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
    {
      trigger: BABYLON.ActionManager.OnLeftPickTrigger,
    },
    function () {
      console.log("I AM TRIGGERED");
    })
  );

  return this;
}
export default Npc;