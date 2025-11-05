'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  ChevronsLeft,
  LayoutDashboard,
  NotebookPen,
  CircleUser,
  FileText,
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Admin token check
  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('/api/auth/isAdmin', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 403) {
          router.push('/login');
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        router.push('/login');
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return <div className="p-8 bg-background min-h-screen text-primary">Loading...</div>;
  }



  return (
    <>
      {/* Main Content */}
      <main className="flex-1 p-8 md:pb-8 pb-20 transition-all duration-300 ease-in-out">
        {children}
      </main>
    </>
  );
}
