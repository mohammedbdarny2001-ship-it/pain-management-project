import { useState } from "react";
import {
  addDoctorNote,
  getDoctorNotesByPatient,
} from "../../services/doctorNotesService";

function DoctorNotesPanel({ doctor, patients }) {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handlePatientChange(event) {
    const username = event.target.value;

    setSelectedPatient(username);
    setNoteText("");
    setMessage("");
    setError("");
    setNotes([]);

    if (!username) {
      return;
    }

    setLoadingNotes(true);

    const result = await getDoctorNotesByPatient(username);

    setLoadingNotes(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setNotes(result.notes);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedPatient || !noteText.trim()) {
      setError("Please select a patient and write a note");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    const result = await addDoctorNote({
      patientUsername: selectedPatient,
      doctorUsername: doctor.username,
      note: noteText,
    });

    setSaving(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setMessage("Doctor note saved successfully");
    setNoteText("");
    setNotes((previousNotes) => [result.note, ...previousNotes]);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mt-6">
      <h3 className="text-xl font-bold text-gray-800 mb-2">Doctor Notes</h3>

      <p className="text-gray-600 mb-4">
        Add clinical notes for a selected patient. Notes are saved in MongoDB.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Select Patient</label>
          <select
            value={selectedPatient}
            onChange={handlePatientChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Choose patient</option>
            {patients.map((patient) => (
              <option key={patient.username} value={patient.username}>
                {patient.name} ({patient.username})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Doctor Note</label>
          <textarea
            value={noteText}
            onChange={(event) => setNoteText(event.target.value)}
            rows="4"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Write a clinical note for this patient"
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm font-medium">{error}</p>
        )}

        {message && (
          <p className="text-green-700 text-sm font-medium bg-green-50 border border-green-200 rounded-lg p-2">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Doctor Note"}
        </button>
      </form>

      {selectedPatient && (
        <div className="mt-6">
          <h4 className="font-bold text-gray-700 mb-3">
            Previous Notes for Selected Patient
          </h4>

          {loadingNotes && <p className="text-gray-600">Loading notes...</p>}

          {!loadingNotes && notes.length === 0 && (
            <p className="text-gray-500">No notes for this patient yet.</p>
          )}

          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note._id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-3"
              >
                <p className="text-gray-800">{note.note}</p>
                <p className="text-xs text-gray-500 mt-2">
                  By {note.doctorUsername} |{" "}
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorNotesPanel;