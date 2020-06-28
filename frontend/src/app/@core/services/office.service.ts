import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import {Patient} from '../../../../../common/patient.model';
import {throwError} from 'rxjs';
import {Office} from '../../../../../common/office.model';

const BASE_PATH: string = `/api/offices`;

@Injectable()
export class OfficeService {

  constructor(private http: HttpClient) {}

  getOffices(): Observable<Office[]> {
    return this.http.get<Office[]>(`${BASE_PATH}`);
  }

  getOfficeById(id: string): Observable<Office> {
    return this.http.get<Office>(`${BASE_PATH}/${id}`);
  }

  addOffice(office: Office): Observable<Office> {
    return this.http.post<Office>(BASE_PATH, office);
  }

  updateOffice(id: string, office: Office): Observable<Office> {
    return this.http.put<Office>(`/${BASE_PATH}/${id}`, office);
  }

}
