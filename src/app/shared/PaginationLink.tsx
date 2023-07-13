interface Props {
  url: string | null;
  active: boolean;
  children: string | JSX.Element | JSX.Element[]
}

function PaginationLink({ url, active, children }: Props) {
  const disabledClass = url ? '' : 'pointer-events-none opacity-70';

  return (
    <a href="#">url</a>
  )
}

export default PaginationLink;