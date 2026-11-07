import PropTypes from "prop-types";
import { useContext, useState } from "react";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import { UserContext } from "../../context/UserContext";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[#171717]">
      <Navbar
        activeMenu={activeMenu}
        user={user}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => {
          if (window.innerWidth < 1024) {
            setMobileMenuOpen((isOpen) => !isOpen);
          } else {
            setSidebarCollapsed((isCollapsed) => !isCollapsed);
          }
        }}
        mobileMenuOpen={mobileMenuOpen}
      />

      {user && (
        <div className="flex min-h-[calc(100vh-64px)]">
          <aside
            className={`hidden shrink-0 border-r border-[#e5e5e5] bg-white transition-[width] duration-200 lg:block ${
              sidebarCollapsed ? "w-[76px]" : "w-64"
            }`}
          >
            <SideMenu
              user={user}
              collapsed={sidebarCollapsed}
            />
          </aside>

          {mobileMenuOpen && (
            <div className="fixed inset-0 top-16 z-40 lg:hidden">
              <button
                type="button"
                aria-label="Close navigation menu"
                className="absolute inset-0 bg-black/30"
                onClick={() => setMobileMenuOpen(false)}
              />
              <aside className="relative h-full w-72 border-r border-[#e5e5e5] bg-white shadow-xl">
                <SideMenu
                  user={user}
                  onNavigate={() => setMobileMenuOpen(false)}
                />
              </aside>
            </div>
          )}

          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-[1440px]">{children}</div>
          </main>
        </div>
      )}
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  activeMenu: PropTypes.string.isRequired,
};

export default DashboardLayout;
