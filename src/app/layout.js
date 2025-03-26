import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata = {
  title: "Review-Cycle",
  description: "Get approvals, fast.",
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
