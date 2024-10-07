'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, ArrowLeftRight, Zap, RefreshCw, Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-dark-charcoal">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between bg-lighter-charcoal border-b border-darker-gray">
        <Link className="flex items-center justify-center" href="#">
          <Trophy className="h-6 w-6 text-light-blue" />
          <span className="ml-2 text-xl font-bold text-almost-white">
            FantasyTradePro
          </span>
        </Link>
        <nav className="hidden md:flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium text-light-gray-dark hover:text-light-blue"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium text-light-gray-dark hover:text-light-blue"
            href="#how-it-works"
          >
            How It Works
          </Link>
          <Link
            className="text-sm font-medium text-light-gray-dark hover:text-light-blue"
            href="#pricing"
          >
            Pricing
          </Link>
          <Link
            className="text-sm font-medium text-light-gray-dark hover:text-light-blue"
            href="#contact"
          >
            Contact
          </Link>
        </nav>
        <Button
          className="md:hidden"
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6 text-almost-white" />
        </Button>
      </header>
      {mobileMenuOpen && (
        <nav className="md:hidden bg-lighter-charcoal border-b border-darker-gray p-4">
          <Link
            className="block py-2 text-sm font-medium text-light-gray-dark hover:text-light-blue"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="block py-2 text-sm font-medium text-light-gray-dark hover:text-light-blue"
            href="#how-it-works"
          >
            How It Works
          </Link>
          <Link
            className="block py-2 text-sm font-medium text-light-gray-dark hover:text-light-blue"
            href="#pricing"
          >
            Pricing
          </Link>
          <Link
            className="block py-2 text-sm font-medium text-light-gray-dark hover:text-light-blue"
            href="#contact"
          >
            Contact
          </Link>
        </nav>
      )}
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-blue to-light-blue">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-almost-white">
                  Dominate Your Fantasy Football League
                </h1>
                <p className="mx-auto max-w-[700px] text-light-gray-dark md:text-xl">
                  Sync your leagues, select your needs, and get AI-powered trade
                  suggestions. Compatible with Sleeper, Yahoo, and ESPN.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/login">
                  <Button className="bg-almost-white text-blue hover:bg-light-gray-dark">
                    Start Trading
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="bg-transparent text-almost-white border-almost-white hover:bg-almost-white hover:text-blue"
                >
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-dark-charcoal"
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-almost-white">
              Powerful Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              <div className="flex flex-col items-center text-center p-6 bg-lighter-charcoal rounded-lg shadow-md max-w-sm w-full">
                <RefreshCw className="h-12 w-12 mb-4 text-light-blue" />
                <h3 className="text-xl font-bold mb-2 text-almost-white">
                  Multi-Platform Sync
                </h3>
                <p className="text-light-gray-dark">
                  Seamlessly sync your leagues from Sleeper, Yahoo, and ESPN in
                  one place.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-lighter-charcoal rounded-lg shadow-md max-w-sm w-full">
                <ArrowLeftRight className="h-12 w-12 mb-4 text-light-blue" />
                <h3 className="text-xl font-bold mb-2 text-almost-white">
                  Smart Trade Suggestions
                </h3>
                <p className="text-light-gray-dark">
                  Get AI-powered trade recommendations based on your team&apos;s
                  needs and league dynamics.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-lighter-charcoal rounded-lg shadow-md max-w-sm w-full">
                <Zap className="h-12 w-12 mb-4 text-light-blue" />
                <h3 className="text-xl font-bold mb-2 text-almost-white">
                  Position-Based Analysis
                </h3>
                <p className="text-light-gray-dark">
                  Select the positions you need to improve and get targeted
                  trade options.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-lighter-charcoal"
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-almost-white">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-items-center">
              <div className="flex flex-col items-center text-center max-w-sm">
                <div className="w-16 h-16 rounded-full bg-light-blue text-dark-charcoal flex items-center justify-center text-2xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2 text-almost-white">
                  Sync Your Leagues
                </h3>
                <p className="text-light-gray-dark">
                  Connect your Sleeper, Yahoo, and ESPN fantasy football
                  accounts.
                </p>
              </div>
              <div className="flex flex-col items-center text-center max-w-sm">
                <div className="w-16 h-16 rounded-full bg-light-blue text-dark-charcoal flex items-center justify-center text-2xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2 text-almost-white">
                  Select Your Needs
                </h3>
                <p className="text-light-gray-dark">
                  Choose the positions or categories you want to improve in your
                  team.
                </p>
              </div>
              <div className="flex flex-col items-center text-center max-w-sm">
                <div className="w-16 h-16 rounded-full bg-light-blue text-dark-charcoal flex items-center justify-center text-2xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2 text-almost-white">
                  Get Trade Suggestions
                </h3>
                <p className="text-light-gray-dark">
                  Review AI-generated trade proposals tailored to your
                  team&apos;s needs.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="pricing"
          className="w-full py-12 md:py-24 lg:py-32 bg-dark-charcoal"
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-almost-white">
              Simple Pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center max-w-4xl mx-auto">
              <div className="flex flex-col p-6 bg-lighter-charcoal rounded-lg shadow-md border border-darker-gray w-full max-w-sm">
                <h3 className="text-2xl font-bold mb-4 text-almost-white">
                  Free
                </h3>
                <p className="text-4xl font-bold mb-4 text-almost-white">
                  $0
                  <span className="text-base font-normal text-light-gray-dark">
                    /month
                  </span>
                </p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center text-light-gray-dark">
                    <svg
                      className="w-4 h-4 mr-2 text-light-blue"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Sync 1 league
                  </li>
                  <li className="flex items-center text-light-gray-dark">
                    <svg
                      className="w-4 h-4 mr-2 text-light-blue"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    5 trade suggestions per week
                  </li>
                  <li className="flex items-center text-light-gray-dark">
                    <svg
                      className="w-4 h-4 mr-2 text-light-blue"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Basic analytics
                  </li>
                </ul>
                <Button className="mt-auto bg-light-blue text-dark-charcoal hover:bg-light-blue/90">
                  Get Started
                </Button>
              </div>
              <div className="flex flex-col p-6 bg-blue rounded-lg shadow-md text-almost-white w-full max-w-sm">
                <h3 className="text-2xl font-bold mb-4">Pro</h3>
                <p className="text-4xl font-bold mb-4">
                  $9.99<span className="text-base font-normal">/month</span>
                </p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-almost-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Sync unlimited leagues
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-almost-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Unlimited trade suggestions
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-almost-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Advanced analytics
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-almost-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Priority support
                  </li>
                </ul>
                <Button className="mt-auto bg-almost-white text-blue hover:bg-light-gray-dark">
                  Upgrade to Pro
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left">
              <div className="space-y-4 max-w-xl">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-almost-white">
                  Ready to Revolutionize Your Fantasy Trading?
                </h2>
                <p className="text-light-gray-dark md:text-xl/relaxed">
                  Join thousands of fantasy managers who are already winning
                  with FantasyTradePro.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex flex-col sm:flex-row gap-2">
                  <Input
                    className="flex-1 bg-almost-white text-dark-charcoal"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button
                    type="submit"
                    className="bg-almost-white text-blue hover:bg-light-gray-dark"
                  >
                    Get Started
                  </Button>
                </form>
                <p className="text-xs text-light-gray-dark">
                  By signing up, you agree to our{' '}
                  <Link className="underline underline-offset-2" href="#">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 w-full shrink-0 border-t border-darker-gray bg-lighter-charcoal">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-light-gray-dark">
              © 2024 FantasyTradePro. All rights reserved.
            </p>
            <nav className="flex gap-4 sm:gap-6">
              <Link
                className="text-xs text-light-gray-dark hover:underline underline-offset-4"
                href="#"
              >
                Terms of Service
              </Link>
              <Link
                className="text-xs text-light-gray-dark hover:underline underline-offset-4"
                href="#"
              >
                Privacy Policy
              </Link>
              <Link
                className="text-xs text-light-gray-dark hover:underline underline-offset-4"
                href="#"
              >
                Cookie Policy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
