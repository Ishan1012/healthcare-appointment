"use client";
import React, { JSX, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { values } from '../data/getValues';
import {
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import getTestimonials from '../context/FeedbackContext';
import LoadingSpinner from './LoadingPage';
import FeedbackForm from '../components/FeedbackForm';
import { Testimonial } from '@/types/type';

const AboutPage = (): JSX.Element => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    const fetchTestimonials = async (): Promise<void> => {
      const data = await getTestimonials();
      setTestimonials(data);
    }

    fetchTestimonials();
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30 pt-15">
      {/* Hero Section */}
      <div className="relative bg-emerald-600 text-white py-20">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">About WellNest</h1>
            <p className="text-xl text-emerald-50">
              Providing exceptional healthcare with compassion, innovation, and excellence.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] rounded-2xl overflow-hidden">
            <Image
              src="/images/hero-image2.png"
              alt="WellNest Mission"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission & Vision</h2>
            <p className="text-gray-600 mb-6">
              At WellNest, our mission is to provide exceptional healthcare services that improve the quality of life for our patients.
              We combine cutting-edge medical technology with compassionate care to ensure the best possible outcomes.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-6 h-6 text-emerald-600 mt-1" />
                <p className="text-gray-600">Patient-centered care approach</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-6 h-6 text-emerald-600 mt-1" />
                <p className="text-gray-600">Continuous medical innovation</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-6 h-6 text-emerald-600 mt-1" />
                <p className="text-gray-600">Community health improvement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values && values.length > 0 && values.map((value) => {
            const Icon = value.icon;
            return (
              <div key={value.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <Icon className="w-12 h-12 text-emerald-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Testimonials Section */}
      <section className="min-h-screen py-24 bg-white relative flex items-center mb-[5vh]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.25),transparent_50%)]"></div>
        <div className="container mx-auto px-4 relative">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">
            What Our Patients Say
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


      {/* Feedback Form Section */}
      <FeedbackForm />

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join Our Medical Family</h2>
          <p className="text-emerald-50 mb-8 max-w-2xl mx-auto">
            Experience healthcare excellence with our team of dedicated professionals.
            We&apos;re here to provide you with the best medical care and support.
          </p>
          <Link href="/appointment" passHref>
            <button className="px-8 py-3 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-colors duration-300 cursor-pointer">
              Book an Appointment
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;