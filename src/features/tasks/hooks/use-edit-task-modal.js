import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";

export const useEditTaskModal = () => {
  const [taskId, setTaskId] = useQueryState("edit-task", parseAsString);

  const open = (id) => setTaskId(id);
  const close = () => setTaskId(null);

  return {
    taskId,
    open,
    close,
    setTaskId,
  };
};
