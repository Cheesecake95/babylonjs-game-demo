export class Player {
  constructor(scene) {
    this.mesh = BABYLON.MeshBuilder.CreateBox('box', { height: 2 }, scene);
    this.material = new BABYLON.StandardMaterial("Mat", scene);
    this.material.diffuseColor = new BABYLON.Color3(0, 1, 2);
    this.mesh.material = this.material;
    this.mesh.isPickable = false;
    this.mesh.position.y += 4;
  }
}