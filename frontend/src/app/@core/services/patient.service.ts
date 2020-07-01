import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import {Patient, PatientResultSet} from '../../../../../common/patient.model';
import {throwError} from 'rxjs';

@Injectable()
export class PatientService {

  constructor(private http: HttpClient) {
  }

  getPatients(sort: string = 'lastName', sortType: string = 'desc',
              limit: number = 10, offset: number = 0): Observable<PatientResultSet> {
    const params = new HttpParams()
      .set('sortType', sortType)
      .set('sort', sort)
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    return this.http.get<PatientResultSet>(`/api/patients`, {params: params});
  }

  addPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(`/api/patients`, patient);
  }

  updatePatient(id: string, patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`/api/patients/${id}`, patient);
  }

  getPatientById(id: string) {
    return this.http.get<Patient>(`/api/patients/${id}`);
  }

  searchPatientByOsteopath(osteopath: string, limit: number = 10, offset: number = 0): Observable<PatientResultSet> {
    const params = new HttpParams()
      .set('sort', 'lastName')
      .set('sortType', 'asc')
      .set('limit', limit.toString())
      .set('offset', offset.toString())
      .append('search', 'createdBy=' + osteopath)
      .append('search', 'consultations.osteopath=' + osteopath);

    return this.http.get<PatientResultSet>(`/api/patients`, {params: params});
  }

  searchPatientByName(name: string): Observable<PatientResultSet> {
    let params = new HttpParams()
      .set('sort', 'lastName')
      .set('sortType', 'asc');

    if (name) {
      params = params.append('search', 'firstName=' + name)
        .append('search', 'lastName=' + name);
    }

    return this.http.get<PatientResultSet>(`/api/patients`, {params: params});
  }

  downloadInvoice(id: string, consultationId: number) {
    return this.http.get(`/api/patients/${id}/consultations/${consultationId}/invoice`,
      {responseType: 'arraybuffer'})
      .map(res => new Blob([res]))
      .catch(res => {
        const decoder = new TextDecoder('utf-8');
        res.error = JSON.parse(decoder.decode(res.error));
        return throwError(res);
      });
  }

  sendInvoice(id: string, consultationId: number) {
    return this.http.post(`/api/patients/${id}/consultations/${consultationId}/invoice`, {});
  }
}
