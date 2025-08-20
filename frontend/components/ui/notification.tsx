"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Separator } from "./spectator";
import { Bell, BellRing, Check, CheckCheck, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: number | string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  category: "payment" | "withdrawal" | "qr_code" | "transaction" | "connection";
  status?: "pending" | "completed" | "failed";
}

interface NotificationNavProps {
  notifications: Array<Notification & {
    category: "payment" | "withdrawal" | "qr_code" | "transaction" | "connection";
  }>;
  onMarkAsRead: (id: number | string) => void;
  onMarkAllAsRead: () => void;
  onRemove: (id: number | string) => void;
  onClearAll: () => void;
}

export default function Notifications({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onRemove,
  onClearAll,
}: NotificationNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <div className="w-3 h-3 bg-green-500 rounded-full" />;
      case "error":
        return <div className="w-3 h-3 bg-red-500 rounded-full" />;
      case "warning":
        return <div className="w-3 h-3 bg-yellow-500 rounded-full" />;
      default:
        return <div className="w-3 h-3 bg-blue-500 rounded-full" />;
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    return notification.category === filter;
  });

  const categories = [
    { value: "all", label: "All", count: notifications.length },
    { value: "unread", label: "Unread", count: notifications.filter((n) => !n.read).length },
    {
      value: "payment",
      label: "Payments",
      count: notifications.filter((n) => n.category === "payment").length,
    },
    {
      value: "withdrawal",
      label: "Withdrawals",
      count: notifications.filter((n) => n.category === "withdrawal").length,
    },
    {
      value: "qr_code",
      label: "QR Codes",
      count: notifications.filter((n) => n.category === "qr_code").length,
    },
    {
      value: "transaction",
      label: "Transactions",
      count: notifications.filter((n) => n.category === "transaction").length,
    },
    {
      value: "connection",
      label: "Connections",
      count: notifications.filter((n) => n.category === "connection").length,
    },
  ];

  return (
    <div
      ref={dropdownRef}
      className="w-fit flex items-center p-[10px] relative h-fit text-[18px] font-[400] opacity-100 gap-[16px] rounded-[60px] bg-transparent shadow-[inset_3px_4px_2px_-1px_rgba(0,0,0,0.23),inset_-5px_-5px_4px_-5px_rgba(251,251,251,0.06)]"
    >
      <Button variant="ghost" onClick={() => setIsOpen(!isOpen)} className="relative group">
        {notifications.filter((n) => !n.read).length > 0 ? (
          <BellRing color="currentColor" size={20} />
        ) : (
          <Bell size={20} color="currentColor" className="stroke-3 text-4xl" />
        )}
        {notifications.filter((n) => !n.read).length > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#8F6DF5] text-white border-0">
            {notifications.filter((n) => !n.read).length > 99
              ? "99+"
              : notifications.filter((n) => !n.read).length}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-80 max-h-[500px] shadow-lg border border-[#8F6DF5]/20 bg-background backdrop-blur-sm z-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center text-foreground">
                <Bell className="mr-2 text-[#8F6DF5]" />
                Notifications
              </CardTitle>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-foreground hover:bg-[#8F6DF5]/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <CardDescription className="text-[#8F6DF5]">Recent activities</CardDescription>
          </CardHeader>

          <div className="px-4 pb-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="text-sm bg-transparent border border-[#8F6DF5]/30 rounded-md px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-[#8F6DF5]"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value} className="bg-background">
                      {category.label} ({category.count})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-1">
                {notifications.filter((n) => !n.read).length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMarkAllAsRead}
                    className="text-foreground hover:bg-[#8F6DF5]/10"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </Button>
                )}
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearAll}
                    className="text-foreground hover:bg-[#8F6DF5]/10"
                    title="Clear all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            <Separator className="bg-[#8F6DF5]/20" />
          </div>

          <CardContent className="p-0 max-h-[350px] overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-[#8F6DF5]">
                <Bell size={70} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm">{filter === "unread" ? "No unread notifications" : "No notifications yet"}</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredNotifications.map((notification, index) => (
                  <div key={notification.id}>
                    <div
                      className={cn(
                        "flex items-start space-x-3 p-4 hover:bg-[#8F6DF5]/10 transition-colors cursor-pointer group",
                        !notification.read && "bg-[#8F6DF5]/5 border-l-2 border-l-[#8F6DF5]"
                      )}
                      onClick={() => !notification.read && onMarkAsRead(notification.id)}
                    >
                      <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4
                              className={cn(
                                "text-sm font-medium truncate text-foreground",
                                !notification.read && "font-semibold"
                              )}
                            >
                              {notification.title}
                              {notification.status && (
                                <span className="ml-2 text-xs text-[#8F6DF5]">
                                  ({notification.status})
                                </span>
                              )}
                            </h4>
                            <p className="text-sm text-[#8F6DF5] mt-1 line-clamp-2">{notification.message}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-xs text-[#8F6DF5]/70">{getTimeAgo(notification.timestamp)}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMarkAsRead(notification.id);
                                }}
                                className="h-6 w-6 p-0 text-foreground hover:bg-[#8F6DF5]/10"
                                title="Mark as read"
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemove(notification.id);
                              }}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-[#8F6DF5]/10"
                              title="Remove"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      {!notification.read && <div className="w-2 h-2 bg-[#8F6DF5] rounded-full flex-shrink-0 mt-2" />}
                    </div>
                    {index < filteredNotifications.length - 1 && <Separator className="bg-[#8F6DF5]/20" />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}