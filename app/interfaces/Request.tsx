import { Pagination } from './Pagination';

export interface Collection<T> {
  (uri: string, params?: Record<string, any>): Promise<Pagination<T>>
}

export interface Resource<T> {
  (uri: string, params?: Record<string, any>): Promise<T>
}