import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight">TaskReminder</span>
        </div>
        <div className="space-x-4">
          <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">Log in</Link>
          <Link href="/register" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition-all">Sign up Free</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          Save Now. <span className="text-indigo-600">Actually</span> Act Later.
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
          The "saved but forgotten" problem is over. Attach YouTube videos, articles, and documents to smart reminders that find you at the right time.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/register" className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl hover:bg-indigo-700 hover:-translate-y-1 transition-all">
            Get Started for Free
          </Link>
          <Link href="#features" className="w-full sm:w-auto bg-gray-50 text-gray-700 px-8 py-4 rounded-xl text-lg font-bold border border-gray-200 hover:bg-gray-100 transition-all">
            See How it Works
          </Link>
        </div>

        {/* Mockup / Visual */}
        <div className="mt-20 relative max-w-5xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25"></div>
          <div className="relative bg-gray-50 border border-gray-100 rounded-2xl shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center text-gray-400">
            <span className="font-medium italic">Application Dashboard Preview</span>
          </div>
        </div>
      </main>

      {/* Features */}
      <section id="features" className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Built for Modern Content Consumers</h2>
            <p className="mt-4 text-lg text-gray-600">Everything you need to regain control over your digital life.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Smart Scheduling", desc: "Attach content to specific time slots or recurring routines.", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
              { title: "Deep Organization", desc: "Use categories and tags to keep your learning path clean.", icon: "M7 7h.01M7 11h.01M7 15h.01M13 7h.01M13 11h.01M13 15h.01M17 7h.01M17 11h.01M17 15h.01" },
              { title: "Real-time Alerts", desc: "Browser and push notifications ensure you never miss a beat.", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" }
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={f.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2026 TaskReminder. Built for the disciplined mind.</p>
        </div>
      </footer>
    </div>
  );
}
