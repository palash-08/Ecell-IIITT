import { FaEye, FaRocket } from "react-icons/fa";

const VisionMission = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 max-w-7xl mx-auto px-6 mb-24">
      {/* Vision */}
      <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="w-20 h-20 bg-[#FFB800] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <FaEye className="text-black text-3xl" />
        </div>
        <h3 className="text-2xl font-bold text-black mb-4 tracking-tight">Our Vision</h3>
        <p className="text-gray-600 leading-relaxed font-medium">
          To be the leading entrepreneurship hub that transforms innovative ideas into impactful
          solutions, creating successful entrepreneurs who contribute to society and the economy.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="w-20 h-20 bg-[#FFB800] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <FaRocket className="text-black text-3xl" />
        </div>
        <h3 className="text-2xl font-bold text-black mb-4 tracking-tight">Our Mission</h3>
        <p className="text-gray-600 leading-relaxed font-medium">
          To nurture entrepreneurial mindset, provide mentorship and resources, facilitate
          networking opportunities, and create a supportive ecosystem for startups and innovation
          at IIIT Trichy.
        </p>
      </div>
    </div>
  );
};

export default VisionMission;
