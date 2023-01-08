import * as THREE from 'three';
import vertex from '../Shaders/vertexParticles.glsl'
import fragment from '../Shaders/fragment.glsl'
import fragmentPos from '../Shaders/fragmentPos.glsl'
import fragmentVel from '../Shaders/fragmentVel.glsl'
import fragmentAcc from '../Shaders/fragmentAcc.glsl'
import Experience from '../Experience.js';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'

export default class FBOParticle
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.renderer = this.experience.renderer.instance 
        this.resources = this.experience.resources
        
        this.resource = this.resources.items.catModel

        this.mouse = new THREE.Vector2();

        this.uniforms = {};
        this.width = 32;
        this.setMesh()
        this.iniGPGPU()
        this.setMouse()
       // console.log('fboHi')
        this.time = 0;
    }

    setMesh()
    {
        this.model = this.resource.scene.children[0].children[0]
        this.model.scale.set(10,10,10)
        this.model.position.set(0,-1,0)


        //this.scene.add(this.model)
        this.catPos = this.model.geometry.attributes.position.array
        this.catNumber  = this.catPos.length / 3

       // console.log(this.catPos)

        this.material = new THREE.ShaderMaterial(
            {
                extensions:"#extension GL_OES_standard_derivatives: enable",
                uniforms: 
                {
                    timer: {value: 0},
                    positionTexture: {value:null},
                    velocityTexture: { value:null},
                    accelerationTexture: { value: null},
                    resolution: {value: new THREE.Vector4()}
                },
                vertexShader: vertex,
                fragmentShader: fragment
            }
        )
        this.geometry = new THREE.BufferGeometry();
        let positions = new Float32Array(this.width*this.width*3);
        let reference = new Float32Array(this.width*this.width*2)
        for(let i=0; i<this.width*this.width; i++)
        {
            let x = Math.random() 
            let y = Math.random() 
            let z = Math.random() 

            let xx = (i%this.width) / this.width
            let yy = ~~(i/this.width) / this.width//~~를 쓰는 이유는 소수점을 버리는 floor와 같지만 조금더 빠드라고해서 쓴다.
            //let yy = Math.floor((i/this.width) / this.width)


            positions.set([x,y,z],i*3)
            reference.set([xx,yy],i*2)

           
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions,3))
        this.geometry.setAttribute('reference', new THREE.BufferAttribute(reference,2))

        this.mesh = new THREE.Points(this.geometry, this.material)
        this.scene.add(this.mesh);
       // console.log(reference)
    }

    iniGPGPU()
    {
        this.gpuCompute = new GPUComputationRenderer(this.width,this.width,this.renderer)

        this.dtPosition = this.gpuCompute.createTexture()
        this.fillPosition(this.dtPosition);

        this.dtVelocity = this.gpuCompute.createTexture()
        this.fillVel(this.dtVelocity);

        this.dtAcceleration = this.gpuCompute.createTexture()
        this.fillAcc(this.dtAcceleration);

       // console.log(this.dtAcceleration)
    
        this.positionVariable = this.gpuCompute.addVariable('texturePosition', fragmentPos, this.dtPosition)
        this.positionVariable.material.uniforms['timer'] = {value:0}
        this.positionVariable.wrapS = THREE.RepeatWrapping
        this.positionVariable.wrapT = THREE.RepeatWrapping



        this.velocityVariable = this.gpuCompute.addVariable('textureVelocity', fragmentVel, this.dtVelocity)
        this.velocityVariable.material.uniforms['force'] = {value: new THREE.Vector3(0.001,-0.001,0.0)}
        this.velocityVariable.wrapS = THREE.RepeatWrapping
        this.velocityVariable.wrapT = THREE.RepeatWrapping


        this.accelerationVariable = this.gpuCompute.addVariable('textureAcceleration', fragmentAcc, this.dtAcceleration)
        this.accelerationVariable.wrapS = THREE.RepeatWrapping
        this.accelerationVariable.wrapT = THREE.RepeatWrapping

        this.gpuCompute.setVariableDependencies( this.positionVariable,     [ this.positionVariable, this.velocityVariable, this.accelerationVariable ] );
        this.gpuCompute.setVariableDependencies( this.velocityVariable,     [ this.positionVariable, this.velocityVariable, this.accelerationVariable ] ); 
        this.gpuCompute.setVariableDependencies( this.accelerationVariable, [ this.positionVariable, this.velocityVariable, this.accelerationVariable ] );
       
       
        //console.log(this.dtPosition)

        this.gpuCompute.init()
        // const error = gpuCompute.init();

		// 		if ( error !== null ) {

		// 			console.error( error );

		// 		}
    }

    fillPosition(texture)
    {
        let posArr  =  texture.image.data
        for(let i=0; i<posArr.length; i=i+4)
        {
            
            // let x = Math.random()
            // let y = Math.random()
            // let z = Math.random()

            let x = (Math.random()-0.5) * 6
            let y = Math.random() + 5
            let z = (Math.random()-0.5) * 6
            
            posArr[i] = x
            posArr[i+1] = y
            posArr[i+2] = z
            posArr[i+3] = 1
        }
        //console.log(arr)
    }

    fillVel(texture)
    {
        let velArr  =  texture.image.data
        for(let i=0; i<velArr.length; i=i+4)
        {
            
            let x = (Math.random()-0.5)  * 0.09
            let y = (Math.random()-0.5)  * 0.086
            let z = (Math.random()-0.5)  * 0.0982

            // let x = 0
            // let y = 0
            // let z = 0
            
            velArr[i] = x
            velArr[i+1] = y
            velArr[i+2] = z
            velArr[i+3] = 1
        }
        //console.log(arr)
    }

    fillAcc(texture)
    {
        let accArr  =  texture.image.data
        for(let i=0; i<accArr.length; i=i+4)
        {
           
            // let x = Math.random()
            // let y = Math.random()
            // let z = Math.random()

            let x = 0
            let y = 0
            let z = 0
            
            accArr[i] = 0.001
            accArr[i+1] = -0.01
            accArr[i+2] = 0
            accArr[i+3] = 1
        }
    }


    update()
    {
        this.time += 0.1;
        this.gpuCompute.compute()
        this.material.uniforms.positionTexture.value = this.gpuCompute.getCurrentRenderTarget(this.positionVariable).texture
        this.material.uniforms.velocityTexture.value = this.gpuCompute.getCurrentRenderTarget(this.velocityVariable).texture
        this.material.uniforms.accelerationTexture.value = this.gpuCompute.getCurrentRenderTarget(this.accelerationVariable).texture
        this.positionVariable.material.uniforms['timer'].value = this.time;
       // this.velocityVariable.material.uniforms['force'].value = new THREE.Vector3(0.0,-0.01,0.0);
    }

    setMouse()
    {
       window.addEventListener('mousemove',(event)=>{

            this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        
           // console.log(this.mouse.x, this.mouse.y)
        })

    }

    
}


