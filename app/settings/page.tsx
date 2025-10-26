"use client";

import Link from "next/link";
import { ArrowLeft, User, Shield, Bell, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4">
        <div className="flex items-center gap-4 max-w-md mx-auto">
          <Link href="/dashboard">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <h1 className="text-lg font-semibold">Settings</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Account Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Account</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium">Your Account</p>
                <p className="text-sm text-gray-500">Connected via Google</p>
              </div>
            </div>
            <div className="pl-12">
              <p className="text-xs text-gray-400 font-mono">0x41bD...a74</p>
            </div>
          </div>
        </div>

        {/* Settings Options */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
            <Shield className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Security</span>
          </div>
          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Notifications</span>
          </div>
          <div className="p-4 flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Help & Support</span>
          </div>
        </div>
      </div>
    </div>
  );
}