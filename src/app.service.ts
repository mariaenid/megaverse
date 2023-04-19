import { Injectable } from '@nestjs/common';
import { CrudService } from './crud.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Direction, Color, Endpoint, IRequest } from './interfaces';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const API_CALL = process.env?.api || 'https://challenge.crossmint.io/api';
const CADIDATE_ID =
  process.env?.candidateId || 'f9080590-8851-4688-a37d-af05b650b648';

@Injectable()
export class AppService {
  polyanetsService: any;
  soloonsService: any;
  comethsService: any;

  constructor(private readonly httpService: HttpService) {
    this.polyanetsService = new CrudService('polyanets', httpService);
    this.soloonsService = new CrudService('soloons', httpService);
    this.comethsService = new CrudService('comeths', httpService);
  }

  async getGoal() {
    const response = (
      await firstValueFrom(
        this.httpService.get(`${API_CALL}/map/${CADIDATE_ID}/goal`).pipe(
          catchError((error: AxiosError) => {
            throw 'An error happened!';
          }),
        ),
      )
    ).data?.goal;

    return response || [];
  }

  getSolarSystem(goal: string[][]): IRequest[] {
    return goal.reduce((acc: any, row: string[], index: number) => {
      const columns = row.reduce((c: IRequest[], d: string, i: number) => {
        if (d === 'POLYANET')
          c.push({ column: i, endpoint: Endpoint.POLYANET });

        if (d.includes('COMETH')) {
          const [direction] = d.split('_');
          const directionFormatted = direction.toLocaleLowerCase();
          c.push({
            column: i,
            endpoint: Endpoint.COMETH,
            direction: directionFormatted as Direction,
          });
        }

        if (d.includes('SOLOON')) {
          const [color] = d.split('_');
          const colorFormatted = color.toLocaleLowerCase();
          c.push({
            column: i,
            endpoint: Endpoint.SOLOON,
            color: colorFormatted as Color,
          });
        }

        return c;
      }, []);

      if (row?.length) {
        acc = [...acc, ...columns.map((d: any) => ({ row: index, ...d }))];
      }

      return acc;
    }, []);
  }

  resolverService: {
    [key in Endpoint]: (arg: any) => Promise<void>;
  } = {
      [Endpoint.COMETH]: async (arg) => await this.comethsService.setValue(arg),
      [Endpoint.POLYANET]: async (arg) => await this.polyanetsService.setValue(arg),
      [Endpoint.SOLOON]: async (arg) => await this.soloonsService.setValue(arg),
    };

  resolverServiceDelete: {
    [key in Endpoint]: (arg: any) => Promise<void>;
  } = {
      [Endpoint.COMETH]: async (arg) =>
        await this.comethsService.deleteValue(arg),
      [Endpoint.POLYANET]: async (arg) =>
        await this.polyanetsService.deleteValue(arg),
      [Endpoint.SOLOON]: async (arg) => await this.soloonsService.deleteValue(arg),
    };

  async run() {
    const goal = await this.getGoal();
    const elements = this.getSolarSystem(goal);
    for (const i in elements) {
      await this.resolverService[elements[i].endpoint!](elements[i]);
      await delay(1000);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
