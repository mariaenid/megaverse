import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { IRequest } from './interfaces';
import { catchError, lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

const API_CALL = process.env?.api || 'https://challenge.crossmint.io/api';
const CANDIDATE_ID =
  process.env?.candidateId || 'f9080590-8851-4688-a37d-af05b650b648';

@Injectable()
export class CrudService {
  apiCall: string;

  constructor(endpoint: string, private readonly httpService: HttpService) {
    this.apiCall = endpoint;
  }

  async setValue(request: IRequest): Promise<void> {
    delete request.endpoint;

    await lastValueFrom(
      this.httpService
        .post(
          `${API_CALL}/${this.apiCall}`,
          {
            ...request,
            candidateId: CANDIDATE_ID,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.log('ERROR', error);
            throw 'An error happened!';
          }),
        ),
    );
  }

  async deleteValue(request: IRequest): Promise<void> {
    await lastValueFrom(
      this.httpService
        .delete(`${API_CALL}/${this.apiCall}`, {
          data: {
            row: request.row,
            column: request.column,
            candidateId: CANDIDATE_ID,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.log('ERROR', error);

            throw 'An error happened!';
          }),
        ),
    );
  }
}
