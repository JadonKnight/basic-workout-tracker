import { useSession } from "next-auth/react";
import Navbar from "./navbar";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="sticky top-0">
        <Navbar />
      </div>
      <div className="min-h-screen bg-gray-100">
        <main>{children}</main>
      </div>
    </>
  );
}
