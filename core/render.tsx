export const renderTextWithIcon = (
  text: string | number,
  options?: { className?: string; icon?: string },
) => {
  let classes = "flex items-center gap-2 py-1 uppercase text-glow__white font-bold";
  if (options && options.className) {
    classes = classes + options.className;
  }

  return (
    <span className={classes}>
      {options && options.icon && <i className={options.icon + " text-glow__orange"}></i>}
      {text}
    </span>
  );
};
