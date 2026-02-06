import { useEffect, useState } from "react";
import { fetchMyCases, submitCase } from "../../api/chv.api";

export default function CHVDashboard() {
  const [cases, setCases] = useState([]);
  const [description, setDescription] = useState("");
  const [riskLevel, setRiskLevel] = useState("medium");
  const [images, setImages] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadCases();
  }, []);

  async function loadCases() {
    const res = await fetchMyCases();
    setCases(res.data);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("description", description);
    formData.append("riskLevel", riskLevel);
    images.forEach(img => formData.append("images", img));

    await submitCase(formData);
    setDescription("");
    setImages([]);
    loadCases();
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-6">
        Community Health Volunteer Dashboard
      </h1>

      {/* Submit Case */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-8"
      >
        <h2 className="text-lg font-semibold mb-4 text-red-600">
          Submit New Case
        </h2>

        <textarea
          className="w-full border rounded p-3 mb-4"
          placeholder="Describe the case..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />

        <select
          className="w-full border rounded p-2 mb-4"
          value={riskLevel}
          onChange={e => setRiskLevel(e.target.value)}
        >
          <option value="low">Low Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="high">High Risk</option>
        </select>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={e => setImages([...e.target.files])}
          className="mb-4"
        />

        <button
          type="submit"
          className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800"
        >
          Submit Case
        </button>
      </form>

      {/* My Cases */}
      <div className="bg-white rounded-xl shadow">
        <h2 className="text-lg font-semibold p-4 border-b">
          My Submitted Cases
        </h2>
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Risk</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {cases.map(c => (
              <tr key={c._id} className="border-t">
                <td className="p-3">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 capitalize">{c.riskLevel}</td>
                <td className="p-3 font-semibold">
                  {c.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
