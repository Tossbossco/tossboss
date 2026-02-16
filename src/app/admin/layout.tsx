import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${GeistMono.variable} ${GeistPixelSquare.variable} font-pixel`}>
      {children}
    </div>
  );
}
