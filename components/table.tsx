import type { JSX } from "react";
import type { Meta, Links } from "@/core/interfaces/Pagination";
import { useEffect } from "react";
import { useAnimateTable } from "@/core/hooks/animate";

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
}

function Table<T extends RequiredAttribute>({ columns, data, meta, links }: Props<T>) {
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
                  className="whitespace-nowrap px-5 font-medium text-gray-200"
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

  return (
    <>
      <div className="relative overflow-x-auto border-b border-t border-neutral-800 bg-transparent pb-5 pt-2 backdrop-blur backdrop-filter">
        <table className="table--layout table--animated table--interactive w-full text-left text-sm text-gray-500">
          <thead className="uppercase text-gray-400">
            <tr>
              {Object.keys(columns).map((key) => (
                <th
                  key={`columnHeader_${key}`}
                  scope="col"
                  className="p-6 font-bold tracking-wider"
                >
                  {"title" in columns[key] ? columns[key].title : key}
                </th>
              ))}
            </tr>
          </thead>
          {renderBody(data)}
        </table>
      </div>
    </>
  );
}

export default Table;
