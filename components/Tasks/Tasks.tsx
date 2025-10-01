import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Task, useTaskStore } from "@/stores/useStore";
import { supabase } from "@/lib/supabaseClient";
import React, { useState, useCallback } from "react";
import { useTasks } from "@/hooks/useTasks";
import { Button, Checkbox, useDisclosure } from "@heroui/react";
import { MdDelete } from "react-icons/md";
import { addToast } from "@heroui/toast";
import { ReusableModal } from "../ReusableModal ";

const Tasks = () => {
  const [task, setTask] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { profile } = useProfile();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);

  const { tasks, loading: loadingFetch } = useTasks();

  const {
    addTaskLocally,
    updateTaskLocally,
    deleteTaskLocally,
    toggleTaskCompletion,
    deleteTask,
  } = useTaskStore();

  /*   ------------ CREATE ------------ */

  const createTask = useCallback(async () => {
    if (!task.trim()) {
      addToast({
        title: "Error al crear tarea",
        description: "La tar no puede estar vacía.",
        color: "danger",
      });
      setError("La tarea no puede estar vacía.");
      return;
    }
    if (!user || !profile) {
      addToast({
        title: "Error",
        description: "Debes iniciar sesión para crear tareas.",
        color: "danger",
      });
      setError("Usuario o perfil no disponible.");
      return;
    }

    setError(null);
    setSuccess("");
    setLoading(true);

    try {
      const { data, error: todoError } = await supabase
        .from("todos")
        .insert({
          task: task.trim(),
          is_complete: false,
          user_id: user.id,
        })
        .select()
        .single();

      if (todoError) {
        addToast({
          title: "Error de servidor",
          description: `No se pudo crear la tarea: ${todoError.message}`,
          color: "danger",
        });
        setError(`Error creando tarea: ${todoError.message}`);
        return;
      }

      addToast({
        title: "¡Tarea creada!",
        description: "Tu nueva tarea ha sido guardada.",
        color: "success",
      });

      addTaskLocally(data as Task);

      setTask("");
      setSuccess("Tarea creada exitosamente");
    } catch (err) {
      console.error(err);
      addToast({
        title: "Error inesperado",
        description: "Ocurrió un problema desconocido.",
        color: "danger",
      });
      setError("Error inesperado al crear la tarea.");
    } finally {
      setLoading(false);
    }
  }, [task, user, profile, addTaskLocally]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      createTask();
    }
  };

  /*   ------------ DELETE ------------ */

  const openDeleteModal = (taskId: string) => {
    setTaskToDeleteId(taskId);
    onOpen();
  };

  const confirmDelete = () => {
    if (taskToDeleteId) {
      deleteTask(taskToDeleteId);
      deleteTaskLocally(taskToDeleteId);
      setTaskToDeleteId(null);
      addToast({
        title: "Tarea eliminada",
        description: "La tarea ha sido eliminada.",
        color: "success",
      });
    }
  };

  /*   ------------ CHECKBOX ------------ */

  const handleToggle = (taskId: string, currentStatus: boolean) => {
    toggleTaskCompletion(taskId, currentStatus);
  };

  return (
    <div className="mx-auto">
      <p className="text-white text-3xl lg:text-5xl font-bold mb-6">Tareas</p>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe una nueva tarea y presiona Enter..."
        disabled={loading}
        className="w-full p-3 rounded-lg focus:outline-none text-sm lg:text-md"
      />

      <ul className="space-y-3">
        {tasks.map((todo) => (
          <li
            key={todo.id}
            className={`flex items-center justify-between p-3 border rounded-lg transition duration-200 ${
              todo.is_complete
                ? "bg-green-50 border-green-200"
                : "bg-white border-gray-200"
            }`}
          >
            <Checkbox
              className="h-[58px]"
              isSelected={todo.is_complete === true}
              onChange={() => handleToggle(todo.id, todo.is_complete)}
            >
              <span className="text-black">{todo.task}</span>
            </Checkbox>

            {todo.is_complete === true ? (
              <Button
                isIconOnly
                color="danger"
                size="sm"
                variant="flat"
                onPress={() => openDeleteModal(todo.id)}
                title="Eliminar tarea"
              >
                <MdDelete size={20} />
              </Button>
            ) : null}
            <ReusableModal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              title="Confirmar Eliminación"
              confirmText="Borrar"
              confirmAction={confirmDelete}
              confirmColor="danger"
            >
              <p>
                ¿Estás seguro de que quieres eliminar esta tarea? Esta acción no
                se puede deshacer.
              </p>
            </ReusableModal>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
