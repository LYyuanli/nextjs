'use client';

import { Provider } from "react-redux";
import { makeStore, AppStore } from './store';
import { useRef } from 'react';

export function Providers({
  children,
  initialState
}: {
  children: React.ReactNode;
  initialState?: any;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    // Create store instance once during the lifetime of the app
    storeRef.current = makeStore(initialState);
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}
