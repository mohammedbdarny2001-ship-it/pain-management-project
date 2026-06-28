import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { getDoctorNotesByPatient } from "../../services/doctorNotesService";

function PatientDoctorNotes() {
  const { currentUser } = useUser();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDoctorNotes() {
      if (!currentUser?.username) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      const result = await getDoctorNotesByPatient(currentUser.username);

      setLoading(false);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setNotes(result.notes);
    }

    loadDoctorNotes();
  }, [currentUser]);

  return (
    <section
      id="doctor-notes-section"
      className="scroll-mt-32 bg-white border border-gray-200 rounded-xl p-5"
    >
      <h3 className="text-2xl font-bold text-blue-700 mb-2">
        Notes from Your Doctor
      </h3>

      <p className="text-gray-600 mb-4">
        Clinical notes written by your doctor will appear here.
      </p>

      {loading && <p className="text-gray-600">Loading doctor notes...</p>}

      {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

      {!loading && !error && notes.length === 0 && (
        <p className="text-gray-500">No doctor notes are available yet.</p>
      )}

      {!loading && !error && notes.length > 0 && (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note._id}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4"
            >
              <p className="text-gray-800 leading-relaxed">{note.note}</p>

              <p className="text-xs text-gray-500 mt-2">
                Doctor: {note.doctorUsername} |{" "}
                {new Date(note.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default PatientDoctorNotes;