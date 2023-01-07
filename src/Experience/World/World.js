import Experience from '../Experience.js'
import Environment from './Environment.js'
import FBOParticle from './FBOParticle.js'
import Floor from './Floor.js'
import Fox from './Fox.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.fboParticle = new FBOParticle()
            // this.floor = new Floor()
            // this.fox = new Fox()
            this.environment = new Environment()
        })
    }

    update()
    {
        if(this.fox)
            this.fox.update()
        if(this.fboParticle)
        {
            this.fboParticle.update()
        }
    }
}