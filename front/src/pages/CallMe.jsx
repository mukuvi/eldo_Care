// frontend/pages/CallMe.jsx
import { useState } from "react";
import voiceApi from "../api/voiceClient";
import { PhoneCall, ShieldCheck, Clock, MapPin, AlertTriangle, CheckCircle } from "lucide-react";

export default function CallMe() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" }); // success | error

  async function handleCall() {
    // Basic validation
    if (!phoneNumber.trim()) {
      setStatus({ type: "error", message: "Please enter your phone number" });
      return;
    }
    if (!phoneNumber.startsWith("+")) {
      setStatus({ type: "error", message: "Include country code (e.g., +254)" });
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: null, message: "" });

      await voiceApi.post("/voice/call-me", { phoneNumber });

      setStatus({
        type: "success",
        message: "We're calling you right now! Answer to speak with our triage team."
      });
      setPhoneNumber("");
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: "Failed to initiate call. Please check your number and try again."
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header / Explanation */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <PhoneCall className="w-8 h-8 text-green-700" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Request a Call</h1>
          </div>

          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Enter your number and we'll call you back <strong>within seconds</strong>. 
            Speak naturally — get instant health guidance and escalation if needed.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              <span>Private & Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span>No waiting</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <span>GPS-enabled help</span>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-w-lg mx-auto">
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Enter Your Phone Number
            </h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (with country code)
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+254712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.trim())}
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-lg transition-all"
                  disabled={loading}
                />
                <p className="mt-2 text-sm text-gray-500">
                  We'll call you back immediately — no app or internet required.
                </p>
              </div>

              <button
                onClick={handleCall}
                disabled={loading || !phoneNumber.trim()}
                className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                  loading || !phoneNumber.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 hover:scale-[1.02] active:scale-95"
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                    Calling...
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-6 h-6" />
                    Call Me Now
                  </>
                )}
              </button>

              {/* Status Message */}
              {status.message && (
                <div
                  className={`p-5 rounded-xl text-center text-lg font-medium flex items-center justify-center gap-3 ${
                    status.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                  )}
                  {status.message}
                </div>
              )}
            </div>
          </div>

          {/* Reassurance Footer */}
          <div className="bg-gray-50 px-8 py-5 text-center text-sm text-gray-600 border-t">
            <p>
              Your privacy is protected. We never share your number. Calls are encrypted end-to-end.
            </p>
          </div>
        </div>

        {/* Quick Info Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <Clock className="w-10 h-10 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Instant Response</h3>
            <p className="text-gray-600">We call back in seconds — no hold times</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <ShieldCheck className="w-10 h-10 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Secure & Private</h3>
            <p className="text-gray-600">Your data is encrypted and never shared</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <MapPin className="w-10 h-10 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">GPS Ready</h3>
            <p className="text-gray-600">Location shared only in emergencies</p>
          </div>
        </div>
      </div>
    </div>
  );
}