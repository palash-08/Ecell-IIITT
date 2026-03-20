import React from "react";
import Image from "next/image";

const EventCards = () => {
  return (
    <div className="w-[90vw] sm:w-[40vw] lg:w-[30vw] h-auto bg-amber-100 text-black p-5 rounded-xl shadow-md flex flex-col gap-4 transition hover:scale-[1.02] hover:shadow-lg duration-300">
      {/* Image Placeholder - replace src with actual path */}
      <div className="relative w-full h-48 rounded-md overflow-hidden bg-white">
        <Image
          src=""
          alt="Event"
          layout="fill"
          objectFit="cover"
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between text-sm text-gray-700 font-semibold">
          <p>
            <span className="font-bold">Faculty Incharge:</span> Dr. J. Kokila
          </p>
          <p>
            <span className="font-bold">Date:</span> 11 Aug, 2024
          </p>
        </div>

        <h3 className="text-xl font-bold">Innovation Challenge</h3>

        <ul className="list-disc list-inside text-sm text-gray-800">
          <li>Pitch your ideas to investors.</li>
          <li>Collaborate with mentors & peers.</li>
          <li>Win exciting cash prizes.</li>
          <li>Get featured on our platform.</li>
          <li>Certificate of participation.</li>
        </ul>
      </div>
    </div>
  );
};

export default EventCards;
