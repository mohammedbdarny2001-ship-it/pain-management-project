import { useReducer } from "react";
import {
  savePainReport,
  isHighPainLevel,
  getSelfRecommendation,
} from "../../services/painReportService";
import { useUser } from "../../context/UserContext";
import EmergencyAlert from "./EmergencyAlert";
import PainReportForm from "./PainReportForm";
import SubmittedPainReport from "./SubmittedPainReport";

const initialState = {
  formData: {
    painLevel: 5,
    location: "",
    painType: "",
    duration: "",
    medicationTaken: "No",
    notes: "",
  },
  loading: false,
  error: "",
  submittedReport: null,
  recommendation: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "CHANGE_FIELD":
      return {
        ...state,
        formData: { ...state.formData, [action.name]: action.value },
      };
    case "SUBMIT_START":
      return { ...state, loading: true, error: "" };
    case "SUBMIT_SUCCESS":
      return {
        ...state,
        loading: false,
        error: "",
        submittedReport: action.report,
        recommendation: action.recommendation,
        formData: {
          painLevel: 5,
          location: "",
          painType: "",
          duration: "",
          medicationTaken: "No",
          notes: "",
        },
      };
    case "SUBMIT_ERROR":
      return { ...state, loading: false, error: action.message };
    default:
      return state;
  }
}

function DailyPainReport() {
  const { currentUser: user } = useUser();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { formData, loading, error, submittedReport, recommendation } = state;

  function handleChange(event) {
    const { name, value } = event.target;
    dispatch({ type: "CHANGE_FIELD", name, value });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.location || !formData.painType || !formData.duration) {
      dispatch({ type: "SUBMIT_ERROR", message: "Please fill in pain location, type and duration" });
      return;
    }

    dispatch({ type: "SUBMIT_START" });

    const reportData = {
      patientUsername: user.username,
      painLevel: Number(formData.painLevel),
      location: formData.location,
      painType: formData.painType,
      duration: formData.duration,
      medicationTaken: formData.medicationTaken,
      notes: formData.notes,
    };

    const result = await savePainReport(reportData);

    if (!result.success) {
      dispatch({ type: "SUBMIT_ERROR", message: result.message });
      return;
    }

    dispatch({
      type: "SUBMIT_SUCCESS",
      report: result.report,
      recommendation: getSelfRecommendation(result.report),
    });
  }

  return (
    <section id="pain-report-section" className="bg-white rounded-2xl shadow p-6 scroll-mt-32">
      <h2 className="text-2xl font-bold text-blue-700 mb-2">
        Daily Pain Report
      </h2>

      <p className="text-gray-600 mb-6">
        Record your daily pain level and symptoms. The report will be saved for
        medical staff review.
      </p>

      {isHighPainLevel(formData.painLevel) && <EmergencyAlert />}

      <PainReportForm
        reportData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />

      <SubmittedPainReport report={submittedReport} />

      {recommendation && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
          <p className="font-bold">{recommendation.title}</p>
          <p>{recommendation.message}</p>
        </div>
      )}
    </section>
  );
}

export default DailyPainReport;
