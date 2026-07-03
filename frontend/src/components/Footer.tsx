"use client";
import React, { JSX } from 'react';
import Link from 'next/link';

const Footer = (): JSX.Element => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">WellNest</h3>
            <p className="text-sm text-gray-600">
              Providing comprehensive healthcare services for a better tomorrow.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-emerald-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-gray-600 hover:text-emerald-600">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/doctor" className="text-sm text-gray-600 hover:text-emerald-600">
                  Doctors
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-emerald-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-emerald-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-emerald-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-emerald-600">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Contact Us</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-gray-600">
                Email: support@wellnest.com
              </li>
              <li className="text-sm text-gray-600">
                Phone: (555) 123-4567
              </li>
              <li className="text-sm text-gray-600">
                Address: 123 Health Street, Medical City, MC 12345
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} WellNest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;