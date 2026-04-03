import type { FunctionComponent } from "react";
import type { Links, Meta } from "@/core/interfaces/Pagination";
import PaginationLink from "./pagination-link";

interface Props {
  metadata: Meta;
  links: Links;
  paginate: (link: string) => void;
}

const PaginationLinks: FunctionComponent<Props> = ({ metadata, links, paginate }) => {
  return (
    <ul className="mx-auto mt-3 flex content-evenly items-center">
      <li>
        <PaginationLink
          key={"link_first"}
          url={metadata.current_page !== 1 && links.first ? links.first : null}
          active={false}
          paginate={paginate}
        >
          Back to start
        </PaginationLink>
      </li>
      <li>
        <PaginationLink key={"link_prev"} url={links.prev} active={false} paginate={paginate}>
          Prev
        </PaginationLink>
      </li>
      <li>
        <PaginationLink key={"link_next"} url={links.next} active={false} paginate={paginate}>
          Next
        </PaginationLink>
      </li>
    </ul>
  );
};

export default PaginationLinks;
