"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  DollarSign,
  Clock,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleSignIn } from "@/components/google-signin";

export default function Welcome() {
  const [showAuth, setShowAuth] = useState(false);

  const benefits = [
    {
      icon: Clock,
      title: "Send in Seconds",
      description: "Your family receives money instantly, not in days",
      highlight: "⚡ Instant",
    },
    {
      icon: DollarSign,
      title: "Save on Fees",
      description: "Up to 99% cheaper than traditional money transfers",
      highlight: "Low Cost",
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your money is protected by blockchain technology",
      highlight: " Secure",
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      location: "New York → Nairobi",
      quote:
        "I can send money to my mother in minutes. She loves how fast it is!",
      amount: "$200",
    },
    {
      name: "David K.",
      location: "London → Mombasa",
      quote: "Finally, a way to send money without crazy fees. Game changer!",
      amount: "$150",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="mb-6">
            {/* Logo/Icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-4xl">🇰🇪</span>
            </div>

            {/* Main Headline - User Focused */}
            <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
              Send Money to
              <br />
              <span className="text-green-600">Your Family</span>
              <br />
              in Kenya
            </h1>

            {/* Value Proposition */}
            <p className="text-gray-600 text-lg mb-6">
              The fastest, cheapest way to support your loved ones back home
            </p>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
              <Users className="w-4 h-4" />
              <span>Trusted by 10,000+ families worldwide</span>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="space-y-4 mb-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {benefit.title}
                    </h3>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {benefit.highlight}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Social Proof - Testimonials */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-center mb-4 text-gray-900">
            What families are saying
          </h3>
          <div className="space-y-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {testimonial.location}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {testimonial.amount}
                  </span>
                </div>
                <p className="text-sm text-gray-600 italic">
                  "{testimonial.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="space-y-4">
          {!showAuth ? (
            <>
              <Button
                onClick={() => setShowAuth(true)}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-6 text-lg font-semibold rounded-xl shadow-lg"
              >
                Start Sending Money
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-500 mb-3">
                  Free to get started • No hidden fees
                </p>
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    className="w-full py-4 border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    See How It Works
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold mb-2">Welcome! 👋</h3>
                <p className="text-gray-600">
                  Sign in to start sending money to your family in Kenya
                </p>
              </div>
              <GoogleSignIn />
              <div className="flex items-center gap-2 justify-center mt-4">
                <Shield className="w-4 h-4 text-green-600" />
                <p className="text-xs text-gray-500">
                  Secure sign-in • Your data is protected
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 mb-2">Powered by</p>
          <div className="flex items-center justify-center gap-4">
            <span className="text-sm font-medium text-gray-500">PYUSD</span>
            <span className="text-gray-300">•</span>
            <span className="text-sm font-medium text-gray-500">Reown</span>
            <span className="text-gray-300">•</span>
            <span className="text-sm font-medium text-gray-500">M-Pesa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
