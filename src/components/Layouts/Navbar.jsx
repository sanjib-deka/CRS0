import PropTypes from "prop-types";
import { LuMenu, LuX } from "react-icons/lu";
import CharAvatar from "../Cards/CharAvatar";

const Navbar = ({
  activeMenu,
  user,
  onToggleSidebar,
  mobileMenuOpen,
  sidebarCollapsed,
}) => {
  const isMobile = window.matchMedia("(max-width: 1023px)").matches;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#e5e5e5] bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button
        type="button"
        aria-label={
          isMobile
            ? mobileMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
            : sidebarCollapsed
              ? "Expand navigation"
              : "Collapse navigation"
        }
        aria-expanded={isMobile ? mobileMenuOpen : !sidebarCollapsed}
        onClick={onToggleSidebar}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#525252] transition hover:bg-[#f5f5f5] hover:text-black"
      >
        {mobileMenuOpen ? (
          <LuX className="text-xl" />
        ) : (
          <LuMenu className="text-xl" />
        )}
      </button>

      <div className="ml-3 flex min-w-0 flex-1 items-center gap-3 lg:ml-0">
        <span className="text-base font-semibold tracking-tight text-[#111111]">
          Corporate ERP System
        </span>
        <span aria-hidden="true" className="text-[#d4d4d4]">/</span>
        <span className="truncate text-sm text-[#525252]">{activeMenu}</span>
      </div>

      <div className="ml-4 flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="max-w-40 truncate text-sm font-medium text-[#171717]">
            {user?.fullName}
          </p>
          <p className="text-xs text-[#737373]">Workspace</p>
        </div>
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt=""
            className="h-9 w-9 rounded-full border border-[#e5e5e5] object-cover"
          />
        ) : (
          <CharAvatar
            fullName={user?.fullName || ""}
            width="h-9 w-9"
            height="h-9"
            style="text-sm"
          />
        )}
      </div>
    </header>
  );
};

Navbar.propTypes = {
  activeMenu: PropTypes.string.isRequired,
  user: PropTypes.shape({
    fullName: PropTypes.string,
    profileImageUrl: PropTypes.string,
  }),
  onToggleSidebar: PropTypes.func.isRequired,
  mobileMenuOpen: PropTypes.bool.isRequired,
  sidebarCollapsed: PropTypes.bool.isRequired,
};

export default Navbar;
