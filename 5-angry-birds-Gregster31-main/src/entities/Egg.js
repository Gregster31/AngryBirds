import GameEntity from "./GameEntity.js";
import { context, images } from "../globals.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { matter } from "../globals.js";
import Bird from "./Bird.js";

export default class Egg extends Bird {
    static RADIUS = 25;
    static RESTITUTION = 0.1;
    static SPRITE_MEASUREMENTS = [
        { x: 668, y: 820, width: 45, height: 57 },
    ];

    constructor(x, y) {
        super(x, y, Egg.RADIUS, Egg.RESTITUTION)

        this.sprites = GameEntity.generateSprites(Egg.SPRITE_MEASUREMENTS);
        this.renderOffset = { x: -22, y: -30 };
    }
}