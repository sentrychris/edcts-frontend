import type { Galnet } from "../../lib/interfaces/Galnet";
import type { Pagination } from "../../lib/interfaces/Pagination";
import { pagination } from "../../lib/api";

export const galnetState: Galnet = {
  id: 0,
  title: "",
  content: "",
  uploaded_at: "",
  banner_image: "",
  slug: "",
};

export const paginatedGalnetState: Pagination<Galnet> = pagination;
