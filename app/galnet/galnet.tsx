import { Galnet } from '../interfaces/Galnet';
import { Pagination } from '../interfaces/Pagination';
import { Collection, Resource } from '../interfaces/Request';
import { pagination, request } from '../util';

export const galnetState: Galnet = {
  id: 0,
  title: '',
  content: '',
  uploaded_at: '',
  banner_image: '',
  slug: ''
};

export const paginatedGalnetState: Pagination<Galnet> = pagination;

export const getAllGalnetNewsArticles: Collection<Galnet> = async (uri, params?) => await request(uri, params);
export const getGalnetNewsArticle: Resource<Galnet> = async (id) => await request(`galnet/news/${id}`);