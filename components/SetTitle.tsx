'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/stores/appStore';

export default function SetTitle({ title }: { title: string }) {
  const { setPageTitle } = useAppStore();

  useEffect(() => {
    setPageTitle(title);
  }, [title, setPageTitle]);

  return null;
}
