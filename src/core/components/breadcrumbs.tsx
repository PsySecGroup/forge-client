import useTheme from '@suid/material/styles/useTheme'
import styles from './css/breadcrumbs.module.css'

type BreadCrumbsProps = {
  links: { name: string, href: string }[]
  onLinkClick?: (href: string) => void
}

export default function BreadCrumbs (props: BreadCrumbsProps) {
  const theme = useTheme()

  const handleLinkClick = (href: string, event: MouseEvent) => {
    event.preventDefault()
    if (props.onLinkClick) props.onLinkClick(href)
  }

  return (
    <nav class={styles.breadCrumbs}>
      {props.links.map((link, index) => (
        <span class={styles.crumb} key={index}>
          <a
            href={link.href}
            class={styles.link}
            onClick={(event) => handleLinkClick(link.href, event)}
          >
            {link.name}
          </a>
          {index < props.links.length - 1 && <span class={styles.separator}>/</span>}
        </span>
      ))}
    </nav>
  )
}
