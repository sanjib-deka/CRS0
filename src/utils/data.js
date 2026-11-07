import {
  LuLayoutDashboard,
  LuHandCoins,
  LuWalletMinimal,
  LuLogOut,
  LuTruck,
  LuUsers,
  LuShoppingCart,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/dashboard",
    group: "Overview",
  },
  {
    id: "02",
    label: "Income",
    icon: LuWalletMinimal,
    path: "/income",
    group: "Finance",
  },
  {
    id: "03",
    label: "Expense",
    icon: LuHandCoins,
    path: "/expense",
    group: "Finance",
  },
  {
    id: "04",
    label: "Fleet",
    icon: LuTruck,
    path: "/fleet",
    group: "Operations",
  },
  {
    id: "05",
    label: "Employees",
    icon: LuUsers,
    path: "/hr",
    group: "HR",
  },
  {
    id: "06",
    label: "Purchase requests",
    icon: LuShoppingCart,
    path: "/procurement",
    group: "Procurement",
  },
];

export const LOGOUT_MENU_ITEM = {
  id: "logout",
  label: "Log out",
  icon: LuLogOut,
};
