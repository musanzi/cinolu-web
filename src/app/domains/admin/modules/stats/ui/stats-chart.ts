import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ApexOptions, ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'admin-stats-chart',
  imports: [ChartComponent, MatCardModule, MatIconModule],
  templateUrl: './stats-chart.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsChart {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly icon = input('chart-no-axes-combined');
  readonly options = input.required<ApexOptions>();
}
