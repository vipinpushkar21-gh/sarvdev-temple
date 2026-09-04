import { permanentRedirect } from 'next/navigation'

export default function ContributorsRedirect() {
  permanentRedirect('/about')
}
