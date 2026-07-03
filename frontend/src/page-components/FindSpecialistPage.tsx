"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Search,
  MapPin,
  Stethoscope,
  Phone,
  Calendar,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getDoctorsApi } from "@/apis/apis";
import { toast } from "sonner";
import { Doctor } from "@/types/type";

// Dynamically import DoctorMap (client-only, no SSR)
const DoctorMap = dynamic(() => import("../components/ui/DoctorMap"), { ssr: false });

const FindSpecialistPage = () => {
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [specialtyQuery, setSpecialtyQuery] = useState<string>("");
  const [locationQuery, setLocationQuery] = useState<string>("");
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(allDoctors);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getDoctorsApi();
        if (response.status < 200 || response.status >= 300) {
          toast.error('Error in fetching doctors');
          return;
        }
        const data = response.data.doctors;
        console.log(data);
        setAllDoctors(data);
        setFilteredDoctors(data);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
        toast.error('Error in fetching doctors');
      }
    };
    fetchDoctors();
  }, []);

  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      const results = allDoctors.filter((doctor) => {
        const specialtyMatch = specialtyQuery
          ? doctor.specialty.toLowerCase().includes(specialtyQuery.toLowerCase())
          : true;
        const locationMatch = locationQuery
          ? doctor.address.toLowerCase().includes(locationQuery.toLowerCase())
          : true;
        return specialtyMatch && locationMatch;
      });
      setFilteredDoctors(results);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased mt-10">
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Search */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-12">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={specialtyQuery}
                  onChange={(e) => setSpecialtyQuery(e.target.value)}
                  placeholder="Specialty (e.g., Cardiologist)"
                  className="w-full py-3 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Location (e.g., Wellness City)"
                  className="w-full py-3 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <button
                onClick={handleSearch}
                className="w-full bg-emerald-600 py-3 text-white font-semibold rounded-lg cursor-pointer hover:bg-emerald-700 flex items-center justify-center"
              >
                <Search className="mr-2" />
                Search
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Doctor List */}
            <div>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                </div>
              ) : filteredDoctors.length > 0 ? (
                <div className="space-y-6">
                  {filteredDoctors.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                  ))}
                </div>
              ) : (
                <div className="text-center bg-white p-10 rounded-2xl shadow-lg">
                  <h3 className="text-2xl font-bold text-slate-800">No Specialists Found</h3>
                  <p className="text-slate-600 mt-2">Try adjusting your search criteria.</p>
                </div>
              )}
            </div>

            {/* Map View */}
            <div className="hidden lg:block bg-slate-200 rounded-2xl shadow-lg sticky top-18 h-[600px] overflow-hidden">
              <DoctorMap doctors={filteredDoctors} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const DoctorCard = ({ doctor }: { doctor: Doctor }) => {
  const router = useRouter();

  // Same logic as your ProfileCard
  const profileUrl = doctor.profileUrl || "/images/user-default.png";
  const [imgSrc, setImgSrc] = useState<string>(profileUrl);

  const openAppointmentPage = () => {
    router.push("/appointment");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex items-start space-x-6 hover:shadow-xl transition">
      <img
        src={imgSrc}
        alt={`Dr. ${doctor.name}`}
        className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100"
        onError={() => setImgSrc("/images/user-default.png")} // fallback (same as ProfileCard)
      />

      <div className="flex-1">
        <h3 className="text-2xl font-bold text-slate-900">{doctor.name}</h3>
        <p className="text-emerald-600 font-semibold">{doctor.specialty}</p>

        <div className="mt-3 text-slate-600 space-y-2">
          <p className="flex items-center">
            <MapPin size={16} className="mr-2" /> {doctor.address}
          </p>
          <p className="flex items-center">
            <Phone size={16} className="mr-2" /> {doctor.phone}
          </p>
        </div>

        <button
          onClick={openAppointmentPage}
          className="mt-4 inline-flex items-center px-6 py-2 bg-emerald-100 text-emerald-800 cursor-pointer rounded-full hover:bg-emerald-200"
        >
          <Calendar size={16} className="mr-2" /> Book Appointment
        </button>
      </div>
    </div>
  );
};


export default FindSpecialistPage;