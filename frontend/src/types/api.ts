export interface Blog {
  id: number;
  userId: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    offset: number;
  };
}
