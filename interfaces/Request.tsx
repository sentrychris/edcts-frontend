import { Pagination } from './Pagination';

export interface Request<T> {
  (uri: string, params?: Record<string, any>): Promise<Pagination<T>>
}