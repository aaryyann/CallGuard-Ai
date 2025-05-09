"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  highlighted?: boolean;
}

export function Pricing() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll("[data-animate]");
            elements.forEach((element) => {
              element.classList.add("animate-in");
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const tiers: PricingTier[] = [
    {
      name: "Starter",
      price: "$299",
      description: "Perfect for small practices handling up to 100 patient calls per month.",
      features: [
        "Up to 100 call analyses per month",
        "Real-time risk alerts",
        "Basic reporting dashboard",
        "Email notifications",
        "Standard support"
      ],
      buttonText: "Start Free Trial"
    },
    {
      name: "Professional",
      price: "$599",
      description: "Ideal for growing clinics with moderate call volume and advanced needs.",
      features: [
        "Up to 500 call analyses per month",
        "Priority risk alerts",
        "Advanced analytics dashboard",
        "SMS & email notifications",
        "Customizable risk thresholds",
        "Premium support",
        "EHR integration"
      ],
      buttonText: "Start Free Trial",
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Tailored solutions for hospitals and large healthcare networks.",
      features: [
        "Unlimited call analyses",
        "Critical risk monitoring",
        "Enterprise dashboard & reporting",
        "Multi-channel alerts",
        "Custom AI training",
        "24/7 dedicated support",
        "Full system integration",
        "Custom deployment options"
      ],
      buttonText: "Contact Sales"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/50" id="pricing" ref={sectionRef}>
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4 opacity-1 translate-y-4"
            data-animate
            style={{ animationDelay: "100ms" }}
          >
            Plans for Every Healthcare Provider
          </h2>
          <p 
            className="text-xl text-muted-foreground opacity-1 translate-y-4"
            data-animate
            style={{ animationDelay: "200ms" }}
          >
            Choose the plan that fits your practice&apos;s needs and budget.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <div 
              key={index}
              className={`relative rounded-xl overflow-hidden opacity-1 translate-y-4 ${
                tier.highlighted 
                  ? 'border-2 border-primary shadow-lg' 
                  : 'border bg-card'
              }`}
              data-animate
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              {tier.highlighted && (
                <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className={`p-6 ${tier.highlighted ? 'pt-8' : ''}`}>
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  {tier.price !== "Custom" && <span className="text-muted-foreground ml-1">/month</span>}
                </div>
                <p className="text-muted-foreground mb-6">{tier.description}</p>
                
                <Link href={tier.name === "Enterprise" ? "/contact" : "/signup"}>
                  <Button 
                    variant={tier.highlighted ? "default" : "outline"} 
                    className="w-full mb-6"
                  >
                    {tier.buttonText}
                  </Button>
                </Link>
                
                <div className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <div className="mr-2 mt-1">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}