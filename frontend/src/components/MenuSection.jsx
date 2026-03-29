import MenuCard from "./MenuCard";

const PlateIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="7" />
    <circle cx="12" cy="12" r="3" />
    <path d="M4 4l2 2M18 18l2 2" />
  </svg>
);

const MenuSection = ({ title, subtitle, items, cartItems, onAdd, onIncrease, onDecrease }) => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-500 text-white shadow-lg">
            <PlateIcon />
          </div>
          <div>
            <p className="section-kicker">Curated Section</p>
            <h3 className="display-title mt-1 text-4xl sm:text-[2.8rem]">{title}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">{subtitle}</p>
          </div>
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600">
          {items.length} items
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const quantity = cartItems.find((entry) => entry.id === item.id)?.quantity ?? 0;
          return (
            <MenuCard
              key={item.id}
              item={item}
              quantity={quantity}
              onAdd={onAdd}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
            />
          );
        })}
      </div>
    </section>
  );
};

export default MenuSection;
