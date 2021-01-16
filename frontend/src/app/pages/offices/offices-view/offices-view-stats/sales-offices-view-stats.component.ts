import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {NbColorHelper, NbThemeService} from '@nebular/theme';
import {Statistic} from '../../../../../../../common/statistic.model';

@Component({
  selector: 'ngx-chartjs-multiple-xaxis',
  template: `
    <chart type="line" [data]="data" [options]="options"></chart>
  `,
})
export class SalesOfficeViewStatsComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  selectedLastYearStatistics: Statistic;
  @Input()
  selectedYearStatistics: Statistic;

  data: {};
  options: any;
  themeSubscription: any;

  constructor(private theme: NbThemeService) {

  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
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
          label: this.selectedLastYearStatistics.range,
          data: this.selectedLastYearStatistics.buckets.map(b => b.ca),
          borderColor: NbColorHelper.hexToRgbA(colors.primaryLight, 0.4),
          backgroundColor: NbColorHelper.hexToRgbA(colors.primaryLight, 0.4),
          fill: false,
          borderDash: [5, 5],
          pointRadius: 4,
          pointHoverRadius: 6,
        }, {
          label: this.selectedYearStatistics.range,
          data: this.selectedYearStatistics.buckets.map(b => b.ca),
          borderColor: colors.primary,
          backgroundColor: colors.primary,
          fill: false,
          pointRadius: 8,
          pointHoverRadius: 10,
        }],
      };

      this.options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: 'top',
          labels: {
            fontColor: chartjs.textColor,
          },
        },
        hover: {
          mode: 'index',
        },
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Mois',
              },
              gridLines: {
                display: true,
                color: chartjs.axisLineColor,
              },
              ticks: {
                fontColor: chartjs.textColor,
              },
            },
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Euros',
              },
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
}
