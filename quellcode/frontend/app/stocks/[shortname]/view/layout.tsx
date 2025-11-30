export const metadata = {
    title: 'View Stocks',
    description: 'View stocks'
};
  
/**
 * A Next.js layout component for viewing a stock's details.
 *
 * This component is not intended to be used directly. Instead, it should be used
 * as a layout component for the `/stocks/[shortname]/view` pages.
 *
 * @param {{ children: React.ReactNode }} props
 * The props object must contain a `children` property
 * that is a React node (i.e. an element or array of elements).
 *
 * @returns {JSX.Element}
 * A JSX element that renders the children within a basic page layout.
 */
export default function ViewLayout({
  children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <div>{children}</div>
  );
}