import {Meta, Links} from "../interfaces/Pagination";
import PaginationLink from "./PaginationLink";

type RenderColumn<T> = (item: T) => string | JSX.Element;

interface Column<T> {
  title: string;
  accessor?: string;
  render?: RenderColumn<T>
}

interface RequiredAttribute {
  id: number;
}

interface Props<T extends RequiredAttribute> {
  columns: {
    [key: string]: Column<T>
  };
  data: T[];
  meta: Meta;
  links: Links;
}

function Table<T extends RequiredAttribute>({ columns, data, meta, links }: Props<T>) {
  function renderBody(data: any) {
    if (!data || data.length === 0) {
      return <tbody>
        <tr className="bg-white dark:bg-gray-800 border-b dark:border-b-gray-600 last:border-b-0">
          <td colSpan={Object.keys(columns).length} scope="row" className="py-4 px-6 font-medium whitespace-nowrap dark:text-gray-200 font-italic text-center">
            No data found...
          </td>
        </tr>
      </tbody>
    }

    return <tbody>
      <>
        {data.map((item: any) => (
          <tr key={`row_${item.id}`} className="bg-white dark:bg-gray-800 border-b dark:border-b-gray-600 last:border-b-0">
            {Object.keys(columns).map(key =>
              <td key={`rowColumn_${item.id}_${key}`} scope="row" className="py-4 px-6 font-medium whitespace-nowrap dark:text-gray-200">
                {renderContent(item, key)}
              </td>
            )}
          </tr>
        ))}
      </>
    </tbody>
  }

  function renderContent(item: T, key: string) {
    if ('render' in columns[key]) {
      //@ts-ignore
      return columns[key].render(item);
    }

    if ('accessor' in columns[key]) {
      //@ts-ignore
      if (columns[key].accessor.includes('.')) {
        //@ts-ignore
        return columns[key].accessor.split('.').reduce((obj,key)=> obj[key], item);
      }
      //@ts-ignore
      return item[columns[key].accessor];
    }

    //@ts-ignore
    return item[key];
  }

  return (
    <>
      <div className="overflow-x-auto relative shadow-sm sm:rounded-lg">
        <table className="w-full text-xs text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-400 uppercase bg-slate-50 dark:bg-gray-800 dark:text-gray-400 dark:border-b dark:border-b-gray-600">
            <tr>
              {Object.keys(columns).map(key =>
                <th key={`columnHeader_${key}`} scope="col" className="py-3 px-6">
                  {'title' in columns[key] ? columns[key].title : key}
                </th>
              )}
            </tr>
          </thead>
          {renderBody(data)}
        </table>
      </div>
      <ul className="flex items-center mx-auto my-7 content-evenly">
        <li>
          <PaginationLink
            key={`link_first`}
            url={(meta.current_page !== 1) && links.first ? links.first : null}
            active={false}
          >First</PaginationLink>
        </li>
        <li>
          <PaginationLink
            key={`link_prev`}
            url={links.prev}
            active={false}
          >Previous</PaginationLink>
        </li>
        {meta.links.map(link =>
          !isNaN(+link.label) &&
            <li key={`link_${link.label}`} className="mx-1 hidden md:block">
              <PaginationLink
                url={link.url}
                active={link.active}
              >
                {link.label}
              </PaginationLink>
            </li>
        )}
        <li>
          <PaginationLink
            key={`link_next`}
            url={links.next}
            active={false}
          >Next</PaginationLink>
        </li>
        <li>
          <PaginationLink
            key={`link_last`}
            url={(meta.current_page !== meta.last_page) && links.last ? links.last : null}
            active={false}
          >Last</PaginationLink>
        </li>
      </ul>
    </>
  )
}

export default Table;