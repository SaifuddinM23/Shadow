import { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Award, Crown, X, CircleDot, Disc3, Goal, HandFist, Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [duration, setDuration] = useState(10); // Dynamically set from video metadata

  // Background Music States & Refs
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.5); // Default 50%
  const [musicMuted, setMusicMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const chooseArenaBtnRef = useRef<HTMLButtonElement>(null);
  const touchStartYRef = useRef(0);

  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);

  // Initialize background music and handle autoplay browser policies
  useEffect(() => {
    const audio = new Audio(`${import.meta.env.BASE_URL}the_batman_theme.mp3`);
    audio.loop = true;
    audio.volume = musicMuted ? 0 : musicVolume;
    audioRef.current = audio;

    const playAudio = () => {
      if (audio.paused) {
        audio.play()
          .then(() => {
            setMusicPlaying(true);
            removeInteractionListeners();
          })
          .catch((err) => {
            console.log("Autoplay blocked or play failed, waiting for user interaction:", err);
          });
      }
    };

    const handleUserInteraction = () => {
      playAudio();
    };

    const removeInteractionListeners = () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };

    // Try playing immediately
    playAudio();

    // Listen for interaction if it was blocked
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);
    window.addEventListener('scroll', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);

    return () => {
      removeInteractionListeners();
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Sync state volume and mute modifications to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicMuted ? 0 : musicVolume;
    }
  }, [musicVolume, musicMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setMusicPlaying(true))
        .catch(err => console.log("Play failed:", err));
    }
  };

  const toggleMute = () => {
    setMusicMuted(prev => !prev);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMusicVolume(val);
    if (val > 0) {
      setMusicMuted(false);
    }
  };


  // References and states for the lightning transition
  const gamesSectionRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cloudCanvasRef = useRef<HTMLCanvasElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [surgeTriggered, setSurgeTriggered] = useState([false, false, false, false]);
  const [isSupercharged, setIsSupercharged] = useState(false);

  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; alpha: number; size: number }[]>([]);
  const isTransitioningRef = useRef(false);
  const transitionProgressRef = useRef(0);

  const [cardStates, setCardStates] = useState<('dormant' | 'charging' | 'charged')[]>(['dormant', 'dormant', 'dormant', 'dormant']);
  const cardStatesRef = useRef<('dormant' | 'charging' | 'charged')[]>(['dormant', 'dormant', 'dormant', 'dormant']);

  const navItems = ["Games", "AR Tech", "Movement", "Inquire"];

  const stats = [
    { value: "50M+", label: "Active Players" },
    { value: "98%", label: "Motion Accuracy" },
    { value: "4", label: "Immersive Sports" },
  ];

  const games = [
    {
      id: "cricket",
      title: "Cricket",
      jpTitle: "CRICKET // PITCH 01",
      description: "Step up to the pitch in augmented reality. Face virtual pacers and spinners, time your bat swings, and test your footwork in real-time.",
      linkText: "Enter Pitch",
      jpLinkText: "ENTER PITCH // 01",
      icon: CircleDot,
      startTime: 0,
    },
    {
      id: "table-tennis",
      title: "Table Tennis",
      jpTitle: "TABLE TENNIS // RALLY 02",
      description: "A high-velocity precision rally. Slice, spin, and smash virtual table tennis balls using fast hand gesture and paddle tracking.",
      linkText: "Start Rally",
      jpLinkText: "START RALLY // 02",
      icon: Disc3,
      startTime: 3,
    },
    {
      id: "football",
      title: "Football",
      jpTitle: "FOOTBALL // STRIKE 03",
      description: "Run, dribble, and shoot virtual soccer balls. Track full-body kinetics and test your target accuracy with zero equipment.",
      linkText: "Take Strike",
      jpLinkText: "TAKE STRIKE // 03",
      icon: Goal,
      startTime: 6,
    },
    {
      id: "shadowboxing",
      title: "Shadowboxing",
      jpTitle: "SHADOWBOXING // ARENA 04",
      description: "Step into the Kombat Arena. Dodge, weave, and throw real punches mapped to dynamic virtual opponents with instant impact response.",
      linkText: "Enter Arena",
      jpLinkText: "ENTER ARENA // 04",
      icon: HandFist,
      startTime: 9,
    },
  ];

  const triggerSurge = (idx: number) => {
    setSurgeTriggered((prev) => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
    setTimeout(() => {
      setSurgeTriggered((prev) => {
        const next = [...prev];
        next[idx] = false;
        return next;
      });
    }, 1500);
  };

  const handleChooseArenaClick = () => {
    if (!isUnlocked) {
      setIsUnlocked(true);
      setVideoProgress(1.0);
    }

    setTimeout(() => {
      const gamesSec = gamesSectionRef.current;
      if (!gamesSec) return;

      setIsSupercharged(true);
      isTransitioningRef.current = true;
      transitionProgressRef.current = 0;

      const grid = cardsGridRef.current;
      const gridTop = gamesSec.offsetTop + (grid?.offsetTop || 0);
      const targetScrollY = Math.max(0, gridTop - (window.innerHeight - (grid?.offsetHeight || 384)) / 2);
      const startScrollY = window.scrollY;
      const distance = targetScrollY - startScrollY;
      const duration = 3000; // Slower cinematic direct scroll to the end part
      let startTime: number | null = null;

      // Reset card states so the strike sequence restarts cleanly
      cardStatesRef.current = ['dormant', 'dormant', 'dormant', 'dormant'];
      setCardStates(['dormant', 'dormant', 'dormant', 'dormant']);

      const scrollStep = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(1, elapsed / duration);
        transitionProgressRef.current = progress;

        // EaseInOutCubic curve
        const ease = progress < 0.5 
          ? 4 * progress * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        window.scrollTo(0, startScrollY + distance * ease);

        if (progress < 1) {
          requestAnimationFrame(scrollStep);
        } else {
          setIsSupercharged(false);
          // Let the residual current particles play out for a moment before clearing transition flag
          setTimeout(() => {
            isTransitioningRef.current = false;
          }, 500);
        }
      };
      requestAnimationFrame(scrollStep);
    }, 50);
  };

  // Lock or unlock scroll depending on the scroll/reveal status
  useEffect(() => {
    if (isUnlocked) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0); // Keep at top during video play
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isUnlocked]);

  // Track wheel and touch events to update videoProgress when scroll is locked
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // If unlocked, check if we scrolled back to top
      if (isUnlocked) {
        if (window.scrollY <= 4 && e.deltaY < 0) {
          setIsUnlocked(false);
          setVideoProgress(0.99); // Start slightly before completion so it slides back shut
          e.preventDefault();
        }
        return;
      }

      // If scroll is locked, let the wheel dictate videoProgress
      e.preventDefault();

      // Delta controls speed of scrubbing (reduced sensitivity for slower scroll speed)
      const sensitivity = 0.00025; // much slower, buttery and responsive
      const delta = e.deltaY * sensitivity;

      setVideoProgress((prev) => {
        const next = Math.max(0, Math.min(1, prev + delta));
        if (next >= 1) {
          setIsUnlocked(true);
        }
        return next;
      });
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isUnlocked) return;
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isUnlocked) {
        if (window.scrollY <= 4 && e.touches[0].clientY > touchStartYRef.current) {
          setIsUnlocked(false);
          setVideoProgress(0.99);
          e.preventDefault();
        }
        return;
      }

      // Block normal scroll gesture
      e.preventDefault();

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartYRef.current - currentY; // positive swipe up (scroll down)
      touchStartYRef.current = currentY;

      // Reduced sensitivity for slower scroll speed
      const sensitivity = 0.0008;
      const delta = deltaY * sensitivity;

      setVideoProgress((prev) => {
        const next = Math.max(0, Math.min(1, prev + delta));
        if (next >= 1) {
          setIsUnlocked(true);
        }
        return next;
      });
    };

    // Listeners are added with passive: false so we can preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isUnlocked]);

  // HTML5 Canvas lightning renderer loop
  useEffect(() => {
    let animId: number;

    const generateLightningPath = (x1: number, y1: number, x2: number, y2: number, displacement: number) => {
      const points = [{ x: x1, y: y1 }, { x: x2, y: y2 }];
      let iterations = 5;

      for (let i = 0; i < iterations; i++) {
        for (let j = points.length - 1; j > 0; j--) {
          const p1 = points[j];
          const p2 = points[j - 1];

          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const len = Math.sqrt(dx * dx + dy * dy);

          if (len < 5) continue;

          const nx = -dy / len;
          const ny = dx / len;
          const offset = (Math.random() - 0.5) * displacement;

          const newPt = {
            x: midX + nx * offset,
            y: midY + ny * offset,
          };

          points.splice(j, 0, newPt);
        }
        displacement *= 0.55; // slower decay for higher jaggedness/crookedness
      }
      return points;
    };

    const drawLightningPath = (
      ctx: CanvasRenderingContext2D,
      points: { x: number; y: number }[],
      opacity: number,
      coreWidth = isSupercharged ? 4.5 : 1.5,
      glowWidth = isSupercharged ? 24 : 8,
      color = 'rgb(239, 68, 68)'
    ) => {
      if (points.length < 2) return;

      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = glowWidth * 2.5;
      ctx.globalAlpha = opacity * 0.12;
      ctx.shadowColor = color;
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = glowWidth;
      ctx.globalAlpha = opacity * 0.5;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = coreWidth;
      ctx.globalAlpha = opacity;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
      ctx.restore();
    };

    const drawMainLightningWithBranches = (
      ctx: CanvasRenderingContext2D,
      startX: number,
      startY: number,
      endX: number,
      endY: number,
      opacity: number
    ) => {
      const mainDisplacement = isSupercharged ? 140 : 80;
      const mainPath = generateLightningPath(startX, startY, endX, endY, mainDisplacement);
      drawLightningPath(ctx, mainPath, opacity);

      const branchProb = isSupercharged ? 0.08 : 0.04;
      mainPath.forEach((pt, idx) => {
        if (idx > 0 && idx < mainPath.length - 1 && Math.random() < branchProb) {
          // Point branches downwards in a cone (Math.PI/2 is straight down)
          const angle = Math.PI / 2 + (Math.random() - 0.5) * (Math.PI / 2);
          const branchLen = 60 + Math.random() * 90;
          const bx = pt.x + Math.cos(angle) * branchLen;
          const by = pt.y + Math.sin(angle) * branchLen;
          
          const branchPath = generateLightningPath(pt.x, pt.y, bx, by, 30);
          drawLightningPath(ctx, branchPath, opacity * 0.45, 0.8, 4);
        }
      });
    };

    const tick = () => {
      const canvas = canvasRef.current;
      const gamesSec = gamesSectionRef.current;
      const cardsGrid = cardsGridRef.current;

      if (!canvas || !gamesSec || !cardsGrid) {
        animId = requestAnimationFrame(tick);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animId = requestAnimationFrame(tick);
        return;
      }

      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      const gridRect = cardsGrid.getBoundingClientRect();
      const startYViewport = window.innerHeight;
      const endYViewport = 200; // Trigger complete when card grid top reaches 200px from top

      const btn = chooseArenaBtnRef.current;
      const getButtonEdgePoint = () => {
        if (!btn) return { x: canvas.width / 2, y: canvas.height / 2 };
        const rect = btn.getBoundingClientRect();
        const rand = Math.random();
        if (rand < 0.70) {
          // Bottom edge (70% probability)
          return {
            x: rect.left + Math.random() * rect.width,
            y: rect.bottom
          };
        } else if (rand < 0.85) {
          // Left edge (15% probability)
          return {
            x: rect.left,
            y: rect.top + Math.random() * rect.height
          };
        } else {
          // Right edge (15% probability)
          return {
            x: rect.right,
            y: rect.top + Math.random() * rect.height
          };
        }
      };

      let progress = 0;
      if (isTransitioningRef.current) {
        progress = transitionProgressRef.current;
      } else if (gridRect.top < startYViewport) {
        progress = Math.max(0, Math.min(1, (startYViewport - gridRect.top) / (startYViewport - endYViewport)));
      }

      ctx.save();

      // Initial giant crimson lightning bolt and intense screen shake (first 18% of scroll transition)
      if (isTransitioningRef.current && progress > 0 && progress < 0.18) {
        const initialProgress = progress / 0.18;
        const startPoint = getButtonEdgePoint();
        const strikeX = startPoint.x;
        const strikeStartY = startPoint.y;
        const strikeEndY = window.innerHeight;
        
        // Massive crimson core and wide glow (single bolt)
        const massivePath = generateLightningPath(strikeX, strikeStartY, strikeX, strikeEndY, 180);
        drawLightningPath(ctx, massivePath, (1.0 - initialProgress) * 0.95, 12, 45, 'rgb(239, 68, 68)');

        // Intense screen shake
        const dx = (Math.random() - 0.5) * 24;
        const dy = (Math.random() - 0.5) * 24;
        ctx.translate(dx, dy);
      } else if (isSupercharged && Math.random() < 0.75) {
        // Normal supercharged screen shake
        const dx = (Math.random() - 0.5) * 8;
        const dy = (Math.random() - 0.5) * 8;
        ctx.translate(dx, dy);
      }

      ctx.clearRect(-20, -20, canvas.width + 40, canvas.height + 40);

      // Reset card states if scrolled back to top (and we are not in the middle of a click transition)
      if (!isTransitioningRef.current && progress <= 0.02) {
        if (cardStatesRef.current.some(c => c !== 'dormant')) {
          cardStatesRef.current = ['dormant', 'dormant', 'dormant', 'dormant'];
          setCardStates(['dormant', 'dormant', 'dormant', 'dormant']);
        }
        particlesRef.current = [];
        ctx.restore();
        animId = requestAnimationFrame(tick);
        return;
      }

      // Start position emerges directly from the Choose Your Arena button edges/bottom!
      const startPoint = getButtonEdgePoint();
      const startX = startPoint.x;
      const startY = startPoint.y; 
      
      // Split point bends organically relative to the moving strike
      const baseSplitX = canvas.width / 2 + Math.cos(Date.now() * 0.004) * (canvas.width * 0.1);
      const splitX = baseSplitX + (Math.random() - 0.5) * (isSupercharged ? 200 : 80);
      const splitY = gridRect.top - 60;

      // Stage 1: Main bolt down to split point (progress goes from 0.02 to 0.3)
      const mainProgress = Math.min(1, Math.max(0, (progress - 0.02) / 0.28));
      const currentMainEndY = startY + (splitY - startY) * mainProgress;
      const lightningOpacity = 1.0 - (progress >= 0.92 ? (progress - 0.92) / 0.08 : 0);

      if (mainProgress > 0) {
        // Draw a single main bolt from the button edge/bottom
        drawMainLightningWithBranches(ctx, startX, startY, splitX, currentMainEndY, lightningOpacity);


        if (mainProgress < 1.0 && Math.random() < (isSupercharged ? 0.95 : 0.4)) {
          const spawnCount = isSupercharged ? 6 : 3;
          for (let i = 0; i < spawnCount; i++) {
            particlesRef.current.push({
              x: splitX,
              y: currentMainEndY,
              vx: (Math.random() - 0.5) * (isSupercharged ? 10 : 6),
              vy: (Math.random() - 0.5) * (isSupercharged ? 10 : 6),
              alpha: 1.0,
              size: 2 + Math.random() * 3,
            });
          }
        }
      }

      // Stage 2: Staggered sequential charging card lifecycles and border-wrapping electricity
      if (progress >= 0.22) {
        const cardCenters = cardRefs.current.map((card) => {
          if (!card) return null;
          const rect = card.getBoundingClientRect();
          return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          };
        });

        const newCardStates = [...cardStatesRef.current];
        let statesChanged = false;

        cardCenters.forEach((center, idx) => {
          if (!center) return;

          // Stagger range
          const cardStart = 0.22 + idx * 0.16;
          const cardEnd = cardStart + 0.16;

          let targetState: 'dormant' | 'charging' | 'charged' = newCardStates[idx];
          if (targetState !== 'charged') {
            if (progress >= cardEnd) {
              targetState = 'charged';
            } else if (progress >= cardStart) {
              targetState = 'charging';
            }
          }

          if (newCardStates[idx] !== targetState) {
            const justCharged = targetState === 'charged' && newCardStates[idx] !== 'charged';
            newCardStates[idx] = targetState;
            statesChanged = true;

            // Transition to charged triggers final strike burst
            if (justCharged) {
              triggerSurge(idx);

              // Large particle burst at card center
              const cardElement = cardRefs.current[idx];
              if (cardElement) {
                const rect = cardElement.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const burstCount = isSupercharged ? 55 : 30;
                for (let p = 0; p < burstCount; p++) {
                  const angle = Math.random() * Math.PI * 2;
                  const speed = isSupercharged ? 4 + Math.random() * 12 : 2 + Math.random() * 8;
                  particlesRef.current.push({
                    x: centerX,
                    y: centerY,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - (isSupercharged ? 4 : 2),
                    alpha: 1.0,
                    size: 2.0 + Math.random() * 4.5,
                  });
                }
              }
            }
          }

          // Draw electrical animations for active states
          const cardElement = cardRefs.current[idx];
          if (cardElement) {
            const rect = cardElement.getBoundingClientRect();

            if (targetState === 'charging') {
              // 1. Draw lightning branch striking the card center from the split point
              const strikeProgress = (progress - cardStart) / 0.16;
              const lengthFactor = Math.min(1, strikeProgress / 0.7); // reaches center at 70% of duration
              const targetX = splitX + (center.x - splitX) * lengthFactor;
              const targetY = splitY + (center.y - splitY) * lengthFactor;

              // Fade out the center strike bolt during the last 30% of its duration
              let strikeOpacity = lightningOpacity;
              if (strikeProgress > 0.7) {
                strikeOpacity *= (1 - (strikeProgress - 0.7) / 0.3);
              }

              const branchPath = generateLightningPath(splitX, splitY, targetX, targetY, 40);
              drawLightningPath(ctx, branchPath, strikeOpacity);

              // 2. Draw organic internal crack-like lightning veins radiating outward from the strike center (center of card)
              const veinProgress = Math.max(0, Math.min(1, (strikeProgress - 0.15) * 1.5));
              const centerX = rect.left + rect.width / 2;
              const centerY = rect.top + rect.height / 2;
              
              if (veinProgress > 0) {
                const numVeins = 6;
                for (let v = 0; v < numVeins; v++) {
                  const angle = (v / numVeins) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
                  const halfDiag = Math.sqrt(rect.width * rect.width + rect.height * rect.height) / 2;
                  const distance = (0.2 + Math.random() * 0.75) * halfDiag * veinProgress;
                  
                  let veinTargetX = centerX + Math.cos(angle) * distance;
                  let veinTargetY = centerY + Math.sin(angle) * distance;
                  
                  const padding = 15;
                  veinTargetX = Math.max(rect.left + padding, Math.min(rect.right - padding, veinTargetX));
                  veinTargetY = Math.max(rect.top + padding, Math.min(rect.bottom - padding, veinTargetY));
                  
                  const veinPath = generateLightningPath(centerX, centerY, veinTargetX, veinTargetY, 15);
                  drawLightningPath(ctx, veinPath, strikeOpacity * 0.9, 0.8, 4, '#ef4444');
                }
              }

              // 3. Emit spark particles inside the card around the veins
              if (Math.random() < 0.7 && veinProgress > 0) {
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.random() * (rect.width / 2) * veinProgress;
                particlesRef.current.push({
                  x: centerX + Math.cos(angle) * dist,
                  y: centerY + Math.sin(angle) * dist,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4 - 1.5,
                  alpha: 1.0,
                  size: 1.2 + Math.random() * 3,
                });
              }

              // 4. Subtle local screen shake when a card is actively charging
              if (Math.random() < 0.3) {
                const dx = (Math.random() - 0.5) * 4;
                const dy = (Math.random() - 0.5) * 4;
                ctx.translate(dx, dy);
              }
            }
          }
        });

        if (statesChanged) {
          cardStatesRef.current = newCardStates;
          setCardStates(newCardStates);
        }
      }

      // Direct random strikes coming "out of nowhere" from the sky to the card grid or random points!
      if (isSupercharged && Math.random() < 0.25) {
        const randomCardIdx = Math.floor(Math.random() * cardRefs.current.length);
        const cardElement = cardRefs.current[randomCardIdx];
        if (cardElement) {
          const rect = cardElement.getBoundingClientRect();
          const targetX = rect.left + rect.width / 2;
          const targetY = rect.top + rect.height / 2;
          
          const startPoint = getButtonEdgePoint();
          const strikeStartX = startPoint.x;
          const strikeStartY = startPoint.y;
          
          const strikePath = generateLightningPath(strikeStartX, strikeStartY, targetX, targetY, 150);
          drawLightningPath(ctx, strikePath, 0.9, 3.5, 14, '#ef4444');
          
          // Particle burst at card center when struck by direct lightning
          const burstCount = 15;
          for (let p = 0; p < burstCount; p++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 4 + Math.random() * 8;
            particlesRef.current.push({
              x: targetX,
              y: targetY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed - 3,
              alpha: 1.0,
              size: 2 + Math.random() * 3,
            });
          }
        }
      }

      // Stage 3: Residual Electrical Currents (linking cards 1-2-3-4)
      if (progress >= 0.9) {
        const cardCenters = cardRefs.current.map((card) => {
          if (!card) return null;
          const rect = card.getBoundingClientRect();
          return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          };
        });

        for (let idx = 0; idx < 3; idx++) {
          const c1 = cardCenters[idx];
          const c2 = cardCenters[idx + 1];
          if (c1 && c2 && Math.random() < 0.3) {
            const arcPath = generateLightningPath(c1.x, c1.y, c2.x, c2.y, 25);
            drawLightningPath(ctx, arcPath, 0.25, 0.8, 3, 'rgba(239, 68, 68, 0.45)');
          }
        }

        if (Math.random() < 0.12) {
          cardCenters.forEach((center) => {
            if (!center) return;
            particlesRef.current.push({
              x: center.x + (Math.random() - 0.5) * 200,
              y: center.y + (Math.random() - 0.5) * 300,
              vx: (Math.random() - 0.5) * 1.5,
              vy: -0.5 - Math.random() * 1.0,
              alpha: 0.8,
              size: 1 + Math.random() * 2,
            });
          });
        }
      }

      // Particles physics loop
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
        p.size = Math.max(0.1, p.size - 0.05);

        if (p.alpha <= 0) return false;

        ctx.save();
        ctx.fillStyle = `rgba(239, 68, 68, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ef4444';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return true;
      });

      ctx.restore(); // Restore shake translation

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [duration, isUnlocked, isSupercharged]);

  // Update video target currentTime playhead when videoProgress updates
  useEffect(() => {
    targetTimeRef.current = videoProgress * duration;
  }, [videoProgress, duration]);

  // requestAnimationFrame loop to lerp currentTime for super fluid, lag-free scrubs
  useEffect(() => {
    if (isUnlocked) return; // Let the video loop play natively when unlocked

    let animId: number;
    let lastSeekTime = -1;

    const updatePlayhead = () => {
      const target = targetTimeRef.current;
      const current = currentTimeRef.current;
      
      // Lerp playhead time
      const lerped = current + (target - current) * 0.15;
      const finalTime = Math.abs(target - lerped) < 0.005 ? target : lerped;
      currentTimeRef.current = finalTime;

      const video = videoRef.current;
      const isBound = finalTime === 0 || finalTime === duration;

      // Throttle seeks by checking seeking state and threshold of change
      if (video && !video.seeking) {
        if (Math.abs(finalTime - lastSeekTime) > 0.025 || isBound) {
          video.currentTime = finalTime;
          lastSeekTime = finalTime;
        }
      }

      animId = requestAnimationFrame(updatePlayhead);
    };

    animId = requestAnimationFrame(updatePlayhead);
    return () => cancelAnimationFrame(animId);
  }, [isUnlocked, duration]);

  // Loop play the end part of the video (last 2.5s) when unlocked
  useEffect(() => {
    const video = videoRef.current;
    let intervalId: number;

    if (isUnlocked && video) {
      const loopStart = Math.max(0, duration - 2.5);

      // Seek to the loop starting point if we are at the end, and play
      if (video.currentTime >= duration - 0.1 || video.currentTime < loopStart) {
        video.currentTime = loopStart;
      }
      video.play().catch(() => {});

      // Keep it looping between loopStart and duration
      intervalId = window.setInterval(() => {
        if (video) {
          if (video.currentTime >= duration - 0.1 || video.currentTime < loopStart || video.ended) {
            video.currentTime = loopStart;
            video.play().catch(() => {});
          }
        }
      }, 100);
    } else {
      video?.pause();
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isUnlocked, duration]);

  // Volumetric cloud canvas animation loop
  useEffect(() => {
    const canvas = cloudCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
        canvas.height = canvas.parentElement?.clientHeight || (window.innerHeight * 0.8);
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    interface Cloud {
      x: number;
      y: number;
      radius: number;
      vx: number;
      baseOpacity: number;
      color: string;
      phase: number;
      pulseSpeed: number;
    }

    interface Fork {
      points: { x: number; y: number }[];
      opacity: number;
    }

    const clouds: Cloud[] = [];
    const cloudCount = 22;
    for (let i = 0; i < cloudCount; i++) {
      const radius = 180 + Math.random() * 150;
      clouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: radius,
        vx: 0.15 + Math.random() * 0.25,
        baseOpacity: 0.2 + Math.random() * 0.35,
        color: Math.random() < 0.3 ? 'rgb(12, 10, 10)' : 'rgb(6, 6, 8)',
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.005 + Math.random() * 0.01
      });
    }

    let flashOpacity = 0;
    let nextFlashTime = Date.now() + 1500;
    let activeForks: Fork[] = [];

    const makeCloudLightningPath = (x1: number, y1: number, x2: number, y2: number, displacement: number) => {
      const points = [{ x: x1, y: y1 }, { x: x2, y: y2 }];
      const iterations = 4;
      for (let i = 0; i < iterations; i++) {
        for (let j = points.length - 1; j > 0; j--) {
          const p1 = points[j];
          const p2 = points[j - 1];
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len < 5) continue;
          const nx = -dy / len;
          const ny = dx / len;
          const offset = (Math.random() - 0.5) * displacement;
          points.splice(j, 0, {
            x: midX + nx * offset,
            y: midY + ny * offset,
          });
        }
        displacement /= 2;
      }
      return points;
    };

    const drawCloudLightning = (cCtx: CanvasRenderingContext2D, points: { x: number; y: number }[], opacity: number) => {
      if (points.length < 2) return;
      cCtx.save();
      cCtx.strokeStyle = '#ef4444';
      cCtx.lineWidth = 6;
      cCtx.globalAlpha = opacity * 0.3;
      cCtx.shadowColor = '#ef4444';
      cCtx.shadowBlur = 15;
      cCtx.beginPath();
      cCtx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) cCtx.lineTo(points[i].x, points[i].y);
      cCtx.stroke();
      cCtx.restore();

      cCtx.save();
      cCtx.strokeStyle = '#ffffff';
      cCtx.lineWidth = 1.5;
      cCtx.globalAlpha = opacity;
      cCtx.beginPath();
      cCtx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) cCtx.lineTo(points[i].x, points[i].y);
      cCtx.stroke();
      cCtx.restore();
    };

    const renderLoop = () => {
      if (!canvas || !ctx) return;

      ctx.fillStyle = '#050404';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const now = Date.now();
      if (now > nextFlashTime) {
        flashOpacity = 0.8 + Math.random() * 0.2;
        nextFlashTime = now + 2000 + Math.random() * 3000;

        if (Math.random() < 0.5) {
          const numForks = Math.floor(1 + Math.random() * 2);
          for (let f = 0; f < numForks; f++) {
            const startX = Math.random() * canvas.width;
            const startY = 0;
            const endX = startX + (Math.random() - 0.5) * canvas.width * 0.4;
            const endY = canvas.height * 0.4 + Math.random() * canvas.height * 0.4;
            activeForks.push({
              points: makeCloudLightningPath(startX, startY, endX, endY, 40),
              opacity: 1.0
            });
          }
        }
      }

      if (flashOpacity > 0) {
        flashOpacity -= 0.04;
        if (flashOpacity < 0) flashOpacity = 0;
      }

      if (flashOpacity > 0) {
        ctx.save();
        ctx.fillStyle = `rgba(239, 68, 68, ${flashOpacity * 0.25})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }

      activeForks = activeForks.filter((fork) => {
        drawCloudLightning(ctx, fork.points, fork.opacity);
        fork.opacity -= 0.08;
        return fork.opacity > 0;
      });

      clouds.forEach((cloud) => {
        cloud.x += cloud.vx;
        if (cloud.x - cloud.radius > canvas.width) {
          cloud.x = -cloud.radius;
        }

        cloud.phase += cloud.pulseSpeed;
        const currentOpacity = Math.max(0.05, cloud.baseOpacity + Math.sin(cloud.phase) * 0.05);

        let finalOpacity = currentOpacity;
        let cloudColor = cloud.color;
        if (flashOpacity > 0) {
          const tintAmount = flashOpacity * 0.6;
          cloudColor = `rgb(${Math.round(15 + tintAmount * 50)}, ${Math.round(12 - tintAmount * 6)}, ${Math.round(12 - tintAmount * 6)})`;
          finalOpacity = Math.min(0.9, currentOpacity + flashOpacity * 0.15);
        }

        const gradient = ctx.createRadialGradient(
          cloud.x, cloud.y, cloud.radius * 0.1,
          cloud.x, cloud.y, cloud.radius
        );
        gradient.addColorStop(0, cloudColor);
        gradient.addColorStop(0.3, `rgba(${cloudColor.replace('rgb(', '').replace(')', '')}, 0.75)`);
        gradient.addColorStop(0.65, `rgba(${cloudColor.replace('rgb(', '').replace(')', '')}, 0.3)`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = finalOpacity;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Fade and scale/translate hero text as split progress begins (to reveal it underneath)
  const heroOpacity = videoProgress >= 0.75 
    ? Math.min(1, (videoProgress - 0.75) / 0.2) // Fully visible by 95% progress
    : 0; // Hidden before 75%
  
  const heroScale = videoProgress >= 0.75
    ? 0.95 + ((videoProgress - 0.75) / 0.25) * 0.05
    : 0.95;

  const heroTranslateY = videoProgress >= 0.75
    ? (1 - (videoProgress - 0.75) / 0.25) * 40
    : 40;

  // Reusable Hero layout elements (navbar + headers + stats)
  // Reusable Hero layout elements (navbar + headers + stats)
  const renderHeroInner = () => (
    <div className="absolute inset-0 w-full h-full flex flex-col justify-between" style={{ width: '100vw', height: '100vh' }}>
      {/* GLOBAL NAVBAR HEADER */}
      <nav className="w-full flex justify-between items-center px-6 sm:px-10 lg:px-16 py-5 lg:py-7 relative z-20 pointer-events-auto">
        {/* Brand/Logo */}
        <span className="font-dela text-white uppercase text-xl sm:text-2xl tracking-wider flex items-center gap-2">
          shadow.io <span className="text-[#e60012] text-xs font-noto tracking-normal font-normal opacity-85">// 影</span>
        </span>

        {/* Center Desktop Links */}
        <div className="hidden md:flex items-center gap-8 lg:gap-12">
          {navItems.map((item) => {
            const jpLabels: Record<string, string> = {
              "Games": "ゲーム",
              "AR Tech": "AR技術",
              "Movement": "動作駆動",
              "Inquire": "問い合わせ"
            };
            return (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="font-inter text-xs text-white/80 hover:text-white tracking-widest uppercase transition-colors duration-300 font-semibold flex flex-col items-center group"
              >
                <span className="group-hover:text-[#e60012] transition-colors">{item}</span>
                <span className="text-[8px] text-white/35 font-noto tracking-normal mt-0.5 group-hover:text-red-500/60 transition-colors">{jpLabels[item]}</span>
              </a>
            );
          })}
        </div>

        {/* Right Desktop CTA Button or Hamburger Menu for Mobile */}
        <div className="flex items-center">
          <a
            href="#get-in-touch"
            className="hidden md:flex items-center gap-2 border border-white/20 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(230,0,18,0.25)] px-6 py-3 text-xs tracking-widest uppercase transition-all duration-300 hover:bg-red-500/10 text-white font-inter"
          >
            PLAY NOW <span className="text-red-500/60 font-noto font-normal text-[10px] tracking-normal">// 起動</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden flex flex-col items-end space-y-1.5 focus:outline-none p-2 -mr-2"
            aria-label="Open menu"
          >
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-4 h-0.5 bg-white"></div>
          </button>
        </div>
      </nav>

      {/* Hero Content Area */}
      <main className="flex-grow flex flex-col justify-center px-6 sm:px-10 lg:px-16 relative z-20 pointer-events-auto">
        {/* Japanese Vertical Text Watermark / Banner */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-4 text-red-500/10 pointer-events-none select-none">
          <span className="font-dela text-6xl tracking-[0.25em] [writing-mode:vertical-rl]">動け。遊べ。支配せよ。</span>
        </div>

        <div className="max-w-4xl flex flex-col items-start text-left">
          
          {/* 1. Tagline */}
          <div className="flex flex-col gap-1 mb-6 lg:mb-8 animate-fade-up">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-red-500" />
              <span className="text-white/80 text-xs sm:text-sm font-inter tracking-[0.3em] uppercase font-bold">
                Next-Gen Motion & AR Gaming Platform
              </span>
            </div>
            <span className="text-[#e60012]/70 text-[9px] font-noto tracking-[0.25em] uppercase pl-6">
              次世代モーション＆ARゲームプラットフォーム // SYSTEM ACTIVE
            </span>
          </div>

          {/* 2. Main Heading */}
          <div className="relative mb-6 lg:mb-8 animate-fade-up-delay-1">
            <h1 className="font-dela text-white uppercase leading-[0.9] tracking-tight text-[clamp(2.5rem,7vw,6.5rem)] flex flex-col">
              <span>MOVE.</span>
              <span>PLAY.</span>
              <span>CONQUER.</span>
            </h1>
            <span className="font-noto text-[#e60012] font-semibold text-sm sm:text-base tracking-[0.2em] block mt-4 uppercase">
              動・戦・支配 // PHYSICAL DIMENSION LOCK
            </span>
          </div>

          {/* 3. Subtext */}
          <p className="text-white/70 text-sm sm:text-base font-inter leading-relaxed max-w-md animate-fade-up-delay-2 mt-4 lg:mt-6">
            Experience games powered by your actual movement and augmented reality. <br className="hidden sm:inline" />
            No controllers, no bounds -- <span className="font-bold text-white">just your shadow.</span>
          </p>

          {/* 4. CTA Row */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 lg:mt-10 animate-fade-up-delay-3">
            <button 
              onClick={handleChooseArenaClick}
              className="group flex items-center gap-3 bg-white hover:bg-[#e60012] hover:text-white text-black px-6 sm:px-8 py-3.5 sm:py-4 text-[11px] sm:text-xs tracking-widest uppercase font-bold transition-all duration-300"
            >
              EXPLORE GAMES <span className="opacity-65 font-noto text-[10px] tracking-normal">// 選択</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <div className="hidden sm:flex items-center gap-3">
              <Award className="w-8 h-8 text-white/50" />
              <div className="flex flex-col text-left">
                <span className="text-white/60 text-xs tracking-wider uppercase font-medium">Top-Rated</span>
                <span className="text-white/60 text-xs tracking-wider uppercase font-medium">AR Platform</span>
              </div>
            </div>
          </div>

          {/* 5. Stats Row */}
          <div className="flex flex-wrap gap-6 sm:gap-12 lg:gap-16 mt-8 sm:mt-10 lg:mt-14 animate-fade-up-delay-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col text-left">
                <span className="font-dela text-white text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                  {stat.value}
                </span>
                <span className="text-white/50 text-[9px] sm:text-xs tracking-widest uppercase mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* Bottom spacer for vertical balance */}
      <div className="h-10 lg:h-14" />
    </div>
  );

  return (
    <div 
      className="relative w-full flex flex-col text-white bg-black select-none bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.95)), url('${import.meta.env.BASE_URL}storm_clouds_bg.png')` }}
    >
      
      {/* CANVAS LIGHTNING OVERLAY */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-30"
      />

      {/* HERO CONTAINER (Full viewport block, no splitting) */}
      <div className="relative w-full h-screen overflow-hidden bg-black z-10">
        
        {/* UNIFIED FULLSCREEN VIDEO BACKGROUND */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0"
          onLoadedMetadata={(e) => {
            if (e.currentTarget.duration) {
              setDuration(e.currentTarget.duration);
            }
            if (!isUnlocked) {
              e.currentTarget.currentTime = 0;
              e.currentTarget.pause();
            }
          }}
          onTimeUpdate={(e) => {
            if (isUnlocked) {
              const video = e.currentTarget;
              const loopStart = Math.max(0, duration - 2.5);
              if (video.currentTime >= duration - 0.1 || video.ended) {
                video.currentTime = loopStart;
                video.play().catch(() => {});
              }
            }
          }}
          onEnded={(e) => {
            if (isUnlocked) {
              const video = e.currentTarget;
              const loopStart = Math.max(0, duration - 2.5);
              video.currentTime = loopStart;
              video.play().catch(() => {});
            }
          }}
        >
          <source src={`${import.meta.env.BASE_URL}main_screen.mp4`} type="video/mp4" />
        </video>
        
        {/* Dark overlays to match original style */}
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black z-10 pointer-events-none" />

        {/* SCROLL CUE FOR INTRO VIDEO */}
        {!isUnlocked && (
          <div 
            style={{
              opacity: Math.max(0, 1 - videoProgress * 2.5),
              pointerEvents: videoProgress > 0.3 ? 'none' : 'auto'
            }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 transition-opacity duration-300 select-none pointer-events-none"
          >
            <span className="font-dela text-[10px] sm:text-xs text-white/80 tracking-[0.25em] uppercase flex items-center gap-2 drop-shadow-md">
              Scroll To Enter <span className="text-[#e60012] font-noto tracking-normal font-normal">// スクロール</span>
            </span>
            <div className="w-5 h-8 rounded-full border border-white/40 flex items-start justify-center p-1.5 shadow-lg bg-black/30 backdrop-blur-sm">
              <div className="w-1 h-2 rounded-full bg-[#e60012] animate-bounce" />
            </div>
          </div>
        )}

        {/* HERO CONTENT OVERLAY */}
        <div 
          style={{
            opacity: heroOpacity,
            transform: `scale(${heroScale}) translateY(${heroTranslateY}px)`,
            willChange: 'opacity, transform',
            transition: 'opacity 0.05s ease-out, transform 0.05s ease-out',
            pointerEvents: heroOpacity > 0.1 ? 'auto' : 'none'
          }}
          className="absolute inset-0 w-full h-full flex flex-col justify-between z-20"
        >
          {renderHeroInner()}
        </div>
      </div>

      {/* STORM SECTION */}
      <section 
        className="relative w-full h-[80vh] overflow-hidden bg-black flex items-center justify-center border-t border-b border-white/5 z-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.35)), url('${import.meta.env.BASE_URL}storm_clouds_bg.png')` }}
      >
        <video
          muted
          loop
          playsInline
          autoPlay
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-35 pointer-events-none mix-blend-screen"
        >
          <source src={`${import.meta.env.BASE_URL}arena.mp4`} type="video/mp4" />
        </video>
        {/* Blending gradient overlay to merge video background with adjacent sections */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" style={{ zIndex: 5 }} />
        <canvas
          ref={cloudCanvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ zIndex: 10 }}
        />
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none" style={{ zIndex: 20 }} />
        
        <div className="relative z-30 text-center flex flex-col items-center gap-6 px-6">
          <button
            ref={chooseArenaBtnRef}
            onClick={handleChooseArenaClick}
            className="relative group px-10 py-5 bg-gradient-to-r from-red-950/80 to-stone-900/80 border border-red-500/40 text-white font-dela tracking-wider text-base uppercase transition-all duration-500 hover:scale-105 hover:border-red-500 hover:shadow-[0_0_35px_rgba(239,68,68,0.5)] overflow-hidden"
          >
            <div className="shine-overlay animate-shine" />
            <span className="relative z-10 flex items-center gap-3">
              CHOOSE YOUR ARENA <span className="text-red-500 text-xs font-noto tracking-normal font-normal opacity-85">// 戦場選択</span>
              <ArrowUpRight className="w-5 h-5 text-red-500 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
          </button>
          <div className="flex flex-col gap-1.5 items-center">
            <p className="text-red-500/65 font-inter text-xs uppercase tracking-[0.25em] animate-pulse font-bold">
              Click to charge the gateway and awaken the arenas
            </p>
            <p className="text-red-500/45 font-noto text-[10px] tracking-[0.2em] uppercase">
              ゲートウェイを起動し、アリーナを目覚めさせる
            </p>
          </div>
        </div>
      </section>

      {/* GAMES SECTION */}
      <section 
        id="games" 
        ref={gamesSectionRef}
        className="relative z-20 bg-zinc-950 py-24 px-6 sm:px-10 lg:px-16 border-t border-white/10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(9,9,11,0.85), rgba(9,9,11,0.92)), url('${import.meta.env.BASE_URL}storm_clouds_bg.png')` }}
      >
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="flex flex-col items-start text-left mb-16 max-w-2xl relative">
            {/* Glowing clouds background glow behind header */}
            <div 
              className="absolute -inset-16 bg-cover bg-center bg-no-repeat opacity-[0.65] pointer-events-none blur-2xl rounded-full"
              style={{ backgroundImage: `url('${import.meta.env.BASE_URL}storm_clouds_bg.png')`, zIndex: 0 }}
            />
            <div className="relative z-10 flex flex-col items-start">
              <span className="text-red-500 font-noto tracking-[0.2em] text-xs uppercase mb-4 block font-semibold">
                THE ACTIVE ARCADE // アクティブ・アーケード
              </span>
              <h2 className="font-dela text-white uppercase text-2xl sm:text-4xl tracking-wide leading-tight mb-6">
                CHOOSE YOUR ARENA <span className="text-[#e60012]/85 text-xl font-noto block mt-2 tracking-normal font-normal">// 領域選択</span>
              </h2>
              <p className="text-white/60 font-inter text-sm sm:text-base leading-relaxed">
                Step in front of the camera and play without hardware controllers. Our advanced motion-tracking and AR engine translates your real-world body movements directly into the virtual playing field.
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <div 
            ref={cardsGridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {games.map((game, idx) => (
              <div
                key={game.id}
                ref={(el) => { cardRefs.current[idx] = el; }}
                className={`group relative flex flex-col justify-between h-96 transition-all duration-500 overflow-hidden ${
                  cardStates[idx] === 'dormant' ? 'arena-card-dormant' : 'arena-card-active'
                } ${
                  cardStates[idx] === 'charging' ? 'card-charging-flicker heat-shimmer' : ''
                } ${
                  cardStates[idx] === 'charged' ? 'active-pulse-glow hover:-translate-y-3' : ''
                }`}
              >
                {/* Conic Border inner cover */}
                {(cardStates[idx] !== 'dormant') && <div className="card-inner-overlay" />}

                {/* Video Background (rendered always but opacity transitioned smoothly) */}
                <div className={`absolute inset-0 w-full h-full overflow-hidden z-0 transition-all duration-1000 ${
                  cardStates[idx] === 'dormant' ? 'opacity-0 pointer-events-none' : 
                  cardStates[idx] === 'charging' ? 'opacity-40 heat-shimmer' : 'opacity-40'
                }`}>
                  {cardStates[idx] !== 'dormant' && (
                    <video
                      muted
                      loop
                      playsInline
                      autoPlay
                      className="w-full h-full object-cover"
                      ref={(el) => {
                        if (el) {
                          if (el.dataset.initialized !== 'true') {
                            el.currentTime = game.startTime;
                            el.dataset.initialized = 'true';
                          }
                          el.play().catch(() => {});
                        }
                      }}
                    >
                      <source src={`${import.meta.env.BASE_URL}samurai.mp4`} type="video/mp4" />
                    </video>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/80" />
                </div>

                {/* Neon Red Line sweep scanning bottom-to-top */}
                {cardStates[idx] === 'charging' && <div className="charging-neon-line" />}

                {/* Energy Surge Sweep */}
                <div className={`energy-surge-sweep ${surgeTriggered[idx] ? 'animate-surge' : ''}`} />

                {/* Card Content */}
                <div className={`relative z-10 flex flex-col justify-between h-full p-8 ${
                  cardStates[idx] === 'charged' ? 'content-materialize' : 
                  cardStates[idx] === 'charging' ? 'opacity-50 blur-[2px] heat-shimmer transition-all duration-300' : 'opacity-0'
                }`}>
                  <div className="flex flex-col gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                      cardStates[idx] === 'charged'
                        ? 'bg-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] opacity-100 transition-all duration-500 delay-300' 
                        : cardStates[idx] === 'charging'
                        ? 'bg-white/5 text-white/20 opacity-30'
                        : 'bg-white/5 text-white/40 opacity-0'
                    }`}>
                      <game.icon className="w-6 h-6" />
                    </div>
                    
                    <h3 className={`font-dela text-sm sm:text-base uppercase tracking-wider ${
                      cardStates[idx] === 'charged' ? 'text-red-500 device-power-on' :
                      cardStates[idx] === 'charging' ? 'text-white/40 opacity-50 transition-all duration-300' :
                      'text-white/20'
                    }`}>
                      {game.jpTitle || game.title}
                    </h3>
                    
                    <p className={`font-inter text-xs sm:text-sm leading-relaxed ${
                      cardStates[idx] === 'charged' ? 'text-white/75 device-power-on' :
                      cardStates[idx] === 'charging' ? 'text-white/20 opacity-50 transition-all duration-300' :
                      'text-white/10'
                    }`}>
                      {game.description}
                    </p>
                  </div>

                  <div className={`flex items-center gap-2 transition-all duration-500 text-xs font-noto tracking-wider uppercase mt-4 ${
                    cardStates[idx] === 'charged' 
                      ? 'text-red-400 group-hover:text-white opacity-100 transition-all duration-500 delay-500' 
                      : cardStates[idx] === 'charging'
                      ? 'text-white/20 opacity-30'
                      : 'text-white/20 opacity-0'
                  }`}>
                    {game.jpLinkText || game.linkText}
                    <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-red-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-20 bg-black border-t border-white/10 py-12 px-6 sm:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-podium text-white font-bold uppercase text-2xl sm:text-3xl tracking-wider">
              shadow.io
            </span>
            <span className="text-white/40 text-xs font-inter uppercase tracking-widest">
              Motion Gaming Engine © {new Date().getFullYear()}
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="font-inter text-xs text-white/50 hover:text-white uppercase tracking-widest transition-colors duration-300"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="text-white/40 text-xs font-inter flex gap-4">
            <a href="#terms" className="hover:text-white transition-colors">TERMS</a>
            <span>•</span>
            <a href="#privacy" className="hover:text-white transition-colors">PRIVACY</a>
          </div>
        </div>
      </footer>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/95 backdrop-blur-sm transition-all duration-500 flex flex-col justify-between ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Mobile Header Row */}
        <div className="flex justify-between items-center px-6 sm:px-10 lg:px-16 py-5 lg:py-7 w-full">
          <span className="font-podium text-white font-bold uppercase text-2xl sm:text-3xl tracking-wider">
            shadow.io
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="text-white hover:text-white/80 transition-colors p-2"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Centered Navigation Items */}
        <div className="flex-grow flex flex-col justify-center items-center px-6">
          <div className="flex flex-col items-center gap-6">
            {navItems.map((item, i) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                style={{
                  transitionDelay: `${i * 80 + 100}ms`,
                  transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                  opacity: menuOpen ? 1 : 0,
                }}
                className="font-podium text-4xl sm:text-5xl text-white hover:text-white/70 transition-all duration-500 ease-out uppercase tracking-wide"
              >
                {item}
              </a>
            ))}
            
            {/* Play Now in Mobile Overlay */}
            <a
              href="#play-now"
              onClick={() => setMenuOpen(false)}
              style={{
                transitionDelay: `${navItems.length * 80 + 100}ms`,
                transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                opacity: menuOpen ? 1 : 0,
              }}
              className="transition-all duration-500 ease-out border border-white/30 hover:border-white/60 px-6 py-3 text-xs tracking-widest uppercase hover:bg-white/10 flex items-center gap-2 mt-4 text-white font-inter"
            >
              PLAY NOW
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>

      {/* FLOATING AUDIO CONTROL PANEL */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-zinc-950/85 backdrop-blur-md border border-white/10 rounded-full px-4 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:border-red-500/30 transition-all duration-300 hover:shadow-[0_0_25px_rgba(239,68,68,0.2)] group/panel pointer-events-auto">
        {/* Pulsing indicator */}
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            {musicPlaying && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${musicPlaying ? 'bg-red-500' : 'bg-zinc-600'}`}></span>
          </div>
          <Music className={`w-3.5 h-3.5 text-white/60 ${musicPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
        </div>

        {/* Divider */}
        <div className="w-[1px] h-4 bg-white/10"></div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="flex items-center justify-center p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
          title={musicPlaying ? "Pause Theme" : "Play Theme"}
        >
          {musicPlaying ? (
            <Pause className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-white text-white" />
          )}
        </button>

        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className="flex items-center justify-center p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
          title={musicMuted ? "Unmute" : "Mute"}
        >
          {musicMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-red-500" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Volume Slider (Expands on panel hover or slider hover) */}
        <div className="w-0 group-hover/panel:w-16 overflow-hidden transition-all duration-300 flex items-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={musicMuted ? 0 : musicVolume}
            onChange={handleVolumeChange}
            className="w-14 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-red-500 hover:accent-red-400 focus:outline-none"
            style={{
              background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${(musicMuted ? 0 : musicVolume) * 100}%, rgba(255,255,255,0.2) ${(musicMuted ? 0 : musicVolume) * 100}%, rgba(255,255,255,0.2) 100%)`
            }}
          />
        </div>
      </div>

      {/* SVG Turbulence/Displacement filter for real-time heat shimmer distortion */}
      <svg style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
        <defs>
          <filter id="heat-distort">
            <feTurbulence type="fractalNoise" baseFrequency="0.05 0.09" numOctaves="2" result="noise">
              <animate 
                attributeName="baseFrequency" 
                dur="4s" 
                keyTimes="0;0.5;1" 
                values="0.05 0.09;0.08 0.04;0.05 0.09" 
                repeatCount="indefinite" 
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

export default App;
