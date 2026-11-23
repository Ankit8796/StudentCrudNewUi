import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFilterStudent, IreturnMessage, Istudent } from '../interface/istudent';

@Injectable({
  providedIn: 'root',
})
export class Studentservice {

  public baseUrl: string = 'https://localhost:7143/api';

  constructor(private http: HttpClient) { }

  getAllStudents(Filterstudent:IFilterStudent): Observable<Istudent[]> {

     let params = new HttpParams();

    if (Filterstudent.pageNumber)
    {debugger
       params=params.set('pageNumber',Filterstudent.pageNumber);
    }
    return this.http.get<Istudent[]>(`${this.baseUrl}/Student/GetStudentDetails`, { params });
  }

  createStudent(data: Istudent): Observable<IreturnMessage> {
    return this.http.post<IreturnMessage>(`${this.baseUrl}/Student/CreateStudent`, data);
  }

  updateStudent(data: Istudent): Observable<IreturnMessage> {debugger
    return this.http.put<IreturnMessage>(`${this.baseUrl}/Student/UpdateStudent`, data);
  }

  deleteStudent(studentId: number): Observable<IreturnMessage> {
    return this.http.delete<IreturnMessage>(`${this.baseUrl}/Student/DeleteStudent/${studentId}`);
  }

}
