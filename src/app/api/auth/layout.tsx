export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full fixed inset-0 z-50 flex items-center justify-center bg-background">
      {children}
    </div>
  );
}
