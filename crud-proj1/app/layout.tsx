import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";

// Set the browser tab title and other page metadata for the whole app.
export const metadata: Metadata = {
  title: "CRUD - NextJS 15 with Supabase",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      {/* Next.js renders each page inside this shared layout. */}
      <body>{children}</body>
    </html>
  );
}
