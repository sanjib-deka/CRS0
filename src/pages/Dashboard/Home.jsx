import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";

import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";

import { Link, useNavigate } from "react-router-dom";
import InfoCard from "../../components/Cards/InfoCard";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { addThousandsSeparator } from "../../utils/helper";
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import FinanceOverview from "../../components/Dashboard/FinanceOverview";
import ExpenseTransactions from "../../components/Dashboard/ExpenseTransactions";
import Last30DaysExpenses from "../../components/Dashboard/Last30DaysExpenses";
import RecentIncome from "../../components/Dashboard/RecentIncome";
import RecentIncomeWithChart from "../../components/Dashboard/RecentIncomeWithChart";
import { LuArrowRight, LuShoppingCart, LuTruck, LuUsers } from "react-icons/lu";

const Home = () => {
  useUserAuth();

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
        if (isMounted && response.data) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        if (isMounted) {
          setLoadError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="mx-auto">
        <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#737373]">
              Workspace / Overview
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#171717]">
              Business overview
            </h1>
            <p className="mt-1 text-sm text-[#737373]">
              Your financial activity at a glance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={
              dashboardData
                ? addThousandsSeparator(dashboardData.totalBalance)
                : loading
                  ? "…"
                  : "—"
            }
            color="bg-[#171717]"
          />

          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={
              dashboardData
                ? addThousandsSeparator(dashboardData.totalIncome)
                : loading
                  ? "…"
                  : "—"
            }
            color="bg-[#525252]"
          />

          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expenses"
            value={
              dashboardData
                ? addThousandsSeparator(dashboardData.totalExpenses)
                : loading
                  ? "…"
                  : "—"
            }
            color="bg-[#a3a3a3]"
          />
        </div>

        {dashboardData && (
          <section aria-label="Business operations" className="mt-6">
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-[#171717]">
                Business operations
              </h2>
              <p className="mt-1 text-xs text-[#737373]">
                Live counts from your employee, fleet, and procurement records.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <ModuleSummary
                href="/hr"
                icon={<LuUsers />}
                title="HR"
                value={`${dashboardData.hr.activeEmployees} / ${dashboardData.hr.totalEmployees}`}
                detail="Active employees"
              />
              <ModuleSummary
                href="/fleet"
                icon={<LuTruck />}
                title="Operations"
                value={`${dashboardData.operations.availableVehicles} / ${dashboardData.operations.totalVehicles}`}
                detail="Vehicles available"
              />
              <ModuleSummary
                href="/procurement"
                icon={<LuShoppingCart />}
                title="Procurement"
                value={dashboardData.procurement.openRequests}
                detail="Open purchase requests"
              />
            </div>
          </section>
        )}

        {dashboardData ? (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <RecentTransactions
              transactions={dashboardData.recentTransactions}
              onSeeMore={() => navigate("/expense")}
            />

            <FinanceOverview
              totalBalance={dashboardData.totalBalance}
              totalIncome={dashboardData.totalIncome}
              totalExpense={dashboardData.totalExpenses}
            />

            <ExpenseTransactions
              transactions={dashboardData.last30DaysExpenses.transactions}
              onSeeMore={() => navigate("/expense")}
            />

            <Last30DaysExpenses
              data={dashboardData.last30DaysExpenses.transactions}
            />

            <RecentIncomeWithChart
              data={dashboardData.last60DaysIncome.transactions.slice(0, 4)}
              totalIncome={dashboardData.totalIncome}
            />

            <RecentIncome
              transactions={dashboardData.last60DaysIncome.transactions}
              onSeeMore={() => navigate("/income")}
            />
          </div>
        ) : (
          <div
            role={loadError ? "alert" : "status"}
            className="mt-6 rounded-xl border border-[#e5e5e5] bg-white px-5 py-8 text-sm text-[#737373]"
          >
            {loading
              ? "Loading financial activity…"
              : loadError
                ? "Financial activity is unavailable. Check the API connection and try again."
                : "No financial data is available yet."}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const ModuleSummary = ({ href, icon, title, value, detail }) => (
  <Link
    to={href}
    className="group rounded-xl border border-[#e5e5e5] bg-white p-4 transition-colors hover:border-[#a3a3a3]"
  >
    <div className="flex items-center justify-between">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#f5f5f5] text-[#404040]">
        {icon}
      </span>
      <LuArrowRight className="text-[#a3a3a3] transition-transform group-hover:translate-x-0.5" />
    </div>
    <h3 className="mt-4 text-sm font-medium text-[#171717]">{title}</h3>
    <p className="mt-2 text-xl font-semibold text-[#171717]">{value}</p>
    <p className="mt-1 text-xs text-[#737373]">{detail}</p>
  </Link>
);

ModuleSummary.propTypes = {
  href: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  detail: PropTypes.string.isRequired,
};

export default Home;
