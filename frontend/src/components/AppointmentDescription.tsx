import { AppointmentDetails } from "@/types/type";
import { CheckCircle, XCircle } from "lucide-react";

interface AppointmentDescriptionProps {
    details: Omit<AppointmentDetails, 'id'> & { status: string };
}

const AppointmentDescription: React.FC<AppointmentDescriptionProps> = ({ details }) => {
    return (
        <div className="min-h-screen flex flex-col mt-10 items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4 py-16">
            {/* Success icon */}
            <div className="flex flex-col items-center text-center animate-fadeIn">
                {
                    details.status !== 'Cancelled' ? (
                        <div className="relative">
                            <CheckCircle className="w-20 h-20 text-emerald-500 drop-shadow-lg" />
                            <div className="absolute inset-0 animate-ping bg-emerald-400 rounded-full opacity-20" />
                        </div>
                    ) : (
                        <div className="relative">
                            <XCircle className="w-20 h-20 text-emerald-500 drop-shadow-lg" />
                            <div className="absolute inset-0 animate-ping bg-emerald-400 rounded-full opacity-20" />
                        </div>
                    )
                }
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-6 tracking-tight">
                    Appointment {details.status}!
                </h2>
                <p className="text-slate-600 mt-2 text-base sm:text-lg">
                    A confirmation email has been sent to your email.
                </p>
            </div>

            {/* Appointment summary card */}
            <div className="mt-8 w-full max-w-lg bg-white shadow-xl rounded-2xl border border-slate-200 p-8 transition-all hover:shadow-2xl hover:border-emerald-100">
                <h3 className="font-bold text-xl sm:text-2xl mb-6 text-slate-800 border-b border-slate-200 pb-2">
                    Appointment Summary
                </h3>
                <div className="space-y-4 text-slate-700">
                    <p>
                        <strong className="font-semibold text-slate-900">Patient:</strong>{" "}
                        {details.patientInfo.name}, {details.patientInfo.age}{" "}
                        <span className="text-slate-500">({details.patientInfo.gender})</span>
                    </p>
                    <p>
                        <strong className="font-semibold text-slate-900">Contact:</strong>{" "}
                        {details.patientInfo.phone} | {details.patientInfo.email}
                    </p>
                    <p>
                        <strong className="font-semibold text-slate-900">Address:</strong>{" "}
                        {details.patientInfo.address || "Not Provided"}
                    </p>

                    <div className="border-t border-slate-200 my-3" />

                    <p>
                        <strong className="font-semibold text-slate-900">Appointment Type:</strong>{" "}
                        {details.type}
                    </p>
                    <p>
                        <strong className="font-semibold text-slate-900">Doctor:</strong>{" "}
                        <span className="text-emerald-700 font-medium">
                            {details.doctor?.name || "N/A"}
                        </span>{" "}
                        ({details.doctor?.specialty || "N/A"})
                    </p>
                    <p>
                        <strong className="font-semibold text-slate-900">Date & Time:</strong>{" "}
                        {details.date} at {details.time}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDescription;
