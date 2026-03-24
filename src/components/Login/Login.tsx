import { useState } from "react";
import styles from "./Login.module.scss";

type Mode = "login" | "signup";

interface LoginProps {
  open: boolean;
  onClose: () => void;
}

export function Login({ open, onClose }: LoginProps) {
  const [mode, setMode] = useState<Mode>("login");

  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          ×
        </button>

        <h2 className={styles.title}>
          {mode === "login" ? "Log in" : "Create account"}
        </h2>

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <label className={styles.label}>
            Email
            <input className={styles.input} type="email" placeholder="you@example.com" />
          </label>

          <label className={styles.label}>
            Password
            <input className={styles.input} type="password" placeholder="••••••••" />
          </label>

          {mode === "signup" && (
            <label className={styles.label}>
              Confirm Password
              <input className={styles.input} type="password" placeholder="••••••••" />
            </label>
          )}

          <button className={styles.submitBtn} type="submit">
            {mode === "login" ? "Log in" : "Sign up"}
          </button>
        </form>

        <p className={styles.toggle}>
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button className={styles.toggleBtn} onClick={() => setMode("signup")}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button className={styles.toggleBtn} onClick={() => setMode("login")}>
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
