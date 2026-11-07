import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { LuTrash2, LuUserPlus } from "react-icons/lu";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";

const EMPLOYEE_STATUSES = ["Active", "On Leave", "Inactive"];
const EMPTY_FORM = {
  employeeCode: "",
  fullName: "",
  workEmail: "",
  jobTitle: "",
  department: "",
};

const Employees = () => {
  useUserAuth();

  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadEmployees = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.HR.EMPLOYEES);
        if (isMounted) {
          setEmployees(response.data);
          setLoadError("");
        }
      } catch (error) {
        console.error("Failed to load employees:", error);
        if (isMounted) {
          setLoadError(error.response?.data?.message || "Unable to load employees.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadEmployees();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await axiosInstance.post(API_PATHS.HR.EMPLOYEES, form);
      setEmployees((current) =>
        [...current, response.data].sort((a, b) =>
          a.fullName.localeCompare(b.fullName)
        )
      );
      setForm(EMPTY_FORM);
      toast.success("Employee added");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to add employee");
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (employee, status) => {
    try {
      const response = await axiosInstance.put(
        API_PATHS.HR.EMPLOYEE(employee._id),
        { ...employee, status }
      );
      setEmployees((current) =>
        current.map((item) =>
          item._id === employee._id ? response.data : item
        )
      );
      toast.success("Employee status updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update employee");
    }
  };

  const deleteEmployee = async (employeeId) => {
    try {
      await axiosInstance.delete(API_PATHS.HR.EMPLOYEE(employeeId));
      setEmployees((current) =>
        current.filter((employee) => employee._id !== employeeId)
      );
      setPendingDelete(null);
      toast.success("Employee removed");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete employee");
    }
  };

  return (
    <DashboardLayout activeMenu="Employees">
      <div>
        <div className="mb-6">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#737373]">
            Workspace / HR
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#171717]">
            Employee directory
          </h1>
          <p className="mt-1 text-sm text-[#737373]">
            Maintain employee contact, role, department, and status records.
          </p>
        </div>

        <section className="card">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-[#171717]">
              Add employee
            </h2>
            <p className="mt-1 text-sm text-[#737373]">
              Records are private to the signed-in workspace.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            <EmployeeInput
              label="Employee ID"
              value={form.employeeCode}
              onChange={(value) => setForm({ ...form, employeeCode: value })}
              placeholder="e.g. EMP-001"
              maxLength={32}
            />
            <EmployeeInput
              label="Full name"
              value={form.fullName}
              onChange={(value) => setForm({ ...form, fullName: value })}
              placeholder="Employee name"
              maxLength={120}
            />
            <EmployeeInput
              label="Work email"
              value={form.workEmail}
              onChange={(value) => setForm({ ...form, workEmail: value })}
              placeholder="name@company.com"
              type="email"
              maxLength={180}
            />
            <EmployeeInput
              label="Job title"
              value={form.jobTitle}
              onChange={(value) => setForm({ ...form, jobTitle: value })}
              placeholder="Role or position"
              maxLength={120}
            />
            <EmployeeInput
              label="Department"
              value={form.department}
              onChange={(value) => setForm({ ...form, department: value })}
              placeholder="Department"
              maxLength={100}
            />
            <div className="flex items-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-[42px] items-center justify-center gap-2 rounded-md bg-[#171717] px-4 text-sm font-medium text-white transition hover:bg-[#404040] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LuUserPlus />
                {saving ? "Saving…" : "Add employee"}
              </button>
            </div>
          </form>
        </section>

        <section className="card mt-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-[#171717]">
              Employees
            </h2>
            <p className="mt-1 text-sm text-[#737373]">
              {employees.length} {employees.length === 1 ? "record" : "records"}
            </p>
          </div>

          {loadError && (
            <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {loadError}
            </p>
          )}

          {loading ? (
            <p role="status" className="py-10 text-center text-sm text-[#737373]">
              Loading employee records…
            </p>
          ) : employees.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#737373]">
              No employee records yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#e5e5e5] text-xs uppercase tracking-wide text-[#737373]">
                    <th className="px-3 py-3 font-medium">Employee</th>
                    <th className="px-3 py-3 font-medium">Job title</th>
                    <th className="px-3 py-3 font-medium">Department</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee._id} className="border-b border-[#f0f0f0] last:border-0">
                      <td className="px-3 py-4">
                        <p className="font-medium text-[#171717]">{employee.fullName}</p>
                        <p className="mt-1 text-xs text-[#737373]">
                          {employee.employeeCode} · {employee.workEmail}
                        </p>
                      </td>
                      <td className="px-3 py-4 text-[#525252]">{employee.jobTitle}</td>
                      <td className="px-3 py-4 text-[#525252]">{employee.department}</td>
                      <td className="px-3 py-4">
                        <select
                          aria-label={`Status for ${employee.fullName}`}
                          value={employee.status}
                          onChange={(event) => updateStatus(employee, event.target.value)}
                          className="rounded-md border border-[#e5e5e5] bg-white px-2 py-1.5 text-xs text-[#404040] outline-none focus:border-[#737373]"
                        >
                          {EMPLOYEE_STATUSES.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-4">
                        {pendingDelete === employee._id ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => deleteEmployee(employee._id)}
                              className="text-xs font-medium text-red-700 hover:underline"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setPendingDelete(null)}
                              className="text-xs text-[#737373] hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            aria-label={`Delete ${employee.fullName}`}
                            onClick={() => setPendingDelete(employee._id)}
                            className="rounded p-1.5 text-[#737373] hover:bg-red-50 hover:text-red-700"
                          >
                            <LuTrash2 />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

const EmployeeInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
}) => (
  <label className="text-sm font-medium text-[#404040]">
    {label}
    <input
      required
      type={type}
      maxLength={maxLength}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="mt-2 w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#737373]"
    />
  </label>
);

EmployeeInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string,
  maxLength: PropTypes.number,
};

export default Employees;
