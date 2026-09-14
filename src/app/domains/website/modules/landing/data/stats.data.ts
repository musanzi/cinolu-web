export interface IStat {
  value: number;
  label: string;
  icon: string;
}

export const STATS: IStat[] = [
  {
    value: 7000,
    label: 'Bénéficiaires',
    icon: 'handshake'
  },
  {
    value: 500,
    label: 'Entrepreneurs accompagnés',
    icon: 'rocket'
  },
  {
    value: 1000,
    label: 'Femmes formées & inspirées avec F360',
    icon: 'school'
  },
  {
    value: 5,
    label: "Programmes et forums d'innovation régionale",
    icon: 'lightbulb'
  }
];
