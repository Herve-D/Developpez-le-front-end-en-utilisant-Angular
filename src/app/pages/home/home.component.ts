import { Component, OnInit } from '@angular/core';
import { Observable, count, distinct, last, map, mergeMap, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { DataItem } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  medalsCount$: Observable<DataItem[]> = of([]);
  joCount$: Observable<Number> = of();

  constructor(private olympicService: OlympicService) { }

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
  }

  countJos(ols: Observable<Olympic[]>): Observable<Number> {
    return ols.pipe(
      mergeMap(olympics => olympics),
      mergeMap(olympic => olympic.participations),
      distinct(participation => participation.year),
      count()
    );
    // var joCounts: Number[] = [];
    // ols.forEach(olympics => {
    //   olympics.map(olympic => {
    //     olympic.participations.map(participation => {
    //       if (!joCounts.includes(participation.year)) {
    //         joCounts.push(participation.year);
    //         console.warn("passe ici");
    //       }
    //     })
    //   })
    // });
    // return joCounts.length;
  }

}
