"use client";
import React, { ChangeEvent, ChangeEventHandler, FormEvent, JSX, useEffect, useState } from 'react';
import Image from 'next/image';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { SignInRequest } from '@/types/type';
import { CodeResponse, useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

type FormErrors = Partial<Record<keyof SignInRequest, string>>;

const LoginForm = (): JSX.Element => {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [loadingGoogle, setLoadingGoogle] = useState<boolean>(false);
	const [formData, setFormData] = useState<SignInRequest>({
		email: '',
		password: '',
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const [role, setRole] = useState<'Patient' | 'Doctor' | 'Admin'>('Patient');

	const { login, isAuthenticated, googleLogin } = useAuth();

	useEffect(() => {
		if (isAuthenticated) {
			toast.error("User already exists");
			router.replace("/");
		}
	}, []);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (loading) {
			return;
		}
		setLoading(true);
		try {
			const success = await login(formData, role);

			if (success) {
				toast.success("Login successful!");
				router.replace('/');
			} else {
				toast.error("Failed to login. Please try again.");
				router.replace('/login');
			}
		} catch (error) {
			toast.error("An error occured. Error: " + error);
			router.replace('/login');
		} finally {
			setLoading(false);
		}
	};

	const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		const { name, value } = e.target;

		const fieldName = name as keyof SignInRequest;

		setFormData(prev => ({
			...prev,
			[fieldName]: value
		}));
		// Clear error when user starts typing
		if (errors[fieldName]) {
			setErrors(prev => ({
				...prev,
				[name]: ''
			}));
		}
	};

	const handleGoogleLoginSuccess = async (codeResponse: CodeResponse) => {
		setLoadingGoogle(true);
		try {
			const success = await googleLogin(codeResponse, role);

			if (success) {
				toast.success("Logged in successfully!");
				router.replace('/');
			} else {
				toast.error("Failed to login by Google. Please try again.");
				router.replace('/login');
			}
		} catch (error) {
			toast.error("Failed to login by Google. Please try again.");
			router.replace('/login');
		} finally {
			setLoadingGoogle(false);
		}
	}

	const handleGoogleLoginError = (errorResponse: Pick<CodeResponse, "error" | "error_description" | "error_uri">) => {
		setLoadingGoogle(false);
		console.error(errorResponse);
		router.replace('/login');
	}

	const handleGoogleAuthentication = useGoogleLogin({
		onSuccess: handleGoogleLoginSuccess,
		onError: handleGoogleLoginError,
		flow: "auth-code"
	});

	return (
		<div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/30 to-emerald-100/30 flex items-center justify-center px-4 py-12 pt-20">
			<div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
				<div className="md:flex md:flex-row-reverse">
					{/* Left side image (hidden on small screens) */}
					<div className="hidden md:block md:w-1/2 relative">
						<Image
							src="/images/login.jpg"
							alt="Care illustration"
							fill
							className="object-cover"
						/>
					</div>
					<div className="w-full md:w-1/2 p-8 space-y-8">
						{/* Logo and Title */}
						<div className="text-center">
							<div className="relative w-24 h-24 mx-auto mb-4">
								<Image
									src="/images/mascot.png"
									alt="WellNest Logo"
									fill
									className="object-contain"
								/>
							</div>
							<h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
							<p className="mt-2 text-sm text-gray-600">
								Sign in to access your WellNest account
							</p>
						</div>

						{/* Role Selection Tabs */}
						<div className="flex bg-gray-100 p-1 rounded-xl">
							{(['Patient', 'Doctor', 'Admin'] as const).map((r) => (
								<button
									key={r}
									type="button"
									onClick={() => setRole(r)}
									className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
										role === r
											? 'bg-white text-emerald-700 shadow-sm border border-gray-200/50'
											: 'text-gray-500 hover:text-gray-800 hover:bg-gray-50/50'
									}`}
								>
									{r}
								</button>
							))}
						</div>

						{/* Login Form */}
						<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
							<div className="space-y-4">
								{/* Email Field */}
								<div>
									<label htmlFor="email" className="block text-sm font-medium text-gray-700">
										Email Address
									</label>
									<div className="mt-1 relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<EnvelopeIcon className="h-5 w-5 text-gray-400" />
										</div>
										<input
											id="email"
											name="email"
											type="email"
											autoComplete="email"
											required
											value={formData.email}
											onChange={handleChange}
											className={`appearance-none block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'
												} rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
											placeholder="Enter your email"
										/>
									</div>
									{errors.email && (
										<p className="mt-1 text-sm text-red-600">{errors.email}</p>
									)}
								</div>

								{/* Password Field */}
								<div>
									<label htmlFor="password" className="block text-sm font-medium text-gray-700">
										Password
									</label>
									<div className="mt-1 relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<LockClosedIcon className="h-5 w-5 text-gray-400" />
										</div>
										<input
											id="password"
											name="password"
											type={showPassword ? "text" : "password"}
											autoComplete="current-password"
											required
											value={formData.password}
											onChange={handleChange}
											className={`appearance-none block w-full pl-10 pr-10 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'
												} rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
											placeholder="Enter your password"
										/>
										<div className="absolute inset-y-0 right-0 pr-3 flex items-center">
											<button
												type="button"
												onClick={() => setShowPassword(!showPassword)}
												className="text-gray-400 cursor-pointer hover:text-gray-500 focus:outline-none"
											>
												{showPassword ? (
													<EyeSlashIcon className="h-5 w-5" />
												) : (
													<EyeIcon className="h-5 w-5" />
												)}
											</button>
										</div>
									</div>
									{errors.password && (
										<p className="mt-1 text-sm text-red-600">{errors.password}</p>
									)}
								</div>
							</div>

							{/* Remember Me and Forgot Password */}
							<div className="flex items-center justify-between">
								<div className="flex items-center">
								</div>
								<div className="text-sm">
									<a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
										Forgot your password?
									</a>
								</div>
							</div>

							{/* Submit Button */}
							<div>
								<button
									type="submit"
									className="w-full cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-300"
								>
									{!loading ? 'Sign in' : 'Signing in..'}
								</button>
							</div>

							{/* Divider + Continue with Google */}
							{role !== "Admin" && (
								<div className="mt-4">
									<div className="relative">
										<div className="absolute inset-0 flex items-center">
											<div className="w-full border-t border-gray-200" />
										</div>
										<div className="relative flex justify-center text-sm">
											<span className="bg-white px-2 text-gray-500">Or continue with</span>
										</div>
									</div>

									<div className="mt-4">
										<button
											type="button"
											onClick={handleGoogleAuthentication}
											disabled={loadingGoogle}
											aria-label="Continue with Google"
											className="w-full cursor-pointer disabled:cursor-not-allowed inline-flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
										>
											<svg className="h-5 w-5 mr-2" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" aria-hidden>
												<path fill="#4285F4" d="M533.5 278.4c0-17.3-1.6-34-4.7-50.2H272v95.1h147.1c-6.3 34.1-25 62.9-53.6 82.2v68.2h86.6c50.6-46.6 81.4-115.4 81.4-190.3z" />
												<path fill="#34A853" d="M272 544.3c72.6 0 133.6-23.9 178.2-64.9l-86.6-68.2c-24.1 16.2-55 25.7-91.6 25.7-70.3 0-130-47.5-151.4-111.3H31.1v69.8C75.2 479.8 166.9 544.3 272 544.3z" />
												<path fill="#FBBC05" d="M120.6 328.6c-10.8-32.5-10.8-67.9 0-100.4V158.4H31.1c-39.5 76.6-39.5 167.8 0 244.4l89.5-74.2z" />
												<path fill="#EA4335" d="M272 109.8c38.6 0 73.3 13.3 100.6 35.2l75.3-75.3C405.9 30.1 344.9 0 272 0 166.9 0 75.2 64.5 31.1 158.4l89.5 69.9C142 157.3 201.7 109.8 272 109.8z" />
											</svg>
											<span className="text-sm font-medium text-gray-700">{loadingGoogle ? 'Redirecting...' : 'Continue with Google'}</span>
										</button>
									</div>
								</div>
							)}
						</form>

						{/* Sign Up Link */}
						<div className="text-center mt-6">
							<p className="text-sm text-gray-600">
								Don&apos;t have an account?{' '}
								<a href="/register" className="font-medium text-emerald-600 hover:text-emerald-500">
									Sign up
								</a>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LoginForm;