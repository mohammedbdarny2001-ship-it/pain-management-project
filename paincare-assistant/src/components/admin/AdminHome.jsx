import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import {
  assignDoctorToPatient,
  createUserByAdmin,
  deleteUserByAdmin,
  getUsersByRole,
} from "../../services/adminService";

function AdminHome() {
  const { currentUser, logout } = useUser();
  const { darkMode, toggleDarkMode } = useTheme();

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctorForm, setDoctorForm] = useState({
    username: "",
    password: "",
    name: "",
    age: "",
    physician: "",
  });
  const [patientForm, setPatientForm] = useState({
    username: "",
    password: "",
    name: "",
    age: "",
    diagnosis: "",
    doctorUsername: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadData() {
    setLoading(true);
    setError("");

    const doctorsResult = await getUsersByRole("doctor");
    const patientsResult = await getUsersByRole("patient");

    setLoading(false);

    if (!doctorsResult.success) {
      setError(doctorsResult.message);
      return;
    }

    if (!patientsResult.success) {
      setError(patientsResult.message);
      return;
    }

    setDoctors(doctorsResult.users);
    setPatients(patientsResult.users);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleDoctorChange(event) {
    const { name, value } = event.target;

    setDoctorForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  function handlePatientChange(event) {
    const { name, value } = event.target;

    setPatientForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  async function handleCreateDoctor(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    const result = await createUserByAdmin(currentUser.username, {
      username: doctorForm.username,
      password: doctorForm.password,
      role: "doctor",
      name: doctorForm.name,
      age: doctorForm.age ? Number(doctorForm.age) : "",
      physician: doctorForm.physician,
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    setMessage(result.message);
    setDoctorForm({
      username: "",
      password: "",
      name: "",
      age: "",
      physician: "",
    });
    loadData();
  }

  async function handleCreatePatient(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    const selectedDoctor = doctors.find((doctor) => {
      return doctor.username === patientForm.doctorUsername;
    });

    const result = await createUserByAdmin(currentUser.username, {
      username: patientForm.username,
      password: patientForm.password,
      role: "patient",
      name: patientForm.name,
      age: patientForm.age ? Number(patientForm.age) : "",
      diagnosis: patientForm.diagnosis,
      physician: selectedDoctor ? selectedDoctor.name : "",
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    setMessage(result.message);
    setPatientForm({
      username: "",
      password: "",
      name: "",
      age: "",
      diagnosis: "",
      doctorUsername: "",
    });
    loadData();
  }

  async function handleDeleteUser(username) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${username}?`
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    const result = await deleteUserByAdmin(currentUser.username, username);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setMessage(result.message);
    loadData();
  }

  async function handleAssignDoctor(patientUsername, doctorUsername) {
    if (!doctorUsername) {
      return;
    }

    setMessage("");
    setError("");

    const result = await assignDoctorToPatient(
      currentUser.username,
      patientUsername,
      doctorUsername
    );

    if (!result.success) {
      setError(result.message);
      return;
    }

    setMessage(result.message);
    loadData();
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow p-5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage doctors, patients, and patient-doctor assignment.
            </p>
          </div>

          <div className="flex gap-3">
            <button
               onClick={toggleDarkMode}
               className="bg-slate-800 text-white px-5 py-2 rounded-lg font-semibold hover:bg-slate-700"
            >
            {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

            <button
               onClick={logout}
               className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-700"
            >
               Logout
            </button>
          </div>


        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoCard title="Doctors" value={doctors.length} />
          <InfoCard title="Patients" value={patients.length} />
          <InfoCard title="Admin" value={currentUser.name} />
        </section>

        {loading && (
          <p className="text-gray-600 bg-white rounded-xl p-4">
            Loading admin data...
          </p>
        )}

        {error && (
          <p className="text-red-600 bg-red-50 border border-red-200 rounded-xl p-4 font-medium">
            {error}
          </p>
        )}

        {message && (
          <p className="text-green-700 bg-green-50 border border-green-200 rounded-xl p-4 font-medium">
            {message}
          </p>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form
            onSubmit={handleCreateDoctor}
            className="bg-white border border-gray-200 rounded-xl p-5 space-y-4"
          >
            <h2 className="text-2xl font-bold text-blue-700">
              Add Doctor
            </h2>

            <AdminInput
              label="Username"
              name="username"
              value={doctorForm.username}
              onChange={handleDoctorChange}
            />

            <AdminInput
              label="Password"
              name="password"
              type="password"
              value={doctorForm.password}
              onChange={handleDoctorChange}
            />

            <AdminInput
              label="Full Name"
              name="name"
              value={doctorForm.name}
              onChange={handleDoctorChange}
            />

            <AdminInput
              label="Age"
              name="age"
              type="number"
              value={doctorForm.age}
              onChange={handleDoctorChange}
            />

            <AdminInput
              label="Specialty / Clinic"
              name="physician"
              value={doctorForm.physician}
              onChange={handleDoctorChange}
              placeholder="Example: Pain clinic specialist"
            />

            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700">
              Add Doctor
            </button>
          </form>

          <form
            onSubmit={handleCreatePatient}
            className="bg-white border border-gray-200 rounded-xl p-5 space-y-4"
          >
            <h2 className="text-2xl font-bold text-blue-700">
              Add Patient
            </h2>

            <AdminInput
              label="Username"
              name="username"
              value={patientForm.username}
              onChange={handlePatientChange}
            />

            <AdminInput
              label="Password"
              name="password"
              type="password"
              value={patientForm.password}
              onChange={handlePatientChange}
            />

            <AdminInput
              label="Full Name"
              name="name"
              value={patientForm.name}
              onChange={handlePatientChange}
            />

            <AdminInput
              label="Age"
              name="age"
              type="number"
              value={patientForm.age}
              onChange={handlePatientChange}
            />

            <AdminInput
              label="Diagnosis"
              name="diagnosis"
              value={patientForm.diagnosis}
              onChange={handlePatientChange}
            />

            <div>
              <label className="block font-medium mb-1">
                Assigned Doctor
              </label>
              <select
                name="doctorUsername"
                value={patientForm.doctorUsername}
                onChange={handlePatientChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">No doctor selected</option>
                {doctors.map((doctor) => (
                  <option key={doctor.username} value={doctor.username}>
                    {doctor.name} ({doctor.username})
                  </option>
                ))}
              </select>
            </div>

            <button className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700">
              Add Patient
            </button>
          </form>
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            Doctors
          </h2>

          <div className="space-y-3">
            {doctors.map((doctor) => (
              <div
                key={doctor.username}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-slate-50 border border-slate-200 rounded-lg p-4"
              >
                <div>
                  <p className="font-bold">{doctor.name}</p>
                  <p className="text-sm text-gray-600">
                    Username: {doctor.username}
                  </p>
                  <p className="text-sm text-gray-600">
                    Specialty / Clinic: {doctor.physician || "Not specified"}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteUser(doctor.username)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700"
                >
                  Delete Doctor
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            Patients
          </h2>

          <div className="space-y-3">
            {patients.map((patient) => (
              <div
                key={patient.username}
                className="bg-slate-50 border border-slate-200 rounded-lg p-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <p className="font-bold">{patient.name}</p>
                    <p className="text-sm text-gray-600">
                      Username: {patient.username}
                    </p>
                    <p className="text-sm text-gray-600">
                      Diagnosis: {patient.diagnosis || "Not specified"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Assigned doctor: {patient.physician || "Not assigned"}
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3">
                    <select
                      defaultValue=""
                      onChange={(event) =>
                        handleAssignDoctor(
                          patient.username,
                          event.target.value
                        )
                      }
                      className="border rounded-lg px-3 py-2"
                    >
                      <option value="">Change doctor</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.username} value={doctor.username}>
                          {doctor.name} ({doctor.username})
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleDeleteUser(patient.username)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700"
                    >
                      Delete Patient
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-sm text-gray-600 font-medium">{title}</p>
      <p className="text-3xl font-bold text-blue-700">{value}</p>
    </div>
  );
}

function AdminInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
}) {
  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2"
      />
    </div>
  );
}

export default AdminHome;