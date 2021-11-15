import {Visitable} from "~/gen/interfaces/Visitable";

export abstract class Visitor {

    public abstract visit(v: Visitable): void;
}
