function addCrosshair(scene, camera) {
  let w = 128;
  let texture = new BABYLON.DynamicTexture('crosshair', w, scene, false);
  texture.hasAlpha = true;
  let ctx = texture.getContext()
  let reticule

  const createNavigate = () => {
    ctx.fillStyle = 'black'
    ctx.clearRect(0, 0, w, w)

    ctx.strokeStyle = 'Gainsboro'
    ctx.lineWidth = 3.5
    ctx.moveTo(w * 0.5, w * 0.25)
    ctx.lineTo(w * 0.5, w * 0.75)
    ctx.moveTo(w * 0.25, w * 0.5)
    ctx.lineTo(w * 0.75, w * 0.5)
    ctx.stroke()
    ctx.beginPath()
    texture.update()
  }

  createNavigate()

  let material = new BABYLON.StandardMaterial('reticule', scene)
  material.diffuseTexture = texture
  material.opacityTexture = texture
  material.emissiveColor.set(1, 1, 1)
  material.disableLighting = true

  let plane = BABYLON.MeshBuilder.CreatePlane('reticule', { size: 0.06 }, scene)
  plane.material = material
  plane.position.set(0, 0, 2)
  plane.isPickable = false
  plane.rotation.z = Math.PI / 4

  reticule = plane
  reticule.parent = camera

  return this;
}
export default addCrosshair;