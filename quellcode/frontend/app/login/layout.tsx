export const metadata = {
  title: 'Login',
  description: 'Login to your account'
};

/**
 * A Next.js layout component that renders its children
 * within a basic page layout.
 *
 * This layout is used for the login page.
 *
 * @param {{ children: React.ReactNode }} props
 * The props object must contain a `children` property
 * that is a React node (i.e. an element or array of elements).
 *
 * @returns {JSX.Element}
 * A JSX element that renders the children within a basic page layout.
 */
export default function LoginLayout({
  children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <div>{children}</div>
  );
}