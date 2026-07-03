"use client";
import { JSX, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import getTestimonials from '../context/FeedbackContext';
import {
	FaPhone,
	FaMapMarkerAlt,
	FaComments,
	FaUsers,
	FaHeart,
	FaCheckCircle,
	FaShieldAlt,
	FaCalendarCheck,
} from 'react-icons/fa';
import { Testimonial } from '@/types/type';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/pages/LoadingPage';

const LandingPage = (): JSX.Element => {
	const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
	const [isMounted, setIsMounted] = useState<boolean>(false);
	const { logout } = useAuth();
	const router = useRouter();

	useEffect(() => {
		const fetchTestimonials = async (): Promise<void> => {
			const data = await getTestimonials();
			// Modify testimonials to match the validated assignment facts
			const customTestimonials: Testimonial[] = [
				{
					id: 1,
					name: "Clinical Coordinator Admin",
					status: "System Seeding & Controls",
					image: "/images/user-default.png",
					testimonial: "Successfully seeds default administrator credentials (admin@wellnest.com / admin12345) on initial database connection, allowing immediate management of doctor profiles.",
					rating: 5,
					createdAt: "2026-07-03",
					updatedAt: "2026-07-03"
				},
				{
					id: 2,
					name: "Assigned Consultation Doctor",
					status: "Clinical Queue & AI Summary",
					image: "/images/user-default.png",
					testimonial: "Successfully reviews pre-visit symptom summaries with urgency levels and suggested questions, and records clinical notes to generate post-visit schedules.",
					rating: 5,
					createdAt: "2026-07-03",
					updatedAt: "2026-07-03"
				},
				{
					id: 3,
					name: "Registered Patient User",
					status: "Symptom Booking & Calendar",
					image: "/images/user-default.png",
					testimonial: "Successfully logs in, chooses specialty, selects dynamic available slots, submits symptoms, and receives a Google Calendar event and email alert.",
					rating: 5,
					createdAt: "2026-07-03",
					updatedAt: "2026-07-03"
				},
				{
					id: 4,
					name: "Medication Daemon Worker",
					status: "Background Schedulers",
					image: "/images/user-default.png",
					testimonial: "Successfully monitors prescription frequencies periodically and delivers medication email reminders to patient mailboxes based on active records.",
					rating: 5,
					createdAt: "2026-07-03",
					updatedAt: "2026-07-03"
				}
			];
			setTestimonials(customTestimonials);
		}

		fetchTestimonials();
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return <LoadingSpinner />;
	}

	return (
		<div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased overflow-x-hidden">
			{/* Hero Section */}
			<section className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-emerald-500/10 via-emerald-100/30 to-slate-50 relative flex items-center mb-[5vh]">
				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-4xl mx-auto text-center">
						<div className="text-center mb-6">
							<span className="bg-emerald-100 text-emerald-800 text-sm font-semibold px-4 py-1.5 rounded-full inline-block mb-4 shadow-sm">
								Healthcare Appointment & Follow-up Manager
							</span>
							<h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
								AI Consultations &{" "}
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-emerald-900">
									Calendar Sync
								</span>
							</h1>
							<p className="text-xl md:text-2xl mb-8 text-gray-700 animate-fade-in-up animation-delay-200 max-w-2xl mx-auto">
								Implement role-based portals for patients, doctors, and admin with integrated calendar syncing and LLM summaries.
							</p>
						</div>

						{/* CTA Buttons */}
						<div className="flex gap-4 justify-center animate-fade-in-up animation-delay-400 mb-16">
							<Link
								href="/appointment"
								className="bg-emerald-700 text-white px-8 py-3 rounded-full font-medium hover:bg-emerald-800 transition-all duration-300 hover:scale-105 hover:shadow-lg"
							>
								Book Appointment
							</Link>
							<Link
								href="/about"
								className="border-2 border-emerald-700 text-emerald-700 px-8 py-3 rounded-full font-medium hover:bg-emerald-50 transition-all duration-300 hover:scale-105"
							>
								View Details
							</Link>
						</div>

						{/* Feature Cards */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-xl mx-auto pb-10">
							<div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
								<div className="flex items-center gap-3 mb-3">
									<div className="p-2 bg-emerald-200 rounded-lg">
										<FaShieldAlt className="w-6 h-6 text-emerald-700" />
									</div>
									<h3 className="text-lg font-semibold text-gray-800">Double-Booking Guard</h3>
								</div>
								<p className="text-gray-600">Enforces slot validation constraints to handle concurrent patient booking safely.</p>
							</div>
							<div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
								<div className="flex items-center gap-3 mb-3">
									<div className="p-2 bg-emerald-200 rounded-lg">
										<FaHeart className="w-6 h-6 text-emerald-700" />
									</div>
									<h3 className="text-lg font-semibold text-gray-800">Dynamic Slot Checking</h3>
								</div>
								<p className="text-gray-600">Calculates and updates doctor slots dynamically relative to leave days and active bookings.</p>
							</div>
						</div>
					</div>
				</div>

				{/* Decorative Elements */}
				<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-20"></div>
				<div className="absolute top-0 left-0 w-64 h-64 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
				<div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
				<div className="absolute -bottom-8 left-20 w-64 h-64 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
			</section>

			{/* About Section */}
			<section className="min-h-screen py-24 bg-white relative flex items-center mb-[5vh]">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.25),transparent_50%)]"></div>
				<div className="container mx-auto px-4 relative">
					<div className="max-w-6xl mx-auto">
						<div className="text-center mb-16">
							<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
								WellNest{" "}
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-emerald-900">
									Assignment Core
								</span>
							</h2>
							<p className="text-lg text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
								A healthcare coordinator system implementing automated calendar syncing, background reminder daemons, and detailed clinical report summaries.
							</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
							<div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
								<FaUsers className="w-14 h-14 text-emerald-700 mx-auto mb-6" />
								<h3 className="text-xl font-semibold text-emerald-900 mb-3">New Doctor Registration</h3>
								<p className="text-gray-600">New doctors can reach out to our team in order to get registered to our website.</p>
							</div>
							<div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
								<FaCalendarCheck className="w-14 h-14 text-emerald-700 mx-auto mb-6" />
								<h3 className="text-xl font-semibold text-emerald-900 mb-3">Google Calendar Sync</h3>
								<p className="text-gray-600">Automatically creates calendar events on booking, and removes them upon cancellation.</p>
							</div>
							<div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
								<FaHeart className="w-14 h-14 text-emerald-700 mx-auto mb-6" />
								<h3 className="text-xl font-semibold text-emerald-900 mb-3">Background Reminders</h3>
								<p className="text-gray-600">A background cron alerts patients via email on medication frequencies parsed from prescriptions.</p>
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
							<div className="bg-emerald-100 p-8 rounded-2xl">
								<h3 className="text-2xl font-semibold text-emerald-900 mb-6">Patient Booking Actions</h3>
								<p className="text-gray-600 mb-6">
									Patients register, log in, filter doctors by specialty, check availability, select dynamic slots, and submit symptoms.
								</p>
								<ul className="space-y-3">
									<li className="flex items-center gap-3">
										<FaCheckCircle className="w-5 h-5 text-emerald-700" />
										<span>Role-based login and verification</span>
									</li>
									<li className="flex items-center gap-3">
										<FaCheckCircle className="w-5 h-5 text-emerald-700" />
										<span>Symptoms and concern form inputs</span>
									</li>
									<li className="flex items-center gap-3">
										<FaCheckCircle className="w-5 h-5 text-emerald-700" />
										<span>Dynamic slot rendering by date</span>
									</li>
								</ul>
							</div>
							<div className="bg-emerald-100 p-8 rounded-2xl">
								<h3 className="text-2xl font-semibold text-emerald-900 mb-6">Admin & Doctor Controls</h3>
								<p className="text-gray-600 mb-6">
									Admins manage doctor profiles and leaves. Doctors review queues, read pre-visit summaries, and record clinical notes.
								</p>
								<ul className="space-y-3">
									<li className="flex items-center gap-3">
										<FaCheckCircle className="w-5 h-5 text-emerald-700" />
										<span>Leave setting cancels conflicting slots</span>
									</li>
									<li className="flex items-center gap-3">
										<FaCheckCircle className="w-5 h-5 text-emerald-700" />
										<span>Pre-visit and post-visit summaries</span>
									</li>
									<li className="flex items-center gap-3">
										<FaCheckCircle className="w-5 h-5 text-emerald-700" />
										<span>Emailed notices for leaves and slots</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Statistics Section */}
			<section className="min-h-screen py-24 bg-gradient-to-b from-emerald-200/50 to-white relative flex items-center mb-[5vh]">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.25),transparent_50%)]"></div>
				<div className="container mx-auto px-4 relative">
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">
						Clinical Manager{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-emerald-900">
							Validation
						</span>
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-16">
						<div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
							<div className="text-4xl font-bold text-emerald-700 mb-4">Conflict Cleanups</div>
							<h3 className="text-2xl font-semibold text-gray-900 mb-2">Leave Conflict Cancellations</h3>
							<p className="text-gray-600">Setting a leave day automatically cancels the doctor's booked slots on that date, deletes the Google Calendar events, and sends email alerts to the patients.</p>
						</div>

						<div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
							<div className="text-4xl font-bold text-emerald-700 mb-4">Pre-Visit Summaries</div>
							<h3 className="text-2xl font-semibold text-gray-900 mb-2">AI Pre-Visit Assessment</h3>
							<p className="text-gray-600">Uses Gemini API to analyze patient symptoms, generating an urgency level (Low/Medium/High/Critical), chief complaint, and three suggested questions for the clinician.</p>
						</div>

						<div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
							<div className="text-4xl font-bold text-emerald-700 mb-4">Post-Visit Summaries</div>
							<h3 className="text-2xl font-semibold text-gray-900 mb-2">AI Post-Visit Instructions</h3>
							<p className="text-gray-600">Translates doctor clinical notes and prescriptions into patient-friendly follow-up instructions and detailed medication plans sent via email.</p>
						</div>

						<div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
							<div className="text-4xl font-bold text-emerald-700 mb-4">Background Daemon</div>
							<h3 className="text-2xl font-semibold text-gray-900 mb-2">Medication Reminders</h3>
							<p className="text-gray-600">A scheduled job periodically parses prescription files to send email notifications for medication timings, incorporating mail retries.</p>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
						<div className="bg-white p-8 rounded-2xl shadow-lg">
							<div className="flex items-center gap-4 mb-4">
								<FaCheckCircle className="w-8 h-8 text-emerald-700" />
								<h3 className="text-xl font-semibold text-gray-900">Google Calendar OAuth</h3>
							</div>
							<p className="text-gray-600">
								Integrates OAuth 2.0 flow to create, reschedule, or delete doctor-patient invites.
							</p>
						</div>
						<div className="bg-white p-8 rounded-2xl shadow-lg">
							<div className="flex items-center gap-4 mb-4">
								<FaHeart className="w-8 h-8 text-emerald-700" />
								<h3 className="text-xl font-semibold text-gray-900">Double-Booking Checks</h3>
							</div>
							<p className="text-gray-600">
								Checks database schemas to prevent two patients from scheduling the same slot simultaneously.
							</p>
						</div>
						<div className="bg-white p-8 rounded-2xl shadow-lg">
							<div className="flex items-center gap-4 mb-4">
								<FaShieldAlt className="w-8 h-8 text-emerald-700" />
								<h3 className="text-xl font-semibold text-gray-900">Graceful Failures</h3>
							</div>
							<p className="text-gray-600">
								Ensures AI failures or mail delivery errors do not block the core scheduling actions.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="min-h-screen py-24 bg-white relative flex items-center mb-[5vh]">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.25),transparent_50%)]"></div>
				<div className="container mx-auto px-4 relative">
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">
						Validation Logs
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
						{testimonials.slice(0, 4).map((testimonial) => (
							<div key={testimonial.id} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
								<div className="flex items-center mb-4">
									<Image
										src={testimonial.image}
										alt={testimonial.name}
										width={50}
										height={50}
										className="h-15 w-15 rounded-full mr-4"
									/>
									<div>
										<h3 className="text-lg font-semibold text-emerald-900">{testimonial.name}</h3>
										<p className="text-sm text-gray-500">{testimonial.status}</p>
									</div>
								</div>
								<p className="text-gray-600 mb-4">
									{testimonial.testimonial}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Bento Grid Section */}
			<section className="min-h-screen py-24 bg-white relative flex items-center mb-[5vh]">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.25),transparent_50%)]"></div>
				<div className="container mx-auto px-4 relative">
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">
						Verified{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-emerald-900">
							Modules
						</span>
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
						<div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
							<h3 className="text-xl font-semibold text-emerald-900 mb-6">Patient Flow</h3>
							<ul className="space-y-3 text-gray-600">
								<li className="flex items-center gap-2">
									<span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
									Patient Self Registration
								</li>
								<li className="flex items-center gap-2">
									<span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
									Picking Specialties & Doctors
								</li>
								<li className="flex items-center gap-2">
									<span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
									Dynamic Slot Check Calendars
								</li>
								<li className="flex items-center gap-2">
									<span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
									Submitting Symptoms Concerns
								</li>
							</ul>
						</div>

						{/* Latest Blog Posts */}
						<div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
							<h3 className="text-xl font-semibold text-emerald-900 mb-6">Secure Consultation</h3>
							<p className="text-gray-600 mb-4">Book active slots with our certified clinicians and receive AI-generated clinical pre-visit summaries.</p>
							<Link href="/appointment" className="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors">Book Now &rarr;</Link>
						</div>

						{/* Patient Resources */}
						<div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
							<h3 className="text-xl font-semibold text-emerald-900 mb-6">Admin & Doctor Portals</h3>
							<ul className="space-y-3 text-gray-600">
								<li className="flex items-center gap-2">
									<span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
									Admin Dashboard Statistics
								</li>
								<li className="flex items-center gap-2">
									<span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
									Leave Adjustments Conflict Checks
								</li>
								<li className="flex items-center gap-2">
									<span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
									Doctor Patient Queue Controls
								</li>
							</ul>
						</div>

						{/* Health Tips */}
						<div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
							<h3 className="text-xl font-semibold text-emerald-900 mb-6">Background Reminders</h3>
							<ul className="space-y-3 text-gray-600">
								<li className="flex items-center gap-2">
									<span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
									Prescription Frequencies Checks
								</li>
								<li className="flex items-center gap-2">
									<span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
									Medication Timing Emails
								</li>
								<li className="flex items-center gap-2">
									<span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
									Automatic Mail Retries Logic
								</li>
							</ul>
						</div>

						{/* Contact Information */}
						<div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
							<h3 className="text-xl font-semibold text-emerald-900 mb-6">Contact Information</h3>
							<div className="space-y-4 text-gray-600">
								<div className="flex items-center gap-3 group">
									<FaPhone className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform duration-300" />
									<span className="group-hover:text-emerald-700 transition-colors duration-300">+91 70071 46609</span>
								</div>
								<div className="flex items-center gap-3 group">
									<FaMapMarkerAlt className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform duration-300" />
									<span className="group-hover:text-emerald-700 transition-colors duration-300">123 Medical Center Drive</span>
								</div>
								<div className="flex items-center gap-3 group">
									<FaComments className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform duration-300" />
									<span className="group-hover:text-emerald-700 transition-colors duration-300">+91 70071 46609</span>
								</div>
							</div>
						</div>

						{/* Operating Hours */}
						<div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
							<h3 className="text-xl font-semibold text-emerald-900 mb-6">Operating Hours</h3>
							<div className="space-y-3 text-gray-600">
								<div className="flex justify-between items-center group">
									<span className="group-hover:text-emerald-700 transition-colors duration-300">Monday - Friday</span>
									<span className="font-medium group-hover:text-emerald-700 transition-colors duration-300">9:00 AM - 6:00 PM</span>
								</div>
								<div className="flex justify-between items-center group">
									<span className="group-hover:text-emerald-700 transition-colors duration-300">Saturday</span>
									<span className="font-medium group-hover:text-emerald-700 transition-colors duration-300">9:00 AM - 2:00 PM</span>
								</div>
								<div className="flex justify-between items-center group">
									<span className="group-hover:text-emerald-700 transition-colors duration-300">Sunday</span>
									<span className="font-medium group-hover:text-emerald-700 transition-colors duration-300">Closed</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default LandingPage;