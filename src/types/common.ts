export type ThemeMode = 'light' | 'dark';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export type StatusVariant = 'success' | 'warning' | 'failure' | 'info' | 'gray';

export interface TableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  className?: string;
  render?: (row: T) => React.ReactNode;
}
