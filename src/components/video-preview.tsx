'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, X, Sparkles, CheckCircle, Clock } from 'lucide-react';

interface VideoPreviewProps {
  videoUrl?: string;
  onRegisterClick: () => void;
  price?: number;
}

export function VideoPreview({
  videoUrl = '',
  onRegisterClick,
  price = 199,
}: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-wider text-blue-700 uppercase bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200/60">
            WORKSHOP TRAILER
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight">
            Get a Preview of the Workshop
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-normal">
            See what you’ll learn and decide whether this workshop is right for your school.
          </p>
        </div>

        {/* Video Player Card */}
        <div className="max-w-4xl mx-auto scroll-reveal-scale">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 aspect-video bg-[#0A192F] group">
            
            {/* Thumbnail Image */}
            <Image
              src="/images/presenter-preview.jpg"
              alt="Workshop preview instructor teaching school management strategies"
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover group-hover:scale-102 transition-transform duration-500"
            />

            {/* Gradient Overlay for Cinematic Depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 via-black/20 to-transparent" />

            {/* Top Bar Details */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Executive Education Series • Garvi Education</span>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-600/90 text-white text-xs font-semibold px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                <span>2 Mins Preview</span>
              </div>
            </div>

            {/* Center Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                id="open-video-preview-btn"
                onClick={() => setIsPlaying(true)}
                className="relative group/play flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/95 text-[#0A192F] shadow-2xl hover:bg-white hover:scale-110 transition-all duration-300 active:scale-95"
                aria-label="Play Workshop Preview Video"
              >
                {/* Ripple ring */}
                <span className="absolute -inset-3 rounded-full bg-white/30 animate-ping opacity-75 pointer-events-none" />
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-[#0A192F] ml-1 text-[#0A192F]" />
              </button>
            </div>

            {/* Bottom Caption Bar */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
              <div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white drop-shadow-sm">
                  Executive Briefing: Modernizing School Administration
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-1">
                  Presented by Senior School Operations Specialists • Garvi Education, Rewa
                </p>
              </div>

              <button
                onClick={onRegisterClick}
                className="animate-vibrate-2s self-start sm:self-auto bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                Register Now — ₹{price}
              </button>
            </div>

          </div>

          {/* Under-video highlights */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-600 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Full curriculum walkthrough</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Real demo of digital attendance & fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Interactive Q&A access for attendees</span>
            </div>
          </div>
        </div>

      </div>

      {/* Video Modal Player */}
      {isPlaying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-[#0A192F] rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
            
            <div className="flex items-center justify-between p-4 border-b border-slate-800 text-white">
              <div className="font-semibold text-sm">
                Garvi Education • Workshop Briefing Preview
              </div>
              <button
                onClick={() => setIsPlaying(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
                aria-label="Close video preview"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              {videoUrl && videoUrl.includes('youtube') ? (
                <iframe
                  src={videoUrl}
                  title="Garvi Education Workshop Preview"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                /* Branded preview player panel when external video is not yet configured */
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#0A192F] to-[#122A50] text-white">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4 border border-blue-500/30">
                    <Sparkles className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold mb-2">
                    Online School Management Masterclass Preview
                  </h4>
                  <p className="text-sm text-slate-300 max-w-lg mb-6 leading-relaxed">
                    This interactive 2-hour session is conducted live with our school operations specialists. You will receive direct access to the live Zoom/Google Meet room and the WhatsApp group upon registration.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                      onClick={() => {
                        setIsPlaying(false);
                        onRegisterClick();
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg"
                    >
                      Complete Registration for ₹{price}
                    </button>
                    <button
                      onClick={() => setIsPlaying(false)}
                      className="text-slate-300 hover:text-white text-sm font-medium"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
