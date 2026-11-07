import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";

const VEHICLE_TYPES = ["Car", "Van", "Bus", "Truck", "Other"];
const VEHICLE_STATUSES = ["Available", "In Service", "Maintenance"];
const EMPTY_FORM = {
  registrationNumber: "",
  vehicleType: "Car",
  capacity: "",
  insuranceExpiry: "",
  registrationExpiry: "",
};

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString() : "Not set";

const Fleet = () => {
  useUserAuth();

  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadVehicles = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.FLEET.VEHICLES);
        if (isMounted) {
          setVehicles(response.data);
          setLoadError("");
        }
      } catch (error) {
        console.error("Failed to load fleet vehicles:", error);
        if (isMounted) {
          setLoadError(
            error.response?.data?.message || "Unable to load fleet vehicles."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadVehicles();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await axiosInstance.post(API_PATHS.FLEET.VEHICLES, {
        ...form,
        registrationNumber: form.registrationNumber.trim(),
        capacity: Number(form.capacity),
      });
      setVehicles((current) => [response.data, ...current]);
      setForm(EMPTY_FORM);
      toast.success("Vehicle added to fleet");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to add vehicle");
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (vehicle, status) => {
    try {
      const response = await axiosInstance.put(
        API_PATHS.FLEET.VEHICLE(vehicle._id),
        { ...vehicle, status }
      );
      setVehicles((current) =>
        current.map((item) =>
          item._id === vehicle._id ? response.data : item
        )
      );
      toast.success("Vehicle status updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update status");
    }
  };

  const deleteVehicle = async (vehicleId) => {
    try {
      await axiosInstance.delete(API_PATHS.FLEET.VEHICLE(vehicleId));
      setVehicles((current) =>
        current.filter((vehicle) => vehicle._id !== vehicleId)
      );
      setPendingDelete(null);
      toast.success("Vehicle removed from fleet");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete vehicle");
    }
  };

  const maintenanceCount = vehicles.filter(
    (vehicle) => vehicle.status === "Maintenance"
  ).length;

  return (
    <DashboardLayout activeMenu="Fleet">
      <div>
        <div className="mb-6">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#737373]">
            Workspace / Operations
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#171717]">
            Fleet
          </h1>
          <p className="mt-1 text-sm text-[#737373]">
            Manage vehicle records, availability, and expiry dates.
          </p>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <FleetMetric label="Vehicles" value={vehicles.length} />
          <FleetMetric
            label="Available"
            value={vehicles.filter((vehicle) => vehicle.status === "Available").length}
          />
          <FleetMetric label="In maintenance" value={maintenanceCount} />
        </div>

        <section className="card">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-[#171717]">
              Register a vehicle
            </h2>
            <p className="mt-1 text-sm text-[#737373]">
              Add a vehicle to your workspace fleet.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="text-sm font-medium text-[#404040]">
              Registration number
              <input
                required
                maxLength={20}
                value={form.registrationNumber}
                onChange={(event) =>
                  setForm({ ...form, registrationNumber: event.target.value })
                }
                placeholder="e.g. AB-12-CD-3456"
                className="mt-2 w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#737373]"
              />
            </label>

            <label className="text-sm font-medium text-[#404040]">
              Vehicle type
              <select
                value={form.vehicleType}
                onChange={(event) =>
                  setForm({ ...form, vehicleType: event.target.value })
                }
                className="mt-2 w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#737373]"
              >
                {VEHICLE_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-[#404040]">
              Passenger capacity
              <input
                required
                min="1"
                step="1"
                type="number"
                value={form.capacity}
                onChange={(event) =>
                  setForm({ ...form, capacity: event.target.value })
                }
                placeholder="Number of seats"
                className="mt-2 w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#737373]"
              />
            </label>

            <label className="text-sm font-medium text-[#404040]">
              Insurance expiry
              <input
                type="date"
                value={form.insuranceExpiry}
                onChange={(event) =>
                  setForm({ ...form, insuranceExpiry: event.target.value })
                }
                className="mt-2 w-full rounded-md border border-[#e5e5e5] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#737373]"
              />
            </label>

            <label className="text-sm font-medium text-[#404040]">
              Registration expiry
              <input
                type="date"
                value={form.registrationExpiry}
                onChange={(event) =>
                  setForm({ ...form, registrationExpiry: event.target.value })
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
                <LuPlus />
                {saving ? "Saving…" : "Add vehicle"}
              </button>
            </div>
          </form>
        </section>

        <section className="card mt-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#171717]">
                Vehicle records
              </h2>
              <p className="mt-1 text-sm text-[#737373]">
                {vehicles.length} {vehicles.length === 1 ? "vehicle" : "vehicles"} in this workspace
              </p>
            </div>
          </div>

          {loadError && (
            <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {loadError}
            </p>
          )}

          {loading ? (
            <p role="status" className="py-10 text-center text-sm text-[#737373]">
              Loading fleet records…
            </p>
          ) : vehicles.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#737373]">
              No vehicles registered yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#e5e5e5] text-xs uppercase tracking-wide text-[#737373]">
                    <th className="px-3 py-3 font-medium">Vehicle</th>
                    <th className="px-3 py-3 font-medium">Capacity</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 font-medium">Insurance expiry</th>
                    <th className="px-3 py-3 font-medium">Registration expiry</th>
                    <th className="px-3 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle._id} className="border-b border-[#f0f0f0] last:border-0">
                      <td className="px-3 py-4">
                        <p className="font-medium text-[#171717]">{vehicle.registrationNumber}</p>
                        <p className="mt-1 text-xs text-[#737373]">{vehicle.vehicleType}</p>
                      </td>
                      <td className="px-3 py-4 text-[#525252]">
                        {vehicle.capacity} seats
                      </td>
                      <td className="px-3 py-4">
                        <select
                          aria-label={`Status for ${vehicle.registrationNumber}`}
                          value={vehicle.status}
                          onChange={(event) => updateStatus(vehicle, event.target.value)}
                          className="rounded-md border border-[#e5e5e5] bg-white px-2 py-1.5 text-xs text-[#404040] outline-none focus:border-[#737373]"
                        >
                          {VEHICLE_STATUSES.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-4 text-[#525252]">
                        {formatDate(vehicle.insuranceExpiry)}
                      </td>
                      <td className="px-3 py-4 text-[#525252]">
                        {formatDate(vehicle.registrationExpiry)}
                      </td>
                      <td className="px-3 py-4">
                        {pendingDelete === vehicle._id ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => deleteVehicle(vehicle._id)}
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
                            aria-label={`Delete ${vehicle.registrationNumber}`}
                            onClick={() => setPendingDelete(vehicle._id)}
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

const FleetMetric = ({ label, value }) => (
  <div className="rounded-xl border border-[#e5e5e5] bg-white p-4">
    <p className="text-sm text-[#737373]">{label}</p>
    <p className="mt-2 text-2xl font-semibold tracking-tight text-[#171717]">{value}</p>
  </div>
);

FleetMetric.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

export default Fleet;
