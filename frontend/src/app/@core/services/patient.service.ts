import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Patient} from '../../pages/patients/patient.model';
import {Observable} from 'rxjs/Rx';

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

  searchPatientByName(name: string): Observable<Patient[]> {
    const params = new HttpParams()
      .set('sort', 'lastName')
      .set('sortType', 'asc')
      .set('firstName', name)
      .set('lastName', name);

    return this.http.get<Patient[]>(`/api/patients`, {params: params});
  }
}
