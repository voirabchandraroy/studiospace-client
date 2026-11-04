"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { ArrowRight, Sparkles, MapPin, Star } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import { Button } from "@/components/ui/button";

const slides = [
  {
    eyebrow: "Photography",
    title: "Shoot on a Cyc Wall Without Renting a Whole Building",
    subtext:
      "Infinity coves, Profoto lighting and drive-in access — bookable by the hour from independent studio owners near you.",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1920&q=80",
    stat: { icon: MapPin, label: "240+ spaces in 18 cities" },
  },
  {
    eyebrow: "Film & Video",
    title: "Sound Stages and Pre-Lit Sets, Ready When You Are",
    subtext:
      "Grip trucks, green screens and 3-phase power. Reserve a stage for a day, a night shoot, or just the golden hour.",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1920&q=80",
    stat: { icon: Star, label: "4.9 average host rating" },
  },
  {
    eyebrow: "Podcast & Music",
    title: "Acoustically Treated Rooms That Actually Sound Good",
    subtext:
      "Shure mics, Rodecaster consoles and isolation booths. Record a season in a weekend, not a month.",
    image:
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1920&q=80",
    stat: { icon: Sparkles, label: "Instant booking confirmation" },
  },
];

export function HeroSlider() {
  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={900}
        loop
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        className="h-[78vh] min-h-[540px] w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.title} className="relative">
            {/* Background image with a gradient fallback */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(135deg, oklch(0.2 0.03 270), oklch(0.35 0.09 45)), url(${slide.image})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/25" />
            <div className="film-grain absolute inset-0 opacity-40" />

            <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
              <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> {slide.eyebrow}
              </span>

              <h1 className="max-w-3xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {slide.title}
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                {slide.subtext}
              </p>

              <p className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold text-amber-300">
                <slide.stat.icon className="h-4 w-4" />
                {slide.stat.label}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
                  <Link href="/studios">
                    Explore Studios <ArrowRight />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/add-studio">Host Your Space</Link>
                </Button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
