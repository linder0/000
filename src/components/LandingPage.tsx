import React, { useState, useEffect, useRef } from 'react';

const TYPEWRITER_TEXT = 'drop 000';
const TYPEWRITER_SPEED = 120; // ms per character
const TYPEWRITER_PAUSE = 900; // ms pause at full text or empty

const monoFont = { fontFamily: 'Space Mono, monospace', letterSpacing: '0.15em' };

const TOP_MARQUEE = 'THIRD SPACER   •   A COMMUNITY-POWERED EXPERIMENT IN CREATIVE ABSURDITY.';
const BOTTOM_MARQUEE = 'SUBMIT AN IDEA. VOTE FOR YOUR FAVORITE. GET IT IN THE MAIL. ONE PHYSICAL DROP. EVERY MONTH.';

function useSeamlessMarquee(text: string, speed = 18) {
  const trackRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const [contentRepeat, setContentRepeat] = useState(2);
  const [animationDuration, setAnimationDuration] = useState(speed);

  useEffect(() => {
    if (!trackRef.current || !contentRef.current) return;
    const trackWidth = trackRef.current.offsetWidth;
    const contentWidth = contentRef.current.offsetWidth;
    // Repeat enough times to fill at least 2x the track width
    const repeat = Math.ceil((trackWidth * 2) / contentWidth);
    setContentRepeat(repeat);
    // Set duration proportional to content width
    setAnimationDuration(speed * repeat);
  }, [text, speed]);

  return { trackRef, contentRef, contentRepeat, animationDuration };
}

const LandingPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [fadeIn, setFadeIn] = useState(false);
  const [typed, setTyped] = useState('');
  const [typingForward, setTypingForward] = useState(true);
  const placeholderRef = useRef<HTMLInputElement>(null);
  const PLACEHOLDER_TEXT = 'enter your email';
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Marquee hooks for top and bottom
  const topMarquee = useSeamlessMarquee(TOP_MARQUEE, 18);
  const bottomMarquee = useSeamlessMarquee(BOTTOM_MARQUEE, 18);

  // Typewriter effect for 'drop 001' (looping)
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (typingForward) {
      if (typed.length < TYPEWRITER_TEXT.length) {
        timeout = setTimeout(() => {
          setTyped(TYPEWRITER_TEXT.slice(0, typed.length + 1));
        }, TYPEWRITER_SPEED);
      } else {
        timeout = setTimeout(() => setTypingForward(false), TYPEWRITER_PAUSE);
      }
    } else {
      if (typed.length > 0) {
        timeout = setTimeout(() => {
          setTyped(TYPEWRITER_TEXT.slice(0, typed.length - 1));
        }, TYPEWRITER_SPEED);
      } else {
        timeout = setTimeout(() => setTypingForward(true), TYPEWRITER_PAUSE);
      }
    }
    return () => clearTimeout(timeout);
  }, [typed, typingForward]);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
    }
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col justify-between overflow-hidden relative">
      {/* Top Marquee */}
      <div className="w-full absolute top-0 left-0 z-50 pointer-events-none" style={{height: '2.2rem'}}>
        <div className="w-full h-full overflow-hidden flex items-center" style={{background: 'rgba(0,0,0,0.4)'}}>
          <div
            ref={topMarquee.trackRef}
            className="relative w-full h-full overflow-hidden"
          >
            <div
              className="absolute left-0 top-0 h-full flex items-center"
              style={{
                width: 'max-content',
                animation: `marquee-loop-top ${topMarquee.animationDuration}s linear infinite`,
              }}
            >
              {Array.from({ length: topMarquee.contentRepeat }).map((_, i) => (
                <span
                  key={i}
                  ref={i === 0 ? topMarquee.contentRef : undefined}
                  className="whitespace-nowrap text-xs md:text-sm tracking-widest uppercase marquee-content"
                  style={{ ...monoFont, color: '#fff', marginRight: '1em', fontSize: '1.2em' }}
                >
                  {TOP_MARQUEE}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Background overlays */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ position: 'absolute', top: '2.2rem', left: 0, width: '100vw', height: 'calc(100vh - 4.4rem)' }}
        >
          <source src="/videos/000background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      {/* Main content */}
      <div className="w-full flex flex-col items-center justify-center" style={{flex: 1}}>
        <div
          className={`flex flex-col items-center justify-center text-center px-6 py-12 transition-opacity duration-1000 flex-1 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
          style={{ transform: 'scale(1)', transformOrigin: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}
        >
          {/* Typewriter drop 001 */}
          <div
            className="mb-8 h-8 text-2xl md:text-3xl font-mono tracking-widest text-white uppercase"
            style={{ ...monoFont, minHeight: '2.5rem' }}
          >
            <span className="whitespace-pre">{typed}</span>
            <span className="inline-block animate-blink">|</span>
          </div>
          {/* Waitlist button or form */}
          {!showForm ? (
            <button
              className="px-8 py-4 text-base md:text-lg font-mono tracking-widest uppercase bg-white text-black border-2 border-black rounded-lg shadow-lg hover:bg-black hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
              style={{ ...monoFont }}
              onClick={() => setShowForm(true)}
            >
              Join the Waitlist
            </button>
          ) : (
            <div className="w-full flex flex-col items-center justify-center animate-fade-in">
              <form
                name="waitlist"
                method="POST"
                data-netlify="true"
                target="hidden_iframe"
                onSubmit={() => setIsSubmitted(true)}
                className="flex flex-col sm:flex-row items-center gap-2 mt-4"
                style={{ ...monoFont }}
              >
                <input type="hidden" name="form-name" value="waitlist" />
                <div className="relative w-64 overflow-hidden bg-black rounded-md">
                  <input
                    ref={placeholderRef}
                    type="email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="px-4 py-2 rounded-md border border-gray-400 bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200 w-full uppercase"
                    autoFocus
                    style={monoFont}
                    required
                    placeholder={PLACEHOLDER_TEXT}
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 font-mono uppercase tracking-widest bg-black text-white border-2 border-black rounded-md shadow hover:bg-white hover:text-black transition-colors duration-200 mt-2 sm:mt-0"
                  style={monoFont}
                >
                  I'M IN
                </button>
              </form>
              <iframe name="hidden_iframe" style={{ display: 'none' }}></iframe>
            </div>
          )}
        </div>
      </div>
      {/* Bottom Marquee */}
      <div className="w-full absolute bottom-0 left-0 z-50 pointer-events-none" style={{height: '2.2rem'}}>
        <div className="w-full h-full overflow-hidden flex items-center" style={{background: 'rgba(0,0,0,0.4)'}}>
          <div
            ref={bottomMarquee.trackRef}
            className="relative w-full h-full overflow-hidden"
          >
            <div
              className="absolute left-0 top-0 h-full flex items-center"
              style={{
                width: 'max-content',
                animation: `marquee-loop-bottom ${bottomMarquee.animationDuration}s linear infinite`,
              }}
            >
              {Array.from({ length: bottomMarquee.contentRepeat }).map((_, i) => (
                <span
                  key={i}
                  ref={i === 0 ? bottomMarquee.contentRef : undefined}
                  className="whitespace-nowrap text-xs md:text-sm tracking-widest uppercase marquee-content"
                  style={{ ...monoFont, color: '#fff', marginRight: '1em', fontSize: '1.2em' }}
                >
                  {BOTTOM_MARQUEE}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Fade-in animation for form and typewriter and marquees */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s steps(1) infinite;
        }
        @keyframes marquee-loop-top {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-loop-bottom {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
