import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface Project {
  id: number;
  name?: string;
  title?: string;
}

const markdownComponents = {
  h1: ({ node, ...props }: any) => (
    <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />
  ),
  h2: ({ node, ...props }: any) => (
    <h2 className="text-xl font-bold mt-3 mb-2" {...props} />
  ),
  h3: ({ node, ...props }: any) => (
    <h3 className="text-lg font-bold mt-2 mb-1" {...props} />
  ),
  strong: ({ node, ...props }: any) => (
    <strong className="font-bold" {...props} />
  ),
  em: ({ node, ...props }: any) => <em className="italic" {...props} />,
  code: ({ node, inline, ...props }: any) =>
    inline ? (
      <code className="bg-slate-900 px-2 py-1 rounded text-blue-300" {...props} />
    ) : (
      <code className="block bg-slate-900 p-3 rounded my-2 overflow-x-auto text-green-300" {...props} />
    ),
  pre: ({ node, ...props }: any) => (
    <pre className="bg-slate-900 p-3 rounded my-2 overflow-x-auto" {...props} />
  ),
  ul: ({ node, ...props }: any) => (
    <ul className="list-disc list-inside my-2 space-y-1" {...props} />
  ),
  ol: ({ node, ...props }: any) => (
    <ol className="list-decimal list-inside my-2 space-y-1" {...props} />
  ),
  li: ({ node, ...props }: any) => <li className="ml-4" {...props} />,
  blockquote: ({ node, ...props }: any) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 my-2 italic" {...props} />
  ),
  a: ({ node, ...props }: any) => (
    <a className="text-blue-400 underline hover:text-blue-300" {...props} />
  ),
  p: ({ node, ...props }: any) => (
    <p className="my-2 leading-relaxed" {...props} />
  ),
};

const AIWorkspace = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "👋 Hello! I'm your CodeForge AI Assistant.\n\nHow can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatList, setChatList] = useState<any[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const chatListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChats();
    fetchProjects();
  }, []);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const target = event.target as HTMLElement | null;
      const isSlider = target?.closest('input[type="range"], [role="slider"], .slider-control');
      const isChatList = target?.closest('[data-chat-list]');

      if (isSlider) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (isChatList && chatListRef.current) {
        const { scrollHeight, clientHeight, scrollTop } = chatListRef.current;
        const isAtTop = scrollTop === 0 && event.deltaY < 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight && event.deltaY > 0;
        
        if (isAtTop || isAtBottom) {
          event.preventDefault();
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/projects/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load projects");
      }

      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedChat) return;

    const userInput = input;

    setMessages(prev => [
      ...prev,
      {
        role: "user",
        content: userInput,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/chat/send/${selectedChat}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userInput,
            project_id: selectedProject,
          }),
        }
      );

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);

      await fetchChats();
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const fetchChats = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/chat/all");
      const data = await response.json();
      setChatList(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadChat = async (chatId: number) => {
    setSelectedChat(chatId);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/chat/messages/${chatId}`
      );

      const data = await response.json();

      setMessages(
        data.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const deleteChat = async (chatId: number) => {
    const confirmed = window.confirm("Delete this conversation?");
    if (!confirmed) return;

    await fetch(`http://127.0.0.1:8000/chat/${chatId}`, {
      method: "DELETE",
    });

    await fetchChats();

    if (selectedChat === chatId) {
      setSelectedChat(null);
      setMessages([
        {
          role: "assistant",
          content: "👋 Conversation deleted.\n\nStart a new chat.",
        },
      ]);
    }
  };

  const createNewChat = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fixed endpoint route, HTTP method, and attached selected project ID parameters
      const response = await fetch("http://127.0.0.1:8000/chat/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          project_id: selectedProject,
        }),
      });

      const chat = await response.json();

      setSelectedChat(chat.id);
      await fetchChats();

      setMessages([
        {
          role: "assistant",
          content: "👋 New conversation started.\n\nHow can I help you today?",
        },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <div className="w-72 border-r border-slate-800 bg-slate-900 p-5 flex flex-col">
        <h1 className="text-2xl font-bold text-white mb-6">🤖 CodeForge AI</h1>

        {/* Integrated Updated Active Project Select Module */}
        <div className="mb-4">
          <label className="block text-sm text-slate-400 mb-2">
            Active Project
          </label>
          <select
            value={selectedProject ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedProject(val === "" ? null : Number(val));
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 transition"
          >
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title || project.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={createNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-3 text-white transition mb-6"
        >
          + New Chat
        </button>

        <div
          ref={chatListRef}
          data-chat-list
          className="flex-1 space-y-2 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800"
        >
          {chatList.map((chat) => (
            <div
              key={chat.id}
              className={`
                flex
                items-center
                justify-between
                rounded-lg
                p-3
                cursor-pointer
                ${
                  selectedChat === chat.id
                    ? "bg-blue-700"
                    : "bg-slate-800 hover:bg-slate-700"
                }
              `}
            >
              <div
                onClick={() => loadChat(chat.id)}
                className="flex-1 truncate text-slate-200"
              >
                💬 {chat.title}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.id);
                }}
                className="ml-3 text-red-400 hover:text-red-600 transition"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-3xl rounded-xl p-4 ${
                  msg.role === "user" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-100"
                }`}
              >
                {msg.role === "user" ? (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                ) : (
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown components={markdownComponents}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-slate-800 p-6">
          <div className="flex gap-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !loading) {
                  handleSend();
                }
              }}
              placeholder="Ask CodeForge AI..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 rounded-xl text-white transition"
            >
              {loading ? "Thinking..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIWorkspace;