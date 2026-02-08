import { useEffect, useState } from "react";
import { fetchMyCases, submitCase } from "../../api/chv.api";

export default function CHVDashboard() {
  const [cases, setCases] = useState([]);
  const [description, setDescription] = useState("");
  const [riskLevel, setRiskLevel] = useState("medium");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [aiFeedback, setAiFeedback] = useState(null); // ← new: AI first-aid steps
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    loadCases();
  }, []);

  async function loadCases() {
    try {
      setLoading(true);
      const res = await fetchMyCases();
      setCases(res.data || []);
    } catch (err) {
      console.error("Failed to load cases", err);
      setError("Could not load your cases. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!description.trim()) {
      setError("Please enter a case description.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setAiFeedback(null);

    try {
      const formData = new FormData();
      formData.append("description", description.trim());
      formData.append("riskLevel", riskLevel);
      images.forEach((img) => formData.append("images", img));

      // Submit case to backend
      const res = await submitCase(formData);

      // The backend now returns aiFeedback in the response
      if (res.data.aiFeedback) {
        setAiFeedback(res.data.aiFeedback);
        setShowFeedbackModal(true);
      }

      // Reset form
      setDescription("");
      setRiskLevel("medium");
      setImages([]);

      // Refresh list
      loadCases();

      // Optional: success toast
      alert("Case submitted successfully! AI first-aid steps shown below.");
    } catch (err) {
      console.error("Submit failed", err);
      setError("Failed to submit case. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 3) {
      setError("You can upload up to 3 images only.");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 tracking-tight">
            Community Health Volunteer Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Submit new cases, get quick AI first-aid guidance, and track your submissions
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {/* Submit New Case Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-10">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h2 className="text-xl font-semibold text-green-800">
              Submit New Case
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Case Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                placeholder="Describe the case in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Risk Level */}
            <div>
              <label htmlFor="riskLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Risk Level
              </label>
              <select
                id="riskLevel"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-white"
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value)}
              >
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
                <option value="critical">Critical Risk</option>
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images (max 3)
              </label>

              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 hover:border-green-500 rounded-xl cursor-pointer transition">
                  <div className="flex flex-col items-center justify-center pt-7">
                    <svg className="w-10 h-10 text-gray-400 group-hover:text-green-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="pt-1 text-sm tracking-wider text-gray-600 group-hover:text-green-600">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-gray-500">(PNG, JPG, max 5MB each)</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className={`px-8 py-3 bg-green-700 text-white font-medium rounded-lg shadow hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ${
                  submitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? "Submitting..." : "Submit Case & Get AI Guidance"}
              </button>
            </div>
          </form>
        </div>

        {/* My Cases Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h2 className="text-xl font-semibold text-green-800">
              My Submitted Cases
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading cases...</div>
          ) : cases.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No cases submitted yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Risk Level</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cases.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${
                            c.riskLevel === "critical"
                              ? "bg-red-100 text-red-700"
                              : c.riskLevel === "high"
                              ? "bg-orange-100 text-orange-700"
                              : c.riskLevel === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {c.riskLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            c.status === "verified"
                              ? "bg-green-100 text-green-700"
                              : c.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* AI First-Aid Feedback Modal */}
        {showFeedbackModal && aiFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b bg-green-50">
                <h3 className="text-2xl font-bold text-green-800">
                  AI First-Aid Guidance
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Simple steps you can take while waiting for higher-level help
                </p>
              </div>

              <div className="p-6 space-y-6">
                <div className="prose text-gray-800">
                  <p className="font-medium text-lg mb-3">Recommended Actions:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    {aiFeedback.steps?.map((step, idx) => (
                      <li key={idx} className="text-base">{step}</li>
                    ))}
                  </ul>

                  {aiFeedback.caution && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="font-medium text-yellow-800">Important Caution:</p>
                      <p className="text-yellow-700 mt-1">{aiFeedback.caution}</p>
                    </div>
                  )}

                  <p className="mt-6 text-sm text-gray-500 italic">
                    {aiFeedback.disclaimer || "This is not medical advice. Always seek professional help as soon as possible."}
                  </p>
                </div>
              </div>

              <div className="p-6 border-t bg-gray-50 flex justify-end">
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-8 py-3 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 transition"
                >
                  Close & Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}