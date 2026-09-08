/** Frontend HTTP contract. Dates are JSON strings; relations are route-dependent. */

export interface IStatsDashboard {
  generatedAt: string;
  period: { months: number; from: string; to: string };
  kpis: {
    key: string;
    label: string;
    value: number;
    unit: 'count' | 'percentage' | 'average';
    changePercentage?: number | null;
  }[];
  charts: {
    userRegistrations: { name: string; value: number }[];
    participationTrend: { name: string; series: { name: string; value: number }[] }[];
    reviewTrend: { name: string; value: number }[];
    ventureTrend: { name: string; series: { name: string; value: number }[] }[];
    activityLifecycle: { name: string; value: number }[];
    participationStatuses: { name: string; value: number }[];
    ventureStatuses: { name: string; value: number }[];
    activitiesByType: { name: string; value: number }[];
    programsByPortfolio: { name: string; value: number }[];
    usersByRole: { name: string; value: number }[];
  };
}

export interface IStatsQuery {
  months?: number | string; /* integer 3..24; default 12 */
}
