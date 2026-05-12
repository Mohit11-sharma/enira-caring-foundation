import React, { useState } from "react";
import { apiService } from "../../services/api";
import { FiUploadCloud, FiCheckCircle, FiAlertCircle, FiImage } from "react-icons/fi";

export default function UploadSlides() {
  const [form, setForm] = useState({
    title: "",
    desc: "",
    quote: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
      setPreview(URL.createObjectURL(e.target.files[0]));
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("desc", form.desc);
      data.append("quote", form.quote);
      data.append("image", form.image);

      await apiService.post("/slides", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Slide uploaded successfully!");
      setForm({ title: "", desc: "", quote: "", image: null });
      setPreview(null);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to upload slide"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-2xl mt-12 border border-gray-100 animate-fade-in">
      <h1 className="text-3xl font-extrabold mb-2 text-gray-900 flex items-center gap-2">
        <FiUploadCloud className="text-green-600" size={32} />
        Upload New Slide
      </h1>
      <p className="text-gray-500 mb-8">
        Add a new slide to your homepage carousel. Please use high-quality images for best results.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            placeholder="Enter slide title"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Description</label>
          <textarea
            name="desc"
            value={form.desc}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            placeholder="Short description for the slide"
            rows={2}
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Quote</label>
          <input
            type="text"
            name="quote"
            value={form.quote}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            placeholder="Optional quote or tagline"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Image <span className="text-red-500">*</span></label>
          <div className="flex items-center gap-4">
            <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition group bg-gray-50">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="flex flex-col items-center text-gray-400 group-hover:text-green-600">
                  <FiImage size={40} />
                  <span className="text-xs mt-2">Click to select image</span>
                </span>
              )}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                required
                className="hidden"
              />
            </label>
            <div className="flex-1 text-xs text-gray-500">
              Recommended size: 1200x500px or larger. JPG/PNG only.
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow"
        >
          {loading && (
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          )}
          {loading ? "Uploading..." : "Upload Slide"}
        </button>
        {success && (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2 mt-2">
            <FiCheckCircle className="w-5 h-5" />
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2 mt-2">
            <FiAlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  );
}