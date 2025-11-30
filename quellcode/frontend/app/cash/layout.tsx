export const metadata = {
  title: 'Cash',
  description: 'Manage your cash transactions',
};

export default function CashLayout({
  children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <div >{children}</div>
  );
}