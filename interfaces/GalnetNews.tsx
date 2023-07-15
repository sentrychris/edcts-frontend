import { Pagination } from "./Pagination";

export interface GalnetNews {
  id: number;
  title: string;
  content: string;
  uploaded_at: string;
  banner_image: string;
}

export interface GetGalnetNews {
  (uri: string, params?: Record<string, any>): Promise<Pagination<GalnetNews>>
}