import { Galnet } from '../../interfaces/Galnet';
import { Pagination } from '../../interfaces/Pagination';
import { pagination } from '../../service/api';

export const galnetState: Galnet = {
  id: 0,
  title: '',
  content: '',
  uploaded_at: '',
  banner_image: '',
  slug: ''
};

export const paginatedGalnetState: Pagination<Galnet> = pagination;