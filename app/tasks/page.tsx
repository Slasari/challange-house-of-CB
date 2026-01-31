"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { logout } from "../actions/auth";
import decoderToken from "../actions/decoderToken";

type User = {
  userId: string;
  email: string;
};

type Task = {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
};

export default function TasksPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  
  useEffect(() => {
      const userData = async () => {
        const {email, userId} = await decoderToken() as {email: string; userId: string}
    
        setUser({userId, email})

        setLoading(false);
      }
      userData()
    const fetchTasks = async (userId: string) => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching tasks:", error.message);
      } else {
        setTasks(data ?? []);
      }
    };
    /* const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/login");
      } else {
        const currentUser = {
          id: data.session.user.id,
          email: data.session.user.email || "Usuario",
        };
        setUser(currentUser);
        fetchTasks(currentUser.id);
      }

      setLoading(false);
    };

    fetchUser(); */
  }, [router]);

  const addTask = async () => {
    if (!newTask.trim() || !user) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert([{ title: newTask, user_id: user.userId }])
      .select();

    if (error) {
      console.error("Error adding task:", error.message);
    } else {
      setTasks((prev) => [data![0], ...prev]);
      setNewTask("");
    }
  };

  const toggleTask = async (task: Task) => {
    const { data, error } = await supabase
      .from("tasks")
      .update({ completed: !task.completed })
      .eq("id", task.id)
      .select();

    if (error) {
      console.error("Error updating task:", error.message);
    } else {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? data![0] : t)));
    }
  };

  const updateTaskTitle = async (taskId: string) => {
    if (!editingTitle.trim()) return;

    const { data, error } = await supabase
      .from("tasks")
      .update({ title: editingTitle })
      .eq("id", taskId)
      .select();

    if (error) {
      console.error("Error updating task:", error.message);
    } else {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? data![0] : t)));
      setEditingTaskId(null);
      setEditingTitle("");
    }
  };

  const deleteTask = async (task: Task) => {
    const { error } = await supabase.from("tasks").delete().eq("id", task.id);

    if (error) {
      console.error("Error deleting task:", error.message);
    } else {
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    }
  };

  if (loading) return <p>Cargando...</p>;

  if (!user) return null;

  return (
    <main className="p-2 flex justify-center flex-col gap-4 items-center">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 min-w-[320px] w-2xl text-slate-900 relative">
        <p>
          <span className="text-xl font-semibold ">¡Bienvenido!</span>{" "}
          {user.email}
        </p>
        <button
          onClick={logout}
          className="absolute top-1.5 right-4 bg-red-500 p-2 rounded text-white font-semibold cursor-pointer"
        >
          Cerrar sesión
        </button>
        <div style={{ margin: "1rem 0" }}>
          <div className="flex justify-between items-center">
            <label
              htmlFor="newtask"
              className="text-sm font-semibold text-slate-700"
            >
              Nueva tarea
            </label>
          </div>
          <input
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm transition-all duration-200 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/10 group-hover:border-slate-300"
            id="newtask"
            type="text"
            placeholder="Hacer..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button
            onClick={addTask}
            className="w-full cursor-pointer bg-blue-800 hover:bg-blue-900 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-blue-600/20 mt-2"
          >
            Agregar
          </button>
        </div>
      </div>
      <h1 className="font-semibold text-3xl">Mis tareas</h1>
      <ul className="w-[80%] min-w-81.25 p-[2.5px] flex flex-col justify-center gap-5 items-center">
        {tasks.map((task) => (
          <li key={task.id} className="bg-white w-[320px] rounded p-2 text-slate-900 items-center flex">
            <div className="w-full">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task)}
            />

            {editingTaskId === task.id ? (
              <input
                className="font-semibold"
                type="text"
                value={editingTitle}
                autoFocus
                onChange={(e) => setEditingTitle(e.target.value)}
                onBlur={() => updateTaskTitle(task.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") updateTaskTitle(task.id);
                  if (e.key === "Escape") {
                    setEditingTaskId(null);
                    setEditingTitle("");
                  }
                }}
                style={{ marginLeft: "0.5rem" }}
              />
            ) : (
              <span
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                  marginLeft: "0.5rem",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
                onClick={() => {
                  setEditingTaskId(task.id);
                  setEditingTitle(task.title);
                }}
              >
                {task.title}
              </span>
            )}

           
            </div>
            <div className="">
               <button
              onClick={() => deleteTask(task)}
              className="cursor-pointer text-red-800"
            >
              Eliminar
            </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
