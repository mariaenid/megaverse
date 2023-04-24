export interface IRequest {
  endpoint?: Endpoint;
  row?: number | string;
  column: number | string;
  color?: string;
  direction?: Direction;
  candidateId?: string;
}

export const enum Endpoint {
  POLYANET = 'polyanets',
  SOLOON = 'soloons',
  COMETH = 'comeths',
}

export const enum Color {
  Blue = 'blue',
  Red = 'red',
  Purple = 'purple',
  White = 'white',
}

export const enum Direction {
  up = 'up',
  down = 'down',
  left = 'left',
  right = 'right',
}

type IColumn = string;

export interface IGoal {
  row: IColumn[][];
}
