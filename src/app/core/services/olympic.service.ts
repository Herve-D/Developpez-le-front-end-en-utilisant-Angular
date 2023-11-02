import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new Observable<Olympic[]>();

  constructor(private http: HttpClient) { }

  loadInitialData(): Observable<Olympic[]> {
    return this.olympics$ = this.http.get<Olympic[]>(this.olympicUrl).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  getOlympics() {
    return this.loadInitialData();
  }

  getCountryById(countryId: number): Observable<Olympic> {
    return this.olympics$.pipe(
      map(olympics => olympics.find(olympic => olympic.id === countryId)),
      map(country => {
        if (!country) {
          throw new Error();
        }
        return country;
      })
    );
  }
}
