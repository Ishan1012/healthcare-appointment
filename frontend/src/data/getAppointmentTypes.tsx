import { Calendar, Stethoscope } from "lucide-react";

export const allAppointmentTypes = [
    { icon: <Stethoscope size={32} />, title: "New Consultation", description: "For new patients or new health concerns." },
    { icon: <Calendar size={32} />, title: "Follow-up Visit", description: "For existing patients continuing their treatment." },
];