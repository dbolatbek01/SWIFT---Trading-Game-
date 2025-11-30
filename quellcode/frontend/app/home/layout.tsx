export const metadata = {
  title: 'Home',
  description: 'Oversee the performance of your portfolio and compare it to the NASDAQ.'
};

export default function HomeLayout({
  children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <div>{children}</div>
  );
}