import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../Context/authContext";
import { useNavigate } from "react-router-dom";
import useToast from "../utils/useToast";
import Input from "../Component/reuseables/Input";
import Loader from "../Component/reuseables/Loader";

import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";

import { api } from "../api/request";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { showError } = useToast();

  const images = [image1, image2, image3];

  // =====================================================
  // ORIGINAL IMAGE TRANSITION LOGIC
  // =====================================================
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  // =====================================================
  // ORIGINAL SUBMIT & REDIRECT LOGIC
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        login(response.data.user);
        localStorage.setItem("token", response.data.token);

        // Original strict role-based navigation
        navigate(
          response.data.user.role === "admin"
            ? "/admin-dashboard"
            : "/employee-dashboard"
        );
      }
    } catch (error) {
      showError(
        error.response?.data?.error || "Failed to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      {/* LEFT IMAGE SECTION */}
      <div className="relative hidden h-screen overflow-hidden md:flex md:flex-[1.9]">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Background"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/35" />

        {/* Brand */}
        <div className="absolute left-10 top-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-bold text-[#0a2d5e] shadow-lg">
              E
            </div>
            <div>
              <p className="text-lg font-bold text-white">Emplora</p>
              <p className="text-xs text-white/70">Employee Management</p>
            </div>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-white/70">
              Human Resource Management
            </p>
            <h2 className="text-3xl font-bold leading-tight lg:text-4xl">
              Manage your workforce.
              <br />
              Empower your people.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-white/75">
              A centralized platform for managing employees, payroll,
              performance, benefits and everyday HR operations.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/65">
            <button type="button" className="transition hover:text-white">
              Terms & Conditions
            </button>
            <button type="button" className="transition hover:text-white">
              Contact Us
            </button>
            <button type="button" className="transition hover:text-white">
              Privacy Policy
            </button>
            <button type="button" className="transition hover:text-white">
              Help
            </button>
            <span className="text-white/30">|</span>
            <span>© 2026 Emplora</span>
          </div>
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-28 right-10 flex gap-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-500 ${
                index === currentImage ? "w-8 bg-white" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* LOGIN SECTION */}
      <div className="flex min-h-screen w-full items-center justify-center bg-white px-5 py-10 sm:px-8 md:min-h-screen md:flex-[0.8] md:px-12 lg:px-16">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-10 flex items-center justify-center gap-3 md:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0a2d5e] text-lg font-bold text-white">
              E
            </div>
            <div>
              <p className="text-lg font-bold text-[#0a2d5e]">Emplora</p>
              <p className="text-xs text-slate-400">Employee Management</p>
            </div>
          </div>

          {/* LOGIN HEADER */}
          <div className="mb-8">
            <p className="mb-3 text-sm font-semibold text-[#00a982]">
              Welcome back
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Sign in to your account
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter your credentials to access your employee management
              dashboard.
            </p>
          </div>

          {/* LOGIN CARD */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)] sm:p-8">
            <form onSubmit={handleSubmit}>
              {/* EMAIL */}
              <div className="mb-5">
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mb-0"
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-3">
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mb-0"
                />
              </div>

              {/* FORGOT PASSWORD */}
              <div className="mb-7 flex justify-end">
                <button
                  type="button"
                  className="text-xs font-semibold text-[#00a982] transition hover:text-[#008c6d]"
                >
                  Forgot password?
                </button>
              </div>

              {/* SIGN IN */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0a2d5e] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#08244b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <Loader size="sm" />}
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* SECURITY MESSAGE */}
            <div className="mt-6 flex items-start gap-3 rounded-lg bg-slate-50 p-3">
              <div className="mt-0.5 text-slate-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v2h8z"
                  />
                </svg>
              </div>
              <p className="text-[11px] leading-5 text-slate-500">
                Your account information is protected. Never share your login
                credentials with anyone.
              </p>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-6 text-center">
            <p className="text-[11px] text-slate-400">
              Emplora Employee Management System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;