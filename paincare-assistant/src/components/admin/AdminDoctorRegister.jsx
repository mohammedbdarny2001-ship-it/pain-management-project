import { useState } from "react";
import { registerDoctor } from "../../services/authService";

function AdminDoctorRegister() {
  const [doctor, setDoctor] = useState({
    username: "",
    password: "",
    name: "",
    specialization: "",
    phone: "",
    email: "",
  });

  function handleChange(e) {
    setDoctor({
      ...doctor,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const result = await registerDoctor(doctor);

    if (!result.success) {
      alert(result.message);
      return;
    }

    alert("Doctor registered successfully!");

    setDoctor({
      username: "",
      password: "",
      name: "",
      specialization: "",
      phone: "",
      email: "",
    });
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Admin - Register Doctor
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Doctor Name"
            value={doctor.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={doctor.username}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={doctor.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <input
            type="text"
            name="specialization"
            placeholder="Specialization"
            value={doctor.specialization}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={doctor.phone}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={doctor.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            Register Doctor
          </button>

        </form>
      </div>
    </div>
  );
}

export default AdminDoctorRegister;