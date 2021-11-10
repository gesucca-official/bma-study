import {Visitor} from "~/gen/Visitor";

export abstract class Visitable {

    public abstract accept(v: Visitor): void;

}
