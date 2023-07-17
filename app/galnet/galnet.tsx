import { Galnet } from '../../interfaces/Galnet';
import { Collection, Resource } from '../../interfaces/Request';
import { request } from '../util';

export const defaultState: Galnet = {
  id: 0,
  title: '',
  content: '',
  uploaded_at: '',
  banner_image: '',
};

export const getAllGalnetNewsArticles: Collection<Galnet> = async (uri, params?: any) => await request(uri, params);
export const getGalnetNewsArticle: Resource<Galnet> = async (id: number) => await request(`galnet/news/${id}`);