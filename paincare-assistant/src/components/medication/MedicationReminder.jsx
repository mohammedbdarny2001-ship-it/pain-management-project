import { useEffect, useState } from "react";
import {
  addMedicationReminder,
  getMedicationReminders,
  markMedicationAsTaken,
  deleteMedicationReminder,
} from "../../services/medicationService";
import MedicationReminderCard from "./MedicationReminderCard";
import { useUser } from "../../context/UserContext";

function MedicationReminder() {
  const { currentUser: user } = useUser();
  const [formData, setFormData] = useState({
    medicationName: "",
    dose: "",
    time: "",
    notes: "",
  });

  const [medications, setMedications] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadMedications() {
    setLoading(true);
    setError("");

    const result = await getMedicationReminders(user.username);

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      setMedications([]);
      return;
    }

    setMedications(result.medications);
  }

  useEffect(() => {
    loadMedications();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.medicationName || !formData.dose || !formData.time) {
      setError("Please fill in medication name, dose and time");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    const result = await addMedicationReminder({
      patientUsername: user.username,
      medicationName: formData.medicationName,
      dose: formData.dose,
      time: formData.time,
      notes: formData.notes,
    });

    setSaving(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setMessage("Medication reminder saved successfully");
    setMedications((previousMedications) => [
      ...previousMedications,
      result.medication,
    ]);

    setFormData({
      medicationName: "",
      dose: "",
      time: "",
      notes: "",
    });
  }

  async function handleMarkTaken(id) {
    const result = await markMedicationAsTaken(id);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setMedications((previousMedications) =>
      previousMedications.map((medication) =>
        medication._id === id ? result.medication : medication
      )
    );
  }

  async function handleDelete(id) {
    const result = await deleteMedicationReminder(id);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setMedications((previousMedications) =>
      previousMedications.filter((medication) => medication._id !== id)
    );
  }

  return (
    <section id="medication-section" className="bg-white rounded-2xl shadow p-6 scroll-mt-32">
      <h2 className="text-2xl font-bold text-blue-700 mb-2">
        Medication Reminder
      </h2>

      <p className="text-gray-600 mb-6">
        Add medication reminders and track whether medication was taken.
      </p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <input
          name="medicationName"
          value={formData.medicationName}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
          placeholder="Medication name"
        />

        <input
          name="dose"
          value={formData.dose}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
          placeholder="Dose, e.g. 500mg"
        />

        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
        />

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Add Reminder"}
        </button>

        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="md:col-span-4 border rounded-lg px-3 py-2"
          rows="2"
          placeholder="Optional notes"
        />
      </form>

      {error && (
        <p className="text-red-600 text-sm font-medium mb-3">{error}</p>
      )}

      {message && (
        <p className="text-green-700 text-sm font-medium bg-green-50 border border-green-200 rounded-lg p-2 mb-3">
          {message}
        </p>
      )}

      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-800">Your Medication Reminders</h3>

        <button
          onClick={loadMedications}
          className="text-blue-700 font-medium hover:underline"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading medications...</p>}

      {!loading && medications.length === 0 && (
        <p className="text-gray-500 bg-gray-50 border rounded-lg p-4">
          No medication reminders yet.
        </p>
      )}

      <div className="space-y-3">
        {medications.map((medication) => (
          <MedicationReminderCard
            key={medication._id}
            medication={medication}
            onMarkTaken={handleMarkTaken}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </section>
  );
}

export default MedicationReminder;