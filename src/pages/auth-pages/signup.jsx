import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import LogoImage from "../../assets/souvenir-hub-logo.png";
import { AuthService } from "../../services/auth-service/auth.service";
import { ROUTER_URL } from "../../const/router.const";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await AuthService.register(form);
      if (res?.data?.token) {
        message.success("Signup successful!");
        navigate(ROUTER_URL.LOGIN);
      } else {
        message.error("Signup failed.");
      }
    } catch {
      message.error("An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7F6] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg flex max-w-5xl w-full overflow-hidden">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-2xl font-bold mb-2">Sign Up</h2>
          <p className="text-gray-500 mb-6">Create your account</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                required
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-orange-300"
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-orange-300"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-orange-300"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 cursor-pointer text-sm text-gray-500"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <p className="text-xs text-center text-gray-500">
              By signing up, you agree to our{" "}
              <span className="text-orange-500 cursor-pointer hover:underline">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-orange-500 cursor-pointer hover:underline">
                Privacy Policy
              </span>
              .
            </p>

            <button
              type="submit"
              disabled={loading}
              className="bg-orange-400 text-white w-full py-2 rounded-md hover:bg-orange-500 transition duration-300"
            >
              {loading ? "Processing..." : "Sign Up"}
            </button>

            <p className="text-sm text-center">
              Already have an account?{" "}
              <span
                className="text-orange-500 cursor-pointer hover:underline"
                onClick={() => navigate(ROUTER_URL.LOGIN)}
              >
                Log in
              </span>
            </p>
          </form>
        </div>

        {/* Right: Logo */}
        <div className="hidden md:flex w-1/2 bg-[#FECFC2] items-center justify-center">
          <img
            src={LogoImage}
            alt="Souvenir Hub"
            className="max-w-[300px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
