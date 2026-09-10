import { httpResource } from '@angular/common/http';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ApexOptions, ApexXAxis } from 'ng-apexcharts';
import { StatsChart } from '../ui/stats-chart';
import { IStatsDashboard, IChartPoint, IChartSeries } from '../interfaces/stats-dashboard.interface';

@Component({
  templateUrl: './stats.html',
  imports: [DatePipe, DecimalPipe, MatButtonModule, MatButtonToggleModule, MatCardModule, MatIconModule, StatsChart],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Stats {
  private readonly kpiOrder = ['users', 'programs', 'ventures', 'participations'];

  protected readonly periodOptions = [3, 6, 12, 24];
  protected readonly months = signal(12);
  protected readonly statsResource = httpResource<IStatsDashboard>(() => `/stats?months=${this.months()}`);
  protected readonly orderedKpis = computed(() => {
    const kpis = this.statsResource.value()?.kpis ?? [];

    return this.kpiOrder.flatMap((key) => {
      const kpi = kpis.find((item) => item.key === key);

      return kpi ? [kpi] : [];
    });
  });

  protected readonly userRegistrationsChart = computed(() =>
    this.createTimelineChart('Registrations', this.statsResource.value()?.charts.userRegistrations ?? [], 'area')
  );

  protected readonly participationStatusesChart = computed(() =>
    this.createDonutChart(this.statsResource.value()?.charts.participationStatuses ?? [])
  );
  protected readonly ventureStatusesChart = computed(() =>
    this.createDonutChart(this.statsResource.value()?.charts.ventureStatuses ?? [])
  );
  protected readonly activitiesByTypeChart = computed(() =>
    this.createBarChart(this.statsResource.value()?.charts.activitiesByType ?? [])
  );
  protected readonly programsByPortfolioChart = computed(() =>
    this.createBarChart(this.statsResource.value()?.charts.programsByPortfolio ?? [])
  );

  protected kpiIcon(key: string): string {
    switch (key) {
      case 'users':
        return 'users';
      case 'programs':
        return 'folder-kanban';
      case 'ventures':
        return 'rocket';
      case 'participations':
        return 'handshake';
      default:
        return 'chart-no-axes-combined';
    }
  }

  protected trendIcon(changePercentage: number): string {
    if (changePercentage === 0) return 'minus';

    return changePercentage > 0 ? 'trending-up' : 'trending-down';
  }

  private createTimelineChart(name: string, points: IChartPoint[], type: 'area' | 'line'): ApexOptions {
    return {
      ...this.axisChartOptions(type),
      series: [{ name, data: points.map((point) => point.value) }],
      xaxis: this.categoryAxis(points.map((point) => point.name)),
      fill: type === 'area' ? { opacity: 0.18, type: 'solid' } : { opacity: 1, type: 'solid' }
    };
  }

  private createMultiTimelineChart(series: IChartSeries[]): ApexOptions {
    return {
      ...this.axisChartOptions('line'),
      series: series.map((item) => ({ name: item.name, data: item.series.map((point) => point.value) })),
      xaxis: this.categoryAxis(series[0]?.series.map((point) => point.name) ?? []),
      legend: { horizontalAlign: 'left', position: 'bottom' }
    };
  }

  private createBarChart(points: IChartPoint[]): ApexOptions {
    return {
      ...this.axisChartOptions('bar'),
      series: [{ name: 'Total', data: points.map((point) => point.value) }],
      xaxis: this.categoryAxis(points.map((point) => point.name)),
      plotOptions: { bar: { borderRadius: 4, columnWidth: '48%' } }
    };
  }

  private createDonutChart(points: IChartPoint[]): ApexOptions {
    return {
      chart: { fontFamily: 'inherit', height: 300, parentHeightOffset: 0, type: 'donut' },
      colors: ['#385f2c', '#638c54', '#9db895', '#b7791f', '#64748b'],
      dataLabels: { enabled: false },
      labels: points.map((point) => point.name),
      legend: { fontSize: '13px', itemMargin: { horizontal: 10, vertical: 4 }, position: 'bottom' },
      noData: { text: 'No data available' },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              name: { offsetY: 18, show: true },
              total: {
                color: '#64748b',
                fontSize: '13px',
                fontWeight: 500,
                formatter: (chart) =>
                  chart.globals.seriesTotals.reduce((total: number, value: number) => total + value, 0),
                label: 'Total',
                show: true,
                showAlways: true
              },
              value: { fontSize: '24px', fontWeight: 600, offsetY: -18, show: true }
            },
            size: '72%'
          }
        }
      },
      series: points.map((point) => point.value),
      stroke: { colors: ['#ffffff'], width: 3 },
      tooltip: { y: { formatter: (value) => value.toLocaleString() } }
    };
  }

  private axisChartOptions(type: 'area' | 'bar' | 'line'): ApexOptions {
    return {
      chart: { fontFamily: 'inherit', height: 300, parentHeightOffset: 0, toolbar: { show: false }, type },
      colors: ['#385f2c', '#b7791f', '#64748b'],
      dataLabels: { enabled: false },
      grid: { borderColor: '#e2e8f0', padding: { left: 8, right: 12 }, strokeDashArray: 4 },
      legend: { fontSize: '13px', itemMargin: { horizontal: 10, vertical: 4 }, position: 'bottom' },
      markers: { size: 0 },
      noData: { text: 'No data available' },
      stroke: { curve: 'smooth', width: 3 },
      tooltip: { intersect: false, shared: true, y: { formatter: (value) => value.toLocaleString() } },
      yaxis: { decimalsInFloat: 0, labels: { formatter: (value) => value.toLocaleString() }, min: 0 }
    };
  }

  private categoryAxis(categories: string[]): ApexXAxis {
    return {
      categories,
      labels: { hideOverlappingLabels: true, rotate: -45, rotateAlways: false },
      tooltip: { enabled: false }
    };
  }
}
