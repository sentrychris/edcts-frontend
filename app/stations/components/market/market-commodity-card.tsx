import type { FunctionComponent } from "react";
import type { MarketCommodity } from "@/core/interfaces/Market";
import { formatNumber } from "@/core/string-utils";

interface Props {
  commodity: MarketCommodity;
}

const MarketCommodityCard: FunctionComponent<Props> = ({ commodity }) => {
  return (
    <>
      <div className="rounded-xl border border-neutral-800 bg-transparent p-5 backdrop-blur backdrop-filter">
        <h2 className="text-glow__blue uppercase">{commodity.name}</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div>
            <h3 className="text-glow__orange mb-2">Buy Price</h3>
            <p className="flex items-center gap-2">
              <i className="icarus-terminal-credits text-glow"></i>
              {formatNumber(commodity.buyPrice)}
            </p>
          </div>
          <div>
            <h3 className="text-glow__orange mb-2">Stock</h3>
            <p className="flex items-center gap-2">
              <i className="icarus-terminal-inventory text-glow"></i>
              {formatNumber(commodity.stock)}
            </p>
          </div>
          <div>
            <h3 className="text-glow__orange mb-2">Sell Price</h3>
            <p className="flex items-center gap-2">
              <i className="icarus-terminal-credits text-glow"></i>
              {formatNumber(commodity.sellPrice)}
            </p>
          </div>
          <div>
            <h3 className="text-glow__orange mb-2">Demand</h3>
            <p className="flex items-center gap-2">
              <i
                className={`icarus-terminal-chevron-${Math.random() > 0.5 ? "up text-green-300" : "down text-red-300"}`}
              ></i>
              {formatNumber(commodity.demand)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketCommodityCard;
