import type { JSX } from "react";
import type { Meta, Links } from "@/core/interfaces/Pagination";
import { useEffect } from "react";
import { useAnimateTable } from "@/core/hooks/animate";
import PaginationLinks from "./pagination-links";

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
    [key: string]: Column<T>;
  };
  data: T[];
  meta?: Meta;
  links?: Links;
  page?: (link: string) => void;
}

function Table<T extends RequiredAttribute>({ columns, data, meta, links, page }: Props<T>) {
  type Mode = { accessor?: string; render?: RenderColumn<T> };
  const isRender = (ctx: Mode): ctx is Required<Mode> => !!ctx.render;
  const isAccessor = (ctx: Mode): ctx is Required<Mode> => !!ctx.accessor;

  useEffect(useAnimateTable);

  const renderBody = (data: any) => {
    if (!data || data.length === 0) {
      return (
        <tbody>
          <tr>
            <td
              colSpan={Object.keys(columns).length}
              scope="row"
              className="font-italic whitespace-nowrap px-6 py-4 font-medium text-gray-200 md:text-center"
            >
              No data found...
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody className="fx-fade-in">
        <>
          {data.map((item: T) => (
            <tr key={`row_${item.id}`}>
              {Object.keys(columns).map((key) => (
                <td
                  key={`rowColumn_${item.id}_${key}`}
                  scope="row"
                  className="whitespace-nowrap px-6 text-xs font-medium text-gray-200"
                >
                  {renderContent(item, key)}
                </td>
              ))}
            </tr>
          ))}
        </>
      </tbody>
    );
  };

  const renderContent = (item: any, key: string) => {
    const column = columns[key];

    if (isRender(column)) {
      return column.render(item);
    }

    if (isAccessor(column)) {
      if (column.accessor.includes(".")) {
        return column.accessor.split(".").reduce((obj, key) => obj[key], item);
      }
      return item[column.accessor];
    }
    return item[key];
  };

  const paginate = (link: string) => {
    if (page) page(link);
  };

  return (
    <div className="relative border border-orange-900/20 bg-black/50 backdrop-blur backdrop-filter">
      {/* Corner bracket accents */}
      <span className="pointer-events-none absolute -left-px -top-px z-10 h-4 w-4 border-l-2 border-t-2 border-orange-500" />
      <span className="pointer-events-none absolute -right-px -top-px z-10 h-4 w-4 border-r-2 border-t-2 border-orange-500" />
      <span className="pointer-events-none absolute -bottom-px -left-px z-10 h-4 w-4 border-b-2 border-l-2 border-orange-500" />
      <span className="pointer-events-none absolute -bottom-px -right-px z-10 h-4 w-4 border-b-2 border-r-2 border-orange-500" />

      <div className="overflow-x-auto pb-1 pt-2">
        <table className="table--layout table--animated table--interactive w-full text-left text-sm text-gray-500">
          <thead className="border-b border-orange-900/20 uppercase">
            <tr>
              {Object.keys(columns).map((key) => (
                <th
                  key={`columnHeader_${key}`}
                  scope="col"
                  className="px-6 py-3 text-xs font-bold tracking-widest text-glow__orange"
                >
                  {"title" in columns[key] ? columns[key].title : key}
                </th>
              ))}
            </tr>
          </thead>
          {renderBody(data)}
        </table>
      </div>
      {links && meta && <PaginationLinks metadata={meta} links={links} paginate={paginate} />}
    </div>
  );
}

export default Table;
