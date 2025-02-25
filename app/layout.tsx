import { pdfjs, Document, Page } from 'react-pdf';

export const metadata = {
  title: 'Sabiq Muhammad',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <body>{children}</body>
    </html>
  );
}
