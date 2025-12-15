import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import ReCAPTCHA from "react-google-recaptcha";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

export default function RegisterPage() {
  const { signup, errors } = useAuth();
  const navigate = useNavigate();

  const [captchaValue, setCaptchaValue] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors: fErrors, isSubmitting },
  } = useForm({
    defaultValues: { role: "paciente" },
  });

  const useCaptcha = Boolean(import.meta.env.VITE_RECAPTCHA_SITE_KEY);

  const password = watch("password");
  const password2 = watch("password2");

  useMemo(() => {
    if (!password2) return;
    if (password !== password2) {
      setError("password2", { type: "validate", message: "Las contraseñas no coinciden" });
    } else {
      clearErrors("password2");
    }
  }, [password, password2, setError, clearErrors]);

  const onSubmit = handleSubmit(async (data) => {
    if (data.password !== data.password2) {
      setError("password2", { type: "validate", message: "Las contraseñas no coinciden" });
      return;
    }

    await signup({
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role,
    });

    navigate("/login");
  });

  const inputBase =
    "p-2 rounded text-white bg-zinc-900/60 border border-white/10 outline-none placeholder:text-white/40 [text-shadow:none] [filter:none] [-webkit-text-fill-color:currentColor]";

  return (
    <div className="max-w-md mx-auto mt-10 bg-zinc-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Registro</h2>

      {errors?.length > 0 && (
        <div className="bg-red-500 text-white p-2 rounded mb-3">
          {errors.map((e, i) => (
            <p key={i}>{e}</p>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          className={inputBase}
          placeholder="Username"
          {...register("username", { required: "Username requerido" })}
        />
        {fErrors.username && <span className="text-red-300">{fErrors.username.message}</span>}

        <input
          className={inputBase}
          placeholder="Email"
          {...register("email", { required: "Email requerido" })}
        />
        {fErrors.email && <span className="text-red-300">{fErrors.email.message}</span>}

        <div className="relative">
          <input
            className={`${inputBase} w-full pr-10`}
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            {...register("password", { required: "Password requerido" })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
          >
            {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
          </button>
        </div>
        {fErrors.password && <span className="text-red-300">{fErrors.password.message}</span>}

        <div className="relative">
          <input
            className={`${inputBase} w-full pr-10`}
            placeholder="Confirmar password"
            type={showPassword2 ? "text" : "password"}
            {...register("password2", { required: "Confirma tu password" })}
          />
          <button
            type="button"
            onClick={() => setShowPassword2((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
          >
            {showPassword2 ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
          </button>
        </div>
        {fErrors.password2 && <span className="text-red-300">{fErrors.password2.message}</span>}

        <select className={inputBase} {...register("role", { required: true })}>
          <option value="paciente" className="bg-zinc-900">Paciente</option>
          <option value="doctor" className="bg-zinc-900">Doctor</option>
          <option value="admin" className="bg-zinc-900">Admin</option>
        </select>

        {useCaptcha && (
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={(val) => setCaptchaValue(val)}
          />
        )}

        <button
          className="bg-green-600 text-white p-2 rounded disabled:opacity-50"
          disabled={(useCaptcha && !captchaValue) || isSubmitting}
        >
          Crear cuenta
        </button>
      </form>
    </div>
  );
}
