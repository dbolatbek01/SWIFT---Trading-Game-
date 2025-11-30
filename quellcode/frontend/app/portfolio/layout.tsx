export const metadata = {
  title: 'Portfolio',
  description: 'Oversee your portfolio'
};
  
export default function PortLayout({
  children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <div>{children}</div>
  );
}