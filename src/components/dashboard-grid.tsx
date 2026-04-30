"use client";

import { Task } from "@/types";
import ProgressChart from "./progress-chart";
import TaskList from "./task-list";
import { useState } from "react";
import Counter from "./counter";
import { sortTasks } from "@/lib/tasks";

export default function DashboardGrid({
  tasks,
  accessToken,
}: {
  tasks: Task[];
  accessToken: string;
}) {
  const [taskList, setTaskList] = useState(() => sortTasks(tasks));
  const totalCount = taskList.length;
  const completedCount = taskList.filter((task) => task.completed).length;

  const percentCompleted =
    totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

  const percentFormatted = Number(
    percentCompleted % 1 === 0
      ? percentCompleted.toFixed(0)
      : percentCompleted.toFixed(1)
  );

  return (
    <div className="grid xl:grid-cols-3 grid-cols-1 gap-5">
      <div
        className={`sm:p-5 p-3 bg-zinc-200 border border-zinc-400 rounded-xl sm:col-span-2 h-max`}>
        <TaskList
          tasks={taskList}
          setTasks={setTaskList}
          accessToken={accessToken}
        />
      </div>

      <div className="sm:p-5 p-3 bg-zinc-200 border border-zinc-400 rounded-xl relative xl:h-[280px]">
        <h4 className="text-xl font-semibold tracking-tighter">
          Wykonane zadania
        </h4>
        <h3 className="text-6xl font-bold mt-2">
          <Counter value={percentFormatted} suffix="%" />
        </h3>

        <ProgressChart
          completion={percentCompleted}
          bars={10}
          baseHeight={30}
          animationDuration={0.5}
          className="xl:absolute bottom-5"
        />
      </div>
    </div>
  );
}
