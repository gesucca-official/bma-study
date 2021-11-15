import {HasSprite} from "~/gen/interfaces/HasSprite";

export abstract class Damageable extends HasSprite {

    abstract sufferDamage(damage: number, cooldown?: number): void;


}
