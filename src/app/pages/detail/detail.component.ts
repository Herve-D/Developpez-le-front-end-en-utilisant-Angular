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
    country$: Observable<Olympic> = of();
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
        const countryId = +this.route.snapshot.params['id'];
        this.getCountry(countryId);
        this.totalMedals$ = this.getTotal(this.country$, 'medalsCount');
        this.totalAthletes$ = this.getTotal(this.country$, 'athleteCount');
    }

    getCountry(countryId: number): void {
        this.country$ = this.olympicService.getCountryById(countryId);
        this.lineChartData$ = this.country$.pipe(
            map(country => this.getLineChartData(country))
        );
    }

    getLineChartData(country: Olympic): Series[] {
        return [
            {
                name: country.country,
                series: country.participations.map(participation => ({
                    name: participation.year.toString(),
                    value: participation.medalsCount
                }))
            }
        ];
    }

    getTotal(country: Observable<Olympic>, property: 'medalsCount' | 'athleteCount'): Observable<number> {
        return country.pipe(
            map(country => country.participations.reduce(
                (acc, participation) => acc + participation[property], 0)
            )
        );
    }

}
