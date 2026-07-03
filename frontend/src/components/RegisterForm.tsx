"use client";
import React, { ChangeEventHandler, FormEvent, JSX, useState } from 'react';
import Image from 'next/image';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { SignUpRequest } from '@/types/type';
import { toast } from 'sonner';
import { CodeResponse, useGoogleLogin } from '@react-oauth/google';

type RegisterFormProps = {
  userType?: string;
};

type FormDataRegister = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType?: string;
};

type FormErrors = Partial<Record<keyof FormDataRegister, string>>;

const RegisterForm = ({ userType }: RegisterFormProps): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormDataRegister>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const { signup, googleLogin } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: SignUpRequest = { role: userType || "Patient", name: formData.name, email: formData.email, password: formData.password };
    try {
      const response = await signup(data);

      if (response) {
        toast.success("User signed up successfully!");

        router.replace('/');
      } else {
        toast.error("Failed to signup. Please try again.");
        router.replace('/register');
      }
    } catch (error) {
      toast.error("An error occured. Error: " + error);
      router.replace('/register');
    }
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;

    const fieldName = name as keyof FormDataRegister;

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
      if (!userType) {
        console.log('no usertype: ' + userType);
        return;
      }
      const success = await googleLogin(codeResponse, userType);

      if (success) {
        toast.success('User created successfully!');

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
              src="/images/register.jpg"
              alt="Register illustration"
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
              <h2 className="text-3xl font-bold text-gray-900">Create Your Account</h2>
              <p className="mt-2 text-sm text-gray-600">
                Join WellNest for comprehensive healthcare services
              </p>
            </div>

            {/* Signup Form */}
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:pl-5 placeholder:pt-2"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email */}
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
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:pl-5 placeholder:pt-2"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password */}
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
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:pl-5 placeholder:pt-2"
                    placeholder="Create a password"
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
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:pl-5 placeholder:pt-2"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-300"
                >
                  Create Account
                </button>
              </div>

              {/* Divider + Continue with Google */}
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
                    <span className="text-sm font-medium text-gray-700">Continue with Google</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;