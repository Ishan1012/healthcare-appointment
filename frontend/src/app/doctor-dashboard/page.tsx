"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { doctorGetAppointmentsApi, getAppointmentApi, doctorSubmitSummaryApi } from "@/apis/apis";
import {
  User,
  FileText,
  Send,
  Activity,
  HelpCircle,
  FileCheck2,
  LogOut
} from "lucide-react";

export default function DoctorDashboard() {
  const { userSession, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedAppt, setSelectedAppt] = useState<any | null>(null);
  const [selectedSummary, setSelectedSummary] = useState<any | null>(null);

  // Post visit submission state
  const [notesForm, setNotesForm] = useState({
    doctorNotes: "",
    prescription: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (userSession && userSession.role !== "Doctor") {
      toast.error("Access denied");
      router.replace("/");
    }
  }, [userSession]);

  const loadAppointments = async () => {
    try {
      const response = await doctorGetAppointmentsApi();
      setAppointments(response.data.appointments);
    } catch (error: any) {
      console.error("Error loading doctor appointments:", error);
      toast.error("Failed to load patient queue");
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const selectAppointment = async (appt: any) => {
    try {
      setSelectedAppt(appt);
      // Fetch details including the pre-visit and post-visit summaries
      const res = await getAppointmentApi(appt._id);
      setSelectedSummary(res.data.summary);

      // Seed notes form if already completed
      if (res.data.summary) {
        setNotesForm({
          doctorNotes: res.data.summary.doctorNotes || "",
          prescription: res.data.summary.prescription || ""
        });
      } else {
        setNotesForm({ doctorNotes: "", prescription: "" });
      }
    } catch (error: any) {
      console.error("Error loading appointment details:", error);
      toast.error("Could not load appointment details");
    }
  };

  const handleNotesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppt) return;
    setSubmitting(true);
    try {
      const res = await doctorSubmitSummaryApi(selectedAppt._id, {
        doctorNotes: notesForm.doctorNotes,
        prescription: notesForm.prescription
      });
      toast.success("Post-visit clinical notes submitted successfully!");
      setSelectedSummary(res.data.summary);
      // Reload appointment to update state status
      loadAppointments();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to submit post-visit summaries");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50 pt-24 pb-12 font-sans antialiased text-slate-800">
        <main className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Doctor Dashboard</h1>
                <p className="text-slate-600">Review patient symptoms and record clinical visit summaries.</p>
              </div>
              <button onClick={() => { logout(); router.replace('/login'); }} className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer transition">
                <LogOut size={18} /> Logout
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Queue List */}
              <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6 h-[700px] flex flex-col">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Activity className="text-emerald-600" /> Patient Queue
                </h2>
                <div className="flex-1 overflow-y-auto space-y-3">
                  {appointments.length > 0 ? (
                    appointments.map(appt => (
                      <div
                        key={appt._id}
                        onClick={() => selectAppointment(appt)}
                        className={`p-4 border rounded-xl cursor-pointer transition flex flex-col justify-between ${selectedAppt?._id === appt._id
                          ? "border-emerald-500 bg-emerald-50/50 shadow-sm"
                          : "border-slate-200 hover:bg-slate-50"
                          }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-slate-900">{appt.patientId?.name || "N/A"}</p>
                            <p className="text-xs text-slate-500">Gender: {appt.patientId?.gender || "N/A"} | Age: {appt.patientId?.age || "N/A"}</p>
                          </div>
                          <span className={`px-2 py-0.5 text-3xs font-semibold rounded-full ${appt.status === "completed" ? "bg-slate-200 text-slate-700" : "bg-emerald-100 text-emerald-800"
                            }`}>
                            {appt.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="mt-3 flex justify-between items-center text-xs text-slate-600 font-semibold border-t border-slate-100 pt-2">
                          <p>{new Date(appt.scheduledTime).toLocaleDateString()}</p>
                          <p>{new Date(appt.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-slate-400 py-12">No appointments scheduled.</p>
                  )}
                </div>
              </div>

              {/* Patient Details & AI pre/post summaries */}
              <div className="lg:col-span-2 space-y-8">
                {selectedAppt ? (
                  <div className="bg-white rounded-2xl shadow-md p-8">
                    {/* Patient Overview */}
                    <div className="border-b border-slate-200 pb-6 mb-6">
                      <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <User className="text-emerald-600" /> Patient Overview
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-sm">
                        <p><strong>Name:</strong> {selectedAppt.patientId?.name || "N/A"}</p>
                        <p><strong>Age:</strong> {selectedAppt.patientId?.age || "N/A"}</p>
                        <p><strong>Gender:</strong> {selectedAppt.patientId?.gender || "N/A"}</p>
                        <p><strong>Phone:</strong> {selectedAppt.patientId?.phone || "N/A"}</p>
                        <p className="md:col-span-2"><strong>Address:</strong> {selectedAppt.patientId?.address || "N/A"}</p>
                      </div>
                    </div>

                    {/* Pre-Visit AI summary */}
                    {selectedSummary ? (
                      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Activity size={20} className="text-emerald-600" /> AI Symptoms Pre-Visit Summary
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${selectedSummary.urgencyLevel === "critical" || selectedSummary.urgencyLevel === "high"
                            ? "bg-rose-100 text-rose-800"
                            : selectedSummary.urgencyLevel === "medium"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                            }`}>
                            {selectedSummary.urgencyLevel} Urgency
                          </span>
                        </div>
                        <p className="text-slate-700 whitespace-pre-line text-sm mb-4 leading-relaxed">
                          {selectedSummary.preVisitSummary}
                        </p>
                        <div className="border-t border-slate-200 pt-4 flex items-start gap-2 text-xs text-slate-600">
                          <HelpCircle size={16} className="text-emerald-600 flex-shrink-0" />
                          <p>These questions were auto-generated by the AI Assistant based on the patient's concerns to help guide your visit.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-yellow-50 text-yellow-800 rounded-xl border border-yellow-200 text-sm mb-6">
                        No pre-visit symptom summary found.
                      </div>
                    )}

                    {/* Visit Records Form (Clinical notes & prescription) */}
                    <div className="border-t border-slate-200 pt-6">
                      <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <FileText className="text-emerald-600" /> Visit Clinical Records
                      </h2>
                      <form onSubmit={handleNotesSubmit} className="space-y-4">
                        <div>
                          <label className="text-sm font-semibold text-slate-700 block mb-1">Clinical Notes</label>
                          <textarea
                            required
                            disabled={selectedAppt.status === "completed"}
                            rows={5}
                            value={notesForm.doctorNotes}
                            onChange={e => setNotesForm({ ...notesForm, doctorNotes: e.target.value })}
                            placeholder="Record diagnosis, observations, patient physical stats, and follow up instructions..."
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-slate-700 block mb-1">Prescription & Medication Schedule</label>
                          <textarea
                            required
                            disabled={selectedAppt.status === "completed"}
                            rows={3}
                            value={notesForm.prescription}
                            onChange={e => setNotesForm({ ...notesForm, prescription: e.target.value })}
                            placeholder="e.g. Paracetamol 500mg (twice daily for 5 days), Amoxicillin 250mg (three times daily)..."
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        {selectedAppt.status !== "completed" && (
                          <button
                            type="submit"
                            disabled={submitting}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-lg cursor-pointer transition flex items-center gap-2"
                          >
                            <Send size={16} /> {submitting ? "Analyzing and Submitting..." : "Submit Records & Complete"}
                          </button>
                        )}
                      </form>
                    </div>

                    {/* AI Post-Visit Summary (if completed) */}
                    {selectedSummary?.postVisitSummary && (
                      <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-6 mt-8">
                        <h3 className="text-lg font-bold text-emerald-900 mb-2 flex items-center gap-2">
                          <FileCheck2 size={20} className="text-emerald-700" /> Patient-Friendly Post-Visit Summary (AI Assistant)
                        </h3>
                        <p className="text-slate-700 whitespace-pre-line text-sm leading-relaxed">
                          {selectedSummary.postVisitSummary}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-md p-12 text-center h-[500px] flex flex-col justify-center items-center">
                    <User size={64} className="text-slate-300 mb-4" />
                    <h3 className="text-2xl font-bold text-slate-700">Select a Patient</h3>
                    <p className="text-slate-500 mt-2 max-w-sm">Choose a patient from the queue on the left to view details and update visit reports.</p>
                  </div>
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
