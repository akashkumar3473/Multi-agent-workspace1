type Props = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

function Sidebar({
  activeTab,
  setActiveTab,
}: Props) {
  return (
    <div className="w-64 h-screen overflow-y-auto bg-slate-900 border-r border-slate-700 p-5 sticky top-0 left-0 sidebar-scroll">

      <h1 className="text-2xl font-bold mb-10 text-white tracking-tight">
        CodeForge AI
      </h1>

      <div className="space-y-3">
        <button
          className={`w-full p-3 rounded text-left font-medium transition-colors duration-200 ${
            activeTab === "projects"
              ? "bg-blue-600 text-white"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
          }`}
          onClick={() => setActiveTab("projects")}
        >
          Projects
        </button>

        <button
          className={`w-full p-3 rounded text-left font-medium transition-colors duration-200 ${
            activeTab === "outputs"
              ? "bg-blue-600 text-white"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
          }`}
          onClick={() => setActiveTab("outputs")}
        >
          Agent Outputs
        </button>

        <button
          className={`w-full p-3 rounded text-left font-medium transition-colors duration-200 ${
            activeTab === "analytics"
              ? "bg-blue-600 text-white"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
          }`}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>
      </div>

      <style>{`
        .sidebar-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: #0f172a;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}

export default Sidebar;