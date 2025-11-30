export const metadata = {
  title: 'Search',
  description: 'Search for stocks'
};
  
export default function SearchLayout({
  children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <div>{children}</div>
  );
}