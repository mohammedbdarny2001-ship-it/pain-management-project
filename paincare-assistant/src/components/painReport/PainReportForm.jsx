function PainReportForm({ reportData, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm mb-1">
          Pain intensity: {reportData.painLevel}/10
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Pain location</label>
          <select
            name="location"
            value={reportData.location}
            onChange={onChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option>Back</option>
            <option>Head</option>
            <option>Neck</option>
            <option>Leg</option>
            <option>Arm</option>
            <option>Chest</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Pain type</label>
          <select
            name="painType"
            value={reportData.painType}
            onChange={onChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option>Burning</option>
            <option>Pressing</option>
            <option>Stabbing</option>
            <option>Numbness</option>
            <option>Electric shock</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Duration</label>
          <input
            name="duration"
            value={reportData.duration}
            onChange={onChange}
            placeholder="Example: 45 minutes"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Medication taken?</label>
          <select
            name="medicationTaken"
            value={reportData.medicationTaken}
            onChange={onChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Notes</label>
        <textarea
          name="notes"
          value={reportData.notes}
          onChange={onChange}
          placeholder="Write short notes about today's pain..."
          className="w-full border rounded-lg px-3 py-2 min-h-24"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
      >
        Submit Pain Report
      </button>
    </form>
  );
}

export default PainReportForm;