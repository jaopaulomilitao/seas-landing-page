// src/app/keystatic/layout.tsx
import KeystaticApp from "./keystatic";

// é retornado o aplicativo como layout principal
export default function Layout() {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <KeystaticApp />
      </body>
    </html>
  );
}