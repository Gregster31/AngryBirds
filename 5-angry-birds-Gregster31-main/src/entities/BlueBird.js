import { CANVAS_HEIGHT, context, input, matter, world } from '../globals.js';
import BodyType from '../enums/BodyType.js';
import Circle from './Circle.js';
import { oneInXChance } from '../../lib/Random.js';
import GameEntity from './GameEntity.js';
import Bird from './Bird.js';
import Input from '../../lib/Input.js';
import BirdType from '../enums/BirdType.js';


export default class BlueBird extends Bird {
    static SPRITE_MEASUREMENTS = [{ x: 1, y: 379, width: 32, height: 30 }];
    static RADIUS = 15; // Need to change because smaller bird

	/**
	 * A bird that will be launched at the pig fortress. The bird is a
	 * dynamic (i.e. non-static) Matter body meaning it is affected by
	 * the world's physics. We've given the bird a high restitution value
	 * so that it is bouncy. The label will help us manage this body later.
	 * The collision filter ensures that birds cannot collide with eachother.
	 * We've set the density to a value higher than the block's default density
	 * of 0.001 so that the bird can actually knock blocks over.
	 *
	 * @see https://brm.io/matter-js/docs/classes/Body.html#property_restitution
	 * @see https://brm.io/matter-js/docs/classes/Body.html#property_label
	 * @see https://brm.io/matter-js/docs/classes/Body.html#property_collisionFilter
	 * @see https://brm.io/matter-js/docs/classes/Body.html#property_density
	 *
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x, y) {
		super(x, y, BlueBird.RADIUS, 0.8, BirdType.Blue);

        this.x = x;
        this.y = y;
		this.sprites = GameEntity.generateSprites(BlueBird.SPRITE_MEASUREMENTS);
		this.renderOffset = { x: -17, y: -13 };

		this.isWaiting = true;
		this.isJumping = false;

		this.birdClones = []; // Saves the new clones
		this.hasSplit = false;
	}

    update(dt) {
		super.update(dt);

        if((input.isKeyPressed(Input.KEYS.SPACE) || input.isKeyPressed(Input.KEYS.E)) 
			&& !this.isWaiting && !this.hasSplit) { // Bird needs to be in the sling
			this.hasSplit = true;
			//Split the bird
            const clone1 = new BlueBird(this.body.position.x, this.body.position.y);
            const clone2 = new BlueBird(this.body.position.x, this.body.position.y);
            console.log(clone2)

			matter.Body.applyForce(clone1.body, clone1.body.position, {
                x: 0.5,
                y: 0.0,
            });
            matter.Body.applyForce(clone2.body, clone2.body.position, {
                x: 0.35,
                y: 0.0,
            });

			this.birdClones.push(clone1, clone2);
        }

        this.birdClones.forEach(clone => {
            if (clone.body.position.y > CANVAS_HEIGHT) {
                clone.shouldCleanUp = true;
            }
        });

        this.birdClones = this.birdClones.filter(clone => !clone.shouldCleanUp);
	}

    render() {
        super.render();
        this.birdClones.forEach((clone) => {
            const { x, y } = clone.body.position;
            context.save();
            context.translate(x, y);
            context.rotate(clone.angle);
            this.sprites[this.currentFrame].render(this.renderOffset.x, this.renderOffset.y);
            context.restore();
        });
    }
}