import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { 
  Play, 
  Pause, 
  X, 
  ArrowRight, 
  Download, 
  FileText, 
  Mail, 
  Instagram, 
  Linkedin, 
  Github,
  Maximize2,
  ChevronRight,
  Sparkles,
  Smartphone,
  Video,
  Monitor
} from 'lucide-react'

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function App() {
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPercent, setLoadingPercent] = useState(0);
  
  // Modal / Lightbox states
  const [activeProject, setActiveProject] = useState(null);
  const [activeLightboxImage, setActiveLightboxImage] = useState(null);
  const [activePdfUrl, setActivePdfUrl] = useState(null);
  
  // Contact Form States
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // Refs for Scroll elements
  const canvasRef = useRef(null);
  const heroContainerRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(1);

  // ------------------------------------------------------------------------
  // PROJECT DATASET
  // ------------------------------------------------------------------------
  const projects = [
    {
      id: 'tea-ad',
      title: 'The Essence of Leaf',
      category: 'Cinematic Advertisements',
      tagline: 'A visual exploration of tea culture, capturing organic motion and sensory details.',
      cover: '/assets/hero-frames/ezgif-frame-100.jpg',
      videoUrl: '/assets/videos/tea.mp4',
      role: 'Creative Director & Filmmaker',
      tools: 'DaVinci Resolve, Premiere Pro, Sony FX3',
      process: 'Captured macro textures, liquid physics, and steam dynamics. The color grading was meticulously calibrated to deliver rich organic tones, creating a sensory advertising experience.',
      output: 'Cinematic commercial broadcasted digitally.'
    },
    {
      id: 'perfume-ad',
      title: 'Aura - Infinite Scent',
      category: 'Visual Storytelling',
      tagline: 'Luxury fragrance advertisement centered on reflections, geometry, and fluid elegance.',
      cover: '/assets/images/saree-ad.png', // Fallback or poster cover
      videoUrl: '/assets/videos/perfume.mov',
      role: 'Director of Photography & Editor',
      tools: 'Blender 3D, DaVinci Resolve, Sony FX3',
      process: 'Engineered high-end lighting reflections and simulated bottle physics. We focused on extreme high-contrast lighting to capture shadows, emphasizing luxury editorial branding.',
      output: 'Brand launch campaign video.'
    },
    {
      id: 'strict-1',
      title: 'Aegis - Safe Lock Campaign',
      category: 'Marketing Campaigns',
      tagline: 'High-contrast product locks emphasizing mechanical strength and security structures.',
      cover: '/assets/hero-frames/ezgif-frame-220.jpg',
      videoUrl: '/assets/videos/strict-1.mp4',
      role: 'Filmmaker & Editor',
      tools: 'DaVinci Resolve, After Effects',
      process: 'Designed a high-impact trailer demonstrating physical and digital security lock concepts. Synchronized mechanical clicks and sound effects for auditory feedback.',
      output: 'Product launching advertisement.'
    },
    {
      id: 'strict-2',
      title: 'Aegis II - Absolute Security',
      category: 'Marketing Campaigns',
      tagline: 'Second sequence in the industrial security series, highlighting metal compositions.',
      cover: '/assets/hero-frames/ezgif-frame-260.jpg',
      videoUrl: '/assets/videos/strict-2.mp4',
      role: 'Filmmaker & Colorist',
      tools: 'DaVinci Resolve, Premiere Pro',
      process: 'Explored cold, industrial metallic aesthetics. Created a futuristic dark laboratory environment to frame high-end commercial locking designs.',
      output: 'B2B advertising reel.'
    },
    {
      id: 'critical-1',
      title: 'Critical Lock Series',
      category: 'Visual Storytelling',
      tagline: 'High-speed cinematic sequences examining precision industrial design.',
      cover: '/assets/hero-frames/ezgif-frame-050.jpg',
      videoUrl: '/assets/videos/critical-1.mp4',
      role: 'Filmmaker',
      tools: 'Premiere Pro, Sony FX3',
      process: 'Recorded high-speed sequences of steel locking mechanisms. The editorial pace emphasizes tension, rigidity, and modern heavy-metal engineering.',
      output: 'Commercial advertising collateral.'
    },
    {
      id: 'ai-ad-1',
      title: 'Cybernetic Oasis',
      category: 'AI-Generated Advertisements',
      tagline: 'Generative biotechnology advertisement showcasing futuristic organic structures.',
      cover: '/assets/hero-frames/ezgif-frame-140.jpg',
      videoUrl: '/assets/videos/ai-ad-1.mp4',
      role: 'AI Creator & Director',
      tools: 'Midjourney, Runway Gen-2, Luma Dream Machine',
      process: 'Developed advanced textual prompts to synthesize bio-chrome mechanical orchids. Generated multiple frame interpolations and processed using neural upscaling tools.',
      prompt: 'hyper-realistic cinematic close-up of bioluminescent orchid blooming inside a futuristic chrome lab, neon teal accents, 8k resolution, raytracing --ar 16:9',
      output: 'Future-facing AI advertising concept.'
    },
    {
      id: 'ai-ad-2',
      title: 'Neo-Tokyo Horizons',
      category: 'AI-Generated Advertisements',
      tagline: 'Futuristic automotive showcase mapping light trails and wet asphalt reflections.',
      cover: '/assets/hero-frames/ezgif-frame-180.jpg',
      videoUrl: '/assets/videos/ai-ad-2.mp4',
      role: 'AI Creator & Sound Designer',
      tools: 'Stable Diffusion, Runway Gen-2, ElevenLabs',
      process: 'Simulated a high-speed sports car driving through wet cyberpunk streets. Created prompt paths for heavy rain, neon reflections, and camera pans.',
      prompt: 'sleek sports car cruising through dark wet neon-lit Tokyo streets, cinematic lighting, heavy rain reflections, A24 aesthetic, photorealistic --ar 16:9',
      output: 'AI campaign reel.'
    }
  ];

  const presentations = [
    {
      id: 'solution-pitch',
      title: 'Modern Digital Solution Pitch Deck',
      category: 'Creative Presentations (PPTs)',
      description: 'An interactive pitch deck structure built to showcase design principles, layout typography breathing room, and minimalist brand solutions.',
      videoUrl: '/assets/videos/pitch-deck.mp4',
      pdfUrl: '/assets/documents/pitch-deck.pdf',
      role: 'Lead Presenter & Designer',
      tools: 'Figma, Canva, PowerPoint'
    }
  ];

  const posters = [
    {
      id: 'saree-poster',
      title: 'Tradition Reimagined',
      category: 'Saree Campaign Poster',
      imgUrl: '/assets/images/saree-ad.png'
    },
    {
      id: 'jewellery-poster',
      title: 'Elegance Awaits',
      category: 'Jewellery Launch Poster',
      imgUrl: '/assets/images/jewellery-ad.png'
    }
  ];

  // ------------------------------------------------------------------------
  // ASSETS PRELOADING
  // ------------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;
    let loadedCount = 0;
    const totalFrames = 300;
    
    // List of static images to preload besides frames
    const otherAssets = [
      '/assets/images/saree-ad.png',
      '/assets/images/jewellery-ad.png',
    ];
    
    const totalAssets = totalFrames + otherAssets.length;
    const loadedImages = [];

    const handleAssetLoad = () => {
      loadedCount++;
      if (isMounted) {
        setLoadingPercent(Math.round((loadedCount / totalAssets) * 100));
      }
      if (loadedCount === totalAssets) {
        setTimeout(() => {
          if (isMounted) setIsLoading(false);
        }, 600);
      }
    };

    // Preload hero frames
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameNum = i.toString().padStart(3, '0');
      img.src = `/assets/hero-frames/ezgif-frame-${frameNum}.jpg`;
      img.onload = () => {
        loadedImages[i - 1] = img;
        handleAssetLoad();
      };
      img.onerror = handleAssetLoad; // don't block load if frame fails
    }

    imagesRef.current = loadedImages;

    // Preload other images
    otherAssets.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = handleAssetLoad;
      img.onerror = handleAssetLoad;
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // ------------------------------------------------------------------------
  // LENIS SMOOTH SCROLLING
  // ------------------------------------------------------------------------
  useEffect(() => {
    if (isLoading) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Sync GSAP scroll trigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    return () => {
      lenis.destroy();
    };
  }, [isLoading]);

  // ------------------------------------------------------------------------
  // HERO CANVAS DRAW & TIMELINE SCRUB
  // ------------------------------------------------------------------------
  const drawFrame = (frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = imagesRef.current[frameIndex - 1];
    if (!img) return;

    // Clear and draw centered image with cover behavior
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const imgRatio = img.width / img.height;
    const canvasRatio = canvas.width / canvas.height;
    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
    } else {
      drawHeight = canvas.width / imgRatio;
      offsetY = (canvas.height - drawHeight) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  useEffect(() => {
    if (isLoading) return;

    // Set initial canvas size
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(1);
    }

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawFrame(currentFrameRef.current);
      }
    };
    window.addEventListener('resize', handleResize);

    // GSAP Scroll Scrub Timeline
    const frameObj = { frame: 1 };
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroContainerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.15,
        pin: true,
        pinSpacing: false,
      }
    });

    // Animate frames inside the timeline
    tl.to(frameObj, {
      frame: 300,
      ease: 'none',
      duration: 20,
      onUpdate: () => {
        const frameIndex = Math.round(frameObj.frame);
        currentFrameRef.current = frameIndex;
        drawFrame(frameIndex);
      }
    }, 0);

    // Text Overlays Animations
    // Block 1 (Daksh Mehta Intro) - Peak opacity at progress ~15%
    tl.fromTo('.overlay-1', 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 3 }, 
      0
    );
    tl.to('.overlay-1', 
      { opacity: 0, y: -50, duration: 3 }, 
      4
    );

    // Block 2 (Tagline) - Peak opacity at progress ~50%
    tl.fromTo('.overlay-2', 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 3 }, 
      8
    );
    tl.to('.overlay-2', 
      { opacity: 0, y: -50, duration: 3 }, 
      12
    );

    // Block 3 (Core Philosophy) - Peak opacity at progress ~85%
    tl.fromTo('.overlay-3', 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 3 }, 
      15
    );
    tl.to('.overlay-3', 
      { opacity: 0, y: -50, duration: 3 }, 
      18
    );

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [isLoading]);

  // ------------------------------------------------------------------------
  // INTERVIEW TIMELINE / SCROLL ANIMATIONS FOR OTHER SECTIONS
  // ------------------------------------------------------------------------
  useEffect(() => {
    if (isLoading) return;

    // Timeline card entries
    gsap.utils.toArray('.timeline-card').forEach((card) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Section headers fade
    gsap.utils.toArray('.section-header').forEach((header) => {
      gsap.fromTo(header,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger !== heroContainerRef.current) t.kill();
      });
    };
  }, [isLoading]);

  // ------------------------------------------------------------------------
  // HOVER VIDEO HANDLERS (Netflix Effect)
  // ------------------------------------------------------------------------
  const handleVideoHoverStart = (e) => {
    const video = e.currentTarget.querySelector('video');
    if (video) {
      video.play().catch(() => {});
    }
  };

  const handleVideoHoverEnd = (e) => {
    const video = e.currentTarget.querySelector('video');
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  // ------------------------------------------------------------------------
  // CONTACT SUBMIT HANDLER
  // ------------------------------------------------------------------------
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setFormSubmitted(false);
    }, 5000);
  };

  return (
    <>
      {/* ==========================================
          loader / preloader screen
          ========================================== */}
      {isLoading && (
        <div className="preloader" id="site-preloader">
          <div className="preloader-title">DAKSH MEHTA</div>
          <div className="preloader-bar-container">
            <div className="preloader-bar" style={{ width: `${loadingPercent}%` }}></div>
          </div>
          <div className="preloader-percentage">{loadingPercent}%</div>
        </div>
      )}

      {/* ==========================================
          top navigation bar
          ========================================== */}
      <nav className="nav-bar" id="navbar">
        <a href="#" className="nav-logo">DAKSH MEHTA</a>
        <ul className="nav-links">
          <li><a href="#work">Work</a></li>
          <li><a href="#ai">AI Work</a></li>
          <li><a href="#presentations">Presentations</a></li>
          <li><a href="#posters">Posters</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* ==========================================
          hero scroll canvas section
          ========================================== */}
      <section 
        className="hero-scroll-container" 
        ref={heroContainerRef}
        id="hero"
      >
        <div className="hero-sticky-wrapper">
          <canvas className="hero-canvas" ref={canvasRef} id="hero-canvas" />
          <div className="hero-overlay">
            
            {/* Overlay 1: Digital Intro */}
            <div className="hero-text-block overlay-1">
              <h1 className="hero-title glow-text">DAKSH MEHTA</h1>
              <div className="hero-subtitle">
                Filmmaker <span className="editorial-italic">&amp;</span> AI Creator
              </div>
            </div>

            {/* Overlay 2: Secondary introduction */}
            <div className="hero-text-block overlay-2">
              <h2 className="hero-title editorial-italic" style={{ fontSize: 'clamp(2rem, 5.5vw, 4rem)', textTransform: 'none' }}>
                "Where creativity, storytelling, and technology meet."
              </h2>
            </div>

            {/* Overlay 3: Brand statement */}
            <div className="hero-text-block overlay-3">
              <h2 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
                CRAFTING STORIES<br/>THAT PEOPLE REMEMBER.
              </h2>
            </div>
            
            <div className="hero-glow-warm"></div>
            
            <div className="scroll-indicator">
              <div className="scroll-indicator-text">Scroll to explore</div>
              <div className="scroll-indicator-line"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          intro section (the pivot)
          ========================================== */}
      <section className="intro-section" id="intro">
        <div className="intro-content">
          <h2 className="intro-quote">
            I DON'T JUST CREATE CONTENT.
            <span className="editorial-italic">I create experiences.</span>
          </h2>
          <p className="intro-bio">
            Bridging cinematic visual arts, B.Tech computer science insights, and cutting-edge artificial intelligence platforms to tell compelling, premium brand stories.
          </p>
        </div>
      </section>

      {/* ==========================================
          featured work section (case study style)
          ========================================== */}
      <section className="section" id="work">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Selected Advertising Works</span>
            <h2 className="section-title">FEATURED PROJECT CASES</h2>
          </div>
          
          <div className="featured-grid">
            {projects.slice(0, 4).map((project) => (
              <div 
                className="featured-card" 
                key={project.id}
                onClick={() => setActiveProject(project)}
                onMouseEnter={handleVideoHoverStart}
                onMouseLeave={handleVideoHoverEnd}
                id={`featured-card-${project.id}`}
              >
                <div className="featured-img-container">
                  <img src={project.cover} alt={project.title} className="featured-img" />
                  <video 
                    src={project.videoUrl} 
                    className="featured-video-preview" 
                    muted 
                    loop 
                    playsInline
                    preload="none"
                  />
                </div>
                <div className="featured-overlay">
                  <span className="featured-category">{project.category}</span>
                  <h3 className="featured-card-title">{project.title}</h3>
                  <div className="featured-role">{project.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          visual storytelling streaming-style grid
          ========================================== */}
      <section className="section" id="storytelling" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Cinematic Library</span>
            <h2 className="section-title">VISUAL STORYTELLING ADS</h2>
          </div>

          <div className="streaming-row">
            <div className="streaming-container">
              {projects.map((project) => (
                <div 
                  className="streaming-item" 
                  key={`stream-${project.id}`}
                  onClick={() => setActiveProject(project)}
                  onMouseEnter={handleVideoHoverStart}
                  onMouseLeave={handleVideoHoverEnd}
                  id={`stream-item-${project.id}`}
                >
                  <img src={project.cover} alt={project.title} className="streaming-thumbnail" />
                  <video 
                    src={project.videoUrl} 
                    className="streaming-video-hover" 
                    muted 
                    loop 
                    playsInline
                    preload="none"
                  />
                  <div className="streaming-meta">
                    <h4 className="streaming-title">{project.title}</h4>
                    <div className="streaming-desc">{project.role} &bull; {project.tools}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          ai advertisement campaigns
          ========================================== */}
      <section className="section ai-section" id="ai">
        <div className="ai-glow-blue"></div>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Generative Ad Campaigns</span>
            <h2 className="section-title">AI ADVERTISEMENT CREATIONS</h2>
          </div>

          <div className="ai-grid">
            {projects.filter(p => p.category.includes('AI-Generated')).map((aiProj) => (
              <div className="ai-card" key={aiProj.id} id={`ai-card-${aiProj.id}`}>
                <div 
                  className="ai-video-wrapper" 
                  onClick={() => setActiveProject(aiProj)}
                >
                  <video 
                    src={aiProj.videoUrl} 
                    className="ai-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                </div>
                <div className="ai-card-info">
                  <h3 className="ai-concept-title">{aiProj.title}</h3>
                  <div className="ai-workflow">
                    <span className="ai-label">Prompt Engineering</span>
                    <div className="ai-prompt">"{aiProj.prompt}"</div>
                  </div>
                  <div className="ai-meta-pills">
                    {aiProj.tools.split(', ').map((tool) => (
                      <span className="ai-pill" key={tool}>{tool}</span>
                    ))}
                    <span className="ai-pill" style={{ borderColor: 'var(--accent-blue)', color: '#fff' }}>Gen AI</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          presentations showcase (ppt slide decks)
          ========================================== */}
      <section className="section presentation-showcase" id="presentations">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Creative Decks</span>
            <h2 className="section-title">PITCH DECKS &amp; PRESENTATIONS</h2>
          </div>

          {presentations.map((deck) => (
            <div className="presentation-card" key={deck.id} id={`presentation-card-${deck.id}`}>
              <div className="presentation-media">
                <video 
                  src={deck.videoUrl} 
                  className="presentation-video" 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                />
              </div>
              <div className="presentation-info">
                <h3 className="presentation-title">{deck.title}</h3>
                <p className="presentation-desc">{deck.description}</p>
                <div className="ai-meta-pills">
                  {deck.tools.split(', ').map(t => <span className="ai-pill" key={t}>{t}</span>)}
                </div>
                
                <div className="presentation-actions">
                  <button 
                    className="btn-luxury"
                    onClick={() => setActivePdfUrl(deck.pdfUrl)}
                  >
                    <FileText size={18} /> View PDF Deck
                  </button>
                  <a 
                    href={deck.pdfUrl} 
                    download
                    className="btn-luxury-outline"
                  >
                    <Download size={18} /> Download
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          poster gallery (masonry grid)
          ========================================== */}
      <section className="section" id="posters" style={{ backgroundColor: '#080808' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Graphic Design Campaigns</span>
            <h2 className="section-title">POSTER &amp; AD MASONRY</h2>
          </div>

          <div className="poster-masonry">
            {posters.map((poster) => (
              <div 
                className="poster-item" 
                key={poster.id}
                onClick={() => setActiveLightboxImage(poster)}
                id={`poster-${poster.id}`}
              >
                <img src={poster.imgUrl} alt={poster.title} className="poster-img" />
                <div className="poster-info-overlay">
                  <h4 className="poster-title">{poster.title}</h4>
                  <div className="poster-tag">{poster.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          about me section (editorial profile)
          ========================================== */}
      <section className="section" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-portrait-container">
              {/* Uses frame 150 from uploaded cinematic assets as a portrait */}
              <img src="/assets/hero-frames/ezgif-frame-150.jpg" alt="Daksh Mehta" className="about-portrait" />
              <div className="about-portrait-overlay"></div>
              <div className="about-portrait-text">
                <h3 className="about-name glow-text">Daksh Mehta</h3>
                <div className="about-tagline">Visual Storyteller &amp; AI Creator</div>
              </div>
            </div>

            <div className="about-stats">
              <h2 className="section-title">THE PROFILE</h2>
              <div className="about-quote">
                "We operate at the intersection of cinematic tradition and future computer technologies to forge unique visual narratives."
              </div>

              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Height</span>
                  <span className="stat-value">6'4"</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Education</span>
                  <span className="stat-value">B.Tech Computer Science Student</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Focus Area</span>
                  <span className="stat-value">Filmmaking, AI Content &amp; Design</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Location</span>
                  <span className="stat-value">Available Globally</span>
                </div>
              </div>

              <a href="#contact" className="btn-luxury" style={{ alignSelf: 'flex-start' }}>
                Start a Campaign <ArrowRight size={18} />
              </a>
            </div>
          </div>

          {/* ==========================================
              experience animated timeline
              ========================================== */}
          <div className="timeline-container">
            <div className="timeline-line"></div>
            
            <div className="timeline-item">
              <div className="timeline-node"></div>
              <div className="timeline-card-wrapper">
                <div className="timeline-card">
                  <span className="timeline-year">2023</span>
                  <h4 className="timeline-title">Learning &amp; Visual Design</h4>
                  <p className="timeline-desc">
                    Started the journey in composition layouts, visual structures, typography weight styling, and branding posters.
                  </p>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-node"></div>
              <div className="timeline-card-wrapper">
                <div className="timeline-card">
                  <span className="timeline-year">2024</span>
                  <h4 className="timeline-title">Cinematography &amp; Film</h4>
                  <p className="timeline-desc">
                    Explored real-world camera systems, focusing on lighting setups, DaVinci Resolve color grading, and direction workflows.
                  </p>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-node"></div>
              <div className="timeline-card-wrapper">
                <div className="timeline-card">
                  <span className="timeline-year">2024</span>
                  <h4 className="timeline-title">Generative AI Exploration</h4>
                  <p className="timeline-desc">
                    Integrated text-to-image and text-to-video generative platforms into the pipeline, mastering prompt engineering guidelines.
                  </p>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-node"></div>
              <div className="timeline-card-wrapper">
                <div className="timeline-card">
                  <span className="timeline-year">2025</span>
                  <h4 className="timeline-title">Commercial Advertising</h4>
                  <p className="timeline-desc">
                    Executed full visual advertisements and graphic marketing assets, managing campaigns from conception to final rendering.
                  </p>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-node"></div>
              <div className="timeline-card-wrapper">
                <div className="timeline-card">
                  <span className="timeline-year">2025</span>
                  <h4 className="timeline-title">Web Interfaces Development</h4>
                  <p className="timeline-desc">
                    Connected front-end code with premium interactive motion libraries to design fluid showcase portfolios.
                  </p>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-node"></div>
              <div className="timeline-card-wrapper">
                <div className="timeline-card">
                  <span className="timeline-year">2026 &amp; Beyond</span>
                  <h4 className="timeline-title">Future Agencies &amp; Directing</h4>
                  <p className="timeline-desc">
                    Aiming to direct feature narratives and build a hybrid creative agency bridging real lens cameras and neural network pipelines.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          contact section
          ========================================== */}
      <section className="section contact-section" id="contact">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-cta-wrapper">
              <span className="section-label">Get in Touch</span>
              <h2 className="contact-cta">
                LET'S CREATE<br />
                <span className="editorial-italic">something</span><br />
                UNFORGETTABLE.
              </h2>
              <a href="mailto:dakshpool1@gmail.com" className="contact-email-link">
                dakshpool1@gmail.com
              </a>
              <div className="social-links">
                <a href="https://instagram.com" className="social-link" target="_blank" rel="noreferrer">Instagram</a>
                <a href="https://www.linkedin.com/in/daksh-mehta-35487a302?utm_source=share_via&utm_content=profile&utm_medium=member_android" className="social-link" target="_blank" rel="noreferrer">LinkedIn</a>
                <a href="https://github.com/dakshmehta05" className="social-link" target="_blank" rel="noreferrer">GitHub</a>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleFormSubmit} id="contact-form">
              {formSubmitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <Sparkles size={40} style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }} />
                  <h3 style={{ marginBottom: '0.5rem' }}>Message Transmitted</h3>
                  <p style={{ fontSize: '0.9rem' }}>We will contact you shortly to begin the collaboration.</p>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label className="stat-label">Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Your name" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="stat-label">Email</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="Your email address" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="stat-label">Project Details</label>
                    <textarea 
                      className="form-input" 
                      rows="4" 
                      placeholder="Tell me about your brand goals..." 
                      style={{ resize: 'none' }}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-luxury" style={{ marginTop: '1rem' }}>
                    Send Brief <ArrowRight size={18} />
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* ==========================================
          footer
          ========================================== */}
      <footer className="footer">
        <div className="footer-content">
          <div>&copy; {new Date().getFullYear()} Daksh Mehta. All Rights Reserved.</div>
          <div style={{ letterSpacing: '0.25em' }}>CREATIVITY &bull; TECHNOLOGY &bull; LENS</div>
        </div>
      </footer>

      {/* ==========================================
          CASE STUDY OVERLAY MODAL
          ========================================== */}
      {activeProject && (
        <div className="modal-backdrop active" onClick={() => setActiveProject(null)}>
          <div 
            className="modal-container" 
            onClick={(e) => e.stopPropagation()}
            id={`modal-${activeProject.id}`}
          >
            <button className="modal-close-btn" onClick={() => setActiveProject(null)}>
              <X size={20} />
            </button>
            <div className="modal-content">
              
              <div className="case-study-hero">
                <video 
                  src={activeProject.videoUrl} 
                  className="case-study-media"
                  controls
                  autoPlay
                  playsInline
                />
              </div>

              <h2 className="section-title" style={{ marginBottom: '1.5rem', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                {activeProject.title}
              </h2>
              
              <div className="case-study-meta-grid">
                <div className="meta-item">
                  <span className="meta-label">Project Type</span>
                  <span className="meta-value">{activeProject.category}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Role</span>
                  <span className="meta-value">{activeProject.role}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Tools Used</span>
                  <span className="meta-value">{activeProject.tools}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Outputs</span>
                  <span className="meta-value">{activeProject.output}</span>
                </div>
              </div>

              <div className="case-study-body">
                <div className="case-study-process">
                  <h3 className="case-study-process-title">Creative Journey</h3>
                  <p>{activeProject.process}</p>
                </div>
                
                {activeProject.prompt && (
                  <div className="ai-workflow" style={{ alignSelf: 'start' }}>
                    <span className="ai-label">Concept Prompt</span>
                    <p className="ai-prompt">"{activeProject.prompt}"</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          POSTER LIGHTBOX MODAL
          ========================================== */}
      {activeLightboxImage && (
        <div className="modal-backdrop active" onClick={() => setActiveLightboxImage(null)}>
          <button className="modal-close-btn" onClick={() => setActiveLightboxImage(null)}>
            <X size={20} />
          </button>
          <div className="lightbox-img-wrapper" onClick={(e) => e.stopPropagation()}>
            <img 
              src={activeLightboxImage.imgUrl} 
              alt={activeLightboxImage.title} 
              className="lightbox-img" 
            />
          </div>
        </div>
      )}

      {/* ==========================================
          PDF PRESENTATION VIEW MODAL
          ========================================== */}
      {activePdfUrl && (
        <div className="modal-backdrop active" onClick={() => setActivePdfUrl(null)}>
          <div 
            className="modal-container" 
            onClick={(e) => e.stopPropagation()} 
            style={{ width: '95%', height: '95vh', maxWidth: '1400px' }}
          >
            <button className="modal-close-btn" onClick={() => setActivePdfUrl(null)}>
              <X size={20} />
            </button>
            <iframe 
              src={activePdfUrl} 
              style={{ width: '100%', height: '100%', border: 'none', borderRadius: '16px' }}
              title="Presentation Slide Previewer"
            />
          </div>
        </div>
      )}
    </>
  )
}
