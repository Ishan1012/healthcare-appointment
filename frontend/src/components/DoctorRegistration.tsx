'use client';
import { registerDoctorApi } from '@/apis/apis';
import { useAuth } from '@/context/AuthContext';
import { DoctorFormData } from '@/types/type';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, ChangeEventHandler, FormEvent, JSX, useState } from 'react';
import { toast } from 'sonner';

const DoctorRegistration = (): JSX.Element => {
    const [formData, setFormData] = useState<DoctorFormData>({
        detailsComplete: true,
        specialty: '',
        qualifications: '',
        address: '',
        phone: '',
        experience: '',
        profileUrl: null,
        availability: [],
        timeSlots: [],
        lat: 0,
        lng: 0,
        notifications: {
            appointmentReminders: true,
            healthTips: false,
            promotionalUpdates: false,
        },
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const { logout } = useAuth();
    const router = useRouter();

    const specialties: string[] = [
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
        'Other'
    ];

    const daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeSlotsAvailable: string[] = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
    ];

    const handleInputChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> = (e) => {
        const { name, value, type } = e.target;
        const target = e.target as HTMLInputElement;

        if (type === 'checkbox') {
            const checked = target.checked;

            if (name.startsWith('notifications.')) {
                const notificationKey = name.split('.')[1] as keyof typeof formData.notifications;
                setFormData(prev => ({
                    ...prev,
                    notifications: {
                        ...prev.notifications,
                        [notificationKey]: checked
                    }
                }));
            } else if (name === 'timeSlots') {
                setFormData(prev => ({
                    ...prev,
                    timeSlots: checked
                        ? [...prev.timeSlots, value]
                        : prev.timeSlots.filter(item => item !== value)
                }));
            } else if (name === 'availability') {
                setFormData(prev => ({
                    ...prev,
                    availability: checked
                        ? [...prev.availability, value]
                        : prev.availability.filter(item => item !== value)
                }));
            }
        } else if (name === 'lat' || name === 'lng' || name === 'experience') {
            setFormData(prev => ({
                ...prev,
                [name]: parseFloat(value) || 0
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setImagePreview(result);
                setBase64Image(result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
            setBase64Image(null);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let dataForSubmission: DoctorFormData;

        if (base64Image) {
            dataForSubmission = {
                ...formData,
                profileUrl: base64Image
            };
        } else {
            dataForSubmission = {
                ...formData,
            };
        }

        try {
            const response = await registerDoctorApi(dataForSubmission);

            if (response.data.success) {
                toast.success("Registration completed successfully!");

                router.replace('/profile');
            } else {
                toast.error("Failed to register. Please try again.");
            }
        } catch (error) {
            const errorMessage = String(error);

            if (errorMessage.includes("Patient Id not found")) {
                logout();
                router.replace('/login');
                toast.error("Session expired. Please log in again.");
            } else {
                console.error(error);
                toast.error("An error occurred: " + errorMessage);
            }
        }
    };

    return (
        <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-white to-green-50 pt-20 pb-20">
            <div className="max-w-4xl mx-auto animate-[fadeInUp_0.8s_ease-out]">

                <div className="text-center mb-8">
                    <div className="w-26 h-26 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-lg bg-transparent">
                        <div className="h-auto w-15 relative">
                            <Image src={'/images/mascot.png'} height={500} width={500} alt='hero' className='h-auto w-15' />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-emerald-900 mb-3 tracking-tight">Doctor Registration</h1>
                    <p className="text-emerald-800/80 text-lg">Join our healthcare platform and connect with patients</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl p-6 md:p-8 shadow-xl shadow-emerald-500/10 border border-emerald-100"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        <div className="space-y-6">
                            {/* Medical Specialty Select */}
                            <div>
                                <label htmlFor="specialty" className="block text-sm font-semibold text-emerald-900 mb-2">Medical Specialty *</label>
                                <select
                                    name="specialty"
                                    id="specialty"
                                    value={formData.specialty}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 bg-gray-50 
                                        focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10"
                                    required
                                >
                                    <option value="">Select your specialty</option>
                                    {specialties.map(specialty => (
                                        <option key={specialty} value={specialty}>{specialty}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Qualifications Input */}
                            <div>
                                <label htmlFor="qualifications" className="block text-sm font-semibold text-emerald-900 mb-2">Qualifications (e.g., MBBS, MD) *</label>
                                <input
                                    type="text"
                                    name="qualifications"
                                    id="qualifications"
                                    value={formData.qualifications}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 bg-gray-50 
                                        focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10"
                                    placeholder="MBBS, MD (Medicine)"
                                    required
                                />
                            </div>

                            {/* Experience Input */}
                            <div>
                                <label htmlFor="experience" className="block text-sm font-semibold text-emerald-900 mb-2">Years of Experience *</label>
                                <input
                                    type="number"
                                    name="experience"
                                    id="experience"
                                    value={formData.experience.toString()}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 bg-gray-50 
                                        focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10"
                                    placeholder="15"
                                    required
                                />
                            </div>

                            {/* Phone Input */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-semibold text-emerald-900 mb-2">Contact Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 bg-gray-50 
                                        focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10"
                                    placeholder="+1 555 123 4567"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-6">

                            {/* Profile Image Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-emerald-900 mb-2">Profile Image</label>
                                <div
                                    className="border-2 border-dashed border-emerald-500 rounded-xl p-8 text-center cursor-pointer bg-green-50 hover:bg-green-100"
                                    onClick={() => {
                                        const input = document.getElementById('image-input');
                                        if (input) input.click();
                                    }}
                                >
                                    <input
                                        id="image-input"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-28 h-28 rounded-full object-cover border-4 border-emerald-500 mx-auto"
                                        />
                                    ) : (
                                        <div className="py-4">
                                            <div className="text-4xl mb-4">📷</div>
                                            <p className="text-emerald-800 font-medium">Click to upload profile image</p>
                                            <p className="text-sm text-emerald-600 mt-2">PNG, JPG up to 5MB</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Address Input */}
                            <div>
                                <label htmlFor="address" className="block text-sm font-semibold text-emerald-900 mb-2">Clinic/Practice Address *</label>
                                <input
                                    type="text"
                                    name="address"
                                    id="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 bg-gray-50 
                                        focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10"
                                    placeholder="123 Health Blvd, City, Country"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Latitude Input */}
                                <div>
                                    <label htmlFor="lat" className="block text-sm font-semibold text-emerald-900 mb-2">Latitude (Map Location) *</label>
                                    <input
                                        type="number"
                                        name="lat"
                                        id="lat"
                                        value={formData.lat.toString()}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 bg-gray-50 
                                            focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10"
                                        placeholder="34.0522"
                                        required
                                    />
                                </div>

                                {/* Longitude Input */}
                                <div>
                                    <label htmlFor="lng" className="block text-sm font-semibold text-emerald-900 mb-2">Longitude (Map Location) *</label>
                                    <input
                                        type="number"
                                        name="lng"
                                        id="lng"
                                        value={formData.lng.toString()}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 bg-gray-50 
                                            focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10"
                                        placeholder="-118.2437"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 space-y-8">
                        <div>
                            <label className="block text-sm font-semibold text-emerald-900 mb-3">Days of Availability *</label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
                                {daysOfWeek.map(day => (
                                    <label key={day} className={`flex items-center justify-center space-x-2 cursor-pointer p-2 rounded-lg border transition-colors ${formData.availability.includes(day) ? 'bg-emerald-100 border-emerald-500 text-emerald-800' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-green-50'}`}>
                                        <input
                                            type="checkbox"
                                            name="availability"
                                            value={day}
                                            checked={formData.availability.includes(day)}
                                            onChange={handleInputChange}
                                            className="hidden"
                                        />
                                        <span className="text-xs font-medium">{day}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-emerald-900 mb-3">Available Time Slots *</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                {timeSlotsAvailable.map(timeSlot => (
                                    <label key={timeSlot} className={`flex items-center justify-center space-x-2 cursor-pointer p-2 rounded-lg border transition-colors ${formData.timeSlots.includes(timeSlot) ? 'bg-emerald-100 border-emerald-500 text-emerald-800' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-green-50'}`}>
                                        <input
                                            type="checkbox"
                                            name="timeSlots"
                                            value={timeSlot}
                                            checked={formData.timeSlots.includes(timeSlot)}
                                            onChange={handleInputChange}
                                            className="hidden"
                                        />
                                        <span className="text-xs font-medium">{timeSlot}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-10">
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 
                text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 
                hover:shadow-xl hover:shadow-emerald-500/25 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 cursor-pointer"
                        >
                            Complete Registration
                        </button>
                        <p className="text-sm text-emerald-600/70 mt-4">
                            By registering, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorRegistration;