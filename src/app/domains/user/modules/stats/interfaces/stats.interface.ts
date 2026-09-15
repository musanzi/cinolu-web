import { IChartSeries, IStatsPeriod, IStatsKpi } from '@/app/shared/interfaces';

export interface IUserStatsCharts {
  activity: IChartSeries[];
}

export interface IUserStatsDashboard {
  generatedAt: string;
  period: IStatsPeriod;
  kpis: IStatsKpi[];
  charts: IUserStatsCharts;
}
