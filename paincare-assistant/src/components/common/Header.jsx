function Header({ role, onOpenPersonalArea }) {
  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  if (role === "doctor") {
    return (
      <header className="bg-white shadow p-5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-blue-700 mb-5">
            PainCare Assistant
          </h1>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => scrollToSection("doctor-dashboard-section")}
              className="bg-green-100 text-green-700 px-8 py-4 rounded-xl text-xl font-bold hover:bg-green-200"
            >
              Doctor Dashboard
            </button>

            <button
              onClick={() => scrollToSection("pain-alerts-section")}
              className="bg-red-100 text-red-700 px-8 py-4 rounded-xl text-xl font-bold hover:bg-red-200"
            >
              Pain Alerts
            </button>

            <button
              onClick={() => scrollToSection("patients-section")}
              className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl text-xl font-bold hover:bg-gray-200"
            >
              Patients
            </button>

            <button
              onClick={() => scrollToSection("clinical-summary-section")}
              className="bg-purple-100 text-purple-700 px-8 py-4 rounded-xl text-xl font-bold hover:bg-purple-200"
            >
              Clinical Summary
            </button>

            <button
              onClick={() => scrollToSection("doctor-notes-section")}
              className="bg-blue-100 text-blue-700 px-8 py-4 rounded-xl text-xl font-bold hover:bg-blue-200"
            >
              Doctor Notes
            </button>

            <button
               onClick={onOpenPersonalArea}
               className="bg-yellow-100 text-yellow-700 px-8 py-4 rounded-xl text-xl font-bold hover:bg-yellow-200"
            >
               Personal Area
            </button>

            
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow p-5 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-5">
          PainCare Assistant
        </h1>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => scrollToSection("pain-report-section")}
            className="bg-blue-100 text-blue-700 px-8 py-4 rounded-xl text-xl font-bold hover:bg-blue-200"
          >
            Pain Report
          </button>

          <button
            onClick={() => scrollToSection("medication-section")}
            className="bg-green-100 text-green-700 px-8 py-4 rounded-xl text-xl font-bold hover:bg-green-200"
          >
            Medication
          </button>

          <button
            onClick={() => scrollToSection("doctor-notes-section")}
            className="bg-orange-100 text-orange-700 px-8 py-4 rounded-xl text-xl font-bold hover:bg-orange-200"
          >
            Doctor Notes
          </button>

          <button
            onClick={() => scrollToSection("chatbot-section")}
            className="bg-purple-100 text-purple-700 px-8 py-4 rounded-xl text-xl font-bold hover:bg-purple-200"
          >
            Chatbot
          </button>

          <button
            onClick={() => scrollToSection("trends-section")}
            className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl text-xl font-bold hover:bg-gray-200"
          >
            Trends
          </button>

          <button
             onClick={onOpenPersonalArea}
             className="bg-yellow-100 text-yellow-700 px-8 py-4 rounded-xl text-xl font-bold hover:bg-yellow-200"
           >
             Personal Area
           </button>

        </div>
      </div>
    </header>
  );
}

export default Header;