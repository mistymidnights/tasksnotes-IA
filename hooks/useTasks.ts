import { useEffect } from "react";
import { useTaskStore, useUserStore } from "@/stores/useStore";

export function useTasks() {
  const userId = useUserStore((state) => state.profile?.id);
  const { tasks, loading, fetchTask } = useTaskStore();

  useEffect(() => {
    if (userId) {
      fetchTask(userId);
    } else {
      useTaskStore.getState().clearTask();
    }
  }, [userId, fetchTask]);

  return { tasks, loading };
}
