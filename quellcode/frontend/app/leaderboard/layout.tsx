export const metadata = {
  title: 'Leaderboard',
  description: 'Compare your portfolio with others!'
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