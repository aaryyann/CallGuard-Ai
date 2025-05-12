"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { ShieldAlert, Menu, X } from 'lucide-react';
import { SessionProvider } from 'next-auth/react';
import UserButton from './user-button';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen 
          ? 'bg-background/95 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ShieldAlert className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl">CallGuard AI</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            <Link 
              href="/#features" 
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link 
              href="/#how-it-works" 
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              How it Works
            </Link>
            <Link 
              href="/#pricing" 
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link 
              href="/dashboard" 
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
          </nav>
          
          <SessionProvider><UserButton/></SessionProvider>
        </div>
        
        <div className="md:hidden flex items-center gap-4">
          <ModeToggle />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t py-4 px-4 bg-background/95 backdrop-blur-md animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col space-y-4 px-2">
            <Link 
              href="/#features" 
              className="py-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="/#how-it-works" 
              className="py-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it Works
            </Link>
            <Link 
              href="/#pricing" 
              className="py-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="pt-2 flex flex-col gap-3">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}