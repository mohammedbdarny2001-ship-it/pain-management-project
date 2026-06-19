import { useState } from "react";
import { registerPatient } from "../../services/authService";

function Register({ onRegister, onShowLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    age: "",
    diagnosis: "",
    physician: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !formData.name ||
      !formData.username ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    const result = await registerPatient(formData);

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    onRegister(result.user);
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-2">
          PainCare Assistant
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Patient Registration
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Full Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Example: Miriam Cohen"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Username *</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Choose username"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="45"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Diagnosis</label>
            <input
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Chronic pain"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Physician</label>
            <input
              name="physician"
              value={formData.physician}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Dr. David Levi"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <button
          type="button"
          onClick={onShowLogin}
          className="w-full mt-4 text-blue-700 font-medium hover:underline"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

export default Register;