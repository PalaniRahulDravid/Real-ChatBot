import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  // State for form inputs
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  // UI feedback states
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ error: "", success: "" });
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Form validation
  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = "Please enter your username.";
    if (!form.email.trim()) newErrors.email = "Please enter your email.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Please enter a valid email.";
    if (!form.password.trim()) newErrors.password = "Please enter your password.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ error: "", success: "" });

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "https://real-chatbot.onrender.com/api"}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMsg({ error: data.error || "Something went wrong", success: "" });
        setLoading(false);
        return;
      }

      setMsg({ success: "✅ Registered Successfully!", error: "" });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);
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
        <h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>

        {/* Username Field */}
        <div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className={`w-full p-2 rounded bg-[#343541] border ${
              errors.username ? "border-red-500" : "border-gray-600"
            } outline-none`}
          />
          {errors.username && (
            <p className="text-red-400 text-sm mt-1">{errors.username}</p>
          )}
        </div>

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

        {/* Success / Error Messages */}
        {msg.error && (
          <p className="text-red-400 text-center text-sm">{msg.error}</p>
        )}
        {msg.success && (
          <p className="text-green-400 text-center text-sm">{msg.success}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[#10A37F] py-2 rounded font-semibold transition-all ${
            loading
              ? "opacity-70 cursor-not-allowed bg-[#0e8c6c]"
              : "hover:opacity-90"
          }`}
        >
          {loading ? "⏳ Creating Account..." : "Register"}
        </button>

        {/* Redirect to Login */}
        <p className="text-center text-sm mt-2">
          Already registered?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;
