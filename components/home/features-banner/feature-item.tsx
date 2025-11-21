import { LucideProps } from 'lucide-react'
import { ForwardRefExoticComponent, RefAttributes } from 'react'

interface FeatureItemProps {
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
  title: string
  description: string
}


export default function FeatureItem({ icon: Icon, ...feature }: FeatureItemProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <Icon className="h-6 w-6 text-foreground" strokeWidth={1.5} />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium uppercase tracking-wide">{feature.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
      </div>
    </div>
  )
}