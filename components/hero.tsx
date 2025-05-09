"use client";

import Link from "next/link";
import Img from "next/image";
import { Button } from "@/components/ui/button";
import { 
  ShieldAlert, 
  AlertCircle, 
  PhoneCall, 
  CheckCircle 
} from "lucide-react";

export function Hero() {
  return (
    <section className="pt-32 pb-16 md:pb-24">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-chart-1 mr-2"></span>
              <span>Preventing medical emergencies before they happen</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">AI-Powered</span> Medical Risk Detection in Patient Calls
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground">
              CallGuard AI listens to patient calls and flags critical medical risks before they 
              become emergencies, helping healthcare providers save lives through early intervention.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/signup">
                <Button size="lg" className="rounded-full">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg" className="rounded-full">
                  See How It Works
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Img src={"user4.png"} alt="image4" width={"1000"} height={"1000"} className="h-full w-full object-cover rounded-full" />
                </div>
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Img src={"user3.png"} alt="image1" width={"1000"} height={"1000"} className="h-full w-full object-cover rounded-full" />
                </div>
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Img src={"user2.png"} alt="image1" width={"1000"} height={"1000"} className="h-full w-full object-cover rounded-full" />
                </div>
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Img src={"user1.png"} alt="image1" width={"1000"} height={"1000"} className="h-full w-full object-cover rounded-full" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Trusted by <span className="font-medium text-foreground">1,000+</span> healthcare providers
              </p>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-chart-1/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-chart-2/20 rounded-full blur-3xl"></div>
              
              <div className="relative bg-card/50 backdrop-blur-sm border rounded-2xl p-6 shadow-lg">
                <div className="absolute -top-4 -right-4 bg-chart-1/10 backdrop-blur-sm rounded-full p-3 border">
                  <AlertCircle className="h-6 w-6 text-chart-1" />
                </div>
                
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center shrink-0 border">
                    <PhoneCall className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Incoming Patient Call</h3>
                    <p className="text-sm text-muted-foreground">Today, 10:42 AM</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">
                      &quot;I&apos;ve been having chest pain that comes and goes for the past day, and I&apos;m feeling more tired than usual...&quot;
                    </p>
                  </div>
                  
                  <div className="border border-destructive/20 bg-destructive/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldAlert className="h-5 w-5 text-destructive" />
                      <h4 className="font-medium text-destructive">Risk Detected</h4>
                    </div>
                    <p className="text-sm text-foreground/80">
                      Symptoms consistent with potential cardiovascular issue. Recommend immediate follow-up.
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="w-full">Dismiss</Button>
                    <Button size="sm" className="w-full">Escalate</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}