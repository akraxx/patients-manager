import {Component, Input, OnInit} from '@angular/core';
import {Office} from '../../../../../../../common/office.model';
import {StatisticService} from '../../../../@core/services/statistic.service';
import {forkJoin} from 'rxjs';
import {Statistic, StatisticBucket} from '../../../../../../../common/statistic.model';

@Component({
  selector: 'ngx-offices-view-stats',
  styleUrls: ['./offices-view-stats.component.scss'],
  templateUrl: './offices-view-stats.component.html',
})
export class OfficesViewStatsComponent implements OnInit {
  @Input()
  office: Office;

  today = new Date();

  selectedYear: number;
  availableYears: number[] = [];

  selectedLastYearStatistics: Statistic;
  selectedYearStatistics: Statistic;

  constructor(private statisticService: StatisticService) {
    this.selectedYear = new Date().getFullYear();
    for (let i = 0; i <= 10; i++) {
      this.availableYears.push(this.selectedYear - i);
    }
  }

  ngOnInit(): void {
    this.updateStatistics();
  }

  updateStatistics() {
    forkJoin([
      this.statisticService.getStatistic((this.selectedYear - 1).toString(), this.office._id),
      this.statisticService.getStatistic(this.selectedYear.toString(), this.office._id),
    ]).subscribe(r => {
      this.selectedLastYearStatistics = r[0] as Statistic;
      this.selectedYearStatistics = r[1] as Statistic;
    });
  }

  getBucketEvolution(index: number): number {
    const currentCa = this.selectedYearStatistics.buckets[index].ca;
    const pastCa = this.selectedLastYearStatistics.buckets[index].ca;

    return ((currentCa - pastCa) / pastCa) * 100;
  }

  getCaToDateEvolution(): number {
    const currentCa = this.selectedYearStatistics.ca;
    const pastCa = this.selectedLastYearStatistics.caToDate;

    return ((currentCa - pastCa) / pastCa) * 100;
  }

  getCaToDateDifference(): number {
    const currentCa = this.selectedYearStatistics.ca;
    const pastCa = this.selectedLastYearStatistics.caToDate;

    return currentCa - pastCa;
  }

  displayableBuckets(): StatisticBucket[] {
    return this.selectedYearStatistics.buckets
      .filter(b => new Date(b.date).getTime() < new Date().getTime());
  }

  previousYear(): number {
    return this.selectedYear - 1;
  }
}
