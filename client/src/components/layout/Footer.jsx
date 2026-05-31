import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-brand-900 to-brand-800 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Logo & Description */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <Calendar className="w-8 h-8 text-orange-400" />
                            <span className="text-2xl font-bold">EventHub</span>
                        </div>
                        <p className="text-orange-200 text-sm leading-relaxed">
                            Your one-stop platform for discovering and booking amazing events.
                            Concerts, conferences, sports, and more — all in one place.
                        </p>
                        {/* Social Media */}
                        <div className="flex space-x-4 mt-4">
                            <a href="#" className="text-orange-300 hover:text-white transition text-sm font-semibold">
                                Facebook
                            </a>
                                <a href="#" className="text-orange-300 hover:text-white transition text-sm font-semibold">
                                Twitter
                            </a>
                                <a href="#" className="text-orange-300 hover:text-white transition text-sm font-semibold">
                                Instagram
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-orange-300">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-orange-200 hover:text-white text-sm transition">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/events" className="text-orange-200 hover:text-white text-sm transition">
                                    Events
                                </Link>
                            </li>
                            <li>
                                <Link to="/my-bookings" className="text-orange-200 hover:text-white text-sm transition">
                                    My Bookings
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="text-orange-200 hover:text-white text-sm transition">
                                    Register
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-orange-300">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-orange-200 text-sm">
                                <Mail className="w-4 h-4" />
                                support@eventhub.com
                            </li>
                            <li className="flex items-center gap-2 text-orange-200 text-sm">
                                <Phone className="w-4 h-4" />
                                +1 234 567 890
                            </li>
                            <li className="flex items-center gap-2 text-orange-200 text-sm">
                                <MapPin className="w-4 h-4" />
                                New York, USA
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t theme-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-orange-300 text-sm">
                        © 2024 EventHub. All rights reserved.
                    </p>
                    <div className="flex space-x-4 mt-2 md:mt-0">
                        <a href="#" className="text-orange-300 hover:text-white text-sm transition">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-orange-300 hover:text-white text-sm transition">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;