"use client"

interface SmoothLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  title?: string
}

export function SmoothLink({ href, children, className, title }: SmoothLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("#")) return

    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <a href={href} onClick={handleClick} className={className} title={title}>
      {children}
    </a>
  )
}
