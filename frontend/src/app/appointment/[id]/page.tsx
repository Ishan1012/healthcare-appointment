'use client';
import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';
import React, { useEffect, useState } from 'react';
import { AppointmentDetails } from '@/types/type';
import { toast } from 'sonner';
import { getAppointmentApi } from '@/apis/apis';
import LoadingSpinner from '@/page-components/LoadingPage';
import { useParams } from 'next/navigation';

const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const AppointmentDescription = dynamic(() => import("@/components/AppointmentDescription"), { ssr: false });

export default function AppointmentDetailsPage() {
	const params = useParams();
	const [appointment, setAppointment] = useState<Omit<AppointmentDetails, 'id'> & { status: string } | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const id = params?.id as string;

	useEffect(() => {
		const fetchAppointment = async () => {
			try {
				const response = await getAppointmentApi(id);

				setAppointment(response.data.appointment as Omit<AppointmentDetails, 'id'> & { status: string });
			} catch (error) {
				console.error(String(error))
				toast.error(String(error));
			} finally {
				setLoading(false);
			}
		};

		fetchAppointment();
	}, []);

	if (loading) {
		return <LoadingSpinner />;
	}

	if (!appointment) {
		return (
			<>
				<Header />
				<div className="min-h-screen bg-slate-50 flex items-center justify-center">
					<p className="text-xl text-slate-600">Could not load appointment.</p>
				</div>
				<Footer />
			</>
		);
	}

	return (
		<>
			<Header />
			<AppointmentDescription details={appointment} />
			<Footer />
		</>
	);
}
