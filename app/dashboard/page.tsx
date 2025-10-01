"use client";

import NotesList from "@/components/Notes/NotesList";
import Tasks from "@/components/Tasks/Tasks";

export default function Dashboard() {
  return (
    <div className="p-6 flex flex-col lg:flex-row gap-2">
      <div className="bg-white w-full lg:w-2/3 p-6 rounded-lg">
        <p className="text-black text-3xl lg:text-5xl font-bold">Notas</p>
        <NotesList />
      </div>
      <div className="bg-[#a677bf] w-full lg:w-1/3 p-6 rounded-lg">
        <Tasks />
      </div>
    </div>
  );
}
