import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
export default function ForgotPasswordPage() {
  return (
    <div className="card">
      <div className="mini-brand">
        <div className="seal">日</div>
        <div><b>日々 Hibi</b><br /><span>Jour après jour</span></div>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
