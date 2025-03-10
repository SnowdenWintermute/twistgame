import { Grid } from "./grid";
import { Jewel } from "./jewel";
import { Point } from "./jewel-quartet";
import { JewelColor } from "./jewel/jewel-consts";

enum Axis {
  Row,
  Column,
}

class MatchCandidate {
  jewelColor: null | JewelColor = null;
  jewelPositions: Point[] = [];
  constructor(initialPoint?: Point, initialColor?: JewelColor) {
    if (initialPoint) this.jewelPositions.push(initialPoint);
    if (initialColor !== undefined) this.jewelColor = initialColor;
  }
  isMatch() {
    return this.jewelPositions.length >= 3;
  }
}

export class MatchChecker {
  constructor(private grid: Grid) {}
  checkForMatches() {
    const rowMatches = this.checkAxisForMatches(this.grid.rows, Axis.Row);

    const columns = this.grid.getColumns();
    const columnMatches = this.checkAxisForMatches(columns, Axis.Column);
    const matches: Point[][] = [...rowMatches, ...columnMatches];
    matches.forEach((match) => {
      match.forEach((jewelPosition) => {
        const jewel = this.grid.getJewelAtPosition(jewelPosition);
        jewel.isPartOfMatch = true;
      });
    });
    return matches;
  }
  checkAxisForMatches(axis: Jewel[][], axisType: Axis) {
    const matches: Point[][] = [];
    let currentMatchCandidate = new MatchCandidate();

    axis.forEach((list, listIndex) => {
      currentMatchCandidate = new MatchCandidate();
      list.forEach((jewel, jewelIndex) => {
        const x = axisType === Axis.Column ? listIndex : jewelIndex;
        const y = axisType === Axis.Row ? listIndex : jewelIndex;
        const position = new Point(x, y);

        if (currentMatchCandidate.jewelColor === null) {
          currentMatchCandidate.jewelColor = jewel.jewelColor;
        }
        if (currentMatchCandidate.jewelColor === jewel.jewelColor) {
          currentMatchCandidate.jewelPositions.push(position);

          if (
            jewelIndex === list.length - 1 &&
            currentMatchCandidate.isMatch()
          ) {
            matches.push(currentMatchCandidate.jewelPositions);
            currentMatchCandidate = new MatchCandidate();
          }
        } else {
          if (currentMatchCandidate.isMatch()) {
            matches.push(currentMatchCandidate.jewelPositions);
          }
          currentMatchCandidate = new MatchCandidate(
            position,
            jewel.jewelColor
          );
        }
      });
    });
    return matches;
  }
}
