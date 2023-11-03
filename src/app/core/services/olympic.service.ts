import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  // Chargement des données
  loadInitialData(): Observable<Olympic[]> {
    return this.olympics$ = this.http.get<Olympic[]>(this.olympicUrl).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  // Récupère un objet Olympic via ID
  getOlympicById(olympicId: number): Observable<Olympic> {
    return this.olympics$.pipe(
      map(olympics => olympics.find(olympic => olympic.id === olympicId)),
      map(olympic => {
        if (!olympic) {
          throw new Error();
        }
        return olympic;
      })
    );
  }
}
