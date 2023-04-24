import { useState } from "react";
import { State } from "./challenge";

interface ISquareProps {
  x: number;
  y: number;
  state: State;
  onChange: (x: number, y: number, newStatus: State) => void;
}
const Square = ({ x, y, state, onChange }: ISquareProps) => {
  const [backgroundColor, setBackgrounColor] = useState('transparent');

  const COLORS = {
    [State.ATTACKED]: 'black',
    [State.DESTROYED]: 'red'
  }

  const handleClick = () => {
    // HERE

    if (state === State.DESTROYED || state === State.ATTACKED) return;

    const newStatus = state === State.ARMED ? State.DESTROYED : State.ATTACKED;
    onChange(x, y, newStatus);
    setBackgrounColor(COLORS[newStatus]);
  }


  return (
    <div
      style={{ width: 20, height: 20, border: 'solid 1px', backgroundColor }}
      onClick={handleClick}
      onMouseOver={() => {
        //console.log('over', x, y, state);

      }}
    ></div>
  );
};

export default Square;