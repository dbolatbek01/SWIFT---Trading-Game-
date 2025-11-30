export const metadata = {
    title: 'Sell',
    description: 'Sell stocks'
};
  
export default function SellLayout({
  children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <div>{children}</div>
  );
}