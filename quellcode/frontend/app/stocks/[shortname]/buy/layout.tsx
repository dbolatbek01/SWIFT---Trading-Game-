export const metadata = {
    title: 'Buy',
    description: 'Buy stocks'
};
  
export default function BuyLayout({
  children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <div>{children}</div>
  );
}