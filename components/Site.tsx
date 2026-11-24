
'use client';
import Projects3D from "./Projects3D";
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Menu,
  X,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const OrbScene = dynamic(() => import('./OrbScene'), {
  ssr: false,
  loading: () => <div className="orb-loading" />
});

const projects = [
  {
    n: '01',
    title: 'Automate-AI',
    type: 'AI AGENT AUTOMATION PLATFORM',
    desc: 'A full-stack platform for building custom AI agents and multi-step workflows. Includes 5+ custom agents, visual LangGraph workflows, MCP integrations with 5+ external tools, 15+ REST APIs, JWT authentication, and Razorpay subscription tiers.',
    stack: 'LangChain · LangGraph · MCP · MERN · Redux Toolkit · Shadcn UI · Razorpay',
    href: 'https://automate-ai-frontend-2yam.onrender.com/',
    mark: 'AUTOMATE / AI'
  },
  {
    n: '02',
    title: 'InterviewIQ',
    type: 'AI INTERVIEW PREPARATION PLATFORM',
    desc: 'An interview-preparation SaaS that uses an uploaded resume to generate 15+ tailored technical and HR questions, then provides structured feedback on relevance, clarity, depth, and communication. Includes Firebase Google sign-in, saved interview history, and Razorpay credit packs.',
    stack: 'React · Node.js · MongoDB · Firebase Auth · Razorpay · Framer Motion',
    href: 'https://three-interviewiq-j80k.onrender.com/',
    mark: 'INTERVIEW / IQ'
  },
  {
    n: '03',
    title: 'SiteForge AI',
    type: 'AI WEBSITE BUILDER',
    desc: 'An AI website builder that turns natural-language prompts into responsive website layouts. Features live preview, drag-and-edit customization across 5+ layouts, user authentication, MongoDB-backed projects, and 12+ REST API endpoints.',
    stack: 'React · Node.js · Express · MongoDB · LLM APIs · REST APIs',
    href: 'https://site-forge-ai-iq6o-three.vercel.app/',
    mark: 'SITE / FORGE'
  }
];

const iconColors: Record<string, string> = {
  c: 'A8B9CC',
  python: '3776AB',
  javascript: 'F7DF1E',
  nextdotjs: 'FFFFFF',
  react: '61DAFB',
  redux: '764ABC',
  shadcnui: 'FFFFFF',
  framer: '0055FF',
  bootstrap: '7952B3',
  tailwindcss: '06B6D4',
  nodedotjs: '5FA04E',
  express: 'FFFFFF',
  mongodb: '47A248',
  mysql: '4479A1',
  fastapi: '009688',
  jsonwebtokens: 'D63AFF',
  firebase: 'FFCA28',
  razorpay: '528FF0',
  chainlink: '375BD2',
  graphql: 'E10098',
  modelcontextprotocol: '8B9CF6',
  openai: 'FFFFFF',
  probot: 'F0F0F0',
  amazonaws: 'FF9900',
  vercel: 'FFFFFF',
  render: '46E3B7',
  docker: '2496ED',
  kubernetes: '326CE5',
  git: 'F05032',
  github: 'FFFFFF',
  postman: 'FF6C37',
  visualstudio: '5C2D91',
  eclipse: '2C2255'
};

const skillGroups = [
  {
    title: 'LANGUAGES',
    subtitle: 'CORE PROGRAMMING',
    items: [
      ['C', 'c'],
      ['Python', 'python'],
      ['JavaScript', 'javascript']
    ]
  },
  {
    title: 'FRONTEND & FRAMEWORKS',
    subtitle: 'INTERFACES / EXPERIENCE',
    items: [
      ['Next.js', 'nextdotjs'],
      ['React.js', 'react'],
      ['Redux Toolkit', 'redux'],
      ['Shadcn UI', 'shadcnui'],
      ['Framer Motion', 'framer'],
      ['Bootstrap', 'bootstrap'],
      ['Tailwind CSS', 'tailwindcss']
    ]
  },
  {
    title: 'BACKEND & DATA',
    subtitle: 'SYSTEMS / PERSISTENCE',
    items: [
      ['Node.js', 'nodedotjs'],
      ['Express.js', 'express'],
      ['MongoDB', 'mongodb'],
      ['MySQL', 'mysql'],
      ['REST APIs', 'fastapi'],
      ['JWT', 'jsonwebtokens'],
      ['Firebase Auth', 'firebase'],
      ['Razorpay', 'razorpay']
    ]
  },
  {
    title: 'AI & CLOUD',
    subtitle: 'INTELLIGENCE / INFRASTRUCTURE',
    items: [
      ['LangChain', 'chainlink'],
      ['LangGraph', 'graphql'],
      ['MCP', 'modelcontextprotocol'],
      ['LLM APIs', 'openai'],
      ['AI Agents', 'probot'],
      ['AWS EC2 / S3', 'amazonaws'],
      ['Vercel', 'vercel'],
      ['Render', 'render'],
      ['Docker', 'docker'],
      ['Kubernetes', 'kubernetes'],
      ['Git', 'git'],
      ['GitHub', 'github'],
      ['Postman', 'postman'],
      ['Visual Studio', 'visualstudio'],
      ['Eclipse', 'eclipse']
    ]
  }
];

export default function Site() {
  const root = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    const updateProgress = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;

      document.documentElement.style.setProperty(
        '--scroll-progress',
        `${max > 0 ? (window.scrollY / max) * 100 : 0}%`
      );
    };

    const updatePointer = (event: PointerEvent) => {
      document.documentElement.style.setProperty(
        '--pointer-x',
        `${event.clientX}px`
      );

      document.documentElement.style.setProperty(
        '--pointer-y',
        `${event.clientY}px`
      );
    };

    updateProgress();

    window.addEventListener('scroll', updateProgress, {
      passive: true
    });

    window.addEventListener('pointermove', updatePointer, {
      passive: true
    });

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from('.hero-copy > *', {
        y: 34,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.2
      });

      gsap.utils
        .toArray<HTMLElement>('.reveal')
        .forEach((el) => {
          gsap.from(el, {
            y: 45,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 86%'
            }
          });
        });

      gsap.to('.hero-orb-wrap', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }, root);

    return () => {
      ctx.revert();

      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('pointermove', updatePointer);
    };
  }, []);

  const navigate = (id: string) => {
    setMenuOpen(false);

    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(
      `Portfolio enquiry from ${form.name}`
    );

    const body = encodeURIComponent(
      `${form.message}\n\nFrom: ${form.name}\nEmail: ${form.email}`
    );

    window.location.href =
      `mailto:karthik02032006@gmail.com?subject=${subject}&body=${body}`;

    setSent(true);
  };

  return (
    <main ref={root}>
      <div className="scroll-progress" aria-hidden="true">
        <span />
      </div>

      <div className="ambient-cursor" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="#home">
          PK<span>•</span>
        </a>

        <div className="top-meta">
          AVAILABLE FOR OPPORTUNITIES
          <br />
          <a href="mailto:karthik02032006@gmail.com">
            Full-time / Internship
          </a>
        </div>

        <div className="top-meta stack-meta">
          TECH STACK:
          <br />
          MERN · NEXT.JS · PYTHON
          <br />
          AI/ML · AWS · MCP
        </div>

        <nav className={menuOpen ? 'nav open' : 'nav'}>
          {[
            ['home', 'Home', '01'],
            ['about', 'About', '02'],
            ['projects', 'Projects', '03'],
            ['skills', 'Skills', '04'],
            ['contact', 'Contact', '05']
          ].map(([id, label, num]) => (
            <button key={id} onClick={() => navigate(id)}>
              {label}
              <span>/ {num}</span>
            </button>
          ))}
        </nav>

        <button
          className="menu-toggle"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* HERO SECTION */}
      <section className="hero" id="home">
        <div className="hero-copy">

          <p className="eyebrow">
            <Sparkles size={12} />
            PORTFOLIO — 2026 / INDIA
          </p>

          {/* YOUR NAME */}
          <p className="hero-name">
            P KARTHIKEYA
          </p>

          <h1>
            <i>AI &</i>
            <br />
            FULL-STACK
            <br />
            <strong>DEVELOPER.</strong>
          </h1>

          <p className="hero-sub">
            Building intelligent, scalable and
            <br className="desktop-break" />
            user-centric digital experiences.
          </p>

          <button
            className="circle-link"
            onClick={() => navigate('about')}
            aria-label="Scroll to about"
          >
            <ArrowDown size={19} />
          </button>
        </div>

        <div className="hero-orb-wrap">
          <OrbScene />
          <div className="orb-caption">
            INTERACTIVE OBJECT / 001
          </div>
        </div>

        <div className="hero-side">
          I build AI-powered products, agentic workflows
          <br />
          and full-stack applications — from thoughtful
          <br />
          interfaces to production-minded backends.
          <br />

          <button onClick={() => navigate('projects')}>
            EXPLORE SELECTED WORK
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="hero-bottom">
          <span>
            SCROLL TO EXPLORE <ArrowDown size={13} />
          </span>

          <span>
            HYDERABAD, INDIA
            <br />
            17°N / 78°E
          </span>
        </div>

        <div className="hero-index">01 — 05</div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about section-line" id="about">
        <div className="section-heading reveal">
          <span className="section-num">/ 01 — ABOUT</span>

          <h2>
            Curious by nature.
            <br />
            <i>Builder by instinct.</i>
          </h2>
        </div>

        <div className="about-copy reveal">
          <p>
            I’m <b>P Karthikeya</b>, a final-year B.Tech Computer
            Science student at CVR College of Engineering
            (CGPA 8.29). I build and ship production-grade AI
            products, including three MERN-stack SaaS applications
            with REST APIs, authentication and payment integrations.
          </p>

          <p>
            My work spans agentic AI workflows built with LangChain,
            LangGraph and MCP, API design, Firebase/JWT authentication,
            Razorpay payments and cloud deployment. I have solved
            450+ Data Structures and Algorithms problems across
            LeetCode, HackerRank and CodeChef.
          </p>

          <a
            className="text-link"
            href="/Karthikeya_P_Resume.pdf"
            target="_blank"
          >
            VIEW RESUME <ArrowUpRight size={14} />
          </a>
        </div>

        <div className="about-facts reveal">
          <div>
            <span>EDUCATION</span>
            <b>B.Tech · Computer Science</b>
            <small>CVR College of Engineering</small>
          </div>

          <div>
            <span>CGPA</span>
            <b>8.29 / 10</b>
          </div>

          <div>
            <span>BASED IN</span>
            <b>Hyderabad, India</b>
          </div>

          <div>
            <span>GRADUATION</span>
            <b>2027</b>
          </div>
        </div>

        <div className="about-orbit" aria-hidden="true">
          <div className="ring ring-one" />
          <div className="ring ring-two" />
          <div className="orbit-core">
            PK<span>✳</span>
          </div>
        </div>
      </section>

   
<section className="skills skills-arsenal section-line" id="skills">

  {/* HEADER */}
  <div className="arsenal-heading reveal">
    <span className="section-num">/ 02 — TOOLKIT</span>

    <h2>
      My Technical <i>Arsenal.</i>
    </h2>

    <p>
      TECHNOLOGIES I USE TO BUILD, DEPLOY AND SCALE REAL-WORLD PRODUCTS.
    </p>

    <div className="arsenal-heading-line" />
  </div>

  {/* SKILL PANELS AND CENTRAL ORB */}
  <div className="arsenal-layout reveal">

    {skillGroups.map((group, gi) => (
      <div className={`arsenal-panel arsenal-panel-${gi + 1}`} key={group.title}>

        <div className="arsenal-panel-heading">

          <span className="arsenal-category-icon">
            {['</>', '▱', '▤', '☁'][gi]}
          </span>

          <div className="arsenal-category-title">
            <h3>
              {gi === 0 ? 'Languages' :
               gi === 1 ? 'Frontend & Frameworks' :
               gi === 2 ? 'Backend & Data' :
               'AI & Cloud'}
            </h3>

            <small>{group.subtitle}</small>
          </div>

          <span className="arsenal-count">
            {String(group.items.length).padStart(2, '0')}
          </span>

        </div>

        <div className="arsenal-tech-grid">

          {group.items.map(([name, slug], i) => (
            <div
              className="arsenal-tech"
              key={name}
              style={{
                '--brand': `#${iconColors[slug] || '9cecff'}`
              } as React.CSSProperties}
              title={name}
            >

              <span className="arsenal-tech-icon">
                <img
                  src={`https://cdn.simpleicons.org/${slug}/${iconColors[slug] || 'E8EEF5'}`}
                  alt={`${name} logo`}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </span>

              <span className="arsenal-tech-name">
                {name}
              </span>

            </div>
          ))}

        </div>
      </div>
    ))}

    {/* CENTRAL CRYSTAL */}
    <div className="arsenal-core" aria-hidden="true">

      <div className="core-glow" />

      <div className="core-ring core-ring-one" />
      <div className="core-ring core-ring-two" />
      <div className="core-ring core-ring-three" />

      <div className="core-orbit-dot dot-one" />
      <div className="core-orbit-dot dot-two" />
      <div className="core-orbit-dot dot-three" />

      <div className="crystal">
        <div className="crystal-face crystal-face-one" />
        <div className="crystal-face crystal-face-two" />
        <div className="crystal-face crystal-face-three" />
        <div className="crystal-face crystal-face-four" />
        <div className="crystal-shine" />
      </div>

      <span className="core-label">
        TECH / CORE
      </span>

    </div>

  </div>

  {/* BOTTOM HIGHLIGHTS */}
  <div className="arsenal-highlights reveal">

    <div className="arsenal-highlight">
      <span className="highlight-symbol">⌘</span>
      <div>
        <b>33 Technologies</b>
        <small>ACROSS THE STACK</small>
      </div>
    </div>

    <span className="highlight-divider" />

    <div className="arsenal-highlight">
      <span className="highlight-symbol">ϟ</span>
      <div>
        <b>Production Ready</b>
        <small>REAL-WORLD PROJECTS</small>
      </div>
    </div>

    <span className="highlight-divider" />

    <div className="arsenal-highlight">
      <span className="highlight-symbol">↗</span>
      <div>
        <b>Continuously Learning</b>
        <small>EXPLORING NEW TOOLS</small>
      </div>
    </div>

  </div>

</section>

 
<Projects3D projects={projects} />

      {/* NUMBERS SECTION */}
      <section className="numbers section-line">
        <span className="section-num reveal">/ 04 — IN NUMBERS</span>

        <div className="number-grid reveal">
          <div>
            <b>450<span>+</span></b>
            <small>DSA PROBLEMS SOLVED</small>
          </div>

          <div>
            <b>8.29</b>
            <small>CGPA / 10</small>
          </div>

          <div>
            <b>15<span>+</span></b>
            <small>REST API ENDPOINTS · AUTOMATE-AI</small>
          </div>

          <div>
            <b>05<span>+</span></b>
            <small>AI AGENTS BUILT</small>
          </div>
        </div>

        <div className="cert-line reveal">
          <span>RECOGNITION & LEARNING</span>

          <p>
            AWS Academy Graduate — Cloud Foundations (2026) · Applied
            Database Systems using Oracle AI Database — Oracle Academy
            (2026) · Data Science & Analytics — HP LIFE, HP Foundation
            (2025)
          </p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="contact section-line" id="contact">
        <div className="contact-title reveal">
          <span className="section-num">/ 05 — CONTACT</span>

          <h2>
            Have an idea?
            <br />
            <i>Let’s build it.</i>
          </h2>

          <p>
            Open to internships, full-time opportunities and interesting
            collaborations.
          </p>
        </div>

        <div className="contact-details reveal">
          <a href="mailto:karthik02032006@gmail.com">
            <Mail size={16} />
            KARTHIK02032006@GMAIL.COM
            <ArrowUpRight size={13} />
          </a>

          <a
            href="https://github.com/karthikp236"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={16} />
            GITHUB
            <ArrowUpRight size={13} />
          </a>

          <a
            href="https://linkedin.com/in/karthikeya-p-288a10337"
            target="_blank"
            rel="noreferrer"
          >
            <Linkedin size={16} />
            LINKEDIN
            <ArrowUpRight size={13} />
          </a>

          <span>HYDERABAD, INDIA</span>
        </div>

        <form className="contact-form reveal" onSubmit={submit}>
          <label>
            YOUR NAME
            <input
              required
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="Name"
            />
          </label>

          <label>
            EMAIL ADDRESS
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              placeholder="you@example.com"
            />
          </label>

          <label>
            MESSAGE
            <textarea
              required
              rows={3}
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              placeholder="Tell me what you're thinking..."
            />
          </label>

          <button type="submit">
            {sent ? 'OPENING EMAIL CLIENT' : 'SEND AN ENQUIRY'}
            <ArrowUpRight size={15} />
          </button>

          <small>
            SUBMIT OPENS YOUR EMAIL APP WITH THE MESSAGE PRE-FILLED.
          </small>
        </form>

        <footer>
          <a className="brand" href="#home">
            PK<span>•</span>
          </a>

          <span>DESIGNED & BUILT WITH CURIOSITY · 2026</span>

          <button onClick={() => navigate('home')}>
            BACK TO TOP ↑
          </button>
        </footer>
      </section>
    </main>
  );
}
