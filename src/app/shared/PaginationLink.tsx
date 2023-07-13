import Link from 'next/link'

interface Props {
  url: string | null;
  active: boolean;
  children: string | JSX.Element | JSX.Element[]
}

function PaginationLink({ url, active, children }: Props) {
  const disabledClass = url ? '' : 'pointer-events-none opacity-70';
  if (!url) url = '#'

  return (
  <Link
      href={url}
      className={
        active ?
          `bg-zinc-900 text-white px-4 py-2 rounded text-sm ${disabledClass}` :
          `text-zinc-500 hover:bg-zinc-900 hover:text-white hover:rounded transition px-4 py-2 text-sm ${disabledClass}`
      }
    >
      {children}
    </Link>
  )
}

export default PaginationLink;