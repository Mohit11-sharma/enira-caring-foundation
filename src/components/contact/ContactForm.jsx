import React, { useState } from "react";
import { contactService } from "../../services/contactServices";

function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSent(false);
    setError("");
    try {
      await contactService.sendContactForm(form);
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(
        err?.message || "Could not send message. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-16 bg-white flex flex-col items-center">
      <span className="text-green-500 font-semibold mb-2 text-lg">
        Contact us
      </span>
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center">
        Feel Free To Write Us Anytime
      </h2>
      <form
        className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-8 rounded-2xl shadow-lg"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          className="col-span-1 md:col-span-1 px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-900 font-medium"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
          className="col-span-1 md:col-span-1 px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-900 font-medium"
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
          required
          className="col-span-1 md:col-span-2 px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-900 font-medium"
        />
        <textarea
          name="message"
          rows={5}
          placeholder="Type your message"
          value={form.message}
          onChange={handleChange}
          required
          className="col-span-1 md:col-span-2 px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-900 font-medium resize-none"
        />
        <div className="col-span-1 md:col-span-2 ">
          <input type="checkbox" checked required className="mr-2"/>
          I consent to receiving RCS, WhatsApp, Email
          or SMS from ENIRA CARING FOUNDATION & I have reviewed and agreed to{" "}
          <a
            href="/term&conditions"
            target="_blank"
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a
            href="/privacy-policy"
            target="_blank"
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            Privacy Policy
          </a>
        </div>
        {/* added the consent container */}
        {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id=""
                  value="consent-box"
                  checked
                  required
                />
                <label
                  className="text-sm text-gray-700 leading-relaxed"
                  htmlFor="consent-box"
                >
                  <span className="text-red-500">*</span> I consent to receiving RCS, WhatsApp, Email or SMS from ENIRA & I have reviewed and agreed to{" "}
                  <a
                    href="/term&conditions"
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div> */}
        <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-gray-900 hover:bg-orange-500 text-white font-semibold text-lg shadow transition disabled:opacity-60"
          >
            <span>{loading ? "Sending..." : "Get in Touch"}</span>
            <span className="inline-block rotate-180">&#10148;</span>
          </button>
        </div>
        {sent && (
          <div className="col-span-1 md:col-span-2 text-center text-green-600 font-medium mt-2">
            Thank you! Your message has been sent.
          </div>
        )}
        {error && (
          <div className="col-span-1 md:col-span-2 text-center text-red-600 font-medium mt-2">
            {error}
          </div>
        )}
      </form>
    </section>
  );
}

export default ContactForm;