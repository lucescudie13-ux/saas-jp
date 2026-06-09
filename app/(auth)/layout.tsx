import { BrandAside } from "@/components/auth/BrandAside";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth">
      <BrandAside />
      <main className="main">{children}</main>
    </div>
  );
}
