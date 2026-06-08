"use client";

import { use, useState } from "react";
import { ClubOwnerShell } from "../../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../../components/club-owner-page";
import {
  addPlannerTask,
  getPlannerRoom,
  listMembersWithRoles,
  updatePlannerTask,
  type PlannerTaskStatus,
} from "@/lib/club-operations-store";
import { getHostClubId } from "@/lib/club-host-store";

export default function ClubOwnerPlannerRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const clubId = getHostClubId();
  const [room, setRoom] = useState(() => getPlannerRoom(roomId));
  const members = listMembersWithRoles(clubId);
  const [taskTitle, setTaskTitle] = useState("");

  function refresh() {
    setRoom(getPlannerRoom(roomId));
  }

  if (!room) {
    return (
      <ClubOwnerShell title="Planner" backHref="/club-owner/planner">
        <p className="co-hint">Planner room not found.</p>
      </ClubOwnerShell>
    );
  }

  return (
    <ClubOwnerShell title="Planner room" backHref="/club-owner/planner">
      <ClubOwnerPageTitle title={room.name} sub={room.eventLabel ?? "Event task board"} />
      <div className="co-stack">
        {room.tasks.map((task) => (
          <div key={task.id} className="co-task-row" style={{ gridTemplateColumns: "1fr", gap: "0.35rem" }}>
            <strong>{task.title}</strong>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <select
                className="co-input"
                value={task.status}
                onChange={(e) => {
                  updatePlannerTask(roomId, task.id, { status: e.target.value as PlannerTaskStatus });
                  refresh();
                }}
              >
                <option value="todo">To do</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
                <option value="blocked">Blocked</option>
              </select>
              <input
                className="co-input"
                type="date"
                value={task.dueDate?.slice(0, 10) ?? ""}
                onChange={(e) => {
                  updatePlannerTask(roomId, task.id, { dueDate: e.target.value });
                  refresh();
                }}
              />
              <select
                className="co-input"
                value={task.assigneeMemberId ?? ""}
                onChange={(e) => {
                  const m = members.find((x) => x.id === e.target.value);
                  updatePlannerTask(roomId, task.id, {
                    assigneeMemberId: e.target.value || undefined,
                    assigneeName: m?.name,
                  });
                  refresh();
                }}
              >
                <option value="">Assignee</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            {task.notes ? <p className="co-hint">{task.notes}</p> : null}
          </div>
        ))}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!taskTitle.trim()) return;
            addPlannerTask(roomId, { title: taskTitle.trim(), status: "todo" });
            setTaskTitle("");
            refresh();
          }}
          className="co-form"
        >
          <input className="co-input" placeholder="New task — e.g. Book venue" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
          <button type="submit" className="co-btn co-btn--primary">
            Add task
          </button>
        </form>
      </div>
    </ClubOwnerShell>
  );
}
