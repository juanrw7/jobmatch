import '../styles/index.css'

export const metadata = {
  title: 'JobMatch - Portal de Empleo Inteligente',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}