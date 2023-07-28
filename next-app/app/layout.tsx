import "@/styles/globals.css";
import Navbar from "@/components/navbar";
import fetchServerSideSession from "@/lib/fetchServerSideSession";
import Footer from "@/components/footer";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await fetchServerSideSession();

  return (
    <html lang="en">
      <body>
        <div className="flex flex-col min-h-screen">
          <div className="sticky top-0">
            <Navbar session={session} />
          </div>
          <main
            className="flex-grow bg-gradient-to-b from-violet-500
                  to-blue-500"
          >
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}