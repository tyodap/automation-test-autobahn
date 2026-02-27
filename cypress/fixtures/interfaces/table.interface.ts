import { Query } from "./query.interface";

export interface Table {
  name: string;
  loadOnFilter: boolean;
  bulkActions: boolean;
  mainSelector: string;
  columns: string[];
  query: Query;
  isCached: boolean;
  addingTable: boolean;
  hasPagination: boolean;
  caseSensitiveSorting: boolean;
}
