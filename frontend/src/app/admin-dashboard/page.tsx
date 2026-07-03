"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  adminGetStatsApi,
  adminGetAppointmentsApi,
  getDoctorsApi,
  adminCreateDoctorApi,
  adminUpdateDoctorApi
} from "@/apis/apis";
import {
  Users,
  UserPlus,
  Calendar,
  Plus,
  Edit,
  X,
  Save,
  Clock,
  LogOut
} from "lucide-react";

const SPECIALTIES = [
  'Consultant Physician (OPD)',
  'Cardiologist',
  'Dermatologist',
  'Neurologist',
  'Orthopedist',
  'Pediatrician',
  'Psychiatrist',
  'Gynecologist',
  'ENT Specialist',
  'Ophthalmologist',
  'General Medicine'
];

export default function AdminDashboard() {
  const { userSession, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0 });
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  const [showAddDoc, setShowAddDoc] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any | null>(null);

  // Doctor form state
  const [docForm, setDocForm] = useState({
    name: "",
    email: "",
    password: "",
    specialisation: "General Medicine",
    workingHoursStart: "09:00",
    workingHoursEnd: "17:00",
    slotDuration: 30,
    leaveDaysStr: "",
    phone: "",
    address: "",
    experience: "",
    profileUrl: "",
    qualifications: ""
  });

  useEffect(() => {
    if (userSession && userSession.role !== "Admin") {
      toast.error("Access denied");
      router.replace("/");
    }
  }, [userSession]);

  const loadData = async () => {
    try {
      const statsRes = await adminGetStatsApi();
      setStats(statsRes.data.stats);

      const doctorsRes = await getDoctorsApi();
      setDoctors(doctorsRes.data.doctors);

      const apptsRes = await adminGetAppointmentsApi();
      setAppointments(apptsRes.data.appointments);
    } catch (error: any) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminCreateDoctorApi({
        name: docForm.name,
        email: docForm.email,
        password: docForm.password,
        specialisation: docForm.specialisation,
        workingHours: {
          start: docForm.workingHoursStart,
          end: docForm.workingHoursEnd
        },
        slotDuration: Number(docForm.slotDuration),
        phone: docForm.phone,
        address: docForm.address,
        experience: docForm.experience,
        profileUrl: docForm.profileUrl,
        qualifications: docForm.qualifications
      });
      toast.success("Doctor profile created successfully!");
      setShowAddDoc(false);
      setDocForm({
        name: "",
        email: "",
        password: "",
        specialisation: "General Medicine",
        workingHoursStart: "09:00",
        workingHoursEnd: "17:00",
        slotDuration: 30,
        leaveDaysStr: "",
        phone: "",
        address: "",
        experience: "",
        profileUrl: "",
        qualifications: ""
      });
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create doctor profile");
    }
  };

  const handleUpdateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;
    try {
      const leaveDays = docForm.leaveDaysStr
        ? docForm.leaveDaysStr.split(",").map(s => s.trim()).filter(Boolean)
        : [];

      await adminUpdateDoctorApi(editingDoc.id, {
        name: docForm.name,
        email: docForm.email,
        specialisation: docForm.specialisation,
        workingHours: {
          start: docForm.workingHoursStart,
          end: docForm.workingHoursEnd
        },
        slotDuration: Number(docForm.slotDuration),
        leaveDays,
        phone: docForm.phone,
        address: docForm.address,
        experience: docForm.experience,
        profileUrl: docForm.profileUrl,
        qualifications: docForm.qualifications
      });
      toast.success("Doctor profile updated!");
      setEditingDoc(null);
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update doctor profile");
    }
  };

  const startEdit = (doc: any) => {
    setEditingDoc(doc);
    setDocForm({
      name: doc.name,
      email: doc.email,
      password: "", // don't set password on edit
      specialisation: doc.specialty || "General Medicine",
      workingHoursStart: doc.workingHours?.start || "09:00",
      workingHoursEnd: doc.workingHours?.end || "17:00",
      slotDuration: doc.slotDuration || 30,
      leaveDaysStr: (doc.leaveDays || []).map((d: any) => new Date(d).toISOString().split('T')[0]).join(", "),
      phone: doc.phone || "",
      address: doc.address || "",
      experience: doc.experience || "",
      profileUrl: doc.profileUrl || "",
      qualifications: doc.qualifications || ""
    });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50 pt-24 pb-12 font-sans antialiased text-slate-800">
        <main className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-slate-600">Manage doctor profiles and view overall hospital appointments.</p>
              </div>
              <button onClick={() => { logout(); router.replace('/login'); }} className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer transition">
                <LogOut size={18} /> Logout
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-emerald-500 flex items-center gap-4">
                <div className="p-3 bg-emerald-100 rounded-xl text-emerald-700">
                  <Users size={28} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase">Total Doctors</p>
                  <p className="text-3xl font-bold text-slate-800">{stats.doctors}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-emerald-500 flex items-center gap-4">
                <div className="p-3 bg-emerald-100 rounded-xl text-emerald-700">
                  <UserPlus size={28} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase">Total Patients</p>
                  <p className="text-3xl font-bold text-slate-800">{stats.patients}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-emerald-500 flex items-center gap-4">
                <div className="p-3 bg-emerald-100 rounded-xl text-emerald-700">
                  <Calendar size={28} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase">Total Bookings</p>
                  <p className="text-3xl font-bold text-slate-800">{stats.appointments}</p>
                </div>
              </div>
            </div>

            {/* Doctor Management */}
            <div className="bg-white rounded-2xl shadow-md p-8 mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Doctor Profiles</h2>
                <button
                  onClick={() => { setShowAddDoc(!showAddDoc); setEditingDoc(null); }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer transition flex items-center gap-2"
                >
                  <Plus size={18} /> Add Doctor
                </button>
              </div>

              {/* Form to Add/Edit Doctor */}
              {(showAddDoc || editingDoc) && (
                <form onSubmit={editingDoc ? handleUpdateDoctor : handleAddDoctor} className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-bold mb-4">{editingDoc ? "Edit Doctor Profile" : "Create New Doctor Profile"}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-semibold">Doctor Name</label>
                      <input
                        type="text"
                        required
                        value={docForm.name}
                        onChange={e => setDocForm({ ...docForm, name: e.target.value })}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold">Email Address</label>
                      <input
                        type="email"
                        required
                        disabled={!!editingDoc}
                        value={docForm.email}
                        onChange={e => setDocForm({ ...docForm, email: e.target.value })}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg disabled:bg-slate-200"
                        placeholder="e.g. jdoe@clinic.com"
                      />
                    </div>
                    {!editingDoc && (
                      <div>
                        <label className="text-sm font-semibold">Password</label>
                        <input
                          type="password"
                          required
                          value={docForm.password}
                          onChange={e => setDocForm({ ...docForm, password: e.target.value })}
                          className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                          placeholder="At least 8 characters"
                        />
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-semibold">Specialisation</label>
                      <select
                        required
                        value={docForm.specialisation}
                        onChange={e => setDocForm({ ...docForm, specialisation: e.target.value })}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="">Select Specialisation</option>
                        {SPECIALTIES.map(spec => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold">Working Hours Start</label>
                      <input
                        type="text"
                        required
                        value={docForm.workingHoursStart}
                        onChange={e => setDocForm({ ...docForm, workingHoursStart: e.target.value })}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                        placeholder="e.g. 09:00"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold">Working Hours End</label>
                      <input
                        type="text"
                        required
                        value={docForm.workingHoursEnd}
                        onChange={e => setDocForm({ ...docForm, workingHoursEnd: e.target.value })}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                        placeholder="e.g. 17:00"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold">Slot Duration (Minutes)</label>
                      <input
                        type="number"
                        required
                        value={docForm.slotDuration}
                        onChange={e => setDocForm({ ...docForm, slotDuration: Number(e.target.value) })}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                        placeholder="e.g. 30"
                      />
                    </div>
                    {editingDoc && (
                      <div className="md:col-span-2">
                        <label className="text-sm font-semibold">Leave Days (comma-separated YYYY-MM-DD)</label>
                        <input
                          type="text"
                          value={docForm.leaveDaysStr}
                          onChange={e => setDocForm({ ...docForm, leaveDaysStr: e.target.value })}
                          className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                          placeholder="e.g. 2026-07-10, 2026-07-15"
                        />
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-semibold">Qualifications</label>
                      <input
                        type="text"
                        value={docForm.qualifications}
                        onChange={e => setDocForm({ ...docForm, qualifications: e.target.value })}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                        placeholder="e.g. M.B.B.S, M.D."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold">Phone Number</label>
                      <input
                        type="text"
                        value={docForm.phone}
                        onChange={e => setDocForm({ ...docForm, phone: e.target.value })}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                        placeholder="e.g. +91 99999 88888"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold">Experience (Years)</label>
                      <input
                        type="text"
                        value={docForm.experience}
                        onChange={e => setDocForm({ ...docForm, experience: e.target.value })}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                        placeholder="e.g. 8"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold">Profile Image URL</label>
                      <input
                        type="text"
                        value={docForm.profileUrl}
                        onChange={e => setDocForm({ ...docForm, profileUrl: e.target.value })}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                        placeholder="e.g. /images/doctors/doctor1.jpg"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold">Clinic / Hospital Address</label>
                      <textarea
                        value={docForm.address}
                        onChange={e => setDocForm({ ...docForm, address: e.target.value })}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg resize-none"
                        rows={2}
                        placeholder="e.g. 123 Main St, New Delhi"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer transition">
                      <Save size={16} /> Save
                    </button>
                    <button type="button" onClick={() => { setShowAddDoc(false); setEditingDoc(null); }} className="flex items-center gap-2 bg-slate-300 hover:bg-slate-400 text-slate-700 font-semibold px-4 py-2 rounded-lg cursor-pointer transition">
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Doctors Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-sm">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Specialty</th>
                      <th className="py-3 px-4">Work Hours</th>
                      <th className="py-3 px-4">Slot</th>
                      <th className="py-3 px-4">Leave Days</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map(doc => (
                      <tr key={doc.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-4 px-4 font-bold">{doc.name}</td>
                        <td className="py-4 px-4 text-slate-600">{doc.email}</td>
                        <td className="py-4 px-4 text-emerald-700 font-semibold">{doc.specialty}</td>
                        <td className="py-4 px-4 text-slate-600 flex items-center gap-1 mt-2">
                          <Clock size={14} /> {doc.workingHours?.start} - {doc.workingHours?.end}
                        </td>
                        <td className="py-4 px-4 text-slate-600">{doc.slotDuration}m</td>
                        <td className="py-4 px-4 text-slate-600 text-sm max-w-xs truncate">
                          {doc.leaveDays?.length ? doc.leaveDays.map((d: any) => new Date(d).toLocaleDateString()).join(", ") : "None"}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button onClick={() => startEdit(doc)} className="text-emerald-600 hover:text-emerald-800 p-1.5 rounded-lg hover:bg-emerald-50 cursor-pointer transition">
                            <Edit size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Clinic Bookings */}
            <div className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Clinic Appointment Bookings</h2>
              <div className="space-y-4">
                {appointments.length > 0 ? (
                  appointments.map((appt, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div>
                        <div className="flex gap-2 items-center">
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${appt.status === "booked" ? "bg-emerald-100 text-emerald-800" :
                              appt.status === "rescheduled" ? "bg-amber-100 text-amber-800" :
                                appt.status === "cancelled" ? "bg-rose-100 text-rose-800" :
                                  "bg-slate-200 text-slate-800"
                            }`}>
                            {appt.status.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mt-2">
                          Patient: {appt.patientId?.name || "N/A"}
                        </h4>
                        <p className="text-sm text-slate-600">
                          Doctor: <strong className="text-slate-700">Dr. {appt.doctorId?.name || "N/A"}</strong> ({appt.doctorId?.specialisation})
                        </p>
                        <p className="text-sm text-slate-600">
                          Contact: {appt.patientId?.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-800">
                          {new Date(appt.scheduledTime).toLocaleDateString()}
                        </p>
                        <p className="text-slate-500 font-semibold">
                          {new Date(appt.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500 py-6">No appointments booked in the system.</p>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
