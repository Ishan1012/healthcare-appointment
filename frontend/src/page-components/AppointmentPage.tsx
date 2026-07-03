"use client";
import React, { JSX, useEffect, useState } from 'react';
import {
    CheckCircle,
    Calendar as CalendarIcon,
    User as UserIcon,
    ArrowRight,
    Stethoscope
} from "lucide-react";
import { allAppointmentTypes } from '@/data/getAppointmentTypes';
import { AppointmentDetails, AppointmentType, Doctor, PatientInfo } from '@/types/type';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { bookAppointmentApi, getDoctorsApi, getDoctorSlotsApi } from '@/apis/apis';

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

const AppointmentPage = (): JSX.Element => {
    const router = useRouter();
    const auth = useAuth();
    const { logout, userSession } = auth;

    // Form and data state
    const [loading, setLoading] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean }[]>([]);

    const [appointmentDetails, setAppointmentDetails] = useState<Omit<AppointmentDetails, 'id'>>({
        type: '',
        doctor: null,
        date: '',
        time: '',
        patientInfo: {
            name: '',
            age: '',
            gender: '',
            address: '',
            phone: '',
            email: userSession?.email || '',
            concern: '',
        },
    });

    // Handle user checks
    if (auth && !userSession) {
        logout();
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-xl text-slate-600">Please sign in to continue.</p>
            </div>
        );
    }

    // Load doctors on mount
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await getDoctorsApi();
                setAllDoctors(response.data.doctors || []);
            } catch (error) {
                const errorMessage = String(error);
                if (errorMessage.includes("Patient Id not found")) {
                    logout();
                    router.replace('/login');
                    toast.error("Session expired. Please log in again.");
                } else {
                    console.error(error);
                    toast.error("Failed to load doctor profiles");
                }
            }
        };
        fetchDoctors();
    }, []);

    // Query active slots on Doctor/Date changes
    useEffect(() => {
        const fetchSlots = async () => {
            if (appointmentDetails.doctor && appointmentDetails.date) {
                try {
                    const res = await getDoctorSlotsApi(appointmentDetails.doctor.id, appointmentDetails.date);
                    setAvailableSlots(res.data.slots || []);
                } catch (error) {
                    console.error("Failed to fetch slots:", error);
                    setAvailableSlots([]);
                }
            } else {
                setAvailableSlots([]);
            }
        };
        fetchSlots();
    }, [appointmentDetails.doctor, appointmentDetails.date]);

    const handlePatientInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAppointmentDetails(prev => ({
            ...prev,
            patientInfo: { ...prev.patientInfo, [name]: value }
        }));
    };

    const handleSelectField = (field: keyof Omit<AppointmentDetails, 'patientInfo'>, value: any) => {
        setAppointmentDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleDoctorChange = (docId: string) => {
        const doc = allDoctors.find(d => d.id === docId) || null;
        handleSelectField('doctor', doc);
        if (doc) {
            setSelectedSpecialty(doc.specialty);
        }
        handleSelectField('time', '');
    };

    const isFormValid = () => {
        const { type, doctor, date, time, patientInfo } = appointmentDetails;
        return (
            type &&
            doctor &&
            date &&
            time &&
            patientInfo.name &&
            patientInfo.age &&
            patientInfo.gender &&
            patientInfo.phone &&
            patientInfo.email
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading || !isFormValid()) return;

        setLoading(true);
        try {
            const response = await bookAppointmentApi(appointmentDetails);
            if (response) {
                toast.success("Appointment Booked successfully!");
                setIsConfirmed(true);
            } else {
                toast.error("Failed to book appointment. Please try again.");
            }
        } catch (error) {
            const errorMessage = String(error);
            if (errorMessage.includes("Patient Id not found")) {
                logout();
                router.replace('/login');
                toast.error("Session expired. Please log in again.");
            } else {
                console.error(error);
                toast.error(errorMessage || "An error occurred during booking.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Filter doctors based on selected specialty
    const filteredDoctors = allDoctors.filter(doc => !selectedSpecialty || doc.specialty === selectedSpecialty);
    const appointmentTypes: AppointmentType[] = allAppointmentTypes;

    if (isConfirmed) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-500/10 via-emerald-100/30 to-slate-50 font-sans text-slate-800 antialiased pt-24 pb-16">
                <main className="container mx-auto px-4 py-8">
                    <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-emerald-100/50">
                        <div className="text-center max-w-xl mx-auto py-8">
                            <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-6 animate-pulse" />
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                                Appointment{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-emerald-900">
                                    Confirmed!
                                </span>
                            </h2>
                            <p className="text-slate-600 text-base mt-3 leading-relaxed">
                                A confirmation email and Google Calendar invite have been dispatched to <strong className="text-emerald-800 font-semibold">{appointmentDetails.patientInfo.email}</strong>.
                            </p>

                            <div className="mt-8 text-left bg-white border border-emerald-100/50 p-6 rounded-2xl shadow-sm space-y-4">
                                <h3 className="font-bold text-lg text-emerald-950 border-b border-emerald-100/50 pb-2">Booking Receipt Summary</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm text-slate-650">
                                    <p><strong>Patient Name:</strong> {appointmentDetails.patientInfo.name}</p>
                                    <p><strong>Age / Gender:</strong> {appointmentDetails.patientInfo.age} ({appointmentDetails.patientInfo.gender})</p>
                                    <p className="sm:col-span-2"><strong>Contact Details:</strong> {appointmentDetails.patientInfo.phone} | {appointmentDetails.patientInfo.email}</p>
                                    <p className="sm:col-span-2"><strong>Address:</strong> {appointmentDetails.patientInfo.address || 'Not Provided'}</p>
                                    <div className="sm:col-span-2 border-t border-emerald-100/50 my-1 pt-2"></div>
                                    <p><strong>Consultation Type:</strong> {appointmentDetails.type}</p>
                                    <p><strong>Assigned Doctor:</strong> Dr. {appointmentDetails.doctor?.name || 'N/A'}</p>
                                    <p className="sm:col-span-2"><strong>Time & Date:</strong> {appointmentDetails.date} at {appointmentDetails.time}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-500/10 via-emerald-100/30 to-slate-50 font-sans text-slate-800 antialiased pt-24 pb-16">
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="text-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                            Book an{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-emerald-900">
                                Appointment
                            </span>
                        </h2>
                        <p className="text-slate-650 text-base md:text-lg mt-2 max-w-xl mx-auto leading-relaxed">
                            Fill in the details below to schedule your consultation slot.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        {/* Section 1: Appointment Type */}
                        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-emerald-100/50 shadow-md hover:shadow-lg transition-all duration-300">
                            <h3 className="text-xl font-bold text-emerald-950 mb-6 flex items-center gap-2">
                                <Stethoscope className="text-emerald-700" size={24} />
                                1. Select Appointment Type
                            </h3>
                            <div className="flex gap-4">
                                {appointmentTypes.map(type => {
                                    const isSelected = appointmentDetails.type === type.title;
                                    return (
                                        <button
                                            key={type.title}
                                            type="button"
                                            onClick={() => handleSelectField('type', type.title)}
                                            className={`p-5 border-2 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between flex-1 hover:-translate-y-0.5 ${isSelected
                                                ? 'border-emerald-600 bg-emerald-50/40 shadow-sm'
                                                : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50/50'
                                                }`}
                                        >
                                            <div>
                                                <span className={`inline-block p-2.5 rounded-lg mb-3 ${isSelected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                                                    {type.icon}
                                                </span>
                                                <h4 className="font-bold text-emerald-950 text-sm">{type.title}</h4>
                                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{type.description}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Section 2: Choose Doctor & Time */}
                        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-emerald-100/50 shadow-md hover:shadow-lg transition-all duration-300 space-y-6">
                            <h3 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                                <CalendarIcon className="text-emerald-700" size={24} />
                                2. Choose Doctor & Time
                            </h3>

                            <div className="flex flex-col gap-5">
                                {/* Specialty Selection */}
                                <div>
                                    <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-2">Select Specialty</label>
                                    <select
                                        value={selectedSpecialty}
                                        onChange={(e) => {
                                            setSelectedSpecialty(e.target.value);
                                            handleSelectField('doctor', null);
                                            handleSelectField('time', '');
                                        }}
                                        className="w-full p-3 border border-emerald-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm shadow-sm transition-all text-slate-800"
                                    >
                                        <option value="">-- Choose a specialty --</option>
                                        {SPECIALTIES.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                                    </select>
                                </div>

                                {/* Doctor Selection */}
                                <div>
                                    <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-2">Select Doctor</label>
                                    <select
                                        value={appointmentDetails.doctor?.id || ''}
                                        onChange={(e) => handleDoctorChange(e.target.value)}
                                        className="w-full p-3 border border-emerald-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm shadow-sm transition-all text-slate-800"
                                    >
                                        <option value="">-- Choose a doctor --</option>
                                        {filteredDoctors.map(doc => (
                                            <option key={doc.id} value={doc.id}>
                                                Dr. {doc.name} ({doc.specialty})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Visit Date Selection */}
                                <div>
                                    <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-2">Select Date</label>
                                    <input
                                        type="date"
                                        value={appointmentDetails.date}
                                        onChange={(e) => {
                                            handleSelectField('date', e.target.value);
                                            handleSelectField('time', '');
                                        }}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full p-3 border border-emerald-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-sm transition-all text-slate-800"
                                    />
                                </div>

                                {/* Available Slots Selection */}
                                <div>
                                    <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-2">Available Time Slots</label>
                                    {appointmentDetails.doctor && appointmentDetails.date ? (
                                        availableSlots.length > 0 ? (
                                            <div className="flex flex-wrap gap-2.5 pt-1">
                                                {availableSlots.map((slot) => {
                                                    const isSelected = appointmentDetails.time === slot.time;
                                                    const isDisabled = !slot.available;
                                                    return (
                                                        <button
                                                            key={slot.time}
                                                            type="button"
                                                            disabled={isDisabled}
                                                            onClick={() => handleSelectField('time', slot.time)}
                                                            className={`px-4 py-2.5 text-xs font-bold rounded-xl border transition-all ${isDisabled
                                                                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                                                    : isSelected
                                                                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-105 cursor-pointer'
                                                                        : 'bg-white text-emerald-950 border-emerald-100 hover:border-emerald-500 hover:text-emerald-700 hover:shadow-sm cursor-pointer'
                                                                }`}
                                                        >
                                                            {slot.time}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-red-500 italic font-semibold">No available times found for the selected date.</p>
                                        )
                                    ) : (
                                        <p className="text-sm text-slate-450 italic">Please choose a doctor and a date first to load available time slots.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Patient Details */}
                        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-emerald-100/50 shadow-md hover:shadow-lg transition-all duration-300 space-y-6">
                            <h3 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                                <UserIcon className="text-emerald-700" size={24} />
                                3. Patient Details
                            </h3>

                            <div className="flex flex-col gap-5">
                                <div>
                                    <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={appointmentDetails.patientInfo.name}
                                        onChange={handlePatientInfoChange}
                                        placeholder="Patient's full name"
                                        className="w-full p-3 border border-emerald-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-sm transition-all text-slate-800"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-2">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        required
                                        min="1"
                                        value={appointmentDetails.patientInfo.age}
                                        onChange={handlePatientInfoChange}
                                        placeholder="Age"
                                        className="w-full p-3 border border-emerald-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-sm transition-all text-slate-800"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-2">Gender</label>
                                    <select
                                        name="gender"
                                        required
                                        value={appointmentDetails.patientInfo.gender}
                                        onChange={handlePatientInfoChange}
                                        className="w-full p-3 border border-emerald-200 rounded-xl bg-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-sm transition-all text-slate-800"
                                    >
                                        <option value="">Select gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={appointmentDetails.patientInfo.phone}
                                        onChange={handlePatientInfoChange}
                                        placeholder="Phone number"
                                        className="w-full p-3 border border-emerald-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-sm transition-all text-slate-800"
                                    />
                                </div>

                                {!appointmentDetails.patientInfo.email && (
                                    <div>
                                        <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={appointmentDetails.patientInfo.email}
                                            onChange={handlePatientInfoChange}
                                            placeholder="Email address"
                                            className="w-full p-3 border border-emerald-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-sm transition-all text-slate-800"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-2">Address</label>
                                    <textarea
                                        name="address"
                                        value={appointmentDetails.patientInfo.address}
                                        onChange={handlePatientInfoChange}
                                        rows={3}
                                        placeholder="Current address"
                                        className="w-full p-3 border border-emerald-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none shadow-sm transition-all text-slate-800"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-2">Symptoms / Concern</label>
                                    <textarea
                                        name="concern"
                                        value={appointmentDetails.patientInfo.concern}
                                        onChange={handlePatientInfoChange}
                                        rows={3}
                                        placeholder="Briefly describe your symptoms or medical concern..."
                                        className="w-full p-3 border border-emerald-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none shadow-sm transition-all text-slate-800"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={!isFormValid() || loading}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-2xl cursor-pointer shadow-md transition-all flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed border-none text-base hover:scale-[1.01]"
                            >
                                {loading ? 'Processing Booking...' : 'Confirm Appointment'}
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AppointmentPage;