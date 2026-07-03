'use client';
import { registerPatientApi } from '@/apis/apis';
import { useAuth } from '@/context/AuthContext';
import { PatientFormData } from '@/types/type';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FC, FormEvent, JSX, useState } from 'react';
import { toast } from 'sonner';

const PatientRegistration = (): JSX.Element => {
    const [formData, setFormData] = useState<PatientFormData>({
        detailsComplete: true,
        profileUrl: null,
        age: 0,
        phone: '',
        isPhoneVerified: false,
        address: '',
    });

    const { logout } = useAuth();
    const router = useRouter();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const target = e.target as HTMLInputElement;

        if (type === 'checkbox') {
            const checked = target.checked;
            if (name === 'isPhoneVerified') {
                setFormData(prev => ({
                    ...prev,
                    [name]: checked
                }));
            }
        } else if (name === 'age') {
            setFormData(prev => ({
                ...prev,
                [name]: parseInt(value) || 0
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
        let dataForSubmission: PatientFormData;

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
            const response = await registerPatientApi(dataForSubmission);

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
                    <h1 className="text-3xl font-bold text-emerald-900 mb-3 tracking-tight">Patient Registration</h1>
                    <p className="text-emerald-800/80 text-lg">Tell us a little about yourself to complete your profile</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl p-6 md:p-8 shadow-xl shadow-emerald-500/10 border border-emerald-100"
                >
                    <div className="grid grid-cols-1 gap-8">
                        <div className="space-y-6">

                            {/* Age Input */}
                            <div>
                                <label htmlFor="age" className="block text-sm font-semibold text-emerald-900 mb-2">Your Age *</label>
                                <input
                                    type="number"
                                    name="age"
                                    id="age"
                                    value={formData.age.toString()}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 bg-gray-50 
                                        focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10"
                                    placeholder="30"
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

                            {/* Address Input */}
                            <div>
                                <label htmlFor="address" className="block text-sm font-semibold text-emerald-900 mb-2">Current Address *</label>
                                <input
                                    type="text"
                                    name="address"
                                    id="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 bg-gray-50 
                                        focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10"
                                    placeholder="123 Main Street, City, Country"
                                    required
                                />
                            </div>

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
                                    {(imagePreview || (typeof formData.profileUrl === 'string' && formData.profileUrl)) ? (
                                        <img
                                            src={imagePreview || (typeof formData.profileUrl === 'string' ? formData.profileUrl : '')}
                                            alt="Preview"
                                            className="w-28 h-28 rounded-full object-cover border-4 border-emerald-500 mx-auto"
                                        />
                                    ) : (
                                        <div className="py-4">
                                            <div className="text-4xl mb-4">📷</div>
                                            <p className="text-emerald-800 font-medium">Click to upload profile image</p>
                                            <p className="text-sm text-emerald-600 mt-2">PNG, JPG up to 5MB (Optional)</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Checkbox */}
                            <div className="flex items-center space-x-3 pt-2">
                                <input
                                    type="checkbox"
                                    name="isPhoneVerified"
                                    checked={formData.isPhoneVerified}
                                    onChange={handleInputChange}
                                    className="h-5 w-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                    id="isPhoneVerified"
                                />
                                <label htmlFor="isPhoneVerified" className="text-sm font-medium text-emerald-900 cursor-pointer">
                                    I confirm my phone number is verified (e.g., via SMS code)
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-10">
                        <button
                            type="submit"
                            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 
                text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 
                hover:shadow-xl hover:shadow-emerald-500/25 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 cursor-pointer"
                        >
                            Complete Profile
                        </button>
                        <p className="text-sm text-emerald-600/70 mt-4">
                            By completing your profile, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PatientRegistration;