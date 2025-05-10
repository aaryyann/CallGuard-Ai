"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Phone,
  Search,
  Bell,
  AlertCircle,
  Settings,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SessionProvider } from "next-auth/react";
import UserButton from "@/components/user-button";
import { UploadCallDialog } from "@/components/upload-call";

interface CallData {
  _id: string;
  callDate: string;
  patientName: string;
  doctorName: string,
  duration: number;
  riskLevel: "high" | "medium" | "low" | "none";
}

export default function Dashboard() {
  const [calls, setCalls] = useState<CallData[]>([]);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const res = await fetch("/api/call-upload", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const json = await res.json();
        if (json.success) {
          setCalls(json.data);
        }
      }
      catch (e) {
        console.log("failed to fetch calls")
      }
    }

    fetchCalls()
  }, [])

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "text-destructive bg-destructive/10 border-destructive/20";
      case "medium": return "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900/30 dark:text-amber-500";
      case "low": return "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-500";
      default: return "text-muted-foreground bg-muted border-muted-foreground/20";
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 bg-card border-r">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">CallGuard AI</span>
          </Link>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
            <Phone className="h-5 w-5" />
            <span>Calls</span>
          </Link>

          <Link href="/dashboard/patients" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted transition-colors">
            <User className="h-5 w-5" />
            <span>Patients</span>
          </Link>

          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted transition-colors">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-4 sticky top-0 z-10">
          <Button variant="ghost" size="icon" className="md:hidden">
            <ShieldAlert className="h-5 w-5" />
          </Button>

          <div className="flex items-center md:ml-4 w-full max-w-md">
            <Search className="h-4 w-4 mr-2 text-muted-foreground absolute ml-3" />
            <Input placeholder="Search calls, patients..." className="pl-9" />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <ModeToggle />

            <SessionProvider><UserButton /></SessionProvider>
          </div>
        </header>

        {/* Main content */}
        <main className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Patient Calls</h1>
              <p className="text-muted-foreground">Manage and analyze patient call recordings.</p>
            </div>

            <UploadCallDialog />
          </div>

          <Alert className="mb-6 border-chart-1/30 bg-chart-1/10">
            <AlertCircle className="h-4 w-4 text-chart-1" />
            <AlertTitle className="text-chart-1">Attention Required</AlertTitle>
            <AlertDescription>
              You have 2 high-risk calls that need your review.
            </AlertDescription>
          </Alert>

          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Recent Calls</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Date & Time</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Patient</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Duration</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Risk Level</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Doctor</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {calls.map((call) => (
                    <tr key={call._id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-sm">{new Date(call.callDate).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm font-medium">{call.patientName}</td>
                      <td className="px-4 py-3 text-sm">{call.duration}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRiskColor(call.riskLevel)}`}>
                          {call.riskLevel.charAt(0).toUpperCase() + call.riskLevel.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{call.doctorName}</td>
                      <td className="px-4 py-3 text-sm">
                        <Button variant="ghost" size="sm">View Details</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}