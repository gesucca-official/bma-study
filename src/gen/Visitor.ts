import {Visitable} from "~/gen/Visitable";

export abstract class Visitor {

    public abstract visit(v: Visitable): void;
}
