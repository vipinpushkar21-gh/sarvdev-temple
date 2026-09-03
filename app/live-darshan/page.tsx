import { redirect } from 'next/navigation'

export default function LiveDarshanPage() {
  redirect('/daily-darshan?type=live')
}
