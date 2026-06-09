import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/common/Button";
import { FormInput } from "@/components/forms/FormInput";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/lib/app-store";
import { mockEmployees } from "@/data/mockEmployees";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Login — NFL Guest House" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useApp();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState<"employee" | "admin">(
    "employee"
  );
  const [errors, setErrors] = useState<{ id?: string; pw?: string }>({});
  const [forgot, setForgot] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const errs: typeof errors = {};

    if (!identifier.trim()) {
      errs.id = "Email or User ID is required";
    }

    if (!password.trim()) {
      errs.pw = "Password is required";
    }

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    // Demo login (replace with backend API later)
    const user = mockEmployees.find(
  (e) => e.id === identifier || e.email === identifier
);

if (!user) {
  setErrors({
    id: "User not found",
  });
  return;
}

if (
  loginType === "admin" &&
  user.role !== "admin"
) {
  setErrors({
    id: "This account is not an Admin / HR account",
  });
  return;
}

if (
  loginType === "employee" &&
  user.role !== "employee"
) {
  setErrors({
    id: "This account is not an Employee account",
  });
  return;
}

login(user);

navigate({
  to:
    user.role === "admin"
      ? "/admin/dashboard"
      : "/employee/dashboard",
});

    /*
    Backend integration example:

    const response = await loginApi({
      identifier,
      password,
      loginType,
    });

    login(response.user);

    navigate({
      to:
        response.user.role === "admin"
          ? "/admin/dashboard"
          : "/employee/dashboard",
    });
    */
  };

  return (
    <PublicLayout>
      <section className="mx-auto max-w-6xl px-6 py-12 grid lg:grid-cols-2 gap-10 items-center">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-md">
          {/* Login Type Selector */}
          <div className="mb-6 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setLoginType("employee")}
              className={`rounded-lg py-3 font-medium transition ${
                loginType === "employee"
                  ? "bg-primary text-white"
                  : "border border-border bg-background hover:bg-muted"
              }`}
            >
              Employee Login
            </button>

            <button
              type="button"
              onClick={() => setLoginType("admin")}
              className={`rounded-lg py-3 font-medium transition ${
                loginType === "admin"
                  ? "bg-primary text-white"
                  : "border border-border bg-background hover:bg-muted"
              }`}
            >
              Admin / HR Login
            </button>
          </div>

          <h1 className="text-2xl font-bold">
            {loginType === "employee"
              ? "Employee Login"
              : "Admin / HR Login"}
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Login to access the NFL Guest House Management System
          </p>

          <form className="mt-6 space-y-4" onSubmit={submit}>
            <FormInput
              label="Email / User ID"
              placeholder="Enter your email or user ID"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              error={errors.id}
            />

            <FormInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.pw}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>

              <button
                type="button"
                onClick={() => setForgot(true)}
                className="text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" fullWidth size="lg">
              {loginType === "employee"
                ? "Login as Employee"
                : "Login as Admin / HR"}
            </Button>

            <Link to="/">
              <Button type="button" variant="secondary" fullWidth>
                Back to Home
              </Button>
            </Link>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            Enter your credentials to continue.
          </p>
        </div>

        <div className="hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80"
            alt="Hotel"
            className="rounded-2xl shadow-xl"
          />
        </div>
      </section>

      <Modal
        open={forgot}
        onClose={() => setForgot(false)}
        title="Password Reset"
        footer={
          <Button onClick={() => setForgot(false)}>
            Close
          </Button>
        }
      >
        <p className="text-sm text-foreground/80">
          Password reset will be handled by the backend/admin team.
        </p>
      </Modal>
    </PublicLayout>
  );
}