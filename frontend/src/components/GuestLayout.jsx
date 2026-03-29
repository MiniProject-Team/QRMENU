import CartDrawer from "./CartDrawer";
import GuestMobileNav from "./GuestMobileNav";
import Navbar from "./Navbar";

const DOT_PATTERN = `url("data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180" fill="none">
    <rect width="180" height="180" fill="#F8FAFC"/>
    <g opacity="0.65">
      <circle cx="22" cy="22" r="2" fill="#CFFAFE"/>
      <circle cx="90" cy="42" r="2" fill="#99F6E4"/>
      <circle cx="150" cy="18" r="2" fill="#E2E8F0"/>
      <circle cx="36" cy="90" r="2" fill="#BFDBFE"/>
      <circle cx="110" cy="102" r="2" fill="#A7F3D0"/>
      <circle cx="162" cy="86" r="2" fill="#CFFAFE"/>
      <circle cx="56" cy="154" r="2" fill="#CBD5E1"/>
      <circle cx="124" cy="146" r="2" fill="#99F6E4"/>
    </g>
  </svg>
`)})`;

const GuestLayout = ({ children, title, subtitle, currentTableId, showMobileNav = true }) => {
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(circle at top left, rgba(45,212,191,0.20), transparent 24%), radial-gradient(circle at top right, rgba(148,163,184,0.16), transparent 26%), ${DOT_PATTERN}`,
        backgroundRepeat: "no-repeat, no-repeat, repeat",
        backgroundSize: "auto, auto, 180px 180px",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(248,250,252,0.88),rgba(248,250,252,0.75))]" aria-hidden="true" />
      <div className="pointer-events-none absolute left-[-10%] top-32 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute right-[-8%] top-16 h-80 w-80 rounded-full bg-cyan-100/70 blur-3xl" aria-hidden="true" />
      <Navbar title={title} subtitle={subtitle} currentTableId={currentTableId} />
      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">{children}</main>
      <CartDrawer />
      {showMobileNav ? <GuestMobileNav currentTableId={currentTableId} /> : null}
    </div>
  );
};

export default GuestLayout;
