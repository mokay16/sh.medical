import { notFound } from 'next/navigation'
import { DeptFooter, DeptHeader } from '@/components/DeptChrome'
import { getDepartment, getDepartments } from '@/lib/content'

export async function generateStaticParams() {
  return (await getDepartments()).map((d) => ({ dept: d.slug }))
}

/** Inside a department, its own header and footer replace SH Medical's. */
export default async function DepartmentLayout({ children, params }: { children: React.ReactNode; params: Promise<{ dept: string }> }) {
  const d = await getDepartment((await params).dept)
  if (!d) notFound()
  return (
    <>
      <DeptHeader d={d} />
      <main id="main">{children}</main>
      <DeptFooter d={d} />
    </>
  )
}
