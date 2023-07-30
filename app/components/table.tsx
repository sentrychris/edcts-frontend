import { JSX, useEffect } from 'react';
import { Meta, Links } from '../interfaces/Pagination';
import { useAnimateTable } from '../hooks/animate';
import PaginationLinks from './pagination-links';

type RenderColumn<T> = (item: T) => string | JSX.Element;

interface Column<T> {
  title: string;
  accessor?: string;
  render?: RenderColumn<T>;
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
  page?: (link: string) => void;
}

function Table<T extends RequiredAttribute>({ columns, data, meta, links, page }: Props<T>) {
  
  type Mode = { accessor?: string; render?: RenderColumn<T> };
  const isRender = (ctx: Mode): ctx is Required<Mode> => !!ctx.render;
  const isAccessor = (ctx: Mode): ctx is Required<Mode> => !!ctx.accessor;

  useEffect(useAnimateTable);
  
  const renderBody = (data: any) => {
    if (!data || data.length === 0) {
      return <tbody>
        <tr>
          <td colSpan={Object.keys(columns).length} scope="row" className="py-4 px-6 font-medium whitespace-nowrap dark:text-gray-200 font-italic text-center">
            No data found...
          </td>
        </tr>
      </tbody>;
    }

    return <tbody className="fx-fade-in">
      <>
        {data.map((item: T) => (
          <tr key={`row_${item.id}`}>
            {Object.keys(columns).map(key =>
              <td key={`rowColumn_${item.id}_${key}`} scope="row" className="px-5 font-medium whitespace-nowrap text-gray-900 dark:text-gray-200">
                {renderContent(item, key)}
              </td>
            )}
          </tr>
        ))}
      </>
    </tbody>;
  };

  const renderContent = (item: any, key: string) => {
    const column = columns[key];

    if (isRender(column)) {
      return column.render(item);
    }

    if (isAccessor(column)) {
      if (column.accessor.includes('.')) {
        return column.accessor.split('.').reduce((obj,key)=> obj[key], item);
      }
      return item[column.accessor];
    }
    return item[key];
  };

  const paginate = (link: string) => {
    if (page) page(link);
  };

  return (
    <>
      <div className="overflow-x-auto relative sm:rounded-lg shadow-lg">
        <table className="w-full text-sm text-left text-gray-500 table--layout table--animated table--interactive">
          <thead className="text-gray-400 uppercase">
            <tr>
              {Object.keys(columns).map(key =>
                <th key={`columnHeader_${key}`} scope="col" className="p-6 font-bold tracking-wider">
                  {'title' in columns[key] ? columns[key].title : key}
                </th>
              )}
            </tr>
          </thead>
          {renderBody(data)}
        </table>
      </div>
      <PaginationLinks metadata={meta} links={links} paginate={paginate} />
    </>
  );
}

export default Table;