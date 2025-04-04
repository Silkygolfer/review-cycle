import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata = {
  title: "CmndCenter",
  description: "You're in control.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
