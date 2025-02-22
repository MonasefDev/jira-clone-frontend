import React, { useCallback, useEffect, useState } from "react";

import { TaskStatus } from "../types";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import KanbanColumnHeader from "./KanbanColumnHeader";
import { KanbanCard } from "./KanbanCard";

const boards = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

export const DataKanban = ({ data, onChange }) => {
  const [tasks, setTasks] = useState(() => {
    const initialTasks = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };
    data.forEach((task) => {
      initialTasks[task.status].push(task);
    });

    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status].sort((a, b) => {
        return a.position - b.position;
      });
    });
    return initialTasks;
  });

  useEffect(() => {
    const newTasks = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };
    data.forEach((task) => {
      newTasks[task.status].push(task);
    });

    Object.keys(newTasks).forEach((status) => {
      newTasks[status].sort((a, b) => {
        return a.position - b.position;
      });
    });

    setTasks(newTasks);
  }, [data]);

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;

      const { source, destination } = result;
      const sourceStatus = source.droppableId;
      const destinationStatus = destination.droppableId;

      // Check if the task is dropped in the same position
      if (
        sourceStatus === destinationStatus &&
        source.index === destination.index
      ) {
        return;
      }

      let updatesPayload = [];

      setTasks((prevTask) => {
        const newTask = { ...prevTask };

        // safely remove task from the source column
        const sourceColumn = [...newTask[sourceStatus]];
        const [movedTask] = sourceColumn.splice(source.index, 1);

        // If there's no moved task (shouldn't happen, but just in case) return the previous state
        if (!movedTask) {
          console.error("No moved task found at the source index");
          return prevTask;
        }

        // create a new task Object with potentially updated status and position
        const updatedMovedTask =
          sourceStatus !== destinationStatus
            ? { ...movedTask, status: destinationStatus }
            : movedTask;

        // update the source column
        newTask[sourceStatus] = sourceColumn;

        // add the updated task to the destination column
        const destColumn = [...newTask[destinationStatus]];
        destColumn.splice(destination.index, 0, updatedMovedTask);
        newTask[destinationStatus] = destColumn;

        // prepare minimal payloads
        updatesPayload = [];

        // Always update the moved task
        updatesPayload.push({
          id: movedTask.id,
          status: destinationStatus,
          position: Math.min((destination.index + 1) * 1_000, 1_000_000),
        });

        // update positions for affected tasks in the destination column
        newTask[destinationStatus].forEach((task, index) => {
          if (task && task.id !== updatedMovedTask.id) {
            const newPosition = Math.min((index + 1) * 1_000, 1_000_000);
            if (task.position !== newPosition) {
              updatesPayload.push({
                id: task.id,
                status: destinationStatus,
                position: newPosition,
              });
            }
          }
        });

        // if the task moved between columns, update its position in the source column
        if (sourceStatus !== destinationStatus) {
          newTask[sourceStatus].forEach((task, index) => {
            if (task) {
              const newPosition = Math.min((index + 1) * 1_000, 1_000_000);
              if (task.position !== newPosition) {
                updatesPayload.push({
                  id: task.id,
                  status: sourceStatus,
                  position: newPosition,
                });
              }
            }
          });
        }
        return newTask;
      });

      onChange(updatesPayload);
    },
    [onChange]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => {
          return (
            <div
              key={board}
              className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]"
            >
              <KanbanColumnHeader
                board={board}
                taskCount={tasks[board].length}
              />
              <Droppable droppableId={board}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px] py-1.5"
                  >
                    {tasks[board].map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <KanbanCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default DataKanban;
