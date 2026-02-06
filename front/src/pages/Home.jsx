import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { PhoneCall, ShieldAlert, Truck, Activity } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  // Animation variants for reusability
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-red-100">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-white pt-20 pb-16 lg:pt-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium leading-6 text-green-700 ring-1 ring-inset ring-green-700/10 bg-green-50 mb-6"
          >
            <Activity className="w-4 h-4 mr-2" />
            Reliable Health Access 24/7
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold tracking-tight sm:text-6xl text-slate-900 max-w-3xl"
          >
            Health Access & <span className="text-red-600">Emergency</span> Response
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-slate-600 max-w-2xl"
          >
            Fast, voice-based health triage connecting communities to care in minutes. 
            No waiting on hold. No complicated apps. Just a phone call when it matters most.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10"
          >
            <button
              onClick={() => navigate("/call-me")}
              className="group relative flex items-center justify-center gap-x-2 rounded-full bg-red-600 px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-red-700 hover:scale-105 transition-all duration-300 active:scale-95"
            >
              <PhoneCall className="w-5 h-5 animate-bounce" />
              Request a Call Now
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. THE STORY SECTION (Using your images) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Part 1: The Problem */}
          <motion.div {...fadeInUp} className="flex flex-col md:flex-row items-center gap-12 mb-32">
            <div className="flex-1">
              <img 
                src="/patient.jpg" 
                alt="Frustrated Patient" 
                className="rounded-2xl shadow-2xl border-4 border-white transform -rotate-2 hover:rotate-0 transition-transform duration-500"
              />
            </div>
            <div className="flex-1 space-y-4 text-center md:text-left">
              <h2 className="text-3xl font-bold text-slate-800 italic">The Old Way is Broken</h2>
              <p className="text-slate-600 text-lg">
                Traditional healthcare waiting lines are long and stressful. When you're sick, 
                the last thing you want is to navigate complex websites or wait hours for a response.
              </p>
            </div>
          </motion.div>

          {/* Part 2: The Solution */}
          <motion.div {...fadeInUp} className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="flex-1">
              <img 
                src="/call.jpg" 
                alt="Patient getting help via call" 
                className="rounded-2xl shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500"
              />
            </div>
            <div className="flex-1 space-y-4 text-center md:text-left">
              <h2 className="text-3xl font-bold text-green-700">A Faster Human Connection</h2>
              <p className="text-slate-600 text-lg">
                Enter your number and <strong>your phone rings instantly</strong>. Speak to an AI triage 
                specialist who understands your needs and routes you to the right care immediately.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 3. HOW IT WORKS (THE WORKFLOW) */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Real-Time Escalation</h2>
            <p className="mt-4 text-slate-400">What happens when things get serious?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div whileHover={{ y: -10 }} className="text-center p-6 bg-slate-800 rounded-2xl border border-slate-700">
              <div className="mx-auto w-12 h-12 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center mb-4">
                <PhoneCall />
              </div>
              <h3 className="font-bold text-xl mb-2">1. Quick Call</h3>
              <p className="text-slate-400">Key in your number. Our system calls you back within seconds.</p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="text-center p-6 bg-slate-800 rounded-2xl border border-slate-700">
              <div className="mx-auto w-12 h-12 bg-red-500/10 text-red-400 rounded-lg flex items-center justify-center mb-4">
                <ShieldAlert />
              </div>
              <h3 className="font-bold text-xl mb-2">2. Hospital Alert</h3>
              <p className="text-slate-400">If risk escalates, partner hospitals are notified in real-time.</p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="text-center p-6 bg-slate-800 rounded-2xl border border-slate-700">
              <div className="mx-auto w-12 h-12 bg-green-500/10 text-green-400 rounded-lg flex items-center justify-center mb-4">
                <Truck />
              </div>
              <h3 className="font-bold text-xl mb-2">3. Emergency Dispatch</h3>
              <p className="text-slate-400">Ambulances are dispatched automatically to your GPS location.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <footer className="py-20 text-center border-t border-slate-200">
        <h2 className="text-2xl font-bold mb-6">Ready to prioritize your health?</h2>
        <button
          onClick={() => navigate("/call-me")}
          className="bg-slate-900 text-white px-10 py-3 rounded-full font-semibold hover:bg-slate-800 transition-colors"
        >
          Get Started
        </button>
      </footer>
    </div>
  );
}