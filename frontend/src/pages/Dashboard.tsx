import NotificationCenter from "../components/NotificationCenter";
import ExecutionConsole from "../components/ExecutionConsole";
import {
  FaSignOutAlt,
  FaTrash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedOutputs, setSelectedOutputs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("projects");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [projectOutputs, setProjectOutputs] = useState<any[]>([]);
  const [thinkingLogs, setThinkingLogs] = useState<string[]>([]);

  const [currentAgent, setCurrentAgent] = useState("Research");
  const [completedAgents, setCompletedAgents] = useState<string[]>([]);

  const [executionLogs, setExecutionLogs] = useState<string[]>([]);

  const [question, setQuestion] = useState("");

  const [chatHistory, setChatHistory] = useState<any[]>([]);

  const [loadingAssistant, setLoadingAssistant] = useState(false);

  interface Notification {
    id: number;
    message: string;
    type: "success" | "info" | "warning" | "error";
    time: string;
  }

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: "Welcome to CodeForge AI",
      type: "info",
      time: new Date().toLocaleTimeString(),
    },
  ]);

  const addNotification = (
    message: string,
    type: "success" | "info" | "warning" | "error"
  ) => {
    setNotifications((prev) => [
      {
        id: Date.now(),
        message,
        type,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
  };

  const totalProjects = projects.length;

  const completedProjects = projects.filter(
    (p) => p.status === "Completed"
  ).length;

  const runningProjects = projects.filter(
    (p) => p.status === "Running"
  ).length;

  const pendingProjects = projects.filter(
    (p) => p.status === "Pending"
  ).length;

  const recentActivities = [
    " Research Agent completed analysis",
    " Architecture Agent generated design",
    " Coding Agent generated code plan",
    " New Project Created",
    " Documentation Agent generated report",
  ];

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        "/projects/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjects(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const askAssistant = async (projectId: number) => {
    if (!question.trim()) return;

    setLoadingAssistant(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/assistant/${projectId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();

      setChatHistory((prev) => [
        ...prev,
        {
          question: question,
          answer: data.answer,
        },
      ]);

      setQuestion("");
    } catch (error) {
      console.error(error);

      setChatHistory((prev) => [
        ...prev,
        {
          question: question,
          answer: "❌ Something went wrong while contacting the AI Assistant.",
        },
      ]);
    } finally {
      setLoadingAssistant(false);
    }
  };

  const createProject = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/projects/create",
        {
          title,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Project Created Successfully");

      console.log(response.data);

      setTitle("");
      setDescription("");

      fetchProjects();
    } catch (error) {
      console.error(error);
      alert("Project Creation Failed");
    }
  };

  const deleteProject = async (projectId: number) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/projects/delete/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      addNotification("Project Deleted Successfully", "success");
      fetchProjects();
    } catch (error) {
      console.error(error);
      alert("Failed to delete project");
      addNotification("Project Deletion Failed", "error");
    }
  };

  const getProgress = (step: string) => {
    switch (step) {
      case "Research":
        return 20;

      case "Architecture":
        return 40;

      case "Coding":
        return 60;

      case "Testing":
        return 80;

      case "Documentation":
        return 90;

      case "Completed":
        return 100;

      default:
        return 0;
    }
  };

  const getStepStatus = (
    currentStep: string,
    stepName: string
  ) => {
    const steps = [
      "Research",
      "Architecture",
      "Coding",
      "Testing",
      "Documentation",
      "Completed",
    ];

    const currentIndex =
      steps.indexOf(currentStep);

    const stepIndex =
      steps.indexOf(stepName);

    if (currentStep === "Pending")
      return "pending";

    if (stepIndex < currentIndex)
      return "completed";

    if (stepIndex === currentIndex)
      return "running";

    return "pending";
  };

  const startWorkflowStream = (projectId: number) => {
    setExecutionLogs([]);
    setCompletedAgents([]);
    setCurrentAgent("");
    setThinkingLogs([]);

    const eventSource = new EventSource(
      `http://127.0.0.1:8000/stream/${projectId}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.agent && data.status === "running") {
        setCurrentAgent(data.agent);

        setExecutionLogs(prev => [
          ...prev,
          `${new Date().toLocaleTimeString()} • ${data.agent} • Running`
        ]);

        if (data.agent === "Research") {
          playThinking([
            "📄 Reading project requirements...",
            "🔎 Searching similar solutions...",
            "📚 Collecting best practices...",
            "📝 Preparing research report..."
          ]);
        }

        if (data.agent === "Architecture") {
          playThinking([
            "🏗 Designing system architecture...",
            "🧩 Selecting components...",
            "🔗 Defining API structure...",
            "📐 Creating architecture plan..."
          ]);
        }

        if (data.agent === "Coding") {
          playThinking([
            "💻 Generating source code...",
            "⚡ Optimizing implementation...",
            "🧪 Checking syntax...",
            "📦 Preparing final code..."
          ]);
        }

        if (data.agent === "Testing") {
          playThinking([
            "🧪 Running unit tests...",
            "🔍 Checking edge cases...",
            "🐞 Detecting bugs...",
            "✅ Validating outputs..."
          ]);
        }

        if (data.agent === "Documentation") {
          playThinking([
            "📄 Generating documentation...",
            "📝 Writing README...",
            "📚 Preparing API guide...",
            "✅ Finalizing documentation..."
          ]);
        }
      }

      if (data.agent && data.status === "completed") {
        setCompletedAgents(prev =>
          prev.includes(data.agent)
            ? prev
            : [...prev, data.agent]
        );

        setExecutionLogs(prev => [
          ...prev,
          `${new Date().toLocaleTimeString()} • ${data.agent} • Completed`
        ]);
      }

      if (data.workflow === "completed") {
        setCurrentAgent("");
        setThinkingLogs([]);

        setExecutionLogs(prev => [
          ...prev,
          "🎉 Workflow Completed Successfully"
        ]);

        fetchProjects();
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };
  };

  const playThinking = (steps: string[]) => {
    setThinkingLogs([]);

    steps.forEach((step, index) => {
      setTimeout(() => {
        setThinkingLogs(prev => [
          ...prev,
          step,
        ]);
      }, index * 1200);
    });
  };

  const runWorkflow = async (projectId: number) => {
    addNotification(
      "Workflow Started",
      "info"
    );

    try {
      startWorkflowStream(projectId);

      const token = localStorage.getItem("token");

      await api.post(
        `/workflow/${projectId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch(error){
      console.error(error);
      addNotification(
        "Workflow Failed",
        "error"
      );
    }
  };

  const viewOutputs = async (projectId: number) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        `/outputs/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      setSelectedOutputs(response.data);
      setActiveTab("outputs");
    } catch (error) {
      console.error(error);
      alert("Failed to load outputs");
    }
  };

  const openProjectDetails = async (project: any) => {
    setSelectedProject(project);
    await fetchProjectOutputs(project.id);
    setShowModal(true);
  };

  const fetchProjectOutputs = async (projectId: number) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        `/outputs/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjectOutputs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProjects();

    const interval = setInterval(() => {
      fetchProjects();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white">
      {/* Sidebar layout wrapper */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Independently scrollable main center slot */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              CodeForge AI
            </h1>
            <p className="text-slate-400 text-lg mt-2">
              Multi-Agent AI Software Development Workspace
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/workspace")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
            >
              🤖 AI Workspace
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">
                AI Development Workspace
              </h2>
              <p className="text-slate-400 mt-2">
                Build software with autonomous AI agents
              </p>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold text-blue-400">
                {totalProjects}
              </div>
              <div className="text-slate-400">
                Total Projects
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4 mt-6">
            <div className="bg-slate-800 p-3 rounded-lg text-center">
              🔍
              <p className="mt-2 text-sm">Research</p>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg text-center">
              🏗
              <p className="mt-2 text-sm">Architecture</p>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg text-center">
              💻
              <p className="mt-2 text-sm">Coding</p>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg text-center">
              🧪
              <p className="mt-2 text-sm">Testing</p>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg text-center">
              📄
              <p className="mt-2 text-sm">Documentation</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            🔄 AI Workflow Pipeline
          </h2>

          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="bg-green-600 p-4 rounded-full">🔍</div>
              <p className="mt-2">Research</p>
            </div>
            <span>➡️</span>
            <div className="text-center">
              <div className="bg-green-600 p-4 rounded-full">🏗</div>
              <p className="mt-2">Architecture</p>
            </div>
            <span>➡️</span>
            <div className="text-center">
              <div className="bg-green-600 p-4 rounded-full">💻</div>
              <p className="mt-2">Coding</p>
            </div>
            <span>➡️</span>
            <div className="text-center">
              <div className="bg-green-600 p-4 rounded-full">🧪</div>
              <p className="mt-2">Testing</p>
            </div>
            <span>➡️</span>
            <div className="text-center">
              <div className="bg-green-600 p-4 rounded-full">📄</div>
              <p className="mt-2">Documentation</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <div className="bg-green-600 px-4 py-2 rounded-lg">
            ✅ {completedProjects} Completed
          </div>
          <div className="bg-blue-600 px-4 py-2 rounded-lg">
            🔄 {runningProjects} Running
          </div>
          <div className="bg-orange-600 px-4 py-2 rounded-lg">
            ⏳ {pendingProjects} Pending
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            📈 Recent Activity
          </h2>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg"
              >
                <span>⚡</span>
                <span>{activity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">
            Create New Project
          </h2>

          <input
            type="text"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white mb-4"
          />

          <textarea
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-32 p-3 rounded-lg bg-slate-800 border border-slate-700 text-white mb-4"
          />

          <button
            onClick={createProject}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-semibold"
          >
            🚀 Create Project
          </button>
        </div>

        <hr />

        {activeTab === "projects" && (
          <>
            <h2 className="text-2xl font-bold mb-4 mt-6">Your Projects</h2>

            {projects.length === 0 ? (
              <p>No Projects Found</p>
            ) : (
              projects.map((project: any) => (
                <div
                  key={project.id}
                  className="bg-slate-900 border border-slate-700 rounded-xl p-5 mb-4 shadow-lg"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xl font-bold">
                        {project.title}
                      </h3>
                      <p className="text-slate-400">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`px-4 py-2 rounded-full text-white font-semibold ${
                          project.status === "Completed"
                            ? "bg-green-500"
                            : project.status === "Running"
                            ? "bg-blue-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {project.status}
                      </div>
                      
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="p-2 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white rounded-lg transition-colors border border-red-500/30"
                        title="Delete Project"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>

                  <p>
                    <strong>Current Step:</strong> {project.workflow_step}
                  </p>

                  <div className="w-full bg-slate-700 rounded-full h-3 mt-3 overflow-hidden">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-1000"
                      style={{
                        width: `${getProgress(project.workflow_step)}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-sm text-slate-400 mt-2 mb-4">
                    <span>Progress</span>
                    <span>{getProgress(project.workflow_step)}%</span>
                  </div>

                  <div className="mt-4 bg-slate-800 p-4 rounded-lg mb-4">
                    <h4 className="font-bold mb-3">
                      Workflow Timeline
                    </h4>

                    {[
                      "Research",
                      "Architecture",
                      "Coding",
                      "Testing",
                      "Documentation",
                    ].map((step) => {
                      const status = getStepStatus(
                        project.workflow_step,
                        step
                      );

                      return (
                        <div
                          key={step}
                          className="flex items-center gap-3 mb-2"
                        >
                          <span>
                            {status === "completed"
                              ? "✅"
                              : status === "running"
                              ? "🔄"
                              : "⏳"}
                          </span>
                          <span>{step}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-3">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                      onClick={() => runWorkflow(project.id)}
                    >
                      Run AI Workflow
                    </button>

                    <button
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                      onClick={() => viewOutputs(project.id)}
                    >
                      View Outputs
                    </button>
                    <button
                      onClick={() => openProjectDetails(project)}
                      className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))
            )}
            <hr />
          </>
        )}

        {activeTab === "outputs" && (
          <>
            <h2>🤖 Agent Outputs</h2>

            {selectedOutputs.length === 0 ? (
              <p>No Outputs Selected</p>
            ) : (
              selectedOutputs.map((output: any) => (
                <div key={output.id}>
                  <h3>{output.agent_name}</h3>
                  <pre>{output.output}</pre>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === "analytics" && (
          <>
            <AnalyticsDashboard />
            <div className="mt-6">
              <NotificationCenter
                notifications={notifications}
              />
            </div>
          </>
        )}
      </div>

      <ExecutionConsole
        currentAgent={currentAgent}
        completedAgents={completedAgents}
        logs={executionLogs}
        thinkingLogs={thinkingLogs}
      />

      {showModal && selectedProject && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-[800px] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-bold">Project Details</h2>
              <div className="flex gap-2">
                <a
                  href={`http://127.0.0.1:8000/report/${selectedProject.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition"
                >
                  📄 Download Report
                </a>

                <a
                  href={`http://127.0.0.1:8000/export/${selectedProject.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition"
                >
                  📦 Download ZIP
                </a>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition"
                >
                  Close
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold">
              {selectedProject.title}
            </h3>

            <p className="text-slate-400 mt-2">
              {selectedProject.description}
            </p>

            <div className="mt-4">
              <strong>Status:</strong> {selectedProject.status}
            </div>

            <div className="mt-2">
              <strong>Current Step:</strong> {selectedProject.workflow_step}
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4">Agent Outputs</h3>

              <div className="mt-8 border-t border-slate-700 pt-6">
                <h3 className="text-2xl font-bold mb-4">
                  🤖 AI Project Assistant
                </h3>

                <textarea
                  rows={4}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask anything about this project..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-purple-500"
                />

                <button
                  onClick={() => askAssistant(selectedProject.id)}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg text-white transition"
                >
                  Ask AI
                </button>

                {loadingAssistant && (
                  <p className="mt-4 text-blue-400">Thinking...</p>
                )}

                <div className="mt-6 space-y-4">
                  {chatHistory.map((chat, index) => (
                    <div key={index} className="space-y-3">
                      <div className="bg-blue-900 p-3 rounded-lg">
                        <strong>👤 You</strong>
                        <p className="mt-2">{chat.question}</p>
                      </div>

                      <div className="bg-slate-800 p-3 rounded-lg">
                        <strong className="text-green-400">
                          🤖 CodeForge AI
                        </strong>
                        <pre className="whitespace-pre-wrap mt-2">
                          {chat.answer}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {projectOutputs.length === 0 ? (
                <p className="mt-4">No outputs found.</p>
              ) : (
                projectOutputs.map((output: any) => (
                  <div
                    key={output.id}
                    className="bg-slate-800 p-4 rounded-lg mb-4 mt-4"
                  >
                    <h4 className="font-bold text-blue-400 mb-2">
                      {output.agent_name}
                    </h4>
                    <pre className="whitespace-pre-wrap text-slate-300">
                      {output.output}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;