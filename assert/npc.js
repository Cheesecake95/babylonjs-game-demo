function Npc(scene, x, z) {
  this.mesh = BABYLON.MeshBuilder.CreateBox('box', { height: 2 }, scene);
  this.material = new BABYLON.StandardMaterial("Mat", scene);
  this.material.diffuseColor = new BABYLON.Color3(0.3, 0.9, 0.4);
  this.mesh.material = this.material;
  this.mesh.isPickable = true;
  this.mesh.position.y += 1;
  this.mesh.position.x += x;
  this.mesh.position.z += z;

  return this;
}
export default Npc;