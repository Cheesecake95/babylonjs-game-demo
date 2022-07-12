function Stairs(scene, w, h, d, x, y, rotation) {
  this.mesh = BABYLON.MeshBuilder.CreateBox('slide', { width: w, height: h, depth: d }, scene);
  this.mesh.position.x += x;
  this.mesh.position.y += y;
  this.mesh.rotation.x += rotation;
  this.mesh.checkCollisions = true;

  return this;
}
export default Stairs;

// Math.PI / 2.8