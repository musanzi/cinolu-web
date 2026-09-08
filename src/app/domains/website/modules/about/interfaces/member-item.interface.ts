export interface IMemberItem {
  id: number;
  name: string;
  role: string;
  image: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
}
