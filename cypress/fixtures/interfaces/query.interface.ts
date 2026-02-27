export interface Query {
  dimentions: string[];
  filter: {
    member: string;
    operator: string;
    values: string[];
  }[];
  order: string[];
}
