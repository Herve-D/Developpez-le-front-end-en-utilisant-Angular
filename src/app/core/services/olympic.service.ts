import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
      // tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        // this.olympics$.next([]);
        return caught;
      })
    );
  }

  getOlympics() {
    // return this.olympics$.asObservable();
    return this.loadInitialData();
  }
}
