export const metadata = {
  title: 'Profile',
  description: 'Watch your profile.'
};

export default function ProfileLayout({
  children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <div>{children}</div>
  );
}