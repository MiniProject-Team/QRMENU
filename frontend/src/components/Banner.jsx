const Banner = ({ title, subtitle, image, buttonLabel = "Explore", align = "center" }) => {
  const alignmentClass =
    align === "left"
      ? "items-start text-left"
      : align === "right"
        ? "items-end text-right"
        : "items-center text-center";

  return (
    <article className="relative overflow-hidden rounded-[30px] shadow-[0_24px_60px_rgba(87,33,12,0.16)]">
      <img src={image} alt={title} className="h-64 w-full object-cover sm:h-72" />
      <div className="absolute inset-0 bg-stone-950/45 backdrop-blur-[2px]" />
      <div className={`absolute inset-0 flex ${alignmentClass} justify-center gap-3 px-6 py-8 sm:px-10`}>
        <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-orange-200">Limited Time Flavor</p>
        <h3 className="display-title text-4xl leading-none text-white sm:text-5xl">{title}</h3>
        <p className="max-w-md text-sm leading-7 text-white/82">{subtitle}</p>
        <button type="button" className="primary-action mt-2 min-w-32">
          {buttonLabel}
        </button>
      </div>
    </article>
  );
};

export default Banner;
