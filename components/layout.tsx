import { useSession } from "next-auth/react";
import Navbar from "./navbar";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <main>{children}</main>
      </div>
    </>
  );
}
