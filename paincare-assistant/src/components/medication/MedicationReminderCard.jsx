function MedicationReminderCard({ medication, onMarkTaken, onDelete }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h4 className="font-bold text-gray-800">
          {medication.medicationName}
        </h4>

        <p className="text-gray-600">
          Dose: {medication.dose} | Time: {medication.time}
        </p>

        {medication.notes && (
          <p className="text-sm text-gray-500 mt-1">
            Notes: {medication.notes}
          </p>
        )}

        <p className="text-sm mt-2">
          Status:{" "}
          <span
            className={
              medication.taken
                ? "text-green-700 font-semibold"
                : "text-orange-700 font-semibold"
            }
          >
            {medication.taken ? "Taken" : "Pending"}
          </span>
        </p>
      </div>

      <div className="flex gap-2">
        {!medication.taken && (
          <button
            onClick={() => onMarkTaken(medication._id)}
            className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700"
          >
            Mark Taken
          </button>
        )}

        <button
          onClick={() => onDelete(medication._id)}
          className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default MedicationReminderCard;