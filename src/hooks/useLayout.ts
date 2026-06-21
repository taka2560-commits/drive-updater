import { useState, useEffect } from 'react';

export type LayoutMode = 'A' | 'B' | 'C';

export function useLayout() {
  const [layout, setLayout] = useState<LayoutMode>(() => {
    return (localStorage.getItem('layoutMode') as LayoutMode) || 'A';
  });

  useEffect(() => {
    localStorage.setItem('layoutMode', layout);
  }, [layout]);

  return [layout, setLayout] as const;
}
