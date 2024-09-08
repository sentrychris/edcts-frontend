import type { FunctionComponent } from "react";
import { memo } from "react";

interface Props {
  visible: boolean;
  message?: string;
}

const LoaderMini: FunctionComponent<Props> = ({
  visible = true,
  message = "Loading, please wait...",
}) => {
  return (
    <div className="mini-elite-loader-container" style={{ opacity: visible ? "0.75" : "0" }}>
      <div className="mini-elite-loader">
        <h2 className="text-glow__orange mb-3 text-xs uppercase">
          {visible ? message : "Loading completed!"}
        </h2>
        <div className="row">
          <div className="mini-arrow up outer outer-18"></div>
          <div className="mini-arrow down outer outer-17"></div>
          <div className="mini-arrow up outer outer-16"></div>
          <div className="mini-arrow down outer outer-15"></div>
          <div className="mini-arrow up outer outer-14"></div>
        </div>
        <div className="row">
          <div className="mini-arrow up outer outer-1"></div>
          <div className="mini-arrow down outer outer-2"></div>
          <div className="mini-arrow up inner inner-6"></div>
          <div className="mini-arrow down inner inner-5"></div>
          <div className="mini-arrow up inner inner-4"></div>
          <div className="mini-arrow down outer outer-13"></div>
          <div className="mini-arrow up outer outer-12"></div>
        </div>
        <div className="row">
          <div className="mini-arrow down outer outer-3"></div>
          <div className="mini-arrow up outer outer-4"></div>
          <div className="mini-arrow down inner inner-1"></div>
          <div className="mini-arrow up inner inner-2"></div>
          <div className="mini-arrow down inner inner-3"></div>
          <div className="mini-arrow up outer outer-11"></div>
          <div className="mini-arrow down outer outer-10"></div>
        </div>
        <div className="row">
          <div className="mini-arrow down outer outer-5"></div>
          <div className="mini-arrow up outer outer-6"></div>
          <div className="mini-arrow down outer outer-7"></div>
          <div className="mini-arrow up outer outer-8"></div>
          <div className="mini-arrow down outer outer-9"></div>
        </div>
      </div>
    </div>
  );
};

export default memo(LoaderMini);
