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
        message.success("Đăng nhập thành công!");
        navigate(ROUTER_URL.COMMON.HOME);
      } else {
        message.error("Phản hồi đăng nhập không hợp lệ.");
      }
    } catch {
      message.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      await loginGoogle(idToken);
      message.success("Đăng nhập Google thành công!");
      navigate(ROUTER_URL.COMMON.HOME);
    } catch {
      message.error("Đăng nhập Google thất bại");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7F6] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg flex max-w-5xl w-full overflow-hidden">
        {/* Left: Login Form */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-2xl font-bold mb-2">Đăng nhập</h2>
          <p className="text-gray-500 mb-6">
            Chào mừng bạn đến với Souvenir Hub
          </p>
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
                  placeholder="Mật khẩu"
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
                Quên mật khẩu?
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-400 text-white w-full py-2 rounded-md hover:bg-orange-500 transition duration-300"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <div className="mt-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full  px-4 py-2 flex items-center justify-center gap-2 mb-2"
            >
              <img
                src="https://img.icons8.com/color/16/000000/google-logo.png"
                alt="Google"
              />
              Đăng nhập với Google
            </button>
            <p className="text-center mt-4 text-sm">
              Chưa có tài khoản?{" "}
              <span
                className="text-orange-500 cursor-pointer hover:underline"
                onClick={() => navigate(ROUTER_URL.SIGNUP)}
              >
                Đăng ký
              </span>
            </p>
          </div>
        </div>

        {/* Right: Logo Section */}
        <div className="hidden md:flex w-1/2 bg-[#F3B5A0] items-center justify-center">
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
