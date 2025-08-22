"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Notification = {
  id: string | number;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  category: "payment" | "withdrawal" | "qr_code" | "transaction"| "connection";
  link?: string;
  status?: "pending" | "completed" | "failed";
  amount?: number | string;
  currency?: string;

};

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (
    n: Omit<Notification, "read" | "timestamp"> & Partial<Pick<Notification, "timestamp" | "read">>
  ) => void;
  markAsRead: (id: string | number) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string | number) => void;
  clearAll: () => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

const STORAGE_KEY = "starkpay_notifications_v1";

function load(): Notification[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as any[];
    return parsed.map((n) => ({ ...n, timestamp: new Date(n.timestamp) }));
  } catch {
    return [];
  }
}

function save(notifs: Notification[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs));
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setNotifications(load());
  }, []);

  useEffect(() => {
    save(notifications);
  }, [notifications]);

  const api = useMemo<NotificationContextType>(
    () => ({
      notifications,
      addNotification: (n) => {
        const notif: Notification = {
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          category: n.category,
          link: n.link,
          status: n.status,
          read: n.read ?? false,
          timestamp: n.timestamp ?? new Date(),
          amount: n.amount,
          currency : n.currency,
        };
        setNotifications((prev) => [notif, ...prev]);
      },
      markAsRead: (id) => {
        setNotifications((prev) => prev.map((x) => (x.id === id ? { ...x, read: true } : x)));
      },
      markAllAsRead: () => {
        setNotifications((prev) => prev.map((x) => ({ ...x, read: true })));
      },
      removeNotification: (id) => {
        setNotifications((prev) => prev.filter((x) => x.id !== id));
      },
      clearAll: () => setNotifications([]),
    }),
    [notifications]
  );

  return <NotificationContext.Provider value={api}>{children}</NotificationContext.Provider>;
}

export default function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
