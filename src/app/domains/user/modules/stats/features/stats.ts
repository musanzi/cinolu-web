import { DatePipe, DecimalPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ApexOptions, ApexXAxis } from 'ng-apexcharts';
import { IUserStatsDashboard } from '../interfaces';
import { StatsChart } from '../ui/stats-chart';

@Component({
  templateUrl: './stats.html',
  imports: [DatePipe, DecimalPipe, MatButtonModule, MatButtonToggleModule, MatCardModule, MatIconModule, StatsChart]
})
export default class Stats {
  private readonly kpiOrder = ['participations', 'reviews', 'ventures'];

  protected readonly periodOptions = [3, 6, 12, 24];
  protected readonly months = signal(12);
  protected readonly statsResource = httpResource<IUserStatsDashboard>(() => `/stats/mine?months=${this.months()}`);
  protected readonly orderedKpis = computed(() => {
    const kpis = this.statsResource.value()?.kpis ?? [];

    return this.kpiOrder.flatMap((key) => {
      const kpi = kpis.find((item) => item.key === key);

      return kpi ? [kpi] : [];
    });
  });
  protected readonly activityChart = computed<ApexOptions>(() => {
    const activity = this.statsResource.value()?.charts.activity ?? [];

    return {
      chart: {
        fontFamily: 'inherit',
        height: 320,
        parentHeightOffset: 0,
        toolbar: { show: false },
        type: 'line'
      },
      colors: ['#385f2c', '#b7791f', '#64748b'],
      dataLabels: { enabled: false },
      grid: { borderColor: '#e2e8f0', padding: { left: 8, right: 12 }, strokeDashArray: 4 },
      legend: { fontSize: '13px', itemMargin: { horizontal: 10, vertical: 4 }, position: 'bottom' },
      markers: { size: 0 },
      noData: { text: 'Aucune donnée disponible' },
      series: activity.map((item) => ({
        name: item.name,
        data: item.series.map((point) => point.value)
      })),
      stroke: { curve: 'smooth', width: 3 },
      tooltip: { intersect: false, shared: true, y: { formatter: (value) => value.toLocaleString() } },
      xaxis: this.categoryAxis(activity[0]?.series.map((point) => point.name) ?? []),
      yaxis: { decimalsInFloat: 0, labels: { formatter: (value) => value.toLocaleString() }, min: 0 }
    };
  });

  protected kpiIcon(key: string): string {
    switch (key) {
      case 'participations':
        return 'clipboard-check';
      case 'reviews':
        return 'star';
      case 'ventures':
        return 'building-2';
      default:
        return 'chart-no-axes-combined';
    }
  }

  protected trendIcon(changePercentage: number): string {
    if (changePercentage === 0) return 'minus';

    return changePercentage > 0 ? 'trending-up' : 'trending-down';
  }

  private categoryAxis(categories: string[]): ApexXAxis {
    return {
      categories,
      labels: { hideOverlappingLabels: true, rotate: -45, rotateAlways: false },
      tooltip: { enabled: false }
    };
  }
}
