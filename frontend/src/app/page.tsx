"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { authUtils } from '../utils/auth';
import { User } from '../types';
import UserBadge from '../components/Common/UserBadge';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setMounted(true);
    if (authUtils.isAuthenticated()) {
      const savedUser = localStorage.getItem('user_profile');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
              <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-800">TaskReminder</span>
          </div>
          
          <div className="flex items-center space-x-6">
            {user ? (
              <UserBadge user={user} onLogout={() => setUser(null)} />
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Log in</Link>
                <Link href="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-md shadow-indigo-50">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-8">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest px-1">Introducing v2.0</span>
            <span className="w-1 h-1 bg-indigo-300 rounded-full mx-2"></span>
            <span className="text-xs text-indigo-500 font-medium tracking-tight">Focus-driven reminders are here</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-8 leading-[1.1]">
            Stop saving items for a <br className="hidden md:block" />
            <span className="text-indigo-600">"later" that never comes.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
            Attach YouTube videos, articles, and documents to smart schedules. We ensure you revisit your saved content exactly when you have the time to engage.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href={user ? "/dashboard" : "/register"} className="w-full sm:w-auto bg-slate-900 text-white px-10 py-4 rounded-2xl text-base font-bold shadow-2xl hover:bg-slate-800 hover:-translate-y-1 transition-all">
              {user ? "Go to Dashboard" : "Get Started for Free"}
            </Link>
            <Link href="#features" className="w-full sm:w-auto bg-white text-slate-600 px-10 py-4 rounded-2xl text-base font-bold border border-slate-200 hover:bg-slate-50 transition-all">
              See How it Works
            </Link>
          </div>

          {/* Interactive Feature Demo */}
          <div className="mt-20 relative max-w-5xl mx-auto group">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
              <div className="flex flex-col lg:flex-row h-[600px]">
                {/* Sidebar Preview */}
                <div className="w-full lg:w-64 bg-slate-50 border-r border-slate-100 p-6 hidden lg:flex flex-col">
                    <div className="flex items-center space-x-2 mb-10">
                        <div className="w-6 h-6 bg-indigo-600 rounded shadow-sm"></div>
                        <div className="h-4 w-24 bg-slate-200 rounded"></div>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`h-10 rounded-lg flex items-center px-3 ${i === 1 ? 'bg-white shadow-sm' : ''}`}>
                                <div className="w-4 h-4 bg-slate-200 rounded mr-3"></div>
                                <div className={`h-3 bg-slate-200 rounded ${i === 1 ? 'w-24' : 'w-20'}`}></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main View Preview */}
                <div className="flex-grow flex flex-col p-8">
                    <div className="flex items-center justify-between mb-10">
                        <div className="text-left">
                            <div className="h-6 w-32 bg-slate-200 rounded mb-2"></div>
                            <div className="h-4 w-48 bg-slate-100 rounded"></div>
                        </div>
                        <div className="h-10 w-32 bg-indigo-600 rounded-xl"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Task Item 1 */}
                        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-start space-x-4">
                            <div className="w-6 h-6 rounded-md border-2 border-indigo-100 flex-shrink-0"></div>
                            <div className="flex-grow text-left">
                                <div className="h-4 w-full bg-slate-100 rounded mb-3"></div>
                                <div className="flex space-x-2">
                                    <div className="h-5 w-16 bg-indigo-50 rounded-full"></div>
                                    <div className="h-5 w-20 bg-emerald-50 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        {/* Task Item 2 */}
                        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-start space-x-4">
                            <div className="w-6 h-6 rounded-md border-2 border-indigo-100 flex-shrink-0"></div>
                            <div className="flex-grow text-left">
                                <div className="h-4 w-3/4 bg-slate-100 rounded mb-3"></div>
                                <div className="flex space-x-2">
                                    <div className="h-5 w-24 bg-amber-50 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        {/* Task Item 3 */}
                        <div className="p-5 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100 flex items-start space-x-4 transform lg:-translate-y-4">
                            <div className="w-6 h-6 rounded-md border-2 border-indigo-400 flex-shrink-0 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <div className="flex-grow text-left">
                                <div className="h-4 w-5/6 bg-indigo-400/50 rounded mb-3"></div>
                                <div className="flex space-x-2">
                                    <div className="h-5 w-20 bg-indigo-500 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        {/* Task Item 4 */}
                        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-start space-x-4">
                            <div className="w-6 h-6 rounded-md border-2 border-indigo-100 flex-shrink-0"></div>
                            <div className="flex-grow text-left">
                                <div className="h-4 w-4/6 bg-slate-100 rounded mb-3"></div>
                                <div className="flex space-x-2">
                                    <div className="h-5 w-16 bg-indigo-50 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Visualization */}
                    <div className="mt-12 text-left">
                        <div className="h-5 w-40 bg-slate-200 rounded mb-6"></div>
                        <div className="flex space-x-4 overflow-hidden">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="flex-shrink-0 w-40 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                    <div className="h-3 w-20 bg-slate-200 rounded mb-3"></div>
                                    <div className="h-8 w-full bg-white rounded-lg border border-slate-100 shadow-sm"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="py-32 border-t border-slate-50 bg-slate-50/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                title: "Route-Based Focus", 
                desc: "Navigate seamlessly between your dashboard, schedule, and settings with a modern, shareable URL structure.", 
                icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              },
              { 
                title: "One-Click Creation", 
                desc: "Use our floating action button from anywhere to quickly save links, videos, or notes without leaving your flow.", 
                icon: "M12 6v6m0 0v6m0-6h6m-6 0H6" 
              },
              { 
                title: "Personalized Settings", 
                desc: "Manage your profile and notification preferences in a dedicated settings area designed for clarity.", 
                icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
              }
            ].map((f, i) => (
              <div key={i} className="group p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={f.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-slate-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2 text-slate-400">
            <div className="w-5 h-5 bg-slate-100 rounded flex items-center justify-center grayscale">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-tight">TaskReminder</span>
          </div>
          <p className="text-slate-400 text-sm font-medium italic">Build your second brain, with discipline.</p>
        </div>
      </footer>
    </div>
  );
}
