export interface IActivitiesQuery {
  page: number;
  limit: number;
  q?: string;
  startDate?: string;
  endDate?: string;
}
