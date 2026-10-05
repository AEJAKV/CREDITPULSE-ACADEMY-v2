'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  LayoutDashboard,
  Library,
  BookOpen,
  Settings,
  Users,
  Check,
  Menu,
  X,
  ShieldCheck,
  Inbox,
} from 'lucide-react';
import { Logo, TierBadge } from './ui';
import { TierMedal } from './visuals';
import { tiers, segmentNames, segmentLessons } from '@/lib/catalog';
import { Logout } from './forms';
import type { Course, Enrollment } from '@/lib/types';
export function Navigation({
  course,
  enrollment,
  admin = false,
  name,
}: {
  course?: Course;
  enrollment?: Enrollment;
  admin?: boolean;
  name: string;
}) {
  const pathname = usePathname(),
    [open, setOpen] = useState(false),
    drawer = useRef<HTMLDivElement>(null),
    toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    drawer.current?.querySelector<HTMLElement>('button,a')?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key === 'Tab') {
        const nodes = drawer.current?.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),summary',
        );
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener('keydown', handler);
    };
  }, [open]);
  const links = admin
    ? [
        { href: '/admin', text: 'Overview', icon: LayoutDashboard },
        { href: '/admin/members', text: 'Members', icon: Users },
        { href: '/admin/curriculum', text: 'Curriculum', icon: BookOpen },
        { href: '/admin/approvals', text: 'Approval queue', icon: Inbox },
        { href: '/admin/settings', text: 'Settings', icon: Settings },
      ]
    : [
        { href: '/dashboard', text: 'My learning', icon: LayoutDashboard },
        { href: '/courses', text: 'Course library', icon: Library },
        { href: '/savings', text: 'Savings Book', icon: BookOpen },
      ];
  const content = (
    <>
      <div className="sidebar-brand">
        <Logo light />
        {admin && <span className="admin-label">ADMINISTRATION</span>}
      </div>
      <nav aria-label={admin ? 'Admin navigation' : 'Member navigation'} className="main-nav">
        {links.map((item) => (
          <Link
            className={
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href + '/'))
                ? 'active'
                : ''
            }
            href={item.href}
            key={item.href}
          >
            <item.icon size={18} />
            {item.text}
          </Link>
        ))}
      </nav>
      {!admin && course && enrollment && (
        <div className="sidebar-course">
          <div className="sidebar-heading">
            <span>YOUR COURSE</span>
            <TierBadge tier={enrollment.tier} small />
          </div>
          <Link href="/dashboard" className="sidebar-course-title">
            {course.title}
          </Link>
          <nav aria-label="Course curriculum" className="course-nav">
            {tiers.map((tier, i) => {
              const lessons = segmentLessons(course, i),
                locked = i > enrollment.tier,
                done = lessons.filter((l) => enrollment.completed.includes(l.id)).length;
              return (
                <details
                  key={tier}
                  open={
                    i ===
                    (course.lessons.find((l) => pathname.includes(l.id))?.tier ?? enrollment.tier)
                  }
                >
                  <summary>
                    <span className="tier-index-medal" aria-hidden="true">
                      <TierMedal
                        tier={i}
                        size={26}
                        dark
                        state={
                          done === lessons.length
                            ? 'earned'
                            : i === enrollment.tier
                              ? 'current'
                              : locked
                                ? 'locked'
                                : 'plain'
                        }
                      />
                    </span>
                    <span>
                      {tier}
                      <span className="sr-only">
                        {done === lessons.length
                          ? ' (earned)'
                          : i === enrollment.tier
                            ? ' (current level)'
                            : locked
                              ? ' (locked)'
                              : ''}
                      </span>
                    </span>
                    <small>
                      {done}/{lessons.length}
                    </small>
                  </summary>
                  <Link className="segment-link" href={`/course/${course.id}/segment/${i + 1}`}>
                    {course.segmentNames[i]}
                  </Link>
                  {!locked &&
                    lessons.map((l) => (
                      <Link
                        className={`sidebar-lesson ${pathname.includes(l.id) ? 'current' : ''}`}
                        href={`/course/${course.id}/lesson/${l.id}`}
                        key={l.id}
                        aria-current={pathname.includes(l.id) ? 'page' : undefined}
                      >
                        <span>
                          {enrollment.completed.includes(l.id) ? <Check size={13} /> : l.number}
                        </span>
                        {l.title}
                      </Link>
                    ))}
                </details>
              );
            })}
          </nav>
        </div>
      )}
      <div className="sidebar-bottom">
        <div className="account-line">
          <span className="avatar">
            {name
              .split(' ')
              .map((x) => x[0])
              .slice(0, 2)
              .join('')}
          </span>
          <span>
            <strong>{name}</strong>
            <small>{admin ? 'Administrator' : 'Member account'}</small>
          </span>
        </div>
        <div className="sidebar-assurance">
          <ShieldCheck size={16} />
          <span>Progress saved to your account</span>
        </div>
        <Logout />
      </div>
    </>
  );
  return (
    <>
      <aside className="sidebar desktop-sidebar">{content}</aside>
      <div className="mobile-top">
        <Logo />
        <button
          ref={toggle}
          className="icon-button"
          aria-label="Open navigation"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu />
        </button>
      </div>
      {open && (
        <div className="drawer-backdrop" onClick={() => setOpen(false)}>
          <div
            className="sidebar mobile-drawer"
            ref={drawer}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="drawer-close icon-button"
              aria-label="Close navigation"
              onClick={() => {
                setOpen(false);
                toggle.current?.focus();
              }}
            >
              <X />
            </button>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
