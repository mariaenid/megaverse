import { useState } from "react";
import Square from "./square";

export enum State {
  NONE,
  ARMED,
  ATTACKED,
  DESTROYED,
}
const LENGTH_SQUARE = 10;

const Challenge = () => {

  const generateBoard = () => {

    const matrix = [];
    for (let i = 0; i < LENGTH_SQUARE; i++) {
      const row = []
      for (let j = 0; j < LENGTH_SQUARE; j++) {
        row.push(State.NONE);
      }
      matrix.push(row);
    }

    matrix[0][5] = State.ARMED;
    matrix[0][6] = State.ARMED;
    matrix[0][7] = State.ARMED;

    matrix[1][2] = State.ARMED;
    matrix[2][2] = State.ARMED;
    matrix[3][2] = State.ARMED;

    return matrix;
  }

  const [status, setStatus] = useState(generateBoard());

  const onAttack = (x: number, y: number, newState: State) => {
    const olStatus = status;
    olStatus[x][y] = newState;
    setStatus(olStatus);
  }

  return <div>
    {status.map((row, x) => {

      return <div style={{ display: 'flex', flexFlow: 'row' }}>{
        row.map((column, y) => {
          return <Square x={x} y={y} state={column} onChange={onAttack} />
        })
      }</div>;
    })}
  </div>
}

export default Challenge;