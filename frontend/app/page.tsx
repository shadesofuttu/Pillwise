'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pill, Menu, X, ArrowRight, Camera, Shield, Globe, Zap, ChevronDown, Star, Check, Clock, AlertCircle, Linkedin, Github, Mail } from 'lucide-react';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Intelligence', href: '#intelligence' },
    { label: 'Safety', href: '#safety' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#F8F6F2]/95 backdrop-blur-md border-b border-[#E8E4DE] py-3' : 'bg-transparent py-5'}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-2.5 group cursor-pointer" aria-label="PillWise home">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center transition-transform group-hover:scale-105">
            <Pill className="w-4 h-4 text-white" />
          </div>
          <span className="font-serif text-xl font-semibold text-ink tracking-tight">pillwise</span>
        </a>

        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map(l => {
            const isActive = activeSection === l.href.substring(1);
            return (
              <a
                key={l.label}
                href={l.href}
                className={`text-sm font-medium transition-colors relative ${
                  isActive ? 'text-accent' : 'text-ink-secondary hover:text-ink'
                }`}
              >
                {l.label}
                {isActive && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-accent rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 bg-ink text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-ink-secondary transition-all hover:shadow-lg hover:scale-105 active:scale-100 min-h-[44px] group"
          >
            <Camera className="w-4 h-4 transition-transform group-hover:rotate-12" />
            Scan Medicine
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-lg border border-border bg-white/80 hover:bg-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="w-5 h-5 text-ink" /> : <Menu className="w-5 h-5 text-ink" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#F8F6F2]/98 backdrop-blur-md border-t border-border animate-fade-in">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1" aria-label="Mobile navigation">
            {navLinks.map(l => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="text-base font-medium text-ink-secondary hover:text-ink py-3 border-b border-border/50 transition-colors"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/scan"
              onClick={() => setMenuOpen(false)}
              className="mt-4 inline-flex items-center justify-center gap-2 bg-ink text-white text-base font-semibold px-5 py-3 rounded-lg hover:bg-ink-secondary transition-all min-h-[52px]"
            >
              <Camera className="w-4 h-4" />
              Scan Medicine
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className="relative min-h-screen flex items-center pt-24 pb-20 px-6 overflow-hidden bg-[#F8F6F2]">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'linear-gradient(#E8E4DE 1px, transparent 1px), linear-gradient(90deg, #E8E4DE 1px, transparent 1px)',
                backgroundSize: '80px 80px',
                opacity: 0.35,
              }}
            />
            <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/8 blur-3xl" />
            <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-amber-100/40 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="inline-flex items-center gap-2 border border-accent-muted bg-accent-light text-accent text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  AI Medicine Intelligence
                </div>

                <h1 className="font-serif leading-[1.05] tracking-tight text-ink">
                  <span className="block text-[clamp(3rem,7vw,5.5rem)] font-semibold">Know Your</span>
                  <span className="block text-[clamp(3rem,7vw,5.5rem)] font-semibold text-accent">Medicine.</span>
                  <span className="block text-[clamp(1.5rem,3.5vw,2.5rem)] font-normal text-ink-secondary mt-2">
                    Instantly. Clearly. Safely.
                  </span>
                </h1>

                <p className="text-lg text-ink-secondary leading-relaxed max-w-lg">
                  Point your camera at any medicine label. PillWise identifies it, explains what it does, and surfaces the safety information that matters — in plain language, in your language.
                </p>

                <div className="flex flex-col sm:flex-row gap-4" style={{ animationDelay: '0.2s' }}>
                  <Link
                    href="/scan"
                    className="inline-flex items-center justify-center gap-2.5 bg-ink text-white font-semibold text-base px-7 py-4 rounded-lg hover:bg-ink-secondary transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 min-h-[56px] group focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  >
                    <Camera className="w-5 h-5 transition-transform group-hover:scale-110" />
                    Scan a Medicine Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center justify-center gap-2 bg-white border border-border text-ink font-medium text-base px-7 py-4 rounded-lg hover:border-accent-muted hover:bg-accent-light transition-all min-h-[56px] group focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  >
                    See how it works
                    <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-2">
                  {['Free to use', 'No sign-up required', '10+ languages'].map(t => (
                    <span key={t} className="flex items-center gap-2 text-sm text-ink-muted">
                      <Check className="w-3.5 h-3.5 text-accent" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <a
              href="#how-it-works"
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink-muted hover:text-accent transition-colors animate-bounce hidden lg:flex"
              aria-label="Scroll to content"
            >
              <ChevronDown className="w-5 h-5" />
            </a>
          </div>
        </section>

        {/* From Photo to Understanding Section */}
        <section id="how-it-works" className="py-20 md:py-32 px-6 bg-white scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="max-w-3xl mb-16 md:mb-24">
              <h2 className="font-serif text-[clamp(2.5rem,5vw,4rem)] font-semibold text-ink leading-[1.1] mb-6">
                From a photograph<br />to understanding.
              </h2>
              <p className="text-xl text-ink-secondary leading-relaxed">
                PillWise turns a simple medicine photograph into structured information you can actually understand.
              </p>
            </div>

            {/* Three Stages - Storytelling Flow */}
            <div className="space-y-16 md:space-y-32">

              {/* Stage 01 - Capture */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                <div className="order-2 lg:order-1 space-y-4 lg:space-y-6">
                  <div className="inline-block">
                    <span className="font-serif text-[6rem] sm:text-[8rem] lg:text-[12rem] font-semibold text-[#E8E4DE] leading-none">01</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-ink mb-3 lg:mb-4">Capture</h3>
                    <p className="text-lg text-ink-secondary leading-relaxed max-w-md">
                      Take or upload a clear photo of the medicine label. Any device, any lighting — we handle the rest.
                    </p>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <div className="flex items-center gap-2 text-sm text-ink-muted">
                      <Camera className="w-4 h-4 text-accent" />
                      Camera
                    </div>
                    <div className="flex items-center gap-2 text-sm text-ink-muted">
                      <span className="w-1 h-1 rounded-full bg-border" />
                      Upload
                    </div>
                    <div className="flex items-center gap-2 text-sm text-ink-muted">
                      <span className="w-1 h-1 rounded-full bg-border" />
                      Instant
                    </div>
                  </div>
                </div>

                <div className="order-1 lg:order-2 relative">
                  <div className="relative bg-[#F8F6F2] rounded-2xl p-8 border border-border shadow-card">
                    {/* Mock medicine photo */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-dashed border-accent-muted flex items-center justify-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-accent/5 group-hover:bg-accent/10 transition-colors" />
                      <div className="relative text-center space-y-3">
                        <Camera className="w-12 h-12 text-accent mx-auto" />
                        <div className="text-sm font-medium text-ink-secondary">Medicine Label Photo</div>
                      </div>
                      {/* Corner brackets */}
                      <span className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-accent rounded-tl-lg" />
                      <span className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-accent rounded-tr-lg" />
                      <span className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-accent rounded-bl-lg" />
                      <span className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-accent rounded-br-lg" />
                    </div>
                  </div>
                  {/* Floating indicator */}
                  <div className="absolute -top-4 -right-4 bg-accent text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg animate-float">
                    Step 1
                  </div>
                </div>
              </div>

              {/* Visual Connector Arrow */}
              <div className="flex justify-center">
                <div className="w-px h-16 bg-gradient-to-b from-border to-transparent" />
              </div>

              {/* Stage 02 - Identify */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                <div className="relative">
                  <div className="relative bg-ink rounded-2xl p-8 border border-ink-secondary shadow-card overflow-hidden">
                    {/* Scanning visualization */}
                    <div className="aspect-[4/3] bg-ink-secondary/20 rounded-xl relative overflow-hidden">
                      {/* Scanning line animation */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute inset-x-0 h-0.5 bg-accent shadow-[0_0_20px_rgba(193,123,78,0.6)] animate-pulse" style={{ top: '40%' }} />
                      </div>
                      
                      {/* Detected text overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 text-white/80 text-sm font-mono">
                        <div className="opacity-40">ANALYZING LABEL...</div>
                        <div className="text-2xl font-semibold text-white tracking-wide">PARACETAMOL</div>
                        <div className="text-lg opacity-60">500 MG</div>
                      </div>

                      {/* Grid overlay */}
                      <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                      }} />
                    </div>
                  </div>
                  {/* Floating indicator */}
                  <div className="absolute -top-4 -left-4 bg-ink text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg animate-float" style={{ animationDelay: '0.5s' }}>
                    Step 2
                  </div>
                </div>

                <div className="space-y-4 lg:space-y-6">
                  <div className="inline-block">
                    <span className="font-serif text-[6rem] sm:text-[8rem] lg:text-[12rem] font-semibold text-[#E8E4DE] leading-none">02</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-ink mb-3 lg:mb-4">Identify</h3>
                    <p className="text-lg text-ink-secondary leading-relaxed max-w-md">
                      PillWise analyzes the label using computer vision and identifies the medicine name, strength, and active ingredients.
                    </p>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <div className="flex items-center gap-2 text-sm text-ink-muted">
                      <Zap className="w-4 h-4 text-accent" />
                      OCR
                    </div>
                    <div className="flex items-center gap-2 text-sm text-ink-muted">
                      <span className="w-1 h-1 rounded-full bg-border" />
                      AI Analysis
                    </div>
                    <div className="flex items-center gap-2 text-sm text-ink-muted">
                      <span className="w-1 h-1 rounded-full bg-border" />
                      &lt; 3 seconds
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Connector Arrow */}
              <div className="flex justify-center">
                <div className="w-px h-16 bg-gradient-to-b from-border to-transparent" />
              </div>

              {/* Stage 03 - Understand */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                <div className="order-2 lg:order-1 space-y-4 lg:space-y-6">
                  <div className="inline-block">
                    <span className="font-serif text-[6rem] sm:text-[8rem] lg:text-[12rem] font-semibold text-[#E8E4DE] leading-none">03</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-ink mb-3 lg:mb-4">Understand</h3>
                    <p className="text-lg text-ink-secondary leading-relaxed max-w-md">
                      Get essential information explained in plain language — purpose, dosage, precautions, and safety warnings.
                    </p>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <div className="flex items-center gap-2 text-sm text-ink-muted">
                      <Globe className="w-4 h-4 text-accent" />
                      10+ Languages
                    </div>
                    <div className="flex items-center gap-2 text-sm text-ink-muted">
                      <span className="w-1 h-1 rounded-full bg-border" />
                      Plain Language
                    </div>
                  </div>
                </div>

                <div className="order-1 lg:order-2 relative">
                  <div className="relative bg-white rounded-2xl border border-border shadow-card p-6 space-y-4">
                    {/* Medicine profile header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-border">
                      <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center">
                        <Pill className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1">
                        <div className="font-serif text-lg font-semibold text-ink">Paracetamol</div>
                        <div className="text-xs text-ink-muted">500mg Tablet</div>
                      </div>
                      <div className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
                        Identified
                      </div>
                    </div>

                    {/* Information cards */}
                    <div className="space-y-3">
                      {[
                        { label: 'Purpose', text: 'Pain relief and fever reduction', icon: Shield },
                        { label: 'Dosage', text: '1–2 tablets every 4–6 hours', icon: Clock },
                        { label: 'Warning', text: 'Do not exceed 8 tablets in 24 hours', icon: AlertCircle },
                      ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[#F8F6F2] border border-border hover:border-accent-muted transition-colors">
                            <Icon className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="text-[10px] font-semibold text-ink-muted uppercase tracking-wider mb-1">{item.label}</div>
                              <div className="text-sm text-ink leading-relaxed">{item.text}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* Floating indicator */}
                  <div className="absolute -top-4 -right-4 bg-accent text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                    Step 3
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom CTA */}
            <div className="mt-16 md:mt-24 text-center">
              <Link
                href="/scan"
                className="inline-flex items-center gap-2.5 bg-ink text-white font-semibold text-base px-8 py-4 rounded-lg hover:bg-ink-secondary transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 min-h-[56px] group focus:ring-2 focus:ring-accent focus:ring-offset-2"
              >
                <Camera className="w-5 h-5 transition-transform group-hover:scale-110" />
                Try It Yourself
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Product Showcase - Section 1: Interface */}
        <section id="intelligence" className="py-20 md:py-32 px-6 bg-[#F8F6F2] relative overflow-hidden scroll-mt-20">
          {/* Subtle background elements */}
          <div className="absolute inset-0 pointer-events-none opacity-30" aria-hidden="true">
            <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-blue-100/40 blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto relative">
            {/* Section Header */}
            <div className="max-w-2xl mb-12 md:mb-20">
              <h2 className="font-serif text-[clamp(2.5rem,5vw,4rem)] font-semibold text-ink leading-[1.1] mb-6">
                Everything you need<br />to understand a medicine.
              </h2>
              <p className="text-xl text-ink-secondary leading-relaxed">
                A complete medicine profile in seconds. Designed to be clear, accessible, and trustworthy.
              </p>
            </div>

            {/* Large UI Showcase - Layered Composition */}
            <div className="relative">
              {/* Main medicine card - center */}
              <div className="relative z-10 max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl border border-border shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-6 md:p-8 hover:shadow-[0_12px_50px_rgba(0,0,0,0.12)] transition-shadow duration-300">
                  {/* Medicine header */}
                  <div className="flex items-start justify-between mb-8 pb-6 border-b border-border">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-light to-amber-50 flex items-center justify-center border border-accent-muted">
                        <Pill className="w-7 h-7 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl font-semibold text-ink mb-1">Paracetamol</h3>
                        <div className="flex items-center gap-3 text-sm text-ink-muted">
                          <span>500mg Tablet</span>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <span>Oral</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full">
                        ✓ Identified
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                        <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                          <div className="h-full w-[95%] bg-emerald-500 rounded-full" />
                        </div>
                        <span className="font-semibold">95%</span>
                      </div>
                    </div>
                  </div>

                  {/* Active ingredient */}
                  <div className="mb-6 p-4 rounded-xl bg-[#F8F6F2] border border-border">
                    <div className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">Active Ingredient</div>
                    <div className="text-base font-medium text-ink">Acetaminophen (Paracetamol)</div>
                  </div>

                  {/* Primary info grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { label: 'Uses', text: 'Pain relief, fever reduction', icon: Shield },
                      { label: 'How it works', text: 'Blocks pain signals in the brain', icon: Zap },
                    ].map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <div key={i} className="p-4 rounded-xl border border-border hover:border-accent-muted transition-colors">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="w-4 h-4 text-accent" />
                            <div className="text-xs font-semibold text-ink-muted uppercase tracking-wider">{item.label}</div>
                          </div>
                          <div className="text-sm text-ink leading-relaxed">{item.text}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Warnings strip */}
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-amber-900 uppercase tracking-wider mb-1">Important</div>
                        <div className="text-sm text-amber-800 leading-relaxed">Do not exceed recommended dose. Can cause liver damage in high doses.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating detail cards */}
              <div className="hidden lg:block">
                {/* Side effects card - left */}
                <div className="absolute left-0 top-32 w-64 bg-white rounded-xl border border-border shadow-card p-5 animate-float">
                  <div className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">Side Effects</div>
                  <ul className="space-y-2 text-sm text-ink-secondary">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span>Nausea (rare)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span>Skin rash (rare)</span>
                    </li>
                  </ul>
                </div>

                {/* Interactions card - right */}
                <div className="absolute right-0 bottom-20 w-64 bg-white rounded-xl border border-border shadow-card p-5 animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">Interactions</div>
                  <div className="space-y-3">
                    <div className="text-sm text-ink-secondary">
                      <span className="font-medium text-ink">Warfarin:</span> May increase bleeding risk
                    </div>
                    <div className="text-sm text-ink-secondary">
                      <span className="font-medium text-ink">Alcohol:</span> Avoid with liver issues
                    </div>
                  </div>
                </div>

                {/* Precautions badge - top right */}
                <div className="absolute right-12 top-8 bg-ink text-white rounded-full px-4 py-2 text-xs font-semibold shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                  Read all precautions
                </div>
              </div>
            </div>

            {/* Bottom note */}
            <div className="mt-16 text-center">
              <p className="text-sm text-ink-muted max-w-xl mx-auto">
                Every result includes complete information, safety warnings, and a clear disclaimer that this is informational only.
              </p>
            </div>
          </div>
        </section>

        {/* Product Showcase - Section 2: Intelligence Map */}
        <section id="medicine-map" className="py-20 md:py-32 px-6 bg-white relative overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 pointer-events-none opacity-20" aria-hidden="true">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, #E8E4DE 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="max-w-6xl mx-auto relative">
            {/* Section Header */}
            <div className="text-center mb-20">
              <h2 className="font-serif text-[clamp(2.5rem,5vw,4rem)] font-semibold text-ink leading-[1.1] mb-6">
                One medicine.<br />A lot to understand.
              </h2>
              <p className="text-xl text-ink-secondary leading-relaxed max-w-2xl mx-auto">
                PillWise connects every piece of information so you see the complete picture.
              </p>
            </div>

            {/* Intelligence Map */}
            <div className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center">
              {/* Center - Medicine */}
              <div className="relative z-20">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-accent to-accent-hover shadow-[0_20px_60px_rgba(193,123,78,0.3)] flex items-center justify-center animate-pulse-ring">
                  <Pill className="w-14 h-14 text-white" />
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <div className="font-serif text-lg font-semibold text-ink">Paracetamol</div>
                </div>
              </div>

              {/* Orbiting information nodes */}
              <div className="absolute inset-0">
                {/* Active Ingredient - top */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2">
                  <div className="relative">
                    <svg className="absolute top-1/2 left-1/2 w-px h-24 -translate-x-1/2" style={{ transform: 'translateX(-50%) translateY(-100%)' }}>
                      <line x1="0" y1="0" x2="0" y2="96" stroke="#E8E4DE" strokeWidth="1" strokeDasharray="4 4" />
                    </svg>
                    <div className="bg-white border border-border rounded-xl px-5 py-3 shadow-card">
                      <div className="text-[10px] font-semibold text-accent uppercase tracking-wider mb-1">Active Ingredient</div>
                      <div className="text-sm font-medium text-ink">Acetaminophen</div>
                    </div>
                  </div>
                </div>

                {/* Strength - top right */}
                <div className="absolute top-16 right-8">
                  <div className="relative">
                    <svg className="absolute top-1/2 right-full w-24 h-px" style={{ transformOrigin: 'right center', transform: 'translateY(-50%) rotate(-25deg)' }}>
                      <line x1="0" y1="0" x2="96" y2="0" stroke="#E8E4DE" strokeWidth="1" strokeDasharray="4 4" />
                    </svg>
                    <div className="bg-white border border-border rounded-xl px-5 py-3 shadow-card">
                      <div className="text-[10px] font-semibold text-accent uppercase tracking-wider mb-1">Strength</div>
                      <div className="text-sm font-medium text-ink">500mg</div>
                    </div>
                  </div>
                </div>

                {/* Uses - right */}
                <div className="absolute top-1/2 right-0 -translate-y-1/2">
                  <div className="relative">
                    <svg className="absolute top-1/2 right-full w-20 h-px -translate-y-1/2">
                      <line x1="0" y1="0" x2="80" y2="0" stroke="#E8E4DE" strokeWidth="1" strokeDasharray="4 4" />
                    </svg>
                    <div className="bg-accent-light border border-accent-muted rounded-xl px-5 py-3 shadow-card">
                      <div className="text-[10px] font-semibold text-accent uppercase tracking-wider mb-1">Uses</div>
                      <div className="text-sm font-medium text-ink">Pain & Fever</div>
                    </div>
                  </div>
                </div>

                {/* Warnings - bottom right */}
                <div className="absolute bottom-16 right-8">
                  <div className="relative">
                    <svg className="absolute bottom-full right-1/2 w-px h-24" style={{ transform: 'translateX(50%) translateY(0)' }}>
                      <line x1="0" y1="0" x2="0" y2="96" stroke="#E8E4DE" strokeWidth="1" strokeDasharray="4 4" />
                    </svg>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 shadow-card">
                      <div className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider mb-1">Warnings</div>
                      <div className="text-sm font-medium text-amber-900">Liver risk</div>
                    </div>
                  </div>
                </div>

                {/* Side Effects - bottom */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                  <div className="relative">
                    <svg className="absolute bottom-full left-1/2 w-px h-20 -translate-x-1/2">
                      <line x1="0" y1="0" x2="0" y2="80" stroke="#E8E4DE" strokeWidth="1" strokeDasharray="4 4" />
                    </svg>
                    <div className="bg-white border border-border rounded-xl px-5 py-3 shadow-card">
                      <div className="text-[10px] font-semibold text-accent uppercase tracking-wider mb-1">Side Effects</div>
                      <div className="text-sm font-medium text-ink">Rare, mild</div>
                    </div>
                  </div>
                </div>

                {/* Interactions - bottom left */}
                <div className="absolute bottom-16 left-8">
                  <div className="relative">
                    <svg className="absolute bottom-full left-1/2 w-px h-24" style={{ transform: 'translateX(-50%)' }}>
                      <line x1="0" y1="0" x2="0" y2="96" stroke="#E8E4DE" strokeWidth="1" strokeDasharray="4 4" />
                    </svg>
                    <div className="bg-white border border-border rounded-xl px-5 py-3 shadow-card">
                      <div className="text-[10px] font-semibold text-accent uppercase tracking-wider mb-1">Interactions</div>
                      <div className="text-sm font-medium text-ink">Warfarin, Alcohol</div>
                    </div>
                  </div>
                </div>

                {/* Formulation - left */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2">
                  <div className="relative">
                    <svg className="absolute top-1/2 left-full w-20 h-px -translate-y-1/2">
                      <line x1="0" y1="0" x2="80" y2="0" stroke="#E8E4DE" strokeWidth="1" strokeDasharray="4 4" />
                    </svg>
                    <div className="bg-white border border-border rounded-xl px-5 py-3 shadow-card">
                      <div className="text-[10px] font-semibold text-accent uppercase tracking-wider mb-1">Formulation</div>
                      <div className="text-sm font-medium text-ink">Tablet, Oral</div>
                    </div>
                  </div>
                </div>

                {/* Precautions - top left */}
                <div className="absolute top-16 left-8">
                  <div className="relative">
                    <svg className="absolute top-1/2 left-full w-24 h-px" style={{ transformOrigin: 'left center', transform: 'translateY(-50%) rotate(25deg)' }}>
                      <line x1="0" y1="0" x2="96" y2="0" stroke="#E8E4DE" strokeWidth="1" strokeDasharray="4 4" />
                    </svg>
                    <div className="bg-white border border-border rounded-xl px-5 py-3 shadow-card">
                      <div className="text-[10px] font-semibold text-accent uppercase tracking-wider mb-1">Precautions</div>
                      <div className="text-sm font-medium text-ink">Dosage limits</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom note */}
            <div className="mt-16 text-center">
              <p className="text-base text-ink-secondary max-w-xl mx-auto leading-relaxed">
                All information is cross-referenced and explained in plain language, no medical jargon required.
              </p>
            </div>
          </div>
        </section>

        {/* Transition gradient from warm to dark */}
        <div className="h-32 bg-gradient-to-b from-white via-[#F8F6F2] to-[#1a1a1a]" />

        {/* AI/Scientific Section - Dark Mode */}
        <section className="relative bg-[#1a1a1a] text-white py-20 md:py-32 px-6 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            {/* Subtle grid */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'linear-gradient(rgba(96, 165, 250, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(96, 165, 250, 0.3) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }} />
            
            {/* Glowing orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-500/10 blur-[120px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
            
            {/* Floating particles */}
            <div className="absolute top-20 left-[10%] w-1 h-1 rounded-full bg-blue-400/40 animate-float" />
            <div className="absolute top-40 right-[15%] w-1.5 h-1.5 rounded-full bg-cyan-400/40 animate-float" style={{ animationDelay: '1.5s' }} />
            <div className="absolute bottom-32 left-[20%] w-1 h-1 rounded-full bg-blue-300/40 animate-float" style={{ animationDelay: '0.8s' }} />
            <div className="absolute bottom-20 right-[25%] w-1 h-1 rounded-full bg-cyan-300/40 animate-float" style={{ animationDelay: '2s' }} />
          </div>

          <div className="max-w-7xl mx-auto relative">
            {/* Section Header */}
            <div className="max-w-3xl mx-auto text-center mb-20">
              <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.05] mb-6 text-white">
                Intelligence behind<br />the label.
              </h2>
              <p className="text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
                PillWise combines image understanding and structured medicine information to turn a label into something easier to understand.
              </p>
            </div>

            {/* Large Cinematic Visual */}
            <div className="relative max-w-6xl mx-auto">
              <div className="relative aspect-[16/9] rounded-3xl border border-white/10 bg-gradient-to-br from-[#1f2937] to-[#111827] p-8 md:p-12 overflow-hidden shadow-[0_0_80px_rgba(59,130,246,0.15)]">
                
                {/* Scanning lines animation */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent animate-pulse" style={{ top: '30%', animationDuration: '3s' }} />
                  <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-pulse" style={{ top: '50%', animationDuration: '4s', animationDelay: '0.5s' }} />
                  <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-300/30 to-transparent animate-pulse" style={{ top: '70%', animationDuration: '3.5s', animationDelay: '1s' }} />
                </div>

                {/* Main content grid */}
                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 h-full items-center">
                  
                  {/* Left - Medicine Label Input */}
                  <div className="space-y-4">
                    <div className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">Input</div>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
                      <div className="relative bg-[#1f2937]/80 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-blue-400/50 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                          <Camera className="w-5 h-5 text-blue-400" />
                          <span className="text-sm font-medium text-white/90">Medicine Label</span>
                        </div>
                        <div className="aspect-[3/2] bg-gradient-to-br from-blue-950/40 to-cyan-950/40 rounded-lg border border-blue-500/20 flex items-center justify-center">
                          <div className="text-center space-y-2">
                            <div className="text-xs text-white/50 font-mono">PARACETAMOL</div>
                            <div className="text-[10px] text-white/40 font-mono">500 MG</div>
                          </div>
                        </div>
                        {/* Corner accents */}
                        <span className="absolute top-4 left-4 w-3 h-3 border-t border-l border-blue-400/60" />
                        <span className="absolute top-4 right-4 w-3 h-3 border-t border-r border-blue-400/60" />
                        <span className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-blue-400/60" />
                        <span className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-blue-400/60" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      Image Recognition
                    </div>
                  </div>

                  {/* Center - AI Processing */}
                  <div className="flex flex-col items-center justify-center space-y-6">
                    {/* Central AI node */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3s' }} />
                      <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 flex items-center justify-center">
                        <Zap className="w-10 h-10 text-blue-400" />
                      </div>
                      {/* Orbiting dots */}
                      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
                        <div className="absolute top-0 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/60" />
                      </div>
                      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '10s', animationDirection: 'reverse' }}>
                        <div className="absolute bottom-0 left-1/2 w-2 h-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-blue-400/60" />
                      </div>
                    </div>
                    
                    <div className="text-center space-y-2">
                      <div className="text-xs font-semibold text-blue-400 uppercase tracking-widest">AI Analysis</div>
                      <div className="flex items-center gap-2 justify-center">
                        {[0, 1, 2].map(i => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: (i * 0.2) + "s" }} />
                        ))}
                      </div>
                    </div>

                    {/* Connection lines */}
                    <svg className="absolute left-[15%] top-1/2 w-[20%] h-px opacity-30 hidden md:block" style={{ transform: 'translateY(-50%)' }}>
                      <line x1="0" y1="0" x2="100%" y2="0" stroke="url(#gradient1)" strokeWidth="1" strokeDasharray="4 4">
                        <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite" />
                      </line>
                      <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
                          <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    <svg className="absolute right-[15%] top-1/2 w-[20%] h-px opacity-30 hidden md:block" style={{ transform: 'translateY(-50%)' }}>
                      <line x1="0" y1="0" x2="100%" y2="0" stroke="url(#gradient2)" strokeWidth="1" strokeDasharray="4 4">
                        <animate attributeName="stroke-dashoffset" from="0" to="-8" dur="1s" repeatCount="indefinite" />
                      </line>
                      <defs>
                        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* Right - Structured Output */}
                  <div className="space-y-4">
                    <div className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">Output</div>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
                      <div className="relative bg-[#1f2937]/80 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-cyan-400/50 transition-colors space-y-3">
                        <div className="flex items-center gap-3 mb-4">
                          <Shield className="w-5 h-5 text-cyan-400" />
                          <span className="text-sm font-medium text-white/90">Medicine Profile</span>
                        </div>
                        {[
                          { label: 'Name', value: 'Paracetamol' },
                          { label: 'Strength', value: '500mg' },
                          { label: 'Uses', value: 'Pain & Fever' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                            <span className="text-white/50">{item.label}</span>
                            <span className="text-white/90 font-medium">{item.value}</span>
                          </div>
                        ))}
                        <div className="pt-2">
                          <div className="text-[10px] text-cyan-400/80 font-mono">+ Safety warnings</div>
                          <div className="text-[10px] text-cyan-400/80 font-mono">+ Side effects</div>
                          <div className="text-[10px] text-cyan-400/80 font-mono">+ Interactions</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      Structured Data
                    </div>
                  </div>
                </div>

                {/* Molecular decoration */}
                <div className="absolute top-4 right-4 opacity-20">
                  <svg width="80" height="80" viewBox="0 0 80 80" className="animate-spin" style={{ animationDuration: '30s' }}>
                    <circle cx="20" cy="20" r="3" fill="#60a5fa" />
                    <circle cx="60" cy="20" r="3" fill="#22d3ee" />
                    <circle cx="40" cy="50" r="3" fill="#60a5fa" />
                    <circle cx="20" cy="60" r="3" fill="#22d3ee" />
                    <circle cx="60" cy="60" r="3" fill="#60a5fa" />
                    <line x1="20" y1="20" x2="60" y2="20" stroke="#60a5fa" strokeWidth="1" opacity="0.3" />
                    <line x1="20" y1="20" x2="40" y2="50" stroke="#60a5fa" strokeWidth="1" opacity="0.3" />
                    <line x1="60" y1="20" x2="40" y2="50" stroke="#22d3ee" strokeWidth="1" opacity="0.3" />
                    <line x1="40" y1="50" x2="20" y2="60" stroke="#60a5fa" strokeWidth="1" opacity="0.3" />
                    <line x1="40" y1="50" x2="60" y2="60" stroke="#22d3ee" strokeWidth="1" opacity="0.3" />
                  </svg>
                </div>
              </div>

              {/* Stats below */}
              <div className="grid grid-cols-3 gap-8 mt-12 max-w-3xl mx-auto">
                {[
                  { value: '< 3s', label: 'Processing time' },
                  { value: '95%+', label: 'Accuracy rate' },
                  { value: '10+', label: 'Languages' },
                ].map((stat, i) => (
                  <div key={i} className="text-center space-y-2">
                    <div className="font-serif text-4xl font-semibold text-white">{stat.value}</div>
                    <div className="text-sm text-white/60">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom tagline */}
            <div className="mt-20 text-center">
              <p className="text-base text-white/50 max-w-2xl mx-auto leading-relaxed">
                Powered by computer vision, natural language processing, and structured pharmaceutical data.
              </p>
            </div>
          </div>
        </section>

        {/* Confidence Section */}
        <section id="confidence" className="py-20 md:py-32 px-6 bg-white scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left - Headline */}
              <div className="space-y-6">
                <h2 className="font-serif text-[clamp(2.5rem,5vw,4rem)] font-semibold text-ink leading-[1.1]">
                  Know when the<br />answer is certain.
                </h2>
                <p className="text-xl text-ink-secondary leading-relaxed max-w-lg">
                  Every identification includes a confidence score based on image clarity and label recognition — not medical certainty.
                </p>
                <p className="text-base text-ink-muted leading-relaxed max-w-lg">
                  Higher confidence means the label was clear and the text was successfully extracted. Always verify with the actual packaging.
                </p>
              </div>

              {/* Right - Confidence Visualization */}
              <div className="relative">
                <div className="bg-[#F8F6F2] rounded-2xl border border-border p-8 space-y-6">
                  {/* Confidence score */}
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 border-4 border-emerald-200">
                      <span className="font-serif text-4xl font-semibold text-emerald-700">96%</span>
                    </div>
                    <div>
                      <div className="text-base font-semibold text-ink mb-1">Identification Confidence</div>
                      <div className="text-sm text-ink-muted">Based on image quality and label clarity</div>
                    </div>
                  </div>

                  {/* Detection checklist */}
                  <div className="pt-6 border-t border-border space-y-3">
                    {[
                      'Medicine name detected',
                      'Strength detected',
                      'Label text extracted',
                      'Information matched',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white border border-border">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                          <Check className="w-3 h-3 text-emerald-600" />
                        </div>
                        <span className="text-sm font-medium text-ink">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Note */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-ink-muted leading-relaxed">
                      Confidence reflects image interpretation accuracy, not medical validity. Always verify information with healthcare professionals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Safety Section */}
        <section id="safety" className="py-20 md:py-32 px-6 bg-[#F8F6F2] scroll-mt-20">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 md:mb-16">
              <h2 className="font-serif text-[clamp(2.5rem,5vw,4rem)] font-semibold text-ink leading-[1.1] mb-6">
                Information should be clear.<br />Safety should be non-negotiable.
              </h2>
              <p className="text-xl text-ink-secondary leading-relaxed max-w-2xl mx-auto">
                PillWise provides informational assistance. It is not a replacement for professional medical guidance.
              </p>
            </div>

            {/* Safety cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: Shield, title: 'Always verify', body: 'Cross-check information with your medicine packaging, insert, or prescription label.' },
                { icon: Star, title: 'Ask your pharmacist', body: 'Pharmacists can answer questions about your specific medicine and situation.' },
                { icon: AlertCircle, title: 'Consult your doctor', body: 'For medical decisions, treatment questions, or concerns, speak with a healthcare professional.' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="bg-white border border-border rounded-xl p-6 hover:border-accent-muted transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-ink mb-2">{item.title}</h3>
                    <p className="text-sm text-ink-secondary leading-relaxed">{item.body}</p>
                  </div>
                );
              })}
            </div>

            {/* Disclaimer box */}
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-amber-900">Medical Disclaimer</h3>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    PillWise is for informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions regarding a medical condition or medication. Never disregard professional medical advice or delay seeking it because of information provided by PillWise.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Editorial Reprise */}
        <section className="py-20 md:py-32 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            {/* Centered header */
            <div className="text-center mb-12 md:mb-20">
              <div className="text-xs font-semibold text-accent uppercase tracking-widest mb-4">Simple Process</div>
              <h2 className="font-serif text-[clamp(2.5rem,5vw,4rem)] font-semibold text-ink leading-[1.1]">
                Three steps to clarity.
              </h2>
            </div>}

            {/* Three steps - horizontal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {[
                { num: '01', title: 'Capture', desc: 'Take or upload a photo of the medicine label.' },
                { num: '02', title: 'Identify', desc: 'AI reads and identifies the medicine from the label.' },
                { num: '03', title: 'Understand', desc: 'Get clear information in plain language.' },
              ].map((step, i) => (
                <div key={i} className="text-center space-y-4 md:space-y-6">
                  <div className="font-serif text-[6rem] md:text-[8rem] font-semibold text-[#E8E4DE] leading-none">{step.num}</div>
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-ink mb-3">{step.title}</h3>
                    <p className="text-base text-ink-secondary leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 md:py-32 px-6 bg-[#F8F6F2]">
          <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-10">
            <div className="space-y-6">
              <h2 className="font-serif text-[clamp(3rem,6vw,5rem)] font-semibold text-ink leading-[1.05]">
                Know what<br />you're taking.
              </h2>
              <p className="text-2xl text-ink-secondary font-light">
                Start with a single photograph.
              </p>
            </div>

            <div>
              <Link
                href="/scan"
                className="inline-flex items-center gap-3 bg-ink text-white font-semibold text-base md:text-lg px-10 md:px-12 py-4 md:py-5 rounded-xl hover:bg-ink-secondary transition-all hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 min-h-[64px] group focus:ring-2 focus:ring-accent focus:ring-offset-2"
              >
                <Camera className="w-5 md:w-6 h-5 md:h-6 transition-transform group-hover:scale-110" />
                Scan a Medicine
                <ArrowRight className="w-4 md:w-5 h-4 md:h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            <p className="text-sm text-ink-muted pt-4">
              Free · No account required · Works on any device
            </p>
          </div>
        </section>

        {/* Contact Us Section */}
        <section id="contact" className="py-20 md:py-32 px-6 bg-white border-t border-border scroll-mt-20">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 md:mb-16">
              <h2 className="font-serif text-[clamp(2.5rem,5vw,4rem)] font-semibold text-ink leading-[1.1] mb-6">
                Get in touch.
              </h2>
              <p className="text-xl text-ink-secondary leading-relaxed max-w-2xl mx-auto">
                Have questions or feedback? We'd love to hear from you. Connect with our team.
              </p>
            </div>

            {/* Team Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Utkarsh */}
              <div className="bg-[#F8F6F2] rounded-2xl border border-border p-8 hover:border-accent-muted hover:shadow-lg transition-all group">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-ink mb-2">Utkarsh</h3>
                    <p className="text-sm text-ink-secondary mb-2">Founder & Developer</p>
                    <a
                      href="mailto:utkarshverma812@gmail.com"
                      className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-accent transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      utkarshverma812@gmail.com
                    </a>
                  </div>
                  
                  <div className="flex gap-3">
                    <a
                      href="https://www.linkedin.com/in/utkarsh-builds/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0A66C2] text-white font-medium text-sm px-4 py-3 rounded-lg hover:bg-[#004182] transition-all hover:shadow-md focus:ring-2 focus:ring-[#0A66C2] focus:ring-offset-2 group/btn"
                      aria-label="Utkarsh's LinkedIn profile"
                    >
                      <Linkedin className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                      LinkedIn
                    </a>
                    <a
                      href="https://github.com/shadesofuttu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-ink text-white font-medium text-sm px-4 py-3 rounded-lg hover:bg-ink-secondary transition-all hover:shadow-md focus:ring-2 focus:ring-ink focus:ring-offset-2 group/btn"
                      aria-label="Utkarsh's GitHub profile"
                    >
                      <Github className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                      GitHub
                    </a>
                  </div>
                </div>
              </div>

              {/* Deepanshu */}
              <div className="bg-[#F8F6F2] rounded-2xl border border-border p-8 hover:border-accent-muted hover:shadow-lg transition-all group">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-ink mb-2">Deepanshu</h3>
                    <p className="text-sm text-ink-secondary mb-2">Co-Founder & Developer</p>
                    <a
                      href="mailto:deepanshupandey046@gmail.com"
                      className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-accent transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      deepanshupandey046@gmail.com
                    </a>
                  </div>
                  
                  <div className="flex gap-3">
                    <a
                      href="https://www.linkedin.com/in/deepanshu-pandey-1a6231383/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0A66C2] text-white font-medium text-sm px-4 py-3 rounded-lg hover:bg-[#004182] transition-all hover:shadow-md focus:ring-2 focus:ring-[#0A66C2] focus:ring-offset-2 group/btn"
                      aria-label="Deepanshu's LinkedIn profile"
                    >
                      <Linkedin className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                      LinkedIn
                    </a>
                    <a
                      href="https://github.com/Deepanshu046"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-ink text-white font-medium text-sm px-4 py-3 rounded-lg hover:bg-ink-secondary transition-all hover:shadow-md focus:ring-2 focus:ring-ink focus:ring-offset-2 group/btn"
                      aria-label="Deepanshu's GitHub profile"
                    >
                      <Github className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* General Contact */}
            <div className="mt-12 text-center">
              <p className="text-base text-ink-secondary mb-4">
                For general inquiries or support
              </p>
              <a
                href="mailto:contact@pillwise.app"
                className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded px-2 py-1"
              >
                <Mail className="w-4 h-4" />
                contact@pillwise.app
              </a>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-border bg-white py-12 md:py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Top row - Logo and links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8 md:mb-12">
            {/* Logo */}
            <div className="space-y-4">
              <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="inline-flex items-center gap-2.5 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center transition-transform group-hover:scale-105">
                  <Pill className="w-4 h-4 text-white" />
                </div>
                <span className="font-serif text-xl font-semibold text-ink tracking-tight">pillwise</span>
              </a>
              <p className="text-sm text-ink-secondary max-w-sm leading-relaxed">
                AI-powered medicine identification. Clear information in plain language.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-6 md:gap-8">
              <div>
                <h3 className="text-xs font-semibold text-ink uppercase tracking-wider mb-4">Product</h3>
                <ul className="space-y-3">
                  {[
                    { label: 'How It Works', href: '#how-it-works' },
                    { label: 'Medicine Intelligence', href: '#intelligence' },
                    { label: 'Safety', href: '#safety' },
                    { label: 'Contact', href: '#contact' },
                  ].map(link => (
                    <li key={link.label}>
                      <a href={link.href} className="text-sm text-ink-secondary hover:text-accent transition-colors focus:outline-none focus:text-accent">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-ink uppercase tracking-wider mb-4">Legal</h3>
                <ul className="space-y-3">
                  {[
                    { label: 'Privacy Policy', href: '#' },
                    { label: 'Terms of Service', href: '#' },
                    { label: 'About', href: '#about' },
                  ].map(link => (
                    <li key={link.label}>
                      <a href={link.href} className="text-sm text-ink-secondary hover:text-accent transition-colors focus:outline-none focus:text-accent">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom row - Disclaimer */}
          <div className="pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-ink-muted text-center md:text-left">
                © 2026 PillWise. For informational purposes only. Not medical advice.
              </p>
              <p className="text-xs text-ink-muted text-center md:text-right max-w-md">
                Always consult a qualified healthcare professional for medical decisions.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
