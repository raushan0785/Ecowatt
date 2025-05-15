"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthContext } from "@/context/auth-context";
import { Menu, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

export default function Navbar() {
  const { user } = useAuthContext();
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const smoothScroll = (e: MouseEvent) => {
      e.preventDefault();
      const targetId = (e.currentTarget as HTMLAnchorElement)
        .getAttribute("href")
        ?.slice(1);
      if (targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }
      setIsOpen(false); // Close mobile menu after clicking a link
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener("click", smoothScroll as EventListener);
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", smoothScroll as EventListener);
      });
    };
  }, []);

  const NavLinks = () => (
    <>
      {/* {isLandingPage && (
        <>
          <a
            className="text-sm font-medium text-muted-foreground hover:text-green-600 cursor-pointer"
            href="#benefits"
            onClick={() => setIsOpen(false)} // Close sheet on click
          >
            Benefits
          </a>
          <a
            className="text-sm font-medium text-muted-foreground hover:text-green-600 cursor-pointer"
            href="#why-choose"
            onClick={() => setIsOpen(false)} // Close sheet on click
          >
            Why Choose Us
          </a>
          <a
            className="text-sm font-medium text-muted-foreground hover:text-green-600 cursor-pointer"
            href="#get-started"
            onClick={() => setIsOpen(false)} // Close sheet on click
          >
            Get Started
          </a>
        </>
      )} */}
      {user ? (
        <>
          <Link
            className="text-sm font-medium text-muted-foreground hover:text-green-600 cursor-pointer"
            href="/learn-more"
            onClick={() => setIsOpen(false)} // Close sheet on click
          >
            Learn More
          </Link>
          <Link
            className="text-sm font-medium text-muted-foreground hover:text-green-600 cursor-pointer"
            href="/dashboard"
            onClick={() => setIsOpen(false)} // Close sheet on click
          >
            Dashboard
          </Link>
          {/* <Link
            className="text-sm font-medium text-muted-foreground hover:text-green-600 cursor-pointer"
            href="/trading"
            onClick={() => setIsOpen(false)} // Close sheet on click
          >
            Trading
          </Link> */}
          <Link
            className="text-sm font-medium text-muted-foreground hover:text-green-600 cursor-pointer"
            href="/settings"
            onClick={() => setIsOpen(false)} // Close sheet on click
          >
            Settings
          </Link>

          <ModeToggle />
        </>
      ) : (
        <>
          <Link
            className="text-sm font-medium text-muted-foreground hover:text-green-600 cursor-pointer"
            href="/learn-more"
            onClick={() => setIsOpen(false)} // Close sheet on click
          >
            Learn More
          </Link>
          <Link
            className="text-sm font-medium text-muted-foreground hover:text-green-600 cursor-pointer"
            href="/sign-in"
            onClick={() => setIsOpen(false)} // Close sheet on click
          >
            <Button
              size="sm"
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Sign In
            </Button>
          </Link>

          <ModeToggle />
        </>
      )}
    </>
  );

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 bg-background z-10">
      <Link className="flex items-center justify-center" href="/">
        <Sun className="h-6 w-6 text-green-600" />
        <span className="ml-2 text-xl font-semibold text-foreground flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="16" fill="#22C55E"/>
            <path d="M16 8L8 16L16 24L24 16L16 8Z" fill="white"/>
            <path d="M16 12L12 16L16 20L20 16L16 12Z" fill="#22C55E"/>
            <text x="16" y="28" text-anchor="middle" font-family="Arial" font-size="8" fill="white">E</text>
          </svg>
          Ecowatt
        </span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="ml-auto hidden md:flex gap-4 sm:gap-6 items-center">
        <NavLinks />
      </nav>

      {/* Mobile Navigation */}
      <div className="ml-auto md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[300px]">
            <nav className="flex flex-col gap-4 mt-4">
              <NavLinks />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
