import { redirect } from 'next/navigation'

export default function Page() {
  // Redirect this generic Sahasranama route to Ganesh-specific nested route
  redirect('/devotionals/ganesha/sahasranama')
}
