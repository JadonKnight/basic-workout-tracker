import "@/styles/globals.css";
import Navbar from "@/components/navbar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Footer from "@/components/footer";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <Navbar session={session} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
