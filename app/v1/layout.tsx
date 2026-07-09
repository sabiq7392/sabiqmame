import LayoutShell from "@/components/v1/LayoutShell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutShell>
      {children}
    </LayoutShell>
  )
}