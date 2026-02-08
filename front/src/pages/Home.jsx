import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { PhoneCall, ShieldAlert, Truck, Activity, HeartPulse, Clock, MapPin } from "lucide-react";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-red-50/30 pt-20 pb-32 lg:pt-32">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-red-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800 mb-6"
          >
            <Activity className="w-5 h-5" />
            24/7 Health Access – No Apps Needed
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6"
          >
            Instant Voice <span className="text-red-600">Emergency</span> & Health Triage
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Just dial or request a call — get immediate triage, guidance, and escalation to hospitals or ambulances when it matters most.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <button
              onClick={() => navigate("/call-me")}
              className="group relative px-10 py-5 bg-red-600 text-white text-xl font-bold rounded-full shadow-2xl hover:bg-red-700 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <PhoneCall className="w-6 h-6 animate-pulse" />
              Request Emergency Call
            </button>

            {/* <button
              onClick={() => navigate("/learn-more")}
              className="px-10 py-5 bg-white text-green-700 border-2 border-green-600 text-xl font-semibold rounded-full hover:bg-green-50 transition-all duration-300"
            >
              Learn How It Works
            </button> */}
          </motion.div>

          {/* Trust Signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-16 flex flex-wrap justify-center gap-10 text-sm text-gray-600"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-green-600" />
              <span>End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span>Response in 30 seconds</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <span>GPS-Enabled Escalation</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Problem → Solution Storytelling */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Healthcare Shouldn't Be Complicated
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Long queues, missed calls, confusing apps — we built a simpler way.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Problem */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="inline-block bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
                The Old Way
              </div>
              <h3 className="text-3xl font-bold text-gray-900">
                Waiting Can Cost Lives
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                In emergencies, every minute matters. Traditional systems force patients to wait on hold, navigate apps, or travel long distances — often too late.
              </p>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 text-xl">×</span>
                  <span>Average wait time: 20–60 minutes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 text-xl">×</span>
                  <span>Language barriers and tech access issues</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 text-xl">×</span>
                  <span>No real-time escalation to ambulances</span>
                </li>
              </ul>
            </motion.div>

            {/* Solution */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="inline-block bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                The Eldo Care Way
              </div>
              <h3 className="text-3xl font-bold text-gray-900">
                Instant Voice-Powered Help
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Request a call — your phone rings immediately. Speak naturally. Get triaged by AI, guided, and escalated to hospitals or ambulances in seconds.
              </p>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <span>No app or internet required</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <span>Works in any language</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 text-xl">✓</span>
                  <span>Automatic GPS-triggered ambulance dispatch</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section className="py-24 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How Eldo Care Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From your phone call to emergency response — in minutes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <PhoneCall className="w-12 h-12 text-green-600" />,
                title: "Request a Call",
                desc: "Enter your number or dial our toll-free line. We call you back instantly — no app needed."
              },
              {
                icon: <HeartPulse className="w-12 h-12 text-red-600" />,
                title: "AI-Powered Triage",
                desc: "Describe your symptoms in any language. Our AI assesses urgency and gives immediate guidance."
              },
              {
                icon: <Truck className="w-12 h-12 text-green-600" />,
                title: "Rapid Escalation",
                desc: "High-risk cases trigger real-time alerts to hospitals and ambulances with your GPS location."
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="mb-6 transform group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Final CTA */}
      <section className="py-24 bg-green-700 text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-8"
          >
            Your Health Can't Wait
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90"
          >
            When every second counts, Eldo Care connects you to help instantly — no delays, no barriers.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            onClick={() => navigate("/call-me")}
            className="group relative px-12 py-6 bg-white text-green-700 text-2xl font-bold rounded-full shadow-2xl hover:bg-gray-100 hover:scale-105 transition-all duration-300"
          >
            <PhoneCall className="inline w-8 h-8 mr-3 text-green-600 group-hover:animate-pulse" />
            Request Emergency Call Now
          </motion.button>
        </div>
      </section>
    </div>
  );
}