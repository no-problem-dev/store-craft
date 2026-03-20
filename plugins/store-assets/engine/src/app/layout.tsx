import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "store-craft engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { overflow: hidden; }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
