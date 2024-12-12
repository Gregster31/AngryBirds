import Input from "../../lib/Input.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { DEBUG, images, input, matter, world } from "../globals.js";
import Bird from "./Bird.js";
import Egg from "./Egg.js";
import GameEntity from "./GameEntity.js";
import Animation from '../../lib/Animation.js';
import BirdType from "../enums/BirdType.js";

export default class WhiteBird extends Bird {
    static RADIUS = 40;
    static DEFLATE_RADIUS = 20;
    static SPRITE_MEASUREMENTS = [
        { x: 410, y: 542, width: 80, height: 93 }, // Base open mouth
        { x: 410, y: 353, width: 80, height: 93 }, // Closed mouth 1
        { x: 410, y: 448, width: 80, height: 93 }, // Closed eyes 2
        { x: 493, y: 353, width: 85, height: 93 }, // Closed eyes 3
        { x: 667, y: 752, width: 50, height: 65 }, // Deflated 4
    ];

    constructor(x, y) {
        super(x, y, WhiteBird.RADIUS, 0.8, BirdType.White);

        this.radius = WhiteBird.RADIUS;
        this.sprites = GameEntity.generateSprites(WhiteBird.SPRITE_MEASUREMENTS);
        this.renderOffset = { x: -45, y: -50 };

        this.animations = {
            layEgg: new Animation([1, 2, 3], 0.1, 1)
        };
        this.currentAnimation = null;

        this.hasEgged = false;
        this.egg = null;
    }

    update(dt) {
        super.update(dt);

        if (this.currentAnimation) {
            this.currentAnimation.update(dt);
        }

        if ((input.isKeyHeld(Input.KEYS.SPACE) || input.isKeyHeld(Input.KEYS.E)) 
            && !this.hasEgged && !this.isWaiting) {
            this.hasEgged = true;
            this.currentAnimation = this.animations.layEgg;
        }

        if (this.currentAnimation && this.currentAnimation.isDone()) {
            this.spawnEgg();
            this.currentAnimation.refresh(); 
            this.currentAnimation = null;
        }

        this.egg?.update(dt);
    }

    spawnEgg() {
        this.egg = new Egg(this.body.position.x, this.body.position.y);
        matter.Composite.add(world, this.egg.body);
    
        this.body = this.changeRadius(this.body, WhiteBird.DEFLATE_RADIUS);
        matter.Body.applyForce(this.body, this.body.position, { x: 0.1, y: -0.6 });
        
        this.radius = WhiteBird.DEFLATE_RADIUS;
        this.currentFrame = 4;
        this.renderOffset = { x: -25, y: -35 };
    }

    changeRadius(body, deflatedRadius) {
        const { x, y } = body.position;
        const { x: velocityX, y: velocityY } = body.velocity;

        matter.World.remove(world, body);

        const newBody = matter.Bodies.circle(x, y, deflatedRadius, {
            restitution: body.restitution,
            density: body.density,
            friction: body.friction,
            collisionFilter: body.collisionFilter,
        });

        matter.World.add(world, newBody);

        matter.Body.setVelocity(newBody, { x: velocityX, y: velocityY });

        return newBody;
    }

    render() {        
        super.render();

        if (this.currentAnimation) {
            this.currentFrame = this.currentAnimation.getCurrentFrame();
        }
        this.egg?.render();
        this.sprites[this.currentFrame]?.render(this.renderOffset.x, this.renderOffset.y);
    }
}
