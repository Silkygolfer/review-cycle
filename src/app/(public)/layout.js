import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/sections/navbar/default";
import "../globals.css";

export const metadata = {
  title: "CmndCenter",
  description: "You're in control.",
};

export default function RootPublicLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
      <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
