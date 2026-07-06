'use client';
import React, { useState, useEffect, useCallback, FC, ReactElement } from 'react';
import {
	Phone,
	MapPin,
	Calendar,
	LogOut,
	ChevronRight,
	FileText,
	Settings,
	Bell,
	Download,
	Stethoscope,
	Briefcase
} from "lucide-react";
import { AppointmentDetails, Doctor, Patient } from '@/types/type';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type UserProfile = Patient | Doctor;

const LoadingPage: FC = () => (
	<div className="min-h-screen bg-slate-50 flex items-center justify-center">
		<div className="flex items-center space-x-2 text-emerald-600">
			<svg className="animate-spin h-6 w-6 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
				<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
				<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
			<p className="text-xl font-semibold">Loading Profile...</p>
		</div>
	</div>
);

interface InfoItemProps {
	icon: ReactElement;
	label: string;
	value: string | number | undefined;
}

const InfoItem: FC<InfoItemProps> = ({ icon, label, value }) => {
	const displayValue = value === undefined || value === null || value === '' ? 'N/A' : value;
	return (
		<div className="flex items-center">
			<div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full">
				{icon}
			</div>
			<div className="ml-4">
				<p className="text-sm font-semibold text-slate-500">{label}</p>
				<p className="text-md font-bold text-slate-800">{displayValue}</p>
			</div>
		</div>
	);
};

interface ProfileCardProps {
	user: UserProfile;
}
const ProfileCard: FC<ProfileCardProps> = ({ user }) => {
	const router = useRouter();
	const isPatient = user.id.startsWith('PAT');
	const profileUrl = user.profileUrl || user.profileUrl;
	const [imgSrc, setImgSrc] = useState(profileUrl || "/images/user-default.png");

	const openRegistrationForm = useCallback(() => {
		if (isPatient) {
			router.push('/register/patient');
		} else {
			router.push('/register/doctor');
		}
	}, [isPatient, router]);

	const isDetailsComplete = isPatient
		? (user as Patient).age !== undefined && (user as Patient).phone !== undefined && (user as Patient).address !== undefined
		: (user as Doctor).specialty !== undefined && (user as Doctor).qualifications !== undefined && (user as Doctor).phone !== undefined;

	return (
		<div className="bg-white rounded-2xl shadow-xl p-8 text-center">
			<img
				src={imgSrc}
				alt="User Profile"
				className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-emerald-200 object-cover"
				onError={() => setImgSrc("/images/user-default.png")}
			/>
			<h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
			<p className="text-slate-600 mt-1">{user.email}</p>

			<div className="mt-8 text-left space-y-4">
				{!isDetailsComplete ? (
					isPatient ? (
						<div className="flex justify-center mt-4">
							<button
								className="px-4 py-2 cursor-pointer bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-650 transition duration-200"
								onClick={openRegistrationForm}
							>
								Complete Details
							</button>
						</div>
					) : (
						<div className="text-center py-4 bg-slate-50 border border-slate-100 rounded-xl">
							<p className="text-sm text-slate-500 italic">Profile details incomplete. Please contact the administrator.</p>
						</div>
					)
				) : (
					isPatient ? (
						<>
							<InfoItem icon={<Calendar size={20} />} label="Age" value={(user as Patient).age} />
							<InfoItem icon={<Phone size={20} />} label="Phone" value={(user as Patient).phone} />
							<InfoItem icon={<MapPin size={20} />} label="Address" value={(user as Patient).address} />
						</>
					) : (
						<>
							<InfoItem icon={<Stethoscope size={20} />} label="Specialty" value={(user as Doctor).specialty} />
							<InfoItem icon={<Briefcase size={20} />} label="Experience (Years)" value={(user as Doctor).experience} />
							<InfoItem icon={<Phone size={20} />} label="Phone" value={(user as Doctor).phone} />
							<InfoItem icon={<MapPin size={20} />} label="Address" value={(user as Doctor).address} />
						</>
					)
				)}
			</div>
			{isPatient && (
				<button
					onClick={openRegistrationForm}
					className="mt-8 w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
				>
					Edit Profile
				</button>
			)}
		</div>
	);
}

interface DashboardNavProps {
	user: UserProfile;
}
const DashboardNav: FC<DashboardNavProps> = ({ user }) => {
	const router = useRouter();
	const isPatient = user.id.startsWith('PAT');

	const patientNavItems = [
		{ icon: <Calendar />, text: "Appointments" },
		{ icon: <FileText />, text: "Medical Records" },
		{ icon: <Bell />, text: "Notifications" },
		{ icon: <Settings />, text: "Account Settings" },
	];

	const doctorNavItems = [
		{ icon: <Calendar />, text: "Schedule & Slots" },
		{ icon: <Briefcase />, text: "Patient Queue" },
		{ icon: <Settings />, text: "Account Settings" },
	];

	const navItems = isPatient ? patientNavItems : doctorNavItems;

	const handleClick = useCallback((name: string) => {
		if (name === "Account Settings" || name === "Notifications") {
			router.push(`/profile?id=${user.id}`);
		} else if (name === "Medical Records") {
			router.push('/profile#records');
		} else if (name === "Appointments") {
			router.push('/profile#upcoming');
		} else if (name === "Schedule & Slots" || name === "Patient Queue") {
			router.push('/doctor-dashboard'); // Example route for doctor actions
		}
	}, [user.id, router]);

	return (
		<div className="bg-white rounded-2xl shadow-xl p-8">
			<h2 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h2>
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
				{navItems.map(item => (
					<div
						key={item.text}
						onClick={() => handleClick(item.text)}
						className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg text-center cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
					>
						<div className="text-emerald-500 mb-2">{React.cloneElement(item.icon, { size: 32, strokeWidth: 1.5 })}</div>
						<p className="font-semibold text-sm">{item.text}</p>
					</div>
				))}
			</div>
		</div>
	);
};

interface AppointmentCardProps {
	appointment: AppointmentDetails;
	isPatientView: boolean;
}
const AppointmentCard: FC<AppointmentCardProps> = ({ appointment, isPatientView }) => {
	const router = useRouter();
	const openAppointment = useCallback(() => {
		router.push(`/appointment/${appointment.id}`);
	}, [appointment.id, router]);


	console.log(appointment);
	const partner = isPatientView ? appointment.doctor : appointment.patientInfo;
	console.log(partner);
	const partnerName = partner?.name || "N/A";
	let detailText = '';
	let roleText = '';

	if (partner && 'specialty' in partner) {
		// partner is a Doctor
		detailText = partner.specialty || 'N/A';
		roleText = `with Dr. ${partnerName}`;
	} else {
		// partner is a Patient
		detailText = `Age: ${partner?.age || 'N/A'}, Phone: ${partner?.phone || 'N/A'}`;
		roleText = `for ${partnerName}`;
	}

	return (
		<div onClick={openAppointment} className="bg-slate-50 p-4 rounded-lg flex items-center justify-between hover:bg-emerald-50 transition-colors cursor-pointer">
			<div className="flex items-center">
				<div className="bg-emerald-100 text-emerald-700 p-3 rounded-lg">
					<Calendar size={24} />
				</div>
				<div className="ml-4">
					<p className="font-bold text-slate-800">{roleText}</p>
					<p className="text-sm text-slate-600">{detailText}</p>
					<p className="text-sm text-slate-600 font-semibold">{new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {appointment.time}</p>
				</div>
			</div>
			<ChevronRight className="text-slate-400" />
		</div>
	);
}

interface AppointmentsSectionProps {
	appointments: AppointmentDetails[];
	isPatientView: boolean;
	title: string;
	id: string;
	emptyMessage: string;
}
const AppointmentsSection: FC<AppointmentsSectionProps> = ({ appointments, isPatientView, title, id, emptyMessage }) => {
	return (
		<div id={id} className="bg-white rounded-2xl shadow-xl p-8">
			<h2 className="text-2xl font-bold text-slate-900 mb-6">{title}</h2>
			<div className="space-y-4">
				{(appointments && appointments.length > 0) ? (
					appointments.map((appt, index) => <AppointmentCard key={index} appointment={appt} isPatientView={isPatientView} />)
				) : (
					<p className="text-slate-600 text-center py-4">{emptyMessage}</p>
				)}
			</div>
		</div>
	);
}

interface RecordCardProps {
	isPatient: boolean;
	record: AppointmentDetails;
}
const RecordCard: FC<RecordCardProps> = ({ isPatient, record }) => {
	const router = useRouter();
	return (
		<div
			onClick={() => {
				if (isPatient) {
					router.push(`/records/${record.id}`);
				}
			}}
			className={`bg-slate-50 p-4 rounded-lg flex items-center justify-between hover:bg-slate-100 transition-colors ${isPatient ? 'cursor-pointer' : ''}`}
		>
			{isPatient ? (
				<div className="flex items-center">
					<div className="bg-slate-200 text-slate-650 p-3 rounded-lg">
						<FileText size={24} />
					</div>
					<div className="ml-4">
						<p className="font-bold text-slate-800">{record.type}</p>
						<p className="text-sm text-slate-600">with Dr. {record.doctor?.name} ({record.doctor?.specialty})</p>
						<p className="text-sm text-slate-600 font-semibold">{new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
					</div>
				</div>
			) : (
				<div className="flex items-center">
					<div className="bg-slate-200 text-slate-655 p-3 rounded-lg">
						<FileText size={24} />
					</div>
					<div className="ml-4">
						<p className="font-bold text-slate-800">{record.type}</p>
						<p className="text-sm text-slate-650">with {record.patientInfo.name} of age ({record.patientInfo.age}).</p>
						<p className="text-sm text-slate-650 font-semibold">{new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
					</div>
				</div>
			)}
			{record.reportUrl && (
				<a
					href={record.reportUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center font-semibold text-emerald-600 hover:text-emerald-800"
					onClick={(e) => e.stopPropagation()}
				>
					<Download size={18} className="mr-2" />
					View Report
				</a>
			)}
		</div>
	);
};

interface MedicalRecordsProps {
	isPatient: boolean;
	records: AppointmentDetails[];
}
const MedicalRecords: FC<MedicalRecordsProps> = ({ isPatient, records }) => (
	<div id="records" className="bg-white rounded-2xl shadow-xl p-8">
		<h2 className="text-2xl font-bold text-slate-900 mb-6">Medical Records</h2>
		<div className="space-y-4">
			{(records && records.length) > 0 ? (
				records.map((record, index) => <RecordCard key={index} isPatient={isPatient} record={record} />)
			) : (
				<p className="text-slate-600 text-center py-4">You have no past medical records.</p>
			)}
		</div>
	</div>
);

const Profile: FC = () => {
	const [user, setUser] = useState<UserProfile | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const router = useRouter();

	const { logout, getUser } = useAuth();

	const isPatient = user?.id.startsWith('PAT') ?? false;

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const data = await getUser();

				setUser(data);
			} catch (error) {
				const errorMessage = String(error);

				if (errorMessage.includes("jwt expired")) {
					logout();
					router.replace('/login');
					toast.error("Session expired. Please log in again.");
				} else {
					console.error(error);
					toast.error("An error occurred: " + errorMessage);
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserData();
	}, [getUser, logout, router]);

	const handleLogout = () => {
		logout();
		toast.success('Logged out successfully!');
		router.replace('/');
	}

	if (isLoading) {
		return <LoadingPage />;
	}

	if (!user) {
		return (
			<div className="min-h-screen bg-slate-50 flex items-center justify-center">
				<p className="text-xl text-slate-600">Could not load user profile.</p>
			</div>
		)
	}

	const patientUser = user as Patient;
	const doctorUser = user as Doctor;

	return (
		<div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased mt-10">
			<main className="container mx-auto px-4 sm:px-6 py-12">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<aside className="lg:col-span-1 space-y-6">
						<ProfileCard user={user} />

						{/* Sync Calendar Card */}
						{!user.googleCalendar?.connected && (
							<div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100/50">
								<h3 className="text-lg font-bold text-slate-800 mb-2">Sync Calendar</h3>
								<p className="text-xs text-slate-500 mb-6 leading-relaxed">
									Connect your Google Calendar to synchronize scheduled appointments and get alerts directly on your devices.
								</p>
								<a
									href={`${process.env.NEXT_PUBLIC_BACKEND_URI ? process.env.NEXT_PUBLIC_BACKEND_URI.replace('/api/v1', '') : 'http://localhost:5000'}/api/v1/calendar/auth?userId=${user.id}`}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-center gap-2 bg-slate-900 text-white font-bold text-xs py-3 px-4 rounded-xl hover:bg-slate-850 transition-all no-underline text-center w-full"
								>
									Connect Google Calendar
									<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
									</svg>
								</a>
							</div>
						)}

						<button onClick={handleLogout} className="w-full flex items-center justify-center font-semibold bg-slate-200 text-slate-700 px-6 py-3 rounded-lg hover:bg-rose-500 hover:text-white transition-colors cursor-pointer">
							<LogOut className="mr-2" size={20} /> Log Out
						</button>
					</aside>

					<div className="lg:col-span-2 space-y-8">
						<DashboardNav user={user} />
						{isPatient && patientUser.upcomingAppointments && (
							<AppointmentsSection
								appointments={patientUser.upcomingAppointments}
								isPatientView={true}
								title="Upcoming Appointments"
								id="upcoming"
								emptyMessage="You have no upcoming appointments."
							/>
						)}
						{!isPatient && doctorUser.upcomingAppointments && (
							<AppointmentsSection
								appointments={doctorUser.upcomingAppointments}
								isPatientView={false}
								title="Today's Patient Queue"
								id="queue"
								emptyMessage="You have no patients scheduled for today."
							/>
						)}
						{isPatient && patientUser.medicalRecords && (
							<MedicalRecords isPatient={isPatient} records={patientUser.medicalRecords} />
						)}
						{!isPatient && doctorUser.medicalRecords && (
							<MedicalRecords isPatient={isPatient} records={doctorUser.medicalRecords} />
						)}
					</div>
				</div>
			</main>
		</div>
	);
};

export default Profile;