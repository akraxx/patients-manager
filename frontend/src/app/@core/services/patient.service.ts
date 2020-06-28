import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import {Patient} from '../../../../../common/patient.model';
import {throwError} from 'rxjs';

@Injectable()
export class PatientService {

  constructor(private http: HttpClient) {}

  getPatients(sort: string = 'lastName', sortType: string = 'desc'): Observable<Patient[]> {
    const params = new HttpParams()
      .set('sortType', sortType)
      .set('sort', sort);

    return this.http.get<Patient[]>(`/api/patients`, {params: params});
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

  searchPatientByOsteopath(osteopath: string): Observable<Patient[]> {
    const params = new HttpParams()
      .set('sort', 'lastName')
      .set('sortType', 'asc')
      .set('createdBy', osteopath)
      .set('consultations.osteopath', osteopath);

    return this.http.get<Patient[]>(`/api/patients`, {params: params});
  }

  searchPatientByName(name: string): Observable<Patient[]> {
    const params = new HttpParams()
      .set('sort', 'lastName')
      .set('sortType', 'asc')
      .set('firstName', name)
      .set('lastName', name);

    return this.http.get<Patient[]>(`/api/patients`, {params: params});
  }

  downloadInvoice(id: string, consultationId: number) {
    return this.http.get(`/api/patients/${id}/consultations/${consultationId}/invoice`,
      { responseType: 'arraybuffer' })
      .map(res => new Blob([res]))
      .catch( res => {
        const decoder = new TextDecoder('utf-8');
        res.error = JSON.parse(decoder.decode(res.error));
        return throwError(res);
      });
  }

  sendInvoice(id: string, consultationId: number) {
    return this.http.post(`/api/patients/${id}/consultations/${consultationId}/invoice`, {});
  }
}
