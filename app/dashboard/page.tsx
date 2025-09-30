"use client";

import Notes from "@/components/Notes/Notes";

export default function Dashboard() {
  return (
    <div className="p-6 flex flex-col lg:flex-row gap-2">
      <div className="bg-white w-full lg:w-2/3 p-6 rounded-lg">
        <p className="text-black text-3xl lg:text-5xl font-bold">Notas</p>
        {/*  <p className='text-gray-600 font-bold'>
          Aún no tienes ningún hábito activo
        </p>
        <p className='text-gray-600 mb-4'>¿Quieres crear uno nuevo?</p> */}
      </div>
      <div className="bg-[#a677bf] w-full lg:w-1/3 p-6 rounded-lg">
        <Notes />
      </div>
    </div>
  );
}
