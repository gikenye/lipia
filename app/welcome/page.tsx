"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Shield, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleSignIn } from "@/components/google-signin";

export default function Welcome() {
  const [showAuth, setShowAuth] = useState(false);

  const benefits = [
    {
      icon: Zap,
      title: "Instant Transfers",
      description: "Send money to Kenya in seconds, not days"
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description: "Bank-level security with blockchain technology"
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Send from anywhere, receive in Kenya"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💸</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Send Money to Kenya
            </h1>
            <p className="text-gray-600 text-lg">
              Fast, secure, and affordable transfers using PYUSD
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-4 mb-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="space-y-4">
          {!showAuth ? (
            <>
              <Button 
                onClick={() => setShowAuth(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full py-4">
                  Explore First
                </Button>
              </Link>
            </>
          ) : (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-center">Sign in to continue</h3>
              <GoogleSignIn />
              <p className="text-xs text-gray-500 text-center mt-4">
                By continuing, you agree to our Terms of Service
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}