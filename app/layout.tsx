import type { Metadata } from "next";
import { DemoProvider } from "@/components/providers/DemoProvider";
import { PreferencesProvider } from "@/components/providers/PreferencesProvider";
import { MobileFrame } from "@/components/layout/MobileFrame";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kidney Breathalyzer",
  description: "คัดกรองความเสี่ยงโรคไตจากลมหายใจ",
  icons: {
    icon: "/favicon.svg",
    apple: "/Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var r=localStorage.getItem("kidney-breathalyzer-preferences");if(r){var p=JSON.parse(r);var d=p.displayMode==="standard"?"mobile":p.displayMode;if(d)document.documentElement.dataset.display=d;if(p.locale){document.documentElement.lang=p.locale==="th"?"th":"en";document.cookie="kb-locale="+p.locale+";path=/;max-age=31536000;SameSite=Lax";}}}catch(e){}`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <DemoProvider>
          <PreferencesProvider>
            <MobileFrame>{children}</MobileFrame>
          </PreferencesProvider>
        </DemoProvider>
      </body>
    </html>
  );
}
