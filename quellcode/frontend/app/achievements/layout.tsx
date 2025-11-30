export const metadata = {
  title: 'Achievements',
  description: 'Look at what achievements you can get.'
};

export default function AchievementsLayout({
  children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <div>{children}</div>
  );
}