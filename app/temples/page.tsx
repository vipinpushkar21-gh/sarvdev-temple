import { Suspense } from 'react'
import TemplesPageContent from './TemplesPageContent'
import { TempleGridSkeleton } from '../../components/Skeleton'

export default function TemplesPage() {
  return (
    <Suspense fallback={<TempleGridSkeleton count={8} />}>
      <TemplesPageContent />
    </Suspense>
  )
}
