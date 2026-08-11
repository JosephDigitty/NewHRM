
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
// import logo from "../assets/logo.png"; // add your logo here

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showError } = useToast();

  const images = [image1, image2, image3];

  const getDashboardPath = (user) => {
    if (user.role === "admin") {
      return "/admin-dashboard";
    }

    if (user.role === "employee") {
      // Standardize position string (remove trailing/leading whitespace and ignore casing)
      const position = user.position?.trim().toLowerCase();

      if (position === "accountant") {
        return "/accountant-dashboard";
      }

      if (position === "director") {
        return "/position-dashboard";
      }

      return "/employee-dashboard";
    }

    return "/employee-dashboard"; // Default fallback route
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        const { user, token } = response.data;

        login(user);
        localStorage.setItem("token", token);

        const targetPath = getDashboardPath(user);
        navigate(targetPath);
      }
    } catch (error) {
      showError(
        error.response?.data?.error || "Failed to login. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* IMAGE AREA */}
      <div className="relative flex-[1.9] hidden md:block overflow-hidden">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Background"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-black/30" />

        {/* Overlay text & app badges */}
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-2xl font-semibold mb-3">
           Employee Management App
          </h2>
         
          <div className="text-xs flex flex-wrap gap-4 opacity-90">
            <a className="hover:underline">Terms & Conditions</a>
            <a className="hover:underline">Contact Us</a>
            <a className="hover:underline">Privacy Policy</a>
            <a className="hover:underline">Help</a>
          </div>
          <p className="text-xs mt-2 opacity-70">© 2025 Diggity Inc.</p>
        </div>
      </div>

      {/*LOGIN FORM */}
      <div className="w-full md:flex-[0.8] flex flex-col items-center justify-center px-8 md:px-16 bg-white">
        {/* Logo + title */}
        <div className="w-full max-w-md mb-8 text-center">
          {/* <img src={'logo'} alt="Logo" className="mx-auto w-24 mb-4" /> */}
          <h2 className="text-2xl font-bold text-[#0a2d5e]">Emplora</h2>
          <p className="text-gray-600 mt-1">
            Welcome back! Please sign in to continue.
          </p>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-md border border-gray-200 rounded-lg p-6 shadow-lg">
          <form onSubmit={handleSubmit}>
            <Input
              label="Username"
              name="email"
              type="text"
              placeholder="Enter your username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mb-4"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mb-2"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00b894] text-white py-2 rounded-md font-semibold hover:bg-[#009975] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader size="sm" /> : null}
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            Licensed and regulated by the Central Bank.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
