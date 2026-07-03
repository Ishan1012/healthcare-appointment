import React from 'react';
import { RecordDetails } from '@/types/type';
import { useRouter } from 'next/navigation';
import {
    Clipboard,
    Activity,
    User,
    Calendar,
    ArrowLeft,
    Pill,
    MapPin,
    FileSpreadsheet
} from "lucide-react";

interface RecordDescriptionProps {
    details: Omit<RecordDetails, 'id'> & { status: string };
}

const RecordDescription: React.FC<RecordDescriptionProps> = ({ details }) => {
    const router = useRouter();
    const doctor = details.doctor;
    const patientInfo = details.patientInfo;
    const summary = details.summary;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-500/10 via-emerald-100/30 to-slate-50 font-sans text-slate-800 antialiased pt-24 pb-16">
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Back Button */}
                    <div>
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-emerald-800 hover:text-emerald-900 font-bold transition-all border-none bg-transparent cursor-pointer text-sm"
                        >
                            <ArrowLeft size={18} /> Back to Profile
                        </button>
                    </div>

                    {/* Record Main Header Card */}
                    <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-emerald-100/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div>
                            <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full mb-3 uppercase tracking-wider">
                                Official Medical Record
                            </span>
                            <h1 className="text-3xl font-bold text-slate-900 leading-tight">
                                {details.type || "General Consultation"}
                            </h1>
                            <p className="text-slate-550 text-sm mt-1.5 flex items-center gap-1.5">
                                <Calendar size={14} className="text-emerald-700" />
                                <span>{new Date(details.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {details.time}</span>
                            </p>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-100/50 px-5 py-3 rounded-2xl text-right sm:text-left">
                            <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider">Assigned Clinician</p>
                            <p className="text-lg font-bold text-emerald-950 mt-1">Dr. {doctor?.name || "N/A"}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{doctor?.specialty || "General Practitioner"}</p>
                        </div>
                    </div>

                    {/* 2-Column Split: Clinical Information & Prescription details */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
                        {/* Left Main Information (3-columns wide) */}
                        <div className="md:col-span-3 space-y-6">
                            {/* Doctor Notes Section */}
                            <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl border border-emerald-100/50 shadow-md hover:shadow-lg transition-all duration-300">
                                <h3 className="text-xl font-bold text-emerald-950 mb-4 flex items-center gap-2">
                                    <Clipboard className="text-emerald-700" size={22} />
                                    Clinical Findings & Notes
                                </h3>
                                {summary?.doctorNotes ? (
                                    <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100 font-sans">
                                        {summary.doctorNotes}
                                    </p>
                                ) : (
                                    <p className="text-sm text-slate-500 italic">No clinical findings recorded by the doctor yet.</p>
                                )}
                            </div>

                            {/* AI Pre-Visit Summary / Symptoms Analysis */}
                            <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl border border-emerald-100/50 shadow-md hover:shadow-lg transition-all duration-300">
                                <h3 className="text-xl font-bold text-emerald-950 mb-4 flex items-center gap-2">
                                    <Activity className="text-emerald-700" size={22} />
                                    AI Symptom Analysis & Urgency
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">Chief Concern / Symptoms</p>
                                        <p className="text-slate-700 text-sm bg-slate-50/50 p-4 rounded-xl border border-slate-100 italic">
                                            "{patientInfo?.concern || "No concerns recorded"}"
                                        </p>
                                    </div>
                                    {summary?.preVisitSummary ? (
                                        <div>
                                            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">Pre-Visit Diagnostics</p>
                                            <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                                {summary.preVisitSummary}
                                            </p>
                                        </div>
                                    ) : null}
                                    {summary?.urgencyLevel ? (
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Urgency Level:</span>
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                                                summary.urgencyLevel === 'high' || summary.urgencyLevel === 'critical'
                                                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                            }`}>
                                                {summary.urgencyLevel}
                                            </span>
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            {/* Post Visit Summary (LLM for patient) */}
                            {summary?.postVisitSummary && (
                                <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl border border-emerald-100/50 shadow-md hover:shadow-lg transition-all duration-300">
                                    <h3 className="text-xl font-bold text-emerald-950 mb-4 flex items-center gap-2">
                                        <FileSpreadsheet className="text-emerald-700" size={22} />
                                        Post-Visit Summary
                                    </h3>
                                    <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed bg-slate-50/55 p-4 rounded-xl border border-slate-100">
                                        {summary.postVisitSummary}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Right Side Column (2-columns wide): Prescription & Patient info */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Prescription Card */}
                            <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl border border-emerald-100/50 shadow-md hover:shadow-lg transition-all duration-300">
                                <h3 className="text-xl font-bold text-emerald-950 mb-4 flex items-center gap-2">
                                    <Pill className="text-emerald-700" size={22} />
                                    Prescription List
                                </h3>
                                {summary?.prescription ? (
                                    <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100/50 font-mono text-xs text-emerald-950 leading-relaxed whitespace-pre-wrap">
                                        {summary.prescription}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 italic">No medication prescribed during this visit.</p>
                                )}
                            </div>

                            {/* Patient Profile Overview */}
                            <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl border border-emerald-100/50 shadow-md hover:shadow-lg transition-all duration-300 space-y-4">
                                <h3 className="text-xl font-bold text-emerald-950 flex items-center gap-2 border-b border-emerald-100/50 pb-2">
                                    <User className="text-emerald-700" size={22} />
                                    Patient Details
                                </h3>
                                <div className="text-sm text-slate-650 space-y-2">
                                    <p><strong>Name:</strong> {patientInfo?.name || "N/A"}</p>
                                    <p><strong>Age / Gender:</strong> {patientInfo?.age || "N/A"} ({patientInfo?.gender || "N/A"})</p>
                                    <p><strong>Phone:</strong> {patientInfo?.phone || "N/A"}</p>
                                    <p><strong>Email:</strong> {patientInfo?.email || "N/A"}</p>
                                    <p className="flex items-start gap-1">
                                        <MapPin size={14} className="mt-0.5 text-slate-400 shrink-0" />
                                        <span><strong>Address:</strong> {patientInfo?.address || "Not Provided"}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RecordDescription;
