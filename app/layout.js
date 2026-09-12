import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Comissió FMó",
  description: "Plataforma de gestió de penyes de la Comissió FMó",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ca">
      <body className="font-display min-h-screen bg-fmo-bg text-white">
        <Providers>
          <Navbar />
          <main className="max-w-6xl mx-auto px-4 py-10">{children}</main>
          <footer className="text-center text-gray-500 text-xs py-10">
            Comissió FMó — tots els drets reservats
          </footer>
        </Providers>
      </body>
    </html>
  );
}
