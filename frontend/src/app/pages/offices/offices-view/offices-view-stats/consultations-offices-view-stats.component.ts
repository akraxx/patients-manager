import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {NbColorHelper, NbThemeService} from '@nebular/theme';
import {Statistic} from '../../../../../../../common/statistic.model';

@Component({
  selector: 'ngx-consultations-offices-view-stats',
  template: `
    <chart type="bar" [data]="data" [options]="options"></chart>
  `,
})
export class ConsultationsOfficesViewStatsComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  selectedLastYearStatistics: Statistic;
  @Input()
  selectedYearStatistics: Statistic;

  data: any;
  options: any;
  themeSubscription: any;

  constructor(private theme: NbThemeService) {
  }

  ngOnInit(): void {
    this.updateStatistics();
  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    this.updateStatistics();
  }

  updateStatistics() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(themeOptions => {

      const colors: any = themeOptions.variables;
      const chartjs: any = themeOptions.variables.chartjs;

      this.data = {
        labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai',
          'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        datasets: [{
          data: this.selectedYearStatistics.buckets.map(b => b.firstConsultations),
          label: 'Nouveau - ' + this.selectedYearStatistics.range,
          backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 0.8),
        }, {
          data: this.selectedLastYearStatistics.buckets.map(b => b.firstConsultations),
          label: 'Nouveau - ' + this.selectedLastYearStatistics.range,
          backgroundColor: NbColorHelper.hexToRgbA(colors.primaryLight, 0.4),
        }, {
          data: this.selectedYearStatistics.buckets.map(b => b.consultations - b.firstConsultations),
          label: 'Suivi - ' + this.selectedYearStatistics.range,
          backgroundColor: NbColorHelper.hexToRgbA(colors.info, 0.8),
        }, {
          data: this.selectedLastYearStatistics.buckets.map(b => b.consultations - b.firstConsultations),
          label: 'Suivi - ' + this.selectedLastYearStatistics.range,
          backgroundColor: NbColorHelper.hexToRgbA(colors.infoLight, 0.4),
        }],
      };

      this.options = {
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          labels: {
            fontColor: chartjs.textColor,
          },
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
                color: chartjs.axisLineColor,
              },
              ticks: {
                fontColor: chartjs.textColor,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: true,
                color: chartjs.axisLineColor,
              },
              ticks: {
                fontColor: chartjs.textColor,
              },
            },
          ],
        },
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
