import { FunctionComponent } from 'react';
import PaginationLink from './pagination-link';
import { Links, Meta } from '../interfaces/Pagination';

interface Props {
  metadata: Meta;
  links: Links;
  paginate: (link: string) => void;
}

const PaginationLinks: FunctionComponent<Props> = ({ metadata, links, paginate }) => {
  return (
    <ul className="flex items-center mx-auto my-7 content-evenly">
      <li>
        <PaginationLink
          key={'link_first'}
          url={(metadata.current_page !== 1) && links.first ? links.first : null}
          active={false}
          paginate={paginate}
        >First</PaginationLink>
      </li>
      <li>
        <PaginationLink
          key={'link_prev'}
          url={links.prev}
          active={false}
          paginate={paginate}
        >Previous</PaginationLink>
      </li>
      {metadata.links.map(link =>
        !isNaN(+link.label) &&
          <li key={`link_${link.label}`} className="mx-1 hidden md:block">
            <PaginationLink
              url={link.url}
              active={link.active}
              paginate={paginate}
            >
              {link.label}
            </PaginationLink>
          </li>
      )}
      <li>
        <PaginationLink
          key={'link_next'}
          url={links.next}
          active={false}
          paginate={paginate}
        >Next</PaginationLink>
      </li>
      <li>
        <PaginationLink
          key={'link_last'}
          url={(metadata.current_page !== metadata.last_page) && links.last ? links.last : null}
          active={false}
          paginate={paginate}
        >Last</PaginationLink>
      </li>
    </ul>
  );
};

export default PaginationLinks;