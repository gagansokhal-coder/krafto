// Auth pages (login, register) use a minimal layout — no Navbar/Footer
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
