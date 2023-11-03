import { Component, OnInit } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Series } from '@swimlane/ngx-charts';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
    olympic$: Observable<Olympic> = of();
    lineChartData$: Observable<Series[]> = of();
    totalMedals$: Observable<number> = of();
    totalAthletes$: Observable<number> = of();

    // Line Chart options
    autoScale: boolean = true;
    xAxis: boolean = true;
    yAxis: boolean = true;
    showXAxisLabel: boolean = true;
    xAxisLabel: string = 'Dates';

    constructor(private olympicService: OlympicService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        const olympicId = +this.route.snapshot.params['id'];
        this.getOlympic(olympicId);
        this.totalMedals$ = this.getTotal(this.olympic$, 'medalsCount');
        this.totalAthletes$ = this.getTotal(this.olympic$, 'athleteCount');
    }

    // Récupération des données du pays Olympique
    getOlympic(olympicId: number): void {
        this.olympic$ = this.olympicService.getOlympicById(olympicId);
        this.lineChartData$ = this.olympic$.pipe(
            map(olympic => this.getLineChartData(olympic))
        );
    }

    // Création données du Line Chart
    getLineChartData(olympic: Olympic): Series[] {
        return [
            {
                name: olympic.country,
                series: olympic.participations.map(participation => ({
                    name: participation.year.toString(),
                    value: participation.medalsCount
                }))
            }
        ];
    }

    // Comptabiliser le total de médailles/d'athlètes
    getTotal(olympic: Observable<Olympic>, property: 'medalsCount' | 'athleteCount'): Observable<number> {
        return olympic.pipe(
            map(olympic => olympic.participations.reduce(
                (acc, participation) => acc + participation[property], 0)
            )
        );
    }

}
