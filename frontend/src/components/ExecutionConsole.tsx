import React from "react";

interface ExecutionConsoleProps {
  currentAgent: string;
  completedAgents: string[];
  logs: string[];
  thinkingLogs: string[];
}

const agents = [
  "Research",
  "Architecture",
  "Coding",
  "Testing",
  "Documentation",
];

const ExecutionConsole: React.FC<ExecutionConsoleProps> = ({
  currentAgent,
  completedAgents,
  logs,
  thinkingLogs,
}) => {
  return (
    <div className="w-85 h-screen overflow-y-auto bg-slate-900 border-l border-slate-700 p-6 shadow-lg sticky top-0 right-0 custom-scrollbar">
      
      <h2 className="text-2xl font-bold mb-6 text-white">
        🤖 AI Execution Console
      </h2>

      {/* Agent Status */}
      <div className="space-y-3">
        {agents.map((agent) => {
          const isCompleted = completedAgents.includes(agent);
          const running = currentAgent === agent;

          return (
            <div
              key={agent}
              className="bg-slate-800 rounded-lg px-4 py-4 border border-slate-700/50"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-white">
                  {agent} Agent
                </span>

                {isCompleted ? (
                  <span className="text-green-400 font-bold animate-bounce">
                    ✅ Completed
                  </span>
                ) : running ? (
                  <span className="text-blue-400 font-bold animate-pulse">
                    🔄 Running...
                  </span>
                ) : (
                  <span className="text-slate-500">
                    ⏳ Waiting
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${
                    isCompleted
                      ? "bg-green-500"
                      : running
                      ? "bg-blue-500"
                      : "bg-slate-600"
                  }`}
                  style={{
                    width: isCompleted
                      ? "100%"
                      : running
                      ? "60%"
                      : "0%",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Thinking Panel */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-3 text-white">
          🧠 AI Thinking
        </h3>

        <div className="bg-black rounded-lg p-4 h-44 overflow-auto font-mono text-sm border border-slate-800 terminal-scroll">
          <div className="min-w-max">
            {thinkingLogs.length === 0 ? (
              <p className="text-slate-500">
                Waiting for AI...
              </p>
            ) : (
              thinkingLogs.map((step, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-cyan-400 mb-2 whitespace-nowrap"
                >
                  <span>▶</span>
                  <span>{step}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Live Logs Panel */}
      <div className="mt-8 mb-6">
        <h3 className="text-lg font-bold mb-3 text-white">
          📜 Live Logs
        </h3>

        <div className="bg-black rounded-lg p-4 h-60 overflow-auto font-mono text-sm border border-slate-800 terminal-scroll">
          <div className="min-w-max">
            {logs.length === 0 ? (
              <p className="text-slate-500">
                Waiting for workflow...
              </p>
            ) : (
              logs.map((log, index) => (
                <p
                  key={index}
                  className="text-green-400 mb-2 whitespace-nowrap"
                >
                  {log}
                </p>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .terminal-scroll::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .terminal-scroll::-webkit-scrollbar-track {
          background: #000000;
        }
        .terminal-scroll::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 3px;
        }
        .terminal-scroll::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0f172a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default ExecutionConsole;