import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { updateUserProfile } from "../../services/authService";

function PersonalProfilePage({ onBack }) {
  const { currentUser, updateCurrentUser, logout } = useUser();

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    age: currentUser?.age || "",
    diagnosis: currentUser?.diagnosis || "",
    physician: currentUser?.physician || "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSaving(true);

    const result = await updateUserProfile(currentUser.username, {
      name: formData.name,
      age: formData.age,
      diagnosis: formData.diagnosis,
      physician: formData.physician,
      password: formData.password || undefined,
    });

    setSaving(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    updateCurrentUser(result.user);

    setFormData((previousData) => ({
      ...previousData,
      password: "",
      confirmPassword: "",
    }));

    setMessage("Personal details updated successfully");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow p-5 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-blue-700">
            Personal Area
          </h1>

          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200"
            >
              Back
            </button>

            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-700 mb-2">
              Update Personal Details
            </h2>

            <p className="text-gray-600">
              You can update your personal information here. Username and role
              cannot be changed.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
            <p>
              <strong>Username:</strong> {currentUser.username}
            </p>
            <p>
              <strong>Role:</strong> {currentUser.role}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Age</label>
              <input
                name="age"
                type="number"
                min="1"
                max="120"
                value={formData.age}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {currentUser.role === "patient" && (
              <>
                <div>
                  <label className="block font-medium mb-1">Diagnosis</label>
                  <input
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">
                    Physician
                  </label>
                  <input
                    name="physician"
                    value={formData.physician}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </>
            )}

            {currentUser.role === "doctor" && (
              <div>
                <label className="block font-medium mb-1">
                  Clinic / Specialty
                </label>
                <input
                  name="physician"
                  value={formData.physician}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Example: Pain clinic specialist"
                />
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="font-bold text-gray-800 mb-2">
                Change Password
              </h3>

              <p className="text-sm text-gray-500 mb-3">
                Leave empty if you do not want to change your password.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">
                    New Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">
                    Confirm Password
                  </label>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
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
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default PersonalProfilePage;