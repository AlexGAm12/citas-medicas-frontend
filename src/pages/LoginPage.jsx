import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

export default function LoginPage() {
  const { signin, errors, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [captchaValue, setCaptchaValue] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors: fErrors },
  } = useForm();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "admin") navigate("/admin/");
      else if (user?.role === "doctor") navigate("/doctor/");
      else navigate("/patient/");
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit = handleSubmit(async (data) => {
    await signin(data);
  });

  const useCaptcha = Boolean(import.meta.env.VITE_RECAPTCHA_SITE_KEY);

  return (
    <div className="max-w-md mx-auto mt-10 bg-zinc-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Iniciar sesión</h2>

      {errors?.length > 0 && (
        <div className="bg-red-500 text-white p-2 rounded mb-3">
          {errors.map((e, i) => (
            <p key={i}>{e}</p>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          className="p-2 rounded text-white bg-zinc-900/60 border border-white/10 outline-none placeholder:text-white/40 [text-shadow:none] [filter:none] [-webkit-text-fill-color:currentColor]"
          placeholder="Email"
          {...register("email", { required: "Email requerido" })}
        />
        {fErrors.email && (
          <span className="text-red-300">{fErrors.email.message}</span>
        )}

        <input
          className="p-2 rounded text-white bg-zinc-900/60 border border-white/10 outline-none placeholder:text-white/40 [text-shadow:none] [filter:none] [-webkit-text-fill-color:currentColor]"
          placeholder="Password"
          type="password"
          {...register("password", { required: "Password requerido" })}
        />
        {fErrors.password && (
          <span className="text-red-300">{fErrors.password.message}</span>
        )}

        {useCaptcha && (
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={(val) => setCaptchaValue(val)}
          />
        )}

        <button
          className="bg-blue-600 text-white p-2 rounded disabled:opacity-50"
          disabled={useCaptcha && !captchaValue}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
