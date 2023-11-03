import { Component, OnInit } from '@angular/core';
import { Observable, count, distinct, last, map, mergeMap, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { DataItem } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  medalsCount$: Observable<DataItem[]> = of();
  joCount$: Observable<number> = of();
  olympicIDs!: Map<string, number>;

  // Pie Chart options
  labels: boolean = true;
  legend: boolean = false;
  trimLabels: boolean = false;

  constructor(private olympicService: OlympicService, private router: Router) { }

  // Chargement des données pour le Line Chart
  ngOnInit(): void {
    const olympics = this.olympicService.loadInitialData();
    this.medalsCount$ = olympics.pipe(last(), map(
      olympics => {
        return olympics.map(olympic => ({
          name: olympic.country,
          value: olympic.participations.reduce((acc, participation) => acc + participation.medalsCount, 0)
        }) as DataItem);
      }
    ));
    this.joCount$ = this.countJOs(olympics);
    this.olympicIDs = this.getOlympicIDs(olympics);
  }

  // Décompte du nombre de JO
  countJOs(olympics: Observable<Olympic[]>): Observable<number> {
    return olympics.pipe(
      mergeMap(olympics => olympics),
      mergeMap(olympic => olympic.participations),
      distinct(participation => participation.year),
      count()
    );
  }

  // Récupération des IDs de chaque pays
  getOlympicIDs(olympics: Observable<Olympic[]>): Map<string, number> {
    const mapIDs = new Map();
    olympics.forEach(olympics => {
      olympics.map(olympic => {
        mapIDs.set(olympic.country, olympic.id);
      })
    });
    return mapIDs;
  }

  // Navigation vers la page Detail du pays sélectionné
  onSelect(event: DataItem): void {
    const olympicId = this.findOlympicId(event.name.toString());
    this.router.navigateByUrl(`detail/${olympicId}`);
  }

  // Récupération de l'ID par le nom du pays
  findOlympicId(name: string): number | undefined {
    return this.olympicIDs.get(name);
  }

}
