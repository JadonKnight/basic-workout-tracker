import Navbar from "./navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0">
        <Navbar />
      </div>
      <main className="flex-grow bg-gray-100">{children}</main>
    </div>
  );
}