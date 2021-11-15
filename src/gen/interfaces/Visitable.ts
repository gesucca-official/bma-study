import {Visitor} from "~/gen/interfaces/Visitor";

export abstract class Visitable {

    public abstract accept(v: Visitor): void;

}
