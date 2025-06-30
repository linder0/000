import React, { useState, useEffect, useRef } from 'react';

const TYPEWRITER_TEXT = 'drop 001';
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
  const [placeholderScroll, setPlaceholderScroll] = useState(0);
  const placeholderRef = useRef<HTMLInputElement>(null);
  const PLACEHOLDER_TEXT = 'enter your email for the first drop';

  // Marquee hooks for top and bottom
  const topMarquee = useSeamlessMarquee(TOP_MARQUEE, 18);
  const bottomMarquee = useSeamlessMarquee(BOTTOM_MARQUEE, 18);

  // Typewriter effect for 'drop 001' (looping)
  useEffect(() => {
    let timeout: NodeJS.Timeout;
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

  // Marquee effect for placeholder (continuous loop)
  useEffect(() => {
    if (!showForm) return;
    let scroll = 0;
    let frame: number;
    const step = () => {
      if (placeholderRef.current) {
        const input = placeholderRef.current;
        const span = document.getElementById('placeholder-span');
        if (span && input.offsetWidth < span.offsetWidth) {
          scroll += 1.2;
          if (scroll > span.offsetWidth) scroll = -input.offsetWidth;
          setPlaceholderScroll(-scroll);
        } else {
          setPlaceholderScroll(0);
        }
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [showForm]);

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-black overflow-hidden relative">
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
                  className="whitespace-nowrap text-xs md:text-sm tracking-widest uppercase opacity-40 marquee-content"
                  style={{ ...monoFont, color: '#fff', marginRight: '1em' }}
                >
                  {TOP_MARQUEE}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Background overlays */}
      <div className="fixed inset-0 -z-10">
        {/* Figma background image (replace URL with exported image if available) */}
        <img
          src="/images/drop000.jpg" // TODO: Replace with Figma export, e.g. '/images/figma-bg.png'
          alt="Background"
          className="h-screen max-h-screen w-auto object-contain mx-auto select-none"
          draggable={false}
          style={{ display: 'block', margin: '0 auto' }}
        />
        {/* Grain overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-10 mix-blend-overlay opacity-50"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.25' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            backgroundSize: 'cover',
            backgroundRepeat: 'repeat',
          }}
        />
        {/* Maximum vignette overlay */}
        <div className="pointer-events-none absolute inset-0 z-20" style={{
          background: 'radial-gradient(ellipse 45% 65% at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.92) 70%, rgba(0,0,0,0.99) 90%, rgba(0,0,0,1) 100%)'
        }} />
      </div>
      {/* Main content */}
      <div
        className={`flex flex-col items-center justify-center text-center px-6 py-12 rounded-xl transition-opacity duration-1000 flex-1 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'rgba(0,0,0,0.60)', boxShadow: '0 4px 32px rgba(0,0,0,0.3)' }}
      >
        {/* Typewriter drop 001 */}
        <div
          className="mb-8 h-8 text-xl md:text-2xl font-mono tracking-widest text-white uppercase"
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
              action="/success"
              className="flex flex-col sm:flex-row items-center gap-2 mt-4"
              style={{ ...monoFont }}
            >
              <input type="hidden" name="form-name" value="waitlist" />
              <div className="relative w-64 overflow-hidden">
                <input
                  ref={placeholderRef}
                  type="email"
                  name="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="px-4 py-2 rounded-md border border-gray-400 bg-black bg-opacity-60 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200 w-full uppercase"
                  autoFocus
                  style={monoFont}
                  required
                />
                {/* Marquee placeholder */}
                {!email && (
                  <span
                    id="placeholder-span"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none whitespace-nowrap marquee-placeholder"
                    style={{ ...monoFont, transform: `translateY(-50%) translateX(${placeholderScroll}px)`, willChange: 'transform' }}
                  >
                    {PLACEHOLDER_TEXT + '   ' + PLACEHOLDER_TEXT}
                  </span>
                )}
              </div>
              <button
                type="submit"
                className="px-6 py-2 font-mono uppercase tracking-widest bg-white text-black border-2 border-black rounded-md shadow hover:bg-black hover:text-white transition-colors duration-200 mt-2 sm:mt-0"
                style={monoFont}
              >
                I'M IN
              </button>
            </form>
          </div>
        )}
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
                  className="whitespace-nowrap text-xs md:text-sm tracking-widest uppercase opacity-40 marquee-content"
                  style={{ ...monoFont, color: '#fff', marginRight: '1em' }}
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
