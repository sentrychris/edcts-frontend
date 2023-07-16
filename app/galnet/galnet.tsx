import { Galnet } from '../../interfaces/Galnet';
import { Request } from '../../interfaces/Request';
import { request } from '../util';

export const defaultState = {
  id: 0,
  title: '',
  content: '',
  uploaded_at: '',
  banner_image: '',
};

export const getAllGalnetNewsArticles: Request<Galnet> = async (uri, params?: any) => await request(uri, params);
export const getGalnetNewsArticle = async (id: number) => await request(`galnet/news/${id}`);