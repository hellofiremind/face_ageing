import '../../../dist/jeelizFaceFilterES6.js'

var THREECAMERA

// callback : launched if a face is detected or lost. TODO : add a cool particle effect WoW !
function detect_callback (faceIndex, isDetected) {
  if (isDetected) {
    console.log('INFO in detect_callback() : DETECTED')
  } else {
    console.log('INFO in detect_callback() : LOST')
  }
}

// build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene (spec) {
  const threeStuffs = THREE.JeelizHelper.init(spec, detect_callback)

  // CREATE A CUBE
  // var spriteMap = new THREE.TextureLoader().load('textures/mask.png')

  // var spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff })

  // var sprite = new THREE.Sprite(spriteMaterial)

  // sprite.scale.set(2, 2, 1)

  var loader = new THREE.TextureLoader()

  // Load an image file into a custom material
  var material = new THREE.MeshLambertMaterial({
    map: loader.load('textures/mask.png')
  })

  material.transparent = true
  material.ambient = material.color

  material.blending = THREE.CustomBlending
  material.blendEquation = THREE.AddEquation // default
  material.blendSrc = THREE.SrcAlphaFactor // default
  material.blendDst = THREE.OneMinusSrcAlphaFactor // default

  // threeStuffs.faceObject.add(sprite)
  const cubeGeometry = new THREE.PlaneGeometry(2, 2, 2)

  const cubeMaterial = new THREE.MeshNormalMaterial()

  const threeCube = new THREE.Mesh(cubeGeometry, material)

  threeCube.frustumCulled = false

  threeStuffs.faceObject.add(threeCube)
  var light = new THREE.AmbientLight(0x404040, 34
  ) // soft white light
  threeStuffs.faceObject.add(light)

  // CREATE THE CAMERA
  THREECAMERA = THREE.JeelizHelper.create_camera()
  console.log('h')
} // end init_threeScene()

// launched by body.onload() :
function main () {
  JeelizResizer.size_canvas({
    canvasId: 'jeeFaceFilterCanvas',
    callback: function (isError, bestVideoSettings) {
      init_faceFilter(bestVideoSettings)
    }
  })
} // end main()

function init_faceFilter (videoSettings) {
  JEEFACEFILTERAPI.init({
    canvasId: 'jeeFaceFilterCanvas',
    NNCpath: '../../../dist/', // root of NNC.json file
    maxFacesDetected: 1,
    callbackReady: function (errCode, spec) {
      if (errCode) {
        console.log('AN ERROR HAPPENS. ERR =', errCode)
        return
      }

      console.log('INFO : JEEFACEFILTERAPI IS READY')
      init_threeScene(spec)
    }, // end callbackReady()

    // called at each render iteration (drawing loop) :
    callbackTrack: function (detectState) {
      THREE.JeelizHelper.render(detectState, THREECAMERA)
    } // end callbackTrack()
  }) // end JEEFACEFILTERAPI.init call
} // end main()

document.body.onload = main
