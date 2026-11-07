import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { LuHandCoins, LuTrendingUpDown, LuWalletMinimal } from "react-icons/lu";

const AuthLayout = ({ children }) => {
  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[1fr_0.9fr]">
      <section className="flex min-h-screen flex-col px-5 py-8 sm:px-10 lg:px-16">
        <Link
          to="/login"
          className="w-fit text-lg font-semibold tracking-tight text-[#171717]"
        >
          Corporate ERP System
        </Link>
        <div className="flex flex-1 items-center justify-center py-10">
          {children}
        </div>
        <p className="text-xs text-[#a3a3a3]">
          Finance and operations in one business workspace.
        </p>
      </section>

      <aside className="hidden min-h-screen flex-col justify-between border-l border-[#e5e5e5] bg-[#f7f7f7] p-12 xl:flex">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-[#737373]">
          Corporate workspace
        </span>
        <div className="mx-auto w-full max-w-lg">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[#171717]">
            One workspace for your business operations.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-[#737373]">
            Review financial activity, manage employee records and fleet
            vehicles, and track supplier purchase requests.
          </p>
          <div className="mt-10 space-y-3">
            <FeatureRow
              icon={<LuWalletMinimal />}
              title="Income tracking"
              description="Record and review income sources."
            />
            <FeatureRow
              icon={<LuHandCoins />}
              title="Expense tracking"
              description="Organise expenses by category and date."
            />
            <FeatureRow
              icon={<LuTrendingUpDown />}
              title="Financial overview"
              description="See balances and recent activity."
            />
          </div>
        </div>
        <p className="text-xs text-[#a3a3a3]">Corporate ERP System</p>
      </aside>
    </main>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

const FeatureRow = ({ icon, title, description }) => (
  <div className="flex items-center gap-4 rounded-lg border border-[#e5e5e5] bg-white p-4">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#f5f5f5] text-lg text-[#171717]">
      {icon}
    </span>
    <div>
      <h2 className="text-sm font-medium text-[#171717]">{title}</h2>
      <p className="mt-1 text-xs text-[#737373]">{description}</p>
    </div>
  </div>
);

FeatureRow.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default AuthLayout;
