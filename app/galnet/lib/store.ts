import type { Galnet } from "@/core/interfaces/Galnet";
import type { Pagination } from "@/core/interfaces/Pagination";
import { pagination } from "@/core/api";

export const galnetState: Galnet = {
  id: 0,
  title: "",
  content: "",
  audio_file: "",
  uploaded_at: "",
  banner_image: "",
  slug: "",
};

export const paginatedGalnetState: Pagination<Galnet> = pagination;
