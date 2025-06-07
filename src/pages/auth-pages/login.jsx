import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../services/auth-service/auth.service";
import { ROUTER_URL } from "../../const/router.const";
import { message } from "antd";
import LogoImage from "../../assets/souvenir-hub-logo.png";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase-config";
import { useAuth } from "../../context/auth.context";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const { loginGoogle, handleLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await AuthService.login({
        email: form.email,
        password: form.password,
      });
      if (response?.data?.token && response?.data?.user) {
        await handleLogin(response.data.token, response.data.user);
        message.success("Login successful!");
        navigate(ROUTER_URL.COMMON.HOME);
      } else {
        message.error("Invalid login response.");
      }
    } catch {
      message.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      await loginGoogle(idToken);
      message.success("Google login successful!");
      navigate(ROUTER_URL.COMMON.HOME);
    } catch {
      message.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7F6] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg flex max-w-5xl w-full overflow-hidden">
        {/* Left: Login Form */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-2xl font-bold mb-2">Login</h2>
          <p className="text-gray-500 mb-6">Welcome to Souvenir Hub</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-orange-300"
              />
            </div>
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-orange-300"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 cursor-pointer text-sm text-gray-500"
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>

              <div className="text-sm text-right mt-1 text-blue-600 cursor-pointer hover:underline">
                Forgot password?
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-400 text-white w-full py-2 rounded-md hover:bg-orange-500 transition duration-300"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full border px-4 py-2 rounded-md flex items-center justify-center gap-2 mb-2"
            >
              <img
                src="https://img.icons8.com/color/16/000000/google-logo.png"
                alt="Google"
              />
              Login with Google
            </button>
            <button className="w-full border px-4 py-2 rounded-md flex items-center justify-center gap-2">
              <img
                src="https://img.icons8.com/color/16/000000/facebook-new.png"
                alt="Facebook"
              />
              Login with Facebook
            </button>
            <p className="text-center mt-4 text-sm">
              Don’t have an account?{" "}
              <span className="text-orange-500 cursor-pointer hover:underline">
                Sign up
              </span>
            </p>
          </div>
        </div>

        {/* Right: Logo Section */}
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

export default LoginPage;
