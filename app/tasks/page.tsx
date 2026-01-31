"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../actions/auth";
import { addTaskAction, deleteTaskAction, getTasksAction, toggleTaskAction, updateTaskAction } from "../actions/tasks";
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

      async function fetchTasks() {
        try{
            const tasksData = await getTasksAction();
            setTasks(tasksData);
        } catch (err){
            console.log("Error al obtener tareas", err)
        } finally {
            setLoading(false)
        }

    }
    fetchTasks();
  }, [router]);

  const addTask = async () => {
    if (!newTask.trim() || !user) return;

    const { data, error } = await addTaskAction(newTask)
    if (error) {
      console.error("Error adding task:", error);
    } else {
      setTasks((prev) => [data![0], ...prev]);
      setNewTask("");
    }
  };

  const toggleTask = async (task: Task) => {

    const res = await toggleTaskAction({taskId: task.id, completed: !task.completed})

    if (res.error) {
      console.error("Error updating task:", res.error);
    } else {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? res.data![0] : t)));
    }
  };

  const updateTaskTitle = async (taskId: string) => {
    if (!editingTitle.trim()) return;
    const res = await updateTaskAction({taskId, title: editingTitle})
    if (res.error) {
      console.error("Error updating task:", res.error);
    } else {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data![0] : t)));
      setEditingTaskId(null);
      setEditingTitle("");
    }
  };

  const deleteTask = async (task: Task) => {

    const error = await deleteTaskAction(task.id)
    if (error) {
      console.error("Error deleting task:", error);
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
