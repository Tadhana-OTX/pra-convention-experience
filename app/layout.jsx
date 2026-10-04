import "./globals.css";

export const metadata = {
  title: "Your PRA. Your Experience.",
  description:
    "An interactive experience poll for the PRA Convention — Northmin.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
