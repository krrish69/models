import './style.css'

import * as THREE from 'three'
import gsap from 'gsap'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import { AdditiveBlending, PointsMaterial, Texture, TextureLoader } from 'three'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js'
import CANNON from 'cannon'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js'

const gui=new dat.GUI({closed:true,width:250})
//Textures
const text=new THREE.TextureLoader()
const cubtext=new THREE.CubeTextureLoader()
const texture=text.load('./Sun1.jpeg')
const texture1=text.load('./Earth.jpeg')
const texture3=text.load('./Neptune.jpeg')
const envi=cubtext.load([
    '/Standard-Cube-Map-4/px.png',
    '/Standard-Cube-Map-4/nx.png',
    '/Standard-Cube-Map-4/py.png',
    '/Standard-Cube-Map-4/ny.png',
    '/Standard-Cube-Map-4/pz.png',
    '/Standard-Cube-Map-4/nz.png'
])

const parttext=text.load('/particles/1.png')
texture.magFilter=THREE.NearestFilter
texture1.magFilter=THREE.NearestFilter

//Text Texture
const matcap=text.load('/textures/matcaps/6.png')

//Physics World
/* const world=new CANNON.World()
world.gravity.set(0,-9.82,0)

const sphere=new CANNON.Sphere(0.5)
const spbody=new CANNON.Body({
    mass:1,
    position:new CANNON.Vec3(0,3,0),
    shape:sphere
    
})
world.addBody(spbody) */

//Canvas
const can=document.querySelector('.webgl') 

//Text Geometry
const font=new FontLoader()
font.load(
    '/fonts/helvetiker_bold.typeface.json',
    (font)=>
    {
        const textgeo=new TextGeometry(
            'S T A R T U P S H I V E',
            {
                font:font,
                size:0.275,
                height:0,
                curveSegments:6,
                bevelEnabled:true,
                bevelThickness:0.009,
                bevelSize:0.003,
                bevelOffset:0,
                bevelSegments:5
                
            }
            
        )
        textgeo.center()
        const textmat=new THREE.MeshMatcapMaterial({matcap:matcap})
        const texting=new THREE.Mesh(textgeo,textmat)
        texting.position.set(2.8,2.5,-0.5)
        scene.add(texting)
    }
)

const scene=new THREE.Scene()
//Adding environment map to background
/* scene.background=envi */

//Models
const draco=new DRACOLoader()
draco.setDecoderPath('/draco/')
const gltf=new GLTFLoader()
gltf.setDRACOLoader(draco)
let mixer=null
gltf.load(
    '/models/space.glb',
    (gltf) =>
    {
        /* const children=[...gltf.scene.children]
        for(const child of children)
        {
            scene.add(child)
        } */

        /* mixer=new THREE.AnimationMixer(gltf.scene)
        const action=mixer.clipAction(gltf.animations[2])
        action.play() */
        gltf.scene.scale.set(0.7,0.7,0.7) 
        scene.add(gltf.scene)
        gltf.scene.position.set(1,-0.9,1)
        gltf.scene.rotation.z=Math.PI *4
    }
)

const gltf1=new GLTFLoader()
gltf1.setDRACOLoader(draco)
let mixer1=null
gltf.load(
    '/models/astro.glb',
    (gltf1) =>
    {
        /* const children=[...gltf.scene.children]
        for(const child of children)
        {
            scene.add(child)
        } */

        /* mixer=new THREE.AnimationMixer(gltf.scene)
        const action=mixer.clipAction(gltf.animations[2])
        action.play() */
        gltf1.scene.scale.set(0.007,0.007,0.007) 
        scene.add(gltf1.scene)
        gltf1.scene.position.set(1.5,-0.9,1)
        gltf1.scene.rotation.z=Math.PI *4
    }
)
//Sun
const group1=new THREE.Group()
scene.add(group1)

const Sun=new THREE.Mesh(
    new THREE.SphereGeometry(1.6,70),
    new THREE.MeshStandardMaterial({
        map:texture
        
    })
)
Sun.position.set(-4.5,2.7,0)
Sun.color=new THREE.Color('red')

group1.add(Sun)

//Earth
const group2=new THREE.Group()
scene.add(group2)
const Earth=new THREE.Mesh(
    new THREE.SphereGeometry(4,70),
    new THREE.MeshStandardMaterial({
        roughness:0,
        metalness:0.7,
        envMap:envi,
       
    })
)
Earth.position.set(2.9,-5,0)

group2.add(Earth)

//Particles
const part=new THREE.BufferGeometry(1,32)
const parti=new THREE.PointsMaterial({
    size:0.08,
    sizeAttenuation:true,
    transparent:true,
    alphaMap:parttext,
    depthTest:false,
    depthWrite:false
})
const particles=new THREE.Points(part,parti)
scene.add(particles) 

//const part=new THREE.BufferGeometry()
const count=1900
const post=new Float32Array(count*3)

for(let i=0;i<count;i++)
{
    post[i]=(Math.random()-0.5)*10
}
part.setAttribute('position',new THREE.BufferAttribute(post,3))

//Light

/* const point1=new THREE.PointLight(0xffffff,1)
point1.position.set(1.7,2,0)
scene.add(point1) */
/* const direction=new THREE.DirectionalLight(0xffffff,1)
scene.add(direction)
direction.position.set(0.25,3,-2.25) */
const ambient=new THREE.AmbientLight(0xffffff,0.5)
scene.add(ambient)

 const point=new THREE.PointLight(0xffffff,0.1)
point.position.x=4
point.position.y=4
point.position.z=4
scene.add(point) 



const hemdir=new THREE.HemisphereLight(0x0000ff,0xFFFFFF ,0.9)
scene.add(hemdir)

/* const rect=new THREE.RectAreaLight(0xffffff,5,3,3)
rect.position.set(2,-2,3)
scene.add(rect) */

/* const spoy=new THREE.SpotLight(0xffa500,2,10,Math.PI,0,1)
spoy.position.set(1,0.5,-2)
scene.add(spoy) */

/* spoy.castShadow=true
spoy.shadow.mapSize.width=1024
spoy.shadow.mapSize.height=1024
spoy.shadow.camera.near=1
spoy.shadow.camera.far=6

const spothelper=new THREE.CameraHelper(spoy.shadow.camera)
scene.add(spothelper) */


//Data GUI
const trip={
    earth:() =>
    {
        Earth.rotation.x=4
        Earth.rotation.y=4
        Earth.rotation.z=4
    },
    sun:() =>
    {
        Sun.rotation.x=4
        Sun.rotation.y=4
        Sun.rotation.z=4
    }

}

gui.hide()

const gp1=gui.addFolder('Sun Position')
gp1.add(Earth.position,'x',-10,10,0.1)
gp1.add(Earth.position,'y',-10,10,0.1)
gp1.add(Earth.position,'z',-10,10,0.1)
const gp3=gui.addFolder('Earth Position')
gp3.add(Earth.position,'x',-10,10,0.1)
gp3.add(Earth.position,'y',-10,10,0.1)
gp3.add(Earth.position,'z',-10,10,0.1)
/* gui.add(Earth,'wireframe')
gui.add(Sun,'wireframe') */
const gp5=gui.addFolder('Visibility')
gp5.add(Sun,'visible')
gp5.add(Earth,'visible')
//gui.addColor(Earth,'color')
const gp2=gui.addFolder('Earth Rotation')
gp2.add(Earth.rotation,'x',-1,10,0.01)
gp2.add(Earth.rotation,'y',-1,10,0.01)
gp2.add(Earth.rotation,'z',-1,1,0.01)
const gp4=gui.addFolder('Sun Rotation')
gp4.add(Sun.rotation,'x',-1,10,0.01)
gp4.add(Sun.rotation,'y',-1,10,0.01)
gp4.add(Sun.rotation,'z',-1,1,0.01)
gui.add(trip,'earth')
gui.add(trip,'sun')



//Set Size
const size={
    width:window.innerWidth,
    height:window.innerHeight

}

//Resize event
window.addEventListener('resize',()=>
{
    size.width=window.innerWidth,
    size.height=window.innerHeight,
    cam.aspect=size.width/size.height,
    cam.updateProjectionMatrix(),
    rend.setSize(size.width,size.height)
    rend.setPixelRatio(Math.min(window.devicePixelRatio,2))
})

window.addEventListener('dblclick',()=>
{
    if(!document.fullscreenElement)
    {
        can.requestFullscreen()
    }
    else
    {
        document.exitFullscreen()
    }
})

//Camera
const cam=new THREE.PerspectiveCamera(65,size.width/size.height)
cam.position.z=4
cam.lookAt(group1.position)
cam.lookAt(group2.position)
scene.add(cam)

//Orbit controls
 const controls=new OrbitControls(cam,can)
controls.enableDamping=true 

//Render
const rend=new THREE.WebGLRenderer({
    canvas:can
})
rend.setSize(size.width,size.height)
//document.body.appendChild(rend.domElement)
rend.render(scene,cam)
rend.setPixelRatio(Math.min(window.devicePixelRatio,2))
rend.outputEncoding=THREE.sRGBEncoding
//rend.toneMapping=THREE.ReinhardToneMapping

const clock=new THREE.Clock()
let old=0
const yo=()=>
{
    const elapse=clock.getElapsedTime()

    //Physical World
    const delta=elapse-old
    old=elapse
    //world.step(1/60,delta,3) 
    Sun.rotation.x+=0.0002
    Earth.rotation.x+=0.001
    Earth.rotation.y+=0.001
    //Sun.rotation.z+=0.01
    particles.rotation.y+=0.0002
    // To make particles move in waves
    /* for(let i=0;i<count;i++)
    {
        const i3=i * 3
        const x=part.attributes.position.array[i3]
        part.attributes.position.array[i3+1]=Math.sin(elapse + x)
    }
    part.attributes.position.needsUpdate=true */
    

    /* cam.position.x=Math.sin(cursor.x *Math.PI*2) *5
    cam.position.z=Math.cos(cursor.x *Math.PI*2) *5
    cam.position.y=cursor.y *5
    cam.lookAt(mesh.position) */

    //Mixer
    if(mixer !==null)
    {
        mixer.update(delta)
    }

    if(mixer1 !==null)
    {
        mixer1.update(delta)
    }
    controls.update()
    
    rend.render(scene,cam)

    window.requestAnimationFrame(yo)


} 

yo()