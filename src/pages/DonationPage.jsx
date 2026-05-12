import React, { useState, useEffect } from "react";

// Environment configuration with fallbacks
const API_BASE_URL = (() => {
  try {
    return import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  } catch (error) {
    console.warn("Environment variable access failed, using fallback URL");
    return "http://localhost:8000/api";
  }
})();

const RAZORPAY_KEY = (() => {
  try {
    return (
      import.meta.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_live_RFZwtzlGSrGl9W"
    );
  } catch (error) {
    console.warn(
      "Environment variable access failed, using fallback Razorpay key",
    );
    return "rzp_live_RFZwtzlGSrGl9W";
  }
})();

// Real API service functions
const donationService = {
  createOrder: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/donations/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse);
        throw new Error(
          "Server returned non-JSON response. Check your Laravel API endpoint.",
        );
      }

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || `HTTP error! status: ${response.status}`,
        );
      }

      return responseData;
    } catch (error) {
      console.error("Create order error:", error);

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(
          "Unable to connect to server. Please check if the backend is running.",
        );
      }

      throw error;
    }
  },

  createSubscription: async (data) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/donations/create-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          credentials: "include",
          body: JSON.stringify(data),
        },
      );

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse);
        throw new Error(
          "Server returned non-JSON response. Check your Laravel API endpoint.",
        );
      }

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || `HTTP error! status: ${response.status}`,
        );
      }

      return responseData;
    } catch (error) {
      console.error("Create subscription error:", error);
      throw error;
    }
  },

  verifyPayment: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/donations/verify-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Payment verification failed");
      }

      return responseData;
    } catch (error) {
      console.error("Verify payment error:", error);
      throw error;
    }
  },

  verifySubscription: async (data) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/donations/verify-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          credentials: "include",
          body: JSON.stringify(data),
        },
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Subscription verification failed",
        );
      }

      return responseData;
    } catch (error) {
      console.error("Verify subscription error:", error);
      throw error;
    }
  },

  getDonors: async (page = 1, perPage = 15, search = "") => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/donations/donors?page=${page}&per_page=${perPage}&search=${encodeURIComponent(search)}&group_by=id`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        },
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to fetch donors");
      }

      return responseData;
    } catch (error) {
      console.error("Get donors error:", error);
      throw error;
    }
  },

  getDonorStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/donations/donors/stats`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to fetch statistics");
      }

      return responseData;
    } catch (error) {
      console.error("Get donor stats error:", error);
      throw error;
    }
  },
};

const useAuth = () => ({
  user: null,
  isAuthenticated: false,
});

const DonationPage = () => {
  const { user, isAuthenticated } = useAuth();

  const [amount, setAmount] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    pan: "",
    cause: "",
    address: "",
    frequency: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [want80G, setWant80G] = useState(false);
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  // Donors section state
  // const [showDonorsSection, setShowDonorsSection] = useState(false);
  // const [donors, setDonors] = useState([]);
  // const [donorStats, setDonorStats] = useState(null);
  // const [donorsLoading, setDonorsLoading] = useState(false);
  // const [donorSearch, setDonorSearch] = useState('');
  // const [donorPage, setDonorPage] = useState(1);
  // const [donorPagination, setDonorPagination] = useState(null);
  // Donors section state
  const [showDonorsSection, setShowDonorsSection] = useState(false);
  const [donors, setDonors] = useState([]);
  const [donorStats, setDonorStats] = useState(null);
  const [donorsLoading, setDonorsLoading] = useState(false);
  const [donorSearch, setDonorSearch] = useState("");
  const [donorPage, setDonorPage] = useState(1);
  const [donorPagination, setDonorPagination] = useState(null);
  const [useMockData, setUseMockData] = useState(false);

  // Mock data for fallback
  const mockDonors = [
    {
      id: 1,
      unique_id: "ECF001",
      name: "Rajesh Kumar",
      total_amount: "25000",
      donation_count: 5,
      causes: { KN: 2, CB: 3 },
    },
    {
      id: 2,
      unique_id: "ECF002",
      name: "Priya Sharma",
      total_amount: "15000",
      donation_count: 3,
      causes: { NN: 2, STEER: 1 },
    },
    {
      id: 3,
      unique_id: "ECF003",
      name: "Amit Patel",
      total_amount: "50000",
      donation_count: 10,
      causes: { GSW: 5, KN: 3, CB: 2 },
    },
    {
      id: 4,
      unique_id: "ECF004",
      name: "Sneha Reddy",
      total_amount: "8000",
      donation_count: 2,
      causes: { CB: 1, NN: 1 },
    },
    {
      id: 5,
      unique_id: "ECF005",
      name: "Vikram Singh",
      total_amount: "30000",
      donation_count: 6,
      causes: { STEER: 4, GSW: 2 },
    },
    {
      id: 6,
      unique_id: "ECF006",
      name: "Anjali Verma",
      total_amount: "12000",
      donation_count: 4,
      causes: { KN: 2, NN: 2 },
    },
    {
      id: 7,
      unique_id: "ECF007",
      name: "Rahul Gupta",
      total_amount: "20000",
      donation_count: 5,
      causes: { CB: 3, STEER: 2 },
    },
    {
      id: 8,
      unique_id: "ECF008",
      name: "Kavita Joshi",
      total_amount: "5000",
      donation_count: 1,
      causes: { GSW: 1 },
    },
    {
      id: 9,
      unique_id: "ECF009",
      name: "Suresh Menon",
      total_amount: "35000",
      donation_count: 7,
      causes: { KN: 3, CB: 2, NN: 2 },
    },
    {
      id: 10,
      unique_id: "ECF010",
      name: "Deepa Nair",
      total_amount: "18000",
      donation_count: 4,
      causes: { STEER: 2, GSW: 2 },
    },
  ];

  const mockStats = {
    total_donors: 150,
    total_donations: 487,
    total_amount: 2450000,
  };

  // Define donation causes with their unique codes and descriptions
  const donationCauses = [
    {
      value: "kshudha-nivarana",
      label: "Kshudha Nivarana",
      code: "KN",
      description: "Combating hunger and malnutrition",
      icon: "🍽️",
    },
    {
      value: "chains-to-bridge",
      label: "Chains to Bridge",
      code: "CB",
      description: "Women empowerment and leadership development",
      icon: "👩‍💼",
    },
    {
      value: "nurturing-nature",
      label: "Nurturing Nature",
      code: "NN",
      description: "Environmental sustainability and conservation",
      icon: "🌱",
    },
    {
      value: "skill-training",
      label: "Skill Training for Employability",
      code: "STEER",
      description: "Vocational training and job readiness",
      icon: "💻",
    },
    {
      value: "general-welfare",
      label: "General Social Welfare",
      code: "GSW",
      description: "Overall community development and support",
      icon: "🤝",
    },
  ];

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript().then((loaded) => {
      if (!loaded) {
        setError("Payment gateway failed to load. Please refresh the page.");
      }
    });
  }, []);

  // Autofill form if user is logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        pan: user.pan || "",
        address: user.address || "",
      }));
    }
  }, [isAuthenticated, user]);

  // Set minimum amount when 80G is selected (only if field is empty)
  useEffect(() => {
    if (want80G && amount === "") {
      setAmount("2000");
    }
  }, [want80G]);

  // Load donors data when section is shown
  useEffect(() => {
    if (showDonorsSection) {
      loadDonors();
      loadDonorStats();
    }
  }, [showDonorsSection, donorPage, donorSearch]);

  const loadDonors = async () => {
    setDonorsLoading(true);
    try {
      const response = await donationService.getDonors(
        donorPage,
        15,
        donorSearch,
      );
      if (response.success) {
        setDonors(response.data.data);
        setDonorPagination({
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total,
        });
      }
    } catch (error) {
      console.error("Failed to load donors:", error);
    } finally {
      setDonorsLoading(false);
    }
  };

  const loadDonorStats = async () => {
    try {
      const response = await donationService.getDonorStats();
      if (response.success) {
        setDonorStats(response.data);
      }
    } catch (error) {
      console.error("Failed to load donor stats:", error);
    }
  };

  const handleDonorSearch = (e) => {
    setDonorSearch(e.target.value);
    setDonorPage(1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleAmountChange = (e) => {
    const newAmount = e.target.value.replace(/[^0-9]/g, "");
    setAmount(newAmount);
    if (error) setError("");
  };

  const handle80GChange = (e) => {
    const checked = e.target.checked;
    setWant80G(checked);

    if (checked) {
      if (amount === "" || Number(amount) < 2000) {
        setAmount("2000");
      }
    } else {
      setForm((prev) => ({
        ...prev,
        pan: "",
        frequency: "",
      }));
    }
  };

  const initializeRazorpayPayment = async (orderData) => {
    if (!window.Razorpay) {
      setError(
        "Payment gateway not loaded. Please refresh the page and try again.",
      );
      setLoading(false);
      return;
    }

    const options = {
      key: RAZORPAY_KEY,
      amount: orderData.amount,
      currency: orderData.currency || "INR",
      name: "Enira Caring Foundation",
      description: `Donation for ${donationCauses.find((c) => c.value === form.cause)?.label || "General Welfare"}`,
      image: "/media/logo.png",
      order_id: orderData.order_id,
      handler: async function (response) {
        try {
          setLoading(true);

          const verificationData = await donationService.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            donation_details: {
              name: form.name,
              phone: form.phone,
              email: form.email,
              amount: Number(amount),
              cause: form.cause,
              causeCode:
                donationCauses.find((cause) => cause.value === form.cause)
                  ?.code || "GSW",
              address: form.address,
              pan: want80G ? form.pan : null,
              frequency: "one-time",
              want80G: want80G,
            },
          });

          if (verificationData.success) {
            setSuccess(
              `Thank you for your donation! Payment ID: ${response.razorpay_payment_id}. Check your email for the certificate!`,
            );
            resetForm();
            if (showDonorsSection) {
              loadDonors();
              loadDonorStats();
            }
          } else {
            setError(
              verificationData.message ||
                "Payment verification failed. Please contact support.",
            );
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          setError(
            error.message ||
              "Payment verification failed. Please contact support.",
          );
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      notes: {
        cause: form.cause,
        want80G: want80G.toString(),
        pan: want80G ? form.pan : "",
      },
      theme: {
        color: "#16a34a",
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
          setError("Payment was cancelled");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const initializeRazorpaySubscription = async (subscriptionData) => {
    if (!window.Razorpay) {
      setError(
        "Payment gateway not loaded. Please refresh the page and try again.",
      );
      setLoading(false);
      return;
    }

    const options = {
      key: RAZORPAY_KEY,
      subscription_id: subscriptionData.subscription_id,
      name: "Enira Caring Foundation",
      description: `${form.frequency.charAt(0).toUpperCase() + form.frequency.slice(1)} donation for ${donationCauses.find((c) => c.value === form.cause)?.label || "General Welfare"}`,
      image: "/media/logo.png",
      handler: async function (response) {
        try {
          setLoading(true);

          const verificationData = await donationService.verifySubscription({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_subscription_id: response.razorpay_subscription_id,
            razorpay_signature: response.razorpay_signature,
            donation_details: {
              name: form.name,
              phone: form.phone,
              email: form.email,
              amount: Number(amount),
              cause: form.cause,
              causeCode:
                donationCauses.find((cause) => cause.value === form.cause)
                  ?.code || "GSW",
              address: form.address,
              pan: want80G ? form.pan : null,
              frequency: form.frequency,
              want80G: want80G,
            },
          });

          if (verificationData.success) {
            setSuccess(
              `Thank you for setting up ${form.frequency} donations! Subscription ID: ${response.razorpay_subscription_id}. Check your email for the certificate!`,
            );
            resetForm();
            if (showDonorsSection) {
              loadDonors();
              loadDonorStats();
            }
          } else {
            setError(
              verificationData.message ||
                "Subscription verification failed. Please contact support.",
            );
          }
        } catch (error) {
          console.error("Subscription verification error:", error);
          setError(
            error.message ||
              "Subscription verification failed. Please contact support.",
          );
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      notes: {
        cause: form.cause,
        frequency: form.frequency,
        want80G: want80G.toString(),
        pan: want80G ? form.pan : "",
      },
      theme: {
        color: "#16a34a",
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
          setError("Payment was cancelled");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      email: "",
      pan: "",
      cause: "",
      address: "",
      frequency: "",
    });
    setAmount("");
    setWant80G(false);
    setAgreedToPolicy(false);
    setShowFrequencyModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreedToPolicy) {
      setError("Please read and agree to our Refund & Cancellation Policy");
      return;
    }

    const numAmount = Number(amount);
    if (numAmount % 10 !== 0) {
      setError("Donation amount must be in multiples of 10");
      return;
    }

    setShowFrequencyModal(true);
  };

  const processDonation = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    setShowFrequencyModal(false);

    const requiredFields = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      cause: form.cause,
      address: form.address,
      amount: amount,
    };

    if (want80G) {
      requiredFields.pan = form.pan;
    }

    const emptyFields = Object.keys(requiredFields).filter(
      (field) => !requiredFields[field]?.trim(),
    );

    if (emptyFields.length > 0) {
      setError(`Please fill in all required fields: ${emptyFields.join(", ")}`);
      setLoading(false);
      return;
    }

    const numAmount = Number(amount);
    if (numAmount % 10 !== 0) {
      setError("Donation amount must be in multiples of 10");
      setLoading(false);
      return;
    }

    if (want80G && numAmount < 2000) {
      setError("Minimum amount for 80G benefit is ₹2000");
      setLoading(false);
      return;
    }

    if (!want80G && numAmount < 50) {
      setError("Minimum donation amount is ₹50");
      setLoading(false);
      return;
    }

    try {
      const selectedCause = donationCauses.find(
        (cause) => cause.value === form.cause,
      );

      const donationData = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        amount: numAmount,
        cause: form.cause.trim(),
        causeCode: selectedCause?.code || "GSW",
        address: form.address.trim(),
        pan: want80G ? form.pan.trim() : null,
        frequency: form.frequency || "one-time",
        want80G: want80G,
      };

      if (form.frequency && form.frequency !== "one-time") {
        const subscriptionResponse =
          await donationService.createSubscription(donationData);

        if (subscriptionResponse.success) {
          await initializeRazorpaySubscription(subscriptionResponse.data);
        } else {
          setError(
            subscriptionResponse.message || "Failed to create subscription",
          );
          setLoading(false);
        }
      } else {
        const orderResponse = await donationService.createOrder(donationData);

        if (orderResponse.success) {
          await initializeRazorpayPayment(orderResponse.data);
        } else {
          setError(orderResponse.message || "Failed to create order");
          setLoading(false);
        }
      }
    } catch (err) {
      console.error("Donation processing error:", err);
      setError(err.message || "Donation failed. Please try again.");
      setLoading(false);
    }
  };

  const handleFrequencySelection = (frequency) => {
    setForm((prev) => ({
      ...prev,
      frequency: frequency,
    }));
    processDonation();
  };

  const showPANField = want80G;

  const isFormValid = () => {
    const numAmount = Number(amount);
    const basicFieldsValid =
      amount.trim() &&
      form.name.trim() &&
      form.phone.trim() &&
      form.email.trim() &&
      form.cause.trim() &&
      form.address.trim();
    const panFieldValid = !want80G || form.pan.trim();
    const amountValid = want80G ? numAmount >= 2000 : numAmount >= 50;
    const multipleOf10 = numAmount % 10 === 0 && numAmount > 0;
    const policyAgreed = agreedToPolicy;

    return (
      basicFieldsValid &&
      panFieldValid &&
      amountValid &&
      multipleOf10 &&
      policyAgreed
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-400">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-green-900 pt-24 pb-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <svg
                className="w-5 h-5 text-yellow-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white font-medium text-sm">
                Tax Benefits Available • 80G Certified
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Transform Lives with
              <span className="block bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent mt-2">
                Your Generosity
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Every contribution creates ripples of change. Join us in building
              a better tomorrow through education, healthcare, and empowerment.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-bold text-white mb-2">
                  10,000+
                </div>
                <div className="text-green-100 font-medium">Lives Impacted</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-bold text-white mb-2">5+</div>
                <div className="text-green-100 font-medium">
                  Active Programs
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-bold text-white mb-2">100%</div>
                <div className="text-green-100 font-medium">Transparent</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#donation-form"
                className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-4 rounded-full shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-105 group"
              >
                <span>Donate Now</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
              <button
                onClick={() => setShowDonorsSection(!showDonorsSection)}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-full border-2 border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>{showDonorsSection ? "Hide" : "View"} Our Donors</span>
              </button>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 mt-12">
              <div className="flex items-center gap-2 text-green-100">
                <svg
                  className="w-5 h-5 text-green-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2 text-green-100">
                <svg
                  className="w-5 h-5 text-green-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">80G Certified</span>
              </div>
              <div className="flex items-center gap-2 text-green-100">
                <svg
                  className="w-5 h-5 text-green-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">Full Transparency</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="currentColor"
              className="text-green-200"
            />
          </svg>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-4 pb-8">
        {showDonorsSection && (
          <div className="max-w-6xl w-full bg-white rounded-2xl shadow-2xl p-8 mb-8 border-2 border-blue-400">
            <div className="flex flex-col items-center mb-6">
              <h2 className="text-3xl font-extrabold text-blue-700 mb-2 text-center">
                Our Valued Donors
              </h2>
              <p className="text-gray-600 text-center">
                Supporting our mission to create positive change
              </p>
            </div>

            {/* {donorStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <div className="text-sm text-green-700 font-medium">Total Donors</div>
                <div className="text-3xl font-bold text-green-800">{donorStats.total_donors}</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-700 font-medium">Total Donations</div>
                <div className="text-3xl font-bold text-blue-800">{donorStats.total_donations}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <div className="text-sm text-purple-700 font-medium">Total Amount Raised</div>
                <div className="text-3xl font-bold text-purple-800">₹{donorStats.total_amount?.toLocaleString()}</div>
              </div>
            </div>
          )} */}

            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={donorSearch}
                  onChange={handleDonorSearch}
                  placeholder="Search by name, donor ID, or cause..."
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow"
                />
                <svg
                  className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {donorsLoading ? (
              <div className="flex justify-center items-center py-12">
                <svg
                  className="animate-spin h-12 w-12 text-blue-600"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            ) : donors.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                      <th className="px-4 py-3 text-left font-semibold">
                        Donor ID
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Causes
                      </th>
                      <th className="px-4 py-3 text-right font-semibold">
                        Total Amount
                      </th>
                      <th className="px-4 py-3 text-center font-semibold">
                        Donations
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {donors.map((donor, index) => (
                      <tr
                        key={donor.id}
                        className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition-colors`}
                      >
                        <td className="px-4 py-3">
                          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                            {donor.unique_id}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {donor.name}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {donor.causes &&
                            Object.keys(donor.causes).length > 0 ? (
                              Object.keys(donor.causes).map((cause) => (
                                <span
                                  key={cause}
                                  className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium"
                                >
                                  {cause}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 text-sm">N/A</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-green-700">
                          ₹{parseFloat(donor.total_amount).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                            {donor.donation_count}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p className="text-lg font-medium">No donors found</p>
                <p className="text-sm">Try adjusting your search criteria</p>
              </div>
            )}

            {donorPagination && donorPagination.last_page > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => setDonorPage((prev) => Math.max(1, prev - 1))}
                  disabled={donorPage === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700 font-medium">
                  Page {donorPagination.current_page} of{" "}
                  {donorPagination.last_page}
                </span>
                <button
                  onClick={() =>
                    setDonorPage((prev) =>
                      Math.min(donorPagination.last_page, prev + 1),
                    )
                  }
                  disabled={donorPage === donorPagination.last_page}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        <div
          id="donation-form"
          className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border-2 border-green-400"
        >
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-400 flex items-center justify-center shadow-lg mb-2">
              <span className="text-3xl text-white font-bold">₹</span>
            </div>
            <h2 className="text-3xl font-extrabold text-green-700 mb-1 text-center">
              Make a Donation
            </h2>
            <p className="text-gray-600 mb-2 text-center">
              Support our cause! Minimum donation is{" "}
              <span className="font-semibold text-red-500">₹50</span> in
              multiples of{" "}
              <span className="font-semibold text-blue-600">10</span>. Select
              80G tax benefit if you want tax deduction.
            </p>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Secured by Razorpay</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4 text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded mb-4 text-center">
              {success}
            </div>
          )}

          <div className="space-y-5">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="want80G"
                  checked={want80G}
                  onChange={handle80GChange}
                  className="accent-green-600"
                />
                <label
                  htmlFor="want80G"
                  className="text-sm font-medium text-green-700"
                >
                  I want 80G tax benefit (Minimum ₹2000 required)
                </label>
              </div>
              {want80G && (
                <p className="text-xs text-green-600 mt-1">
                  Great! You'll be eligible for tax deduction under Section 80G.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Donation Amount (₹)
                {want80G ? (
                  <span className="text-red-500">
                    {" "}
                    *Minimum ₹2000 (multiples of ₹10)
                  </span>
                ) : (
                  <span className="text-red-500">
                    {" "}
                    *Minimum ₹50 (multiples of ₹10)
                  </span>
                )}
              </label>
              <input
                type="text"
                name="amount"
                value={amount}
                onChange={handleAmountChange}
                required
                className="w-full border-2 border-green-400 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500 font-semibold text-lg shadow"
                placeholder={
                  want80G ? "e.g., 2000, 2010, 2020..." : "e.g., 50, 60, 70..."
                }
                min={want80G ? "2000" : "50"}
              />
              {amount !== "" && Number(amount) % 10 !== 0 && (
                <p className="text-red-500 text-xs mt-1">
                  Amount must be in multiples of ₹10
                </p>
              )}
              {want80G &&
                Number(amount) < 2000 &&
                amount !== "" &&
                Number(amount) % 10 === 0 && (
                  <p className="text-red-500 text-xs mt-1">
                    Minimum amount for 80G benefit is ₹2000
                  </p>
                )}
              {!want80G &&
                Number(amount) < 50 &&
                amount !== "" &&
                Number(amount) % 10 === 0 && (
                  <p className="text-red-500 text-xs mt-1">
                    Minimum donation amount is ₹50
                  </p>
                )}
              {amount !== "" &&
                Number(amount) % 10 === 0 &&
                Number(amount) >= (want80G ? 2000 : 50) && (
                  <p className="text-green-600 text-xs mt-1">
                    ✓ Valid donation amount
                  </p>
                )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500 shadow"
                placeholder="Your Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500 shadow"
                placeholder="Your Phone"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500 shadow"
                placeholder="Your Email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Donation Cause <span className="text-red-500">*</span>
                <span className="text-blue-600">
                  {" "}
                  (Select the program you want to support)
                </span>
              </label>
              <select
                name="cause"
                value={form.cause}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500 shadow bg-white"
              >
                <option value="">-- Select a cause --</option>
                {donationCauses.map((cause) => (
                  <option key={cause.value} value={cause.value}>
                    {cause.icon} {cause.label} ({cause.code}) -{" "}
                    {cause.description}
                  </option>
                ))}
              </select>
              {form.cause && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                  {(() => {
                    const selectedCause = donationCauses.find(
                      (cause) => cause.value === form.cause,
                    );
                    return selectedCause ? (
                      <p className="text-blue-700 text-xs">
                        <span className="font-semibold">
                          Certificate Code: {selectedCause.code}
                        </span>{" "}
                        - Your donation will specifically support{" "}
                        {selectedCause.description.toLowerCase()}.
                      </p>
                    ) : null;
                  })()}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500 shadow"
                placeholder="Your Address"
              />
            </div>

            {showPANField && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PAN Number <span className="text-red-500">*</span>
                  <span className="text-green-600">
                    {" "}
                    (Required for 80G tax benefit)
                  </span>
                </label>
                <input
                  type="text"
                  name="pan"
                  value={form.pan}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-green-500 focus:border-green-500 shadow"
                  placeholder="Your PAN (Required for 80G)"
                />
                {want80G && !form.pan.trim() && (
                  <p className="text-red-500 text-xs mt-1">
                    PAN is required for 80G tax benefit
                  </p>
                )}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="policyAgreement"
                  checked={agreedToPolicy}
                  onChange={(e) => setAgreedToPolicy(e.target.checked)}
                  className="accent-blue-600 mt-1"
                  required
                />
                <label
                  htmlFor="policyAgreement"
                  className="text-sm text-gray-700 leading-relaxed"
                >
                  <span className="text-red-500">*</span> I have read and agree
                  to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowPolicyModal(true)}
                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    Refund & Cancellation Policy
                  </button>
                </label>
              </div>
              {!agreedToPolicy && (
                <p className="text-red-500 text-xs mt-2">
                  Agreement to our policy is required to proceed with donation
                </p>
              )}
            </div>

            {/* added the consent container */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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
                  <span className="text-red-500">*</span> I consent to receiving
                  RCS, WhatsApp, Email or SMS from ENIRA CARING FOUNDATION & I have reviewed and
                  agreed to{" "}
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
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !isFormValid()}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-colors shadow flex items-center justify-center gap-2 ${
                loading || !isFormValid()
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Create Donation
                </>
              )}
            </button>

            <div className="text-center text-xs text-gray-500">
              <p>Powered by Razorpay | Your payment information is secure</p>
            </div>
          </div>
        </div>

        {showPolicyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Refund & Cancellation Policy
                  </h3>
                  <button
                    onClick={() => setShowPolicyModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Our organisation makes public its policy on refund and
                  cancellation of donations received for the social cause on
                  payment gateway as under:
                </p>

                <p>
                  <strong>No refund/cancellation</strong> for the donated amount
                  by any donor will be entertained for online donations since
                  refund is a cumbersome process. The donation will be used for
                  the education, healthcare, social welfare, and women
                  empowerment of the poorest of the poor in far-flung villages.
                  Development Focus does not compel any person or organization
                  to donate money. It depends on your wish whether you are
                  willing to contribute some portion of your income towards the
                  philanthropic activities for the establishment of universal
                  justice and peace.
                </p>

                <p>
                  If at any time you feel that you wish to collect any
                  information on how your money was spent, you are most welcome
                  to contact us. While donating the money, you are free to ask
                  any query or doubt which you have in your mind. Our experts
                  will guide you through the entire process and how the money is
                  utilized. It is your right to know where the donation is being
                  used.
                </p>

                <p>
                  Once online payment is made, we will send a confirmation email
                  regarding the donation along with a tax-exempted receipt valid
                  u/s 80G of IT for Indian donations.
                </p>

                <p>
                  The request for any donation-related information can be sent
                  to{" "}
                  <a
                    href="mailto:eniracaring@gmail.com"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    eniracaring@gmail.com
                  </a>
                </p>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-2xl">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setAgreedToPolicy(true);
                      setShowPolicyModal(false);
                    }}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    I Agree & Accept
                  </button>
                  <button
                    onClick={() => setShowPolicyModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showFrequencyModal && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 max-w-sm w-full max-h-[85vh] flex flex-col">
              <div className="p-6 pb-4 border-b border-gray-100">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-1">
                    {want80G ? "Maximize Tax Savings!" : "Make Impact Last"}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {want80G
                      ? "Regular donations save taxes while supporting our cause!"
                      : "Join our community of regular supporters!"}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-2 text-xs text-blue-600">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Automated via Razorpay</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Choose Your Frequency:
                  </label>

                  <div
                    onClick={() => handleFrequencySelection("monthly")}
                    className="group bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-2 border-green-200 hover:border-green-400 rounded-xl p-3 cursor-pointer transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            M
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-800 text-sm">
                            Monthly
                          </h4>
                          <p className="text-green-600 text-xs">
                            {want80G ? "Max tax benefits" : "Steady support"}
                          </p>
                        </div>
                      </div>
                      <svg
                        className="w-4 h-4 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        ></path>
                      </svg>
                    </div>
                  </div>

                  <div
                    onClick={() => handleFrequencySelection("quarterly")}
                    className="group bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200 hover:border-blue-400 rounded-xl p-3 cursor-pointer transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            Q
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-800 text-sm">
                            Quarterly
                          </h4>
                          <p className="text-blue-600 text-xs">
                            {want80G ? "Every 3 months" : "Perfect balance"}
                          </p>
                        </div>
                      </div>
                      <svg
                        className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        ></path>
                      </svg>
                    </div>
                  </div>

                  <div
                    onClick={() => handleFrequencySelection("yearly")}
                    className="group bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-2 border-purple-200 hover:border-purple-400 rounded-xl p-3 cursor-pointer transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            Y
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-purple-800 text-sm">
                            Yearly
                          </h4>
                          <p className="text-purple-600 text-xs">
                            {want80G ? "Set & forget" : "Best value"}
                          </p>
                        </div>
                      </div>
                      <svg
                        className="w-4 h-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleFrequencySelection("one-time")}
                  className="w-full py-2 px-4 text-gray-600 hover:text-gray-800 font-medium rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
                >
                  <span>💳</span>
                  <span>One-time payment instead</span>
                </button>

                <button
                  onClick={() => setShowFrequencyModal(false)}
                  className="mt-3 text-xs text-gray-400 hover:text-gray-600 block mx-auto transition-colors duration-200"
                >
                  ✕ Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationPage;
