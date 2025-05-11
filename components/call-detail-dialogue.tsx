"use client";

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Play, Pause } from "lucide-react";

interface CallDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  call: {
    _id: string;
    callDate: string;
    patientName: string;
    doctorName: string;
    duration: number;
    transcript?: string;
    keywordsFlagged?: string[];
    riskLevel: "high" | "medium" | "low" | "none";
    status: "new" | "reviewed" | "resolved";
    condition?: string,
    advice?: string,
    confidenceScore?: number
    audioUrl?: string;
  };
}

export function CallDetailsDialog({ isOpen, onClose, call }: CallDetailsDialogProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "text-destructive bg-destructive/10 border-destructive/20";
      case "medium": return "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900/30 dark:text-amber-500";
      case "low": return "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-500";
      default: return "text-muted-foreground bg-muted border-muted-foreground/20";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[80%] overflow-scroll">
        <DialogHeader>
          <DialogTitle>Call Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Info */}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{call.patientName}</h3>
                <p className="text-sm text-muted-foreground">{call.callDate}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRiskColor(call.riskLevel)}`}>
                {call.riskLevel.charAt(0).toUpperCase() + call.riskLevel.slice(1)} Risk
              </span>
            </div>

            {call.doctorName && (
              <p className="text-sm">
                <span className="font-medium">Doctor:</span> {call.doctorName}
              </p>
            )}

            <p className="text-sm">
              <span className="font-medium">Duration:</span> {call.duration}
            </p>
          </div>

          {/* Audio Player */}
          {call.audioUrl && (
            <div className="space-y-2">
              <h4 className="font-medium">Call Recording</h4>
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <audio ref={audioRef} src={call.audioUrl} className="hidden" />
                <div className="text-sm text-muted-foreground">
                  {call.duration}
                </div>
              </div>
            </div>
          )}

          {/* Keywords Flagged */}
          {call.keywordsFlagged && (
            <div className="space-y-2">
              <h4 className="font-medium">Keywords Flagged</h4>
              <div className="flex flex-wrap gap-2">
                {call.keywordsFlagged.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-muted rounded-md text-sm"
                  >
                    {keyword.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Condition */}
          {call.condition && (
            <div className="space-y-2">
              <h4 className="font-medium">Patients&apos;s Condition</h4>
              <div className="p-4 bg-muted rounded-lg text-sm">
                <div className="text-sm max-h-[4.5em] overflow-y-auto custom-scrollbar">
                  {call.condition.split('\n').map((line, index) => (
                    <p key={index} className="mb-1">{line}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/*advice*/}
          {call.advice && (
            <div className="space-y-2">
              <h4 className="font-medium">Advice to patient</h4>
              <div className="p-4 bg-muted rounded-lg text-sm">
                <div className="text-sm max-h-[4.5em] overflow-y-auto custom-scrollbar">
                  {call.advice.split('\n').map((line, index) => (
                    <p key={index} className="mb-1">{line}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {call.confidenceScore && (
            <p className="text-sm">
              <span className="font-medium">Confidence Score:</span> {call.confidenceScore}
            </p>
          )}

          {/* Risk Assessment */}
          {call.riskLevel !== "none" && (
            <div className="border border-destructive/20 bg-destructive/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <h4 className="font-medium text-destructive">Risk Assessment</h4>
              </div>
              <p className="text-sm">
                This call has been flagged as {call.riskLevel} risk. Immediate attention may be required.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}