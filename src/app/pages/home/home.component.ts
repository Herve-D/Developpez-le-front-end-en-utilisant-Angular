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
  countryIds!: Map<string, number>;

  // Pie Chart options
  labels: boolean = true;
  legend: boolean = false;
  trimLabels: boolean = false;

  constructor(private olympicService: OlympicService, private router: Router) { }

  ngOnInit(): void {
    const ols = this.olympicService.getOlympics();
    this.medalsCount$ = ols.pipe(last(), map(
      olympics => {
        return olympics.map(olympic => ({
          name: olympic.country,
          value: olympic.participations.reduce((acc, participation) => acc + participation.medalsCount, 0)
        }) as DataItem);
      }
    ));
    this.joCount$ = this.countJos(ols);
    this.countryIds = this.getCountryIds(ols);
  }

  countJos(ols: Observable<Olympic[]>): Observable<number> {
    return ols.pipe(
      mergeMap(olympics => olympics),
      mergeMap(olympic => olympic.participations),
      distinct(participation => participation.year),
      count()
    );
  }

  getCountryIds(ols: Observable<Olympic[]>): Map<string, number> {
    const mapIds = new Map();
    ols.forEach(olympics => {
      olympics.map(olympic => {
        mapIds.set(olympic.country, olympic.id);
      })
    });
    return mapIds;
  }

  onSelect(event: DataItem): void {
    const countryId = this.findCountryId(event.name.toString());
    this.router.navigateByUrl(`detail/${countryId}`);
  }

  findCountryId(name: string): number | undefined {
    return this.countryIds.get(name);
  }

}
