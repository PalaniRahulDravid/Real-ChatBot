import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState({ error: "", success: "" });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Please enter your email.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Please enter a valid email address.";
    if (!form.password.trim())
      newErrors.password = "Please enter your password.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ error: "", success: "" });

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "https://real-chatbot.onrender.com/api"}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMsg({ error: data.error || "Invalid email or password.", success: "" });
        setLoading(false);
        return;
      }

      // Store token and redirect after success
      localStorage.setItem("token", data.token);
      setMsg({ success: "✅ Login successful! Redirecting...", error: "" });

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Login Error:", err);
      setMsg({ error: "⚠️ Server error. Please try again later.", success: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#343541] text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#202123] p-8 rounded-lg shadow-lg w-[90%] max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Welcome Back</h2>

        {/* Email Field */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={`w-full p-2 rounded bg-[#343541] border ${
              errors.email ? "border-red-500" : "border-gray-600"
            } outline-none`}
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className={`w-full p-2 rounded bg-[#343541] border ${
              errors.password ? "border-red-500" : "border-gray-600"
            } outline-none`}
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Feedback Messages */}
        {msg.error && (
          <p className="text-red-400 text-center text-sm">{msg.error}</p>
        )}
        {msg.success && (
          <p className="text-green-400 text-center text-sm">{msg.success}</p>
        )}

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[#10A37F] py-2 rounded font-semibold transition-all ${
            loading
              ? "opacity-70 cursor-not-allowed bg-[#0e8c6c]"
              : "hover:opacity-90"
          }`}
        >
          {loading ? "🔐 Logging in..." : "Login"}
        </button>

        {/* Redirect to Register */}
        <p className="text-center text-sm mt-2">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
