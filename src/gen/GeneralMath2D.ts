export class GeneralMath2D {

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {
    }

    static direction(myCoordinate: number, otherCoordinate: number): number {
        return (otherCoordinate - myCoordinate) / Math.abs(otherCoordinate - myCoordinate);
    }

}
