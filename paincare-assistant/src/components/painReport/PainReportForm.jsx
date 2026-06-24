function PainReportForm({ reportData, onChange, onSubmit, loading, error }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block font-medium mb-1">
          Pain Level: {reportData.painLevel}/10
        </label>
        <input
          type="range"
          name="painLevel"
          min="0"
          max="10"
          value={reportData.painLevel}
          onChange={onChange}
          className="w-full"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Pain Location</label>
        <input
          name="location"
          value={reportData.location}
          onChange={onChange}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Example: Lower back"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Pain Type</label>
        <select
          name="painType"
          value={reportData.painType}
          onChange={onChange}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">Select pain type</option>
          <option value="Burning">Burning</option>
          <option value="Pressing">Pressing</option>
          <option value="Stabbing">Stabbing</option>
          <option value="Sharp">Sharp</option>
          <option value="Dull">Dull</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Duration</label>
        <input
          name="duration"
          value={reportData.duration}
          onChange={onChange}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Example: 45 minutes"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Medication Taken</label>
        <select
          name="medicationTaken"
          value={reportData.medicationTaken}
          onChange={onChange}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Additional Notes</label>
        <textarea
          name="notes"
          value={reportData.notes}
          onChange={onChange}
          className="w-full border rounded-lg px-3 py-2"
          rows="3"
          placeholder="Describe anything important about today's pain"
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm font-medium">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Saving..." : "Submit Pain Report"}
      </button>
    </form>
  );
}

export default PainReportForm;
