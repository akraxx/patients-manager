import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import {Statistic} from '../../../../../common/statistic.model';

const BASE_PATH: string = `/api/statistics`;

@Injectable()
export class StatisticService {

  constructor(private http: HttpClient) {}

  getStatistic(year: string, officeId?: string): Observable<Statistic> {
    const params = new HttpParams()
      .set('year', year)
      .set('officeId', officeId);

    return this.http.get<Statistic>(BASE_PATH, {params: params});
  }

}
