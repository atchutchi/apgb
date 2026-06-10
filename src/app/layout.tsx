import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "APGB | Administração dos Portos da Guiné-Bissau",
    template: "%s | APGB",
  },
  description:
    "Portal oficial da Administração dos Portos da Guiné-Bissau e do Porto de Bissau.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
