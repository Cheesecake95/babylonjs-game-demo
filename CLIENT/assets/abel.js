function Abel(scene) {
  BABYLON.SceneLoader.ImportMesh("", "./models/", "Abel.glb", scene, function (newMeshes, particleSystems, skeletons, animationGroups) {
    var abel = newMeshes[0];
    console.log(animationGroups);

  })
  return this;
}
export default Abel;