import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
export default function ForgotPasswordPage() {
  return (
    <div className="card">
      <div className="mini-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="brand-mark" src="/logo.webp" alt="Hibi" />
        <div><b>日々 Hibi</b><br /><span>Jour après jour</span></div>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
