import { useState } from "react";
import { loginUser } from "../../services/authService";

function Login({ onLogin, onShowRegister }) {
  const [username, setUsername] = useState("patient1");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const result = await loginUser(username, password);

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    onLogin(result.user);
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-2">
          PainCare Assistant
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Login as Patient or Doctor
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Username</label>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full border rounded-lg px-3 py-2"
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          type="button"
          onClick={onShowRegister}
          className="w-full mt-4 text-blue-700 font-medium hover:underline"
        >
          New patient? Register here
        </button>

        <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <p className="font-semibold mb-1">Demo users:</p>
          <p>
            <strong>Patient:</strong> patient1 / 1234
          </p>
          <p>
            <strong>Doctor:</strong> doctor1 / 1234
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;