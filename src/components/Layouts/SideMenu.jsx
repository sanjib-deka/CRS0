import PropTypes from "prop-types";
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LOGOUT_MENU_ITEM, SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/UserContext";
import CharAvatar from "../Cards/CharAvatar";

const SideMenu = ({ user, collapsed = false, onNavigate }) => {
  const { clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUser();
    navigate("/login");
  };

  const menuGroups = [...new Set(SIDE_MENU_DATA.map((item) => item.group))];

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col px-3 py-5">
      <div
        className={`mb-7 flex items-center gap-3 rounded-lg bg-[#f7f7f7] p-3 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt=""
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
        ) : (
          <CharAvatar
            fullName={user?.fullName || ""}
            width="h-9 w-9"
            height="h-9"
            style="text-sm"
          />
        )}
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#171717]">
              {user?.fullName}
            </p>
            <p className="text-xs text-[#737373]">Personal workspace</p>
          </div>
        )}
      </div>

      <nav aria-label="Main navigation" className="flex-1 space-y-6">
        {menuGroups.map((group) => (
          <section key={group}>
            {!collapsed && (
              <h2 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#a3a3a3]">
                {group}
              </h2>
            )}
            <div className="space-y-1">
              {SIDE_MENU_DATA.filter((item) => item.group === group).map(
                (item) => (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={onNavigate}
                    title={collapsed ? item.label : undefined}
                    aria-label={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `flex h-10 items-center gap-3 rounded-md px-3 text-sm transition-colors ${
                        isActive
                          ? "bg-[#171717] font-medium text-white"
                          : "text-[#525252] hover:bg-[#f5f5f5] hover:text-[#171717]"
                      } ${collapsed ? "justify-center px-0" : ""}`
                    }
                  >
                    <item.icon className="shrink-0 text-[17px]" />
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                )
              )}
            </div>
          </section>
        ))}
      </nav>

      <button
        type="button"
        title={collapsed ? LOGOUT_MENU_ITEM.label : undefined}
        onClick={handleLogout}
        className={`flex h-10 items-center gap-3 rounded-md px-3 text-sm text-[#525252] transition-colors hover:bg-[#f5f5f5] hover:text-[#171717] ${
          collapsed ? "justify-center px-0" : ""
        }`}
      >
        <LOGOUT_MENU_ITEM.icon className="shrink-0 text-[17px]" />
        {!collapsed && LOGOUT_MENU_ITEM.label}
      </button>
    </div>
  );
};

SideMenu.propTypes = {
  user: PropTypes.shape({
    fullName: PropTypes.string,
    profileImageUrl: PropTypes.string,
  }),
  collapsed: PropTypes.bool,
  onNavigate: PropTypes.func,
};

export default SideMenu;
