import Link from "next/link"

type AuthHeaderProps = {
  title: string
  description: string
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <div className="text-center mb-8">
      <Link href="/" className="inline-block mb-6">
        <h1 className="font-serif text-3xl">BITCOT</h1>
      </Link>
      <h2 className="text-2xl font-medium mb-2">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}


