import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  title: string
  description?: string
  align?: "left" | "center" | "right"
  className?: string
}

export function SectionHeading({ title, description, align = "center", className }: SectionHeadingProps) {
  const alignmentClass =
    align === "left" ? "text-left mx-0" : align === "right" ? "text-right ml-auto" : "text-center mx-auto"
  
  const descriptionAlignmentClass =
    align === "left" ? "mx-0" : align === "right" ? "ml-auto mr-0" : "mx-auto"

  return (
    <div className={cn("mb-16", alignmentClass, className)}>
      <h2 className="font-serif text-4xl md:text-5xl mb-4">{title}</h2>
      {description && (
        <p className={cn("text-muted-foreground text-lg max-w-2xl leading-relaxed", descriptionAlignmentClass)}>{description}</p>
      )}
    </div>
  )
}

