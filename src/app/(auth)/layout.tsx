import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen w-full bg-white dark:bg-slate-900">
      {children}
    </main>
  );
}
