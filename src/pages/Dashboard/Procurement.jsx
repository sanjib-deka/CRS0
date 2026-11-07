import { useEffect, useState } from "react";
import { LuClipboardList, LuTrash2 } from "react-icons/lu";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";

const REQUEST_STATUSES = [
  "Draft",
  "Requested",
  "Approved",
  "Received",
  "Cancelled",
];
const EMPTY_FORM = {
  supplier: "",
  description: "",
  quantity: "",
  unitCost: "",
  neededBy: "",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

const Procurement = () => {
  useUserAuth();

  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadRequests = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.PROCUREMENT.REQUESTS);
        if (isMounted) {
          setRequests(response.data);
          setLoadError("");
        }
      } catch (error) {
        console.error("Failed to load purchase requests:", error);
        if (isMounted) {
          setLoadError(
            error.response?.data?.message || "Unable to load purchase requests."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadRequests();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await axiosInstance.post(
        API_PATHS.PROCUREMENT.REQUESTS,
        {
          ...form,
          quantity: Number(form.quantity),
          unitCost: Number(form.unitCost),
        }
      );
      setRequests((current) => [response.data, ...current]);
      setForm(EMPTY_FORM);
      toast.success("Purchase request created");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to create purchase request"
      );
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (request, status) => {
    try {
      const response = await axiosInstance.put(
        API_PATHS.PROCUREMENT.REQUEST(request._id),
        { ...request, status }
      );
      setRequests((current) =>
        current.map((item) =>
          item._id === request._id ? response.data : item
        )
      );
      toast.success("Purchase request status updated");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to update purchase request"
      );
    }
  };

  const deleteRequest = async (requestId) => {
    try {
      await axiosInstance.delete(API_PATHS.PROCUREMENT.REQUEST(requestId));
      setRequests((current) =>
        current.filter((request) => request._id !== requestId)
      );
      setPendingDelete(null);
      toast.success("Purchase request deleted");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to delete purchase request"
      );
    }
  };

  return (
    <DashboardLayout activeMenu="Purchase requests">
      <div>
        <div className="mb-6">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#737373]">
            Workspace / Procurement
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#171717]">
            Purchase requests
          </h1>
          <p className="mt-1 text-sm text-[#737373]">
            Record supplier requests, estimated costs, and fulfillment status.
          </p>
        </div>

        <div className="mb-5 rounded-lg border border-[#e5e5e5] bg-white px-4 py-3 text-sm text-[#737373]">
          Statuses are managed within your account. Multi-user approval roles
          are not configured yet.
        </div>

        <section className="card">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-[#171717]">
              Create a purchase request
            </h2>
            <p className="mt-1 text-sm text-[#737373]">
              Estimated total is calculated from quantity and unit cost.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            <label className="text-sm font-medium text-[#404040]">
              Supplier
              <input
                required
                maxLength={120}
                value={form.supplier}
                onChange={(event) =>
                  setForm({ ...form, supplier: event.target.value })
                }
                placeholder="Supplier name"
                className="mt-2 w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#737373]"
              />
            </label>
            <label className="text-sm font-medium text-[#404040]">
              Item or service
              <input
                required
                maxLength={240}
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                placeholder="What needs to be purchased?"
                className="mt-2 w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#737373]"
              />
            </label>
            <label className="text-sm font-medium text-[#404040]">
              Quantity
              <input
                required
                type="number"
                min="1"
                step="1"
                value={form.quantity}
                onChange={(event) =>
                  setForm({ ...form, quantity: event.target.value })
                }
                placeholder="1"
                className="mt-2 w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#737373]"
              />
            </label>
            <label className="text-sm font-medium text-[#404040]">
              Unit cost (INR)
              <input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={form.unitCost}
                onChange={(event) =>
                  setForm({ ...form, unitCost: event.target.value })
                }
                placeholder="0.00"
                className="mt-2 w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#737373]"
              />
            </label>
            <label className="text-sm font-medium text-[#404040]">
              Required by
              <input
                type="date"
                value={form.neededBy}
                onChange={(event) =>
                  setForm({ ...form, neededBy: event.target.value })
                }
                className="mt-2 w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#737373]"
              />
            </label>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-[42px] items-center justify-center gap-2 rounded-md bg-[#171717] px-4 text-sm font-medium text-white transition hover:bg-[#404040] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LuClipboardList />
                {saving ? "Saving…" : "Create request"}
              </button>
            </div>
          </form>
        </section>

        <section className="card mt-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-[#171717]">
              Request register
            </h2>
            <p className="mt-1 text-sm text-[#737373]">
              {requests.length} {requests.length === 1 ? "request" : "requests"}
            </p>
          </div>

          {loadError && (
            <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {loadError}
            </p>
          )}

          {loading ? (
            <p role="status" className="py-10 text-center text-sm text-[#737373]">
              Loading purchase requests…
            </p>
          ) : requests.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#737373]">
              No purchase requests yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#e5e5e5] text-xs uppercase tracking-wide text-[#737373]">
                    <th className="px-3 py-3 font-medium">Supplier / item</th>
                    <th className="px-3 py-3 font-medium">Quantity</th>
                    <th className="px-3 py-3 font-medium">Est. total</th>
                    <th className="px-3 py-3 font-medium">Required by</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request._id} className="border-b border-[#f0f0f0] last:border-0">
                      <td className="px-3 py-4">
                        <p className="font-medium text-[#171717]">{request.supplier}</p>
                        <p className="mt-1 text-xs text-[#737373]">{request.description}</p>
                      </td>
                      <td className="px-3 py-4 text-[#525252]">{request.quantity}</td>
                      <td className="px-3 py-4 text-[#525252]">
                        {formatCurrency(request.quantity * request.unitCost)}
                      </td>
                      <td className="px-3 py-4 text-[#525252]">
                        {request.neededBy
                          ? new Date(request.neededBy).toLocaleDateString()
                          : "Not set"}
                      </td>
                      <td className="px-3 py-4">
                        <select
                          aria-label={`Status for ${request.description}`}
                          value={request.status}
                          onChange={(event) => updateStatus(request, event.target.value)}
                          className="rounded-md border border-[#e5e5e5] bg-white px-2 py-1.5 text-xs text-[#404040] outline-none focus:border-[#737373]"
                        >
                          {REQUEST_STATUSES.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-4">
                        {pendingDelete === request._id ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => deleteRequest(request._id)}
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
                            aria-label={`Delete request for ${request.description}`}
                            onClick={() => setPendingDelete(request._id)}
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

export default Procurement;
