import { NavLink } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

const links = [
  { to: ROUTES.ADMIN_DASHBOARD, label: "Dashboard" },
  { to: ROUTES.ADMIN_PRODUCTS, label: "Products" },
  { to: ROUTES.ADMIN_CATEGORIES, label: "Categories" },
  { to: ROUTES.ADMIN_COUPONS, label: "Coupons" },
  { to: ROUTES.ADMIN_ORDERS, label: "Orders" },
  { to: ROUTES.ADMIN_USERS, label: "Users" },
];

const AdminSidebar = () => {
  return (
    <aside className="w-56 border-r min-h-[calc(100vh-57px)] p-4">
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === ROUTES.ADMIN_DASHBOARD}
            className={({ isActive }) =>
              `px-3 py-2 rounded text-sm ${isActive ? "bg-black text-white" : "hover:bg-gray-100"}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
