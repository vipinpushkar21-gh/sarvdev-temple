export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Login page is standalone — hide shared chrome */}
      <style>{`
        header, footer, .disclaimer, .fixed { display: none !important; }
        body > .flex-1, [class*="flex-1"] { flex: unset; }
      `}</style>
      {children}
    </>
  )
}
