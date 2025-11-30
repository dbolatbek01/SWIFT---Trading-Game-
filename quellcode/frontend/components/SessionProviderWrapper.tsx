'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

/**
 * A wrapper component that provides NextAuth.js session context to its children.
 *
 * This component is used to wrap the main app component and provide session context
 * to all components in the app.
 *
 * @param {{ children: ReactNode }} props
 * The props object must contain a `children` property
 * that is a React node (i.e. an element or array of elements).
 *
 * @returns {JSX.Element}
 * A JSX element that wraps the children in a NextAuth.js SessionProvider.
 */
export default function SessionProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
