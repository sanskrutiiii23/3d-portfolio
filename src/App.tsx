import { Suspense, lazy, useDeferredValue, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { KineticTypographyLoader } from "@/components/ui/loading-animation";
import UniqueLoading from "@/components/ui/morph-loading";
import { motion, useInView, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import Lenis from "lenis";
import { BackgroundProvider, useBackground } from "@/lib/backgrounds";
import { BgSwitcher } from "@/components/ui/bg-switcher";
const NeuralBackground = lazy(() => import("@/components/ui/neural-background").then(m => ({ default: m.NeuralBackground })));
const AuroraBg = lazy(() => import("@/components/ui/aurora-bg").then(m => ({ default: m.AuroraBg })));
const ParticleSwarm = lazy(() => import("@/components/ui/particle-swarm").then(m => ({ default: m.ParticleSwarm })));
const WaveGrid = lazy(() => import("@/components/ui/wave-grid").then(m => ({ default: m.WaveGrid })));
const GradientFlow = lazy(() => import("@/components/ui/gradient-flow").then(m => ({ default: m.GradientFlow })));
import SimpleMarquee from "@/components/ui/simple-marquee";
import CenterUnderline from "@/components/ui/underline-center";
import ComesInGoesOutUnderline from "@/components/ui/underline-comes-in-goes-out";
import GoesOutComesInUnderline from "@/components/ui/underline-goes-out-comes-in";
import { featuredProjects, type Project } from "@/data/projects";

const HeroScene = lazy(() => import("./components/hero-scene"));
const resumePdf = import.meta.env.VITE_RESUME_URL?.trim() || new URL("../Sanskruti_Borade_Resume.pdf", import.meta.url).href;
const resumeFileName = "Sanskruti_Borade_Resume.pdf";
const profileImage = new URL("../my_pic.jpeg", import.meta.url).href;
const profileImageWebp = new URL("../my_pic.jpeg", import.meta.url).href;
const githubUsername = "sanskrutiiii23";
const heroLines = [
  "Frontend engineering",
  "with 3D orbital vision",
  "and creative design depth.",
];

const toolboxData = [
  {
    id: "web-dev",
    number: "01",
    category: "Web Dev",
    proficiency: 92,
    status: "Core Expertise",
    description: "My core focus. I build fast, interactive single-page applications, design responsive layouts, and connect them with REST APIs.",
    skills: ["React", "JavaScript (ES6+)", "Tailwind CSS", "Node.js", "Express", "HTML5 & CSS3", "REST APIs", "Vite", "Git & GitHub"],
  },
  {
    id: "data-analytics",
    number: "02",
    category: "Data & Analytics",
    proficiency: 86,
    status: "Proficient",
    description: "Working with datasets, finding key patterns, and creating clear Power BI and Excel dashboards that make numbers easy to digest.",
    skills: ["Power BI", "Microsoft Excel", "Data Analysis", "Market Research", "Business Insights", "Data Modeling"],
  },
  {
    id: "ui-ux",
    number: "03",
    category: "UI/UX",
    proficiency: 90,
    status: "Advanced",
    description: "Before jumping into code, I map out user journeys, wireframes, and design components in Figma so the finished product feels natural.",
    skills: ["Figma", "Canva", "Wireframing", "Interactive Prototyping", "Design Systems", "Mobile Responsive UI"],
  },
];

const capabilityGroups = [
  "React.js",
  "CesiumJS",
  "JavaScript (ES6+)",
  "TypeScript",
  "Tailwind CSS",
  "Three.js",
  "Python",
  "Node.js",
  "Express.js",
  "REST APIs",
  "Figma",
  "Power BI",
  "Microsoft Excel",
  "Git & GitHub",
  "Vite",
  "C / C++",
  "NumPy & pandas",
  "scikit-learn",
  "Postman",
];

const contactLinks = [
  { label: "GitHub", value: "github.com/sanskrutiiii23", href: "https://github.com/sanskrutiiii23" },
  { label: "LinkedIn", value: "Sanskruti Borade", href: "https://www.linkedin.com/in/sanskruti-borade-39291536b/" },
  { label: "Email", value: "sanskrutiborade07@gmail.com", href: "mailto:sanskrutiborade07@gmail.com" },
  { label: "Phone", value: "+91 8928141813", href: "tel:+918928141813" },
  { label: "Resume", value: "Download PDF", href: resumePdf },
];

type GithubActivity = {
  repo: string;
  message: string;
  pushedAt: string;
  commitUrl: string;
  repoUrl: string;
};

type GeneratedLiveData = {
  generatedAt: string;
  github: {
    latestPush: GithubActivity | null;
    latestCommit: GithubActivity | null;
    profileUrl: string;
  };
  projects?: Project[];
  spotify: {
    widgetUrl: string;
    profileUrl: string;
  };
};

type SpotifyTrack = {
  title: string;
  artist: string;
  albumArt: string;
  playedAt: string;
  url: string;
};

type PaletteItem = {
  id: string;
  group: "Pages" | "Projects" | "Actions" | "Links";
  title: string;
  description: string;
  keywords: string[];
  action: () => void;
};

function formatRelativeTime(value: string) {
  const time = new Date(value).getTime();
  const diffMs = Date.now() - time;

  if (!Number.isFinite(time) || diffMs < 0) {
    return "just now";
  }

  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function repoSlug(href: string) {
  return href.split("/").filter(Boolean).pop()?.toLowerCase() ?? href.toLowerCase();
}

function mergeProjects(curated: Project[], generated?: Project[]): Project[] {
  if (!generated || generated.length === 0) {
    return curated;
  }

  const curatedSlugs = new Set(curated.map((project) => repoSlug(project.href)));
  const additions = generated.filter((project) => !curatedSlugs.has(repoSlug(project.href)));

  return [...curated, ...additions];
}

function AppBackground() {
  const { currentBg } = useBackground();
  switch (currentBg) {
    case "neural":
      return <NeuralBackground className="neural-bg" />;
    case "aurora":
      return <AuroraBg className="neural-bg" />;
    case "particle-swarm":
      return <ParticleSwarm className="neural-bg" />;
    case "wave-grid":
      return <WaveGrid className="neural-bg" />;
    case "gradient-flow":
      return <GradientFlow className="neural-bg" />;
  }
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile;
}

function LazyHeroScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "600px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ width: "100%", height: "100%" }}>
      <Suspense fallback={<div className="hero-canvas__fallback" />}>
        <HeroScene paused={!visible} />
      </Suspense>
    </div>
  );
}


function TiltCard({
  item,
  index,
}: {
  item: (typeof toolboxData)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 0, y: 0 });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 280, damping: 24 });
  const mouseYSpring = useSpring(y, { stiffness: 280, damping: 24 });

  // 3D inward tilt towards cursor
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["14deg", "-14deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-14deg", "14deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;

    x.set(xPct);
    y.set(yPct);
    setGlarePos({ x: mouseX, y: mouseY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1200,
        height: "100%",
      }}
    >
      <motion.article
        className="live-card"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          position: "relative",
          minHeight: "29rem",
          height: "100%",
          padding: "var(--spacing-xxl) var(--spacing-standard)",
          borderRadius: "var(--radius-lg)",
          background: isHovered ? "rgba(255, 255, 255, 0.03)" : "transparent",
          border: isHovered ? "1px solid rgba(0, 212, 255, 0.5)" : "1px solid var(--border-glass)",
          boxShadow: isHovered
            ? "0 28px 65px -15px rgba(0, 212, 255, 0.3), var(--inset-glow-hover)"
            : "var(--inset-glow)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          cursor: "pointer",
          overflow: "hidden",
        }}
        animate={{
          scale: isHovered ? 1.04 : 1,
          y: isHovered ? -12 : 0,
        }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
      >
        {/* Dynamic 3D Glare sheen following cursor */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            pointerEvents: "none",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.2s ease",
            background: `radial-gradient(420px circle at ${glarePos.x}px ${glarePos.y}px, rgba(255, 255, 255, 0.14), transparent 70%)`,
            zIndex: 1,
          }}
        />

        {/* Floating 3D Content Layer */}
        <div
          style={{
            transform: isHovered ? "translateZ(38px)" : "translateZ(0px)",
            transition: "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)",
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Header row matching Live Signal card header */}
          <div className="live-card__head" style={{ marginBottom: 0 }}>
            <span style={{ fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, color: "var(--text-secondary)" }}>
              [{item.number}] {item.category}
            </span>
            <span
              style={{
                fontSize: "12px",
                fontFamily: "monospace",
                padding: "3px 10px",
                borderRadius: "9999px",
                background: isHovered ? "rgba(0, 212, 255, 0.15)" : "rgba(255, 255, 255, 0.04)",
                border: isHovered ? "1px solid rgba(0, 212, 255, 0.35)" : "1px solid rgba(255, 255, 255, 0.1)",
                color: isHovered ? "#00d4ff" : "var(--text-secondary)",
                transition: "all 0.2s ease",
              }}
            >
              {item.status}
            </span>
          </div>

          <div>
            <h3
              style={{
                margin: "0 0 12px",
                fontSize: "clamp(1.7rem, 2.8vw, 2.4rem)",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              {item.category}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                lineHeight: 1.7,
                color: "var(--text-secondary)",
              }}
            >
              {item.description}
            </p>
          </div>

          {/* Proficiency progress bar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Proficiency</span>
              <span style={{ fontFamily: "monospace", color: "#00d4ff", fontWeight: 600, fontSize: "12px" }}>
                {item.proficiency}% • {item.status}
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: "5px",
                borderRadius: "9999px",
                background: "rgba(255, 255, 255, 0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${item.proficiency}%`,
                  height: "100%",
                  borderRadius: "9999px",
                  background: "linear-gradient(90deg, #00d4ff 0%, #a855f7 100%)",
                  boxShadow: "0 0 12px rgba(0, 212, 255, 0.5)",
                  transition: "width 0.8s ease",
                }}
              />
            </div>
          </div>
        </div>

        {/* Skill tags at bottom */}
        <div
          style={{
            transform: isHovered ? "translateZ(26px)" : "translateZ(0px)",
            transition: "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)",
            position: "relative",
            zIndex: 2,
            paddingTop: "24px",
            marginTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {item.skills.map((skill, sIdx) => (
              <span
                key={sIdx}
                style={{
                  fontSize: "12px",
                  padding: "5px 12px",
                  borderRadius: "9999px",
                  background: isHovered ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.03)",
                  border: isHovered ? "1px solid rgba(0, 212, 255, 0.28)" : "1px solid rgba(255, 255, 255, 0.08)",
                  color: "rgba(255, 255, 255, 0.88)",
                  transition: "all 0.2s ease",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}


function App() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cursorCoreRef = useRef<HTMLDivElement | null>(null);
  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const commandInputRef = useRef<HTMLInputElement | null>(null);
  const commandResultsRef = useRef<HTMLDivElement | null>(null);
  const [latestPush, setLatestPush] = useState<GithubActivity | null>(null);
  const [latestCommit, setLatestCommit] = useState<GithubActivity | null>(null);
  const [githubError, setGithubError] = useState(false);
  const [projects, setProjects] = useState<Project[]>(featuredProjects);
  const [selectedSkillCategory, setSelectedSkillCategory] = useState("all");
  const [commandOpen, setCommandOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);
  const [commandQuery, setCommandQuery] = useState("");
  const [activeCommandIndex, setActiveCommandIndex] = useState(0);
  const deferredCommandQuery = useDeferredValue(commandQuery);
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 10500);
    return () => clearTimeout(timer);
  }, []);

  const openHref = (href: string) => {
    window.open(href, "_self", "noopener,noreferrer");
  };

  const downloadResume = () => {
    const link = document.createElement("a");
    link.href = resumePdf;
    link.download = resumeFileName;
    link.click();
  };

  const scrollToSelector = (selector: string) => {
    const target = document.querySelector<HTMLElement>(selector);
    if (!target) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        offset: -80,
      });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const paletteItems = useMemo<PaletteItem[]>(
    () => [
      {
        id: "page-story",
        group: "Pages",
        title: "Story",
        description: "Jump to hero and operating summary.",
        keywords: ["story", "hero", "intro", "about"],
        action: () => scrollToSelector("#story"),
      },
      {
        id: "page-work",
        group: "Pages",
        title: "Work",
        description: "Jump to projects and systems.",
        keywords: ["work", "projects", "code"],
        action: () => scrollToSelector("#work"),
      },
      {
        id: "page-capabilities",
        group: "Pages",
        title: "Capabilities",
        description: "Jump to stack cloud and platform strengths.",
        keywords: ["skills", "capabilities", "stack", "azure", "aks"],
        action: () => scrollToSelector("#capabilities"),
      },
      {
        id: "page-contact",
        group: "Pages",
        title: "Contact",
        description: "Jump to direct contact links and resume access.",
        keywords: ["contact", "email", "phone", "resume"],
        action: () => scrollToSelector("#contact"),
      },
      ...featuredProjects.map<PaletteItem>((project) => ({
        id: `project-${project.title}`,
        group: "Projects",
        title: project.title,
        description: project.impact,
        keywords: [project.title, project.stack, project.impact],
        action: () => openHref(project.href),
      })),
      {
        id: "action-resume",
        group: "Actions",
        title: "Download resume",
        description: "Open PDF resume download instantly.",
        keywords: ["resume", "cv", "download", "pdf"],
        action: downloadResume,
      },
      {
        id: "action-email",
        group: "Actions",
        title: "Send email",
        description: "Start direct conversation for projects and opportunities.",
        keywords: ["email", "mail", "contact", "hire"],
        action: () => openHref("mailto:sanskrutiborade07@gmail.com"),
      },
      {
        id: "action-phone",
        group: "Actions",
        title: "Call now",
        description: "Open direct phone link.",
        keywords: ["phone", "call", "mobile"],
        action: () => openHref("tel:+918928141813"),
      },
      {
        id: "link-github",
        group: "Links",
        title: "GitHub profile",
        description: "Open full GitHub profile.",
        keywords: ["github", "profile", "repos"],
        action: () => openHref(`https://github.com/${githubUsername}`),
      },
      {
        id: "link-linkedin",
        group: "Links",
        title: "LinkedIn profile",
        description: "Open LinkedIn profile.",
        keywords: ["linkedin", "network", "profile"],
        action: () => openHref("https://www.linkedin.com/in/sanskruti-borade-39291536b/"),
      },
    ],
    [],
  );

  const commandGroups = useMemo(() => {
    const normalizedQuery = deferredCommandQuery.trim().toLowerCase();
    const matchingItems = !normalizedQuery
      ? paletteItems
      : paletteItems.filter((item) => {
          const haystack = `${item.title} ${item.description} ${item.keywords.join(" ")}`.toLowerCase();
          return haystack.includes(normalizedQuery);
        });

    return ["Pages", "Projects", "Actions", "Links"]
      .map((group) => ({
        group: group as PaletteItem["group"],
        items: matchingItems.filter((item) => item.group === group),
      }))
      .filter((group) => group.items.length > 0);
  }, [deferredCommandQuery, paletteItems]);

  const flatCommandItems = useMemo(() => commandGroups.flatMap((group) => group.items), [commandGroups]);

  useEffect(() => {
    let cancelled = false;

    const loadGeneratedSnapshot = async () => {
      const response = await fetch("/generated/live-data.json", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to load generated live data");
      }

      return (await response.json()) as GeneratedLiveData;
    };

    const loadProjects = async () => {
      try {
        const snapshot = await loadGeneratedSnapshot();
        if (!cancelled) {
          setProjects(mergeProjects(featuredProjects, snapshot.projects));
        }
      } catch (err) {
        console.warn("Projects snapshot load failed, using curated list:", err);
      }
    };

    const loadGithub = async () => {
      try {
        const token = import.meta.env.VITE_GITHUB_TOKEN;
        const headers: Record<string, string> = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const repoResponse = await fetch(
          `https://api.github.com/users/${githubUsername}/repos?sort=pushed&per_page=6&type=owner`,
          { headers },
        );
        if (!repoResponse.ok) {
          throw new Error("Failed to load GitHub repos");
        }

        const repos = (await repoResponse.json()) as Array<{
          full_name: string;
          html_url: string;
          pushed_at: string;
          fork?: boolean;
        }>;

        const targetRepo = repos.find((repo) => !repo.fork) ?? repos[0];
        if (!targetRepo) {
          throw new Error("No repos found");
        }

        const commitsResponse = await fetch(`https://api.github.com/repos/${targetRepo.full_name}/commits?per_page=2`, { headers });
        if (!commitsResponse.ok) {
          throw new Error("Failed to load latest commit");
        }

        const commits = (await commitsResponse.json()) as Array<{
          sha: string;
          html_url: string;
          commit: { message: string; committer?: { date?: string } };
        }>;

        const pushCommit = commits[0];
        const historyCommit = commits[1] ?? commits[0];

        const pushData = {
          repo: targetRepo.full_name,
          message: pushCommit?.commit.message.split("\n")[0] ?? "Recent push",
          pushedAt: targetRepo.pushed_at,
          commitUrl: pushCommit?.html_url ?? targetRepo.html_url,
          repoUrl: targetRepo.html_url,
        };

        const commitData = {
          repo: targetRepo.full_name,
          message: historyCommit?.commit.message.split("\n")[0] ?? "Latest commit",
          pushedAt: historyCommit?.commit.committer?.date ?? targetRepo.pushed_at,
          commitUrl: historyCommit?.html_url ?? targetRepo.html_url,
          repoUrl: targetRepo.html_url,
        };

        if (!cancelled) {
          setLatestPush(pushData);
          setLatestCommit(commitData);
          setGithubError(false);
        }
      } catch (err) {
        console.warn("GitHub API fetch failed, falling back to snapshot:", err);

        try {
          const snapshot = await loadGeneratedSnapshot();
          const hasValidData = snapshot.github.latestPush || snapshot.github.latestCommit;

          if (!cancelled) {
            setLatestPush(snapshot.github.latestPush);
            setLatestCommit(snapshot.github.latestCommit);
            setGithubError(!hasValidData);
          }
        } catch (snapErr) {
          console.error("Snapshot fallback also failed:", snapErr);

          if (!cancelled) {
            setLatestPush(null);
            setLatestCommit(null);
            setGithubError(true);
          }
        }
      }
    };

    void loadGithub();
    void loadProjects();

    const pollInterval = isMobile ? 300000 : 60000;

    const intervalId = window.setInterval(() => {
      void loadGithub();
    }, pollInterval);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!commandOpen) {
      return;
    }

    commandInputRef.current?.focus();
  }, [commandOpen]);

  useEffect(() => {
    const results = commandResultsRef.current;

    if (!results || !commandOpen) {
      return;
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      results.scrollTop += event.deltaY;
    };

    results.addEventListener("wheel", onWheel, { passive: false });
    return () => results.removeEventListener("wheel", onWheel);
  }, [commandOpen]);

  useEffect(() => {
    const { body } = document;

    if (commandOpen) {
      lenisRef.current?.stop();
      body.style.overflow = "hidden";
      return () => {
        body.style.overflow = "";
        lenisRef.current?.start();
      };
    }

    body.style.overflow = "";
    lenisRef.current?.start();

    return () => {
      body.style.overflow = "";
    };
  }, [commandOpen]);

  useEffect(() => {
    if (flatCommandItems.length === 0) {
      setActiveCommandIndex(0);
      return;
    }

    setActiveCommandIndex((current) => Math.min(current, flatCommandItems.length - 1));
  }, [flatCommandItems]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const commandShortcut = (event.ctrlKey || event.metaKey || event.shiftKey) && event.key.toLowerCase() === "k";

      if (commandShortcut) {
        event.preventDefault();
        setCommandOpen(true);
        return;
      }

      if (!commandOpen) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setCommandOpen(false);
        setCommandQuery("");
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveCommandIndex((current) => {
          if (flatCommandItems.length === 0) {
            return 0;
          }

          return (current + 1) % flatCommandItems.length;
        });
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveCommandIndex((current) => {
          if (flatCommandItems.length === 0) {
            return 0;
          }

          return (current - 1 + flatCommandItems.length) % flatCommandItems.length;
        });
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const action = flatCommandItems[activeCommandIndex]?.action;
        setCommandOpen(false);
        setCommandQuery("");
        requestAnimationFrame(() => {
          action?.();
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeCommandIndex, commandOpen, flatCommandItems]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 80);
      if (currentY > 80) {
        setNavHidden(currentY > lastScrollY.current);
      } else {
        setNavHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    let frameId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(raf);
    };
    frameId = window.requestAnimationFrame(raf);

    return () => {
      lenisRef.current = null;
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, [isMobile]);

  useEffect(() => {
    const root = document.documentElement;
    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;
    let lastTime = performance.now();

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0]?.clientX ?? lastX : e.clientX;
      const clientY = "touches" in e ? e.touches[0]?.clientY ?? lastY : e.clientY;
      const now = performance.now();
      const dt = Math.max(now - lastTime, 16);
      const speed = Math.min(Math.hypot(clientX - lastX, clientY - lastY) / dt, 1.5);
      lastX = clientX;
      lastY = clientY;
      lastTime = now;
      root.style.setProperty("--pointer-x", `${clientX}px`);
      root.style.setProperty("--pointer-y", `${clientY}px`);
      root.style.setProperty("--pointer-speed", `${speed.toFixed(3)}`);
    };

    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchmove", onPointerMove);
    };
  }, []);

  useEffect(() => {
    if (isLoading || isMobile) return;
    const body = document.body;
    const root = document.documentElement;
    const cursor = cursorRef.current;
    const cursorCore = cursorCoreRef.current;
    const dot = cursorDotRef.current;
    const canvas = particleCanvasRef.current;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    if (!cursor || !cursorCore || !dot || !canvas || !finePointer) {
      return;
    }

    body.classList.add("custom-cursor-enabled");

    const context = canvas.getContext("2d");
    if (!context) {
      return () => {
        body.classList.remove("custom-cursor-enabled");
      };
    }

    const ringSize = 44;
    const dotSize = 10;

    gsap.set([cursor, dot], { autoAlpha: 0, x: -999, y: -999 });

    let cursorX = -999;
    let cursorY = -999;
    let dotX = -999;
    let dotY = -999;
    const motion = { vx: 0, vy: 0, speed: 0 };
    const ambientParticles = Array.from({ length: 48 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.2 + 0.08,
    }));
    const trailParticles: Array<{ x: number; y: number; vx: number; vy: number; life: number; size: number }> = [];

    const trailPoints = Array.from({ length: 18 }, () => ({ x: 0, y: 0 }));

    let lastMoveX = 0;
    let lastMoveY = 0;
    let lastMoveTime = performance.now();
    let hoverActive = false;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const onMove = (event: MouseEvent) => {
      const now = performance.now();
      const deltaTime = Math.max(now - lastMoveTime, 16);
      motion.vx = event.clientX - lastMoveX;
      motion.vy = event.clientY - lastMoveY;
      motion.speed = Math.min(Math.hypot(motion.vx, motion.vy) / deltaTime, 1.5);
      lastMoveX = event.clientX;
      lastMoveY = event.clientY;
      lastMoveTime = now;

      cursorX = event.clientX - ringSize / 2;
      cursorY = event.clientY - ringSize / 2;
      dotX = event.clientX - dotSize / 2;
      dotY = event.clientY - dotSize / 2;

      root.style.setProperty("--pointer-x", `${event.clientX}px`);
      root.style.setProperty("--pointer-y", `${event.clientY}px`);
      root.style.setProperty("--pointer-speed", `${motion.speed.toFixed(3)}`);

      gsap.set([cursor, dot], { autoAlpha: 1 });

      for (let i = trailPoints.length - 1; i > 0; i--) {
        trailPoints[i].x = trailPoints[i - 1].x;
        trailPoints[i].y = trailPoints[i - 1].y;
      }
      trailPoints[0].x = event.clientX;
      trailPoints[0].y = event.clientY;

      if (motion.speed > 0.3) {
        trailParticles.push({
          x: event.clientX,
          y: event.clientY,
          vx: motion.vx * 0.05 + (Math.random() - 0.5) * 0.8,
          vy: motion.vy * 0.05 + (Math.random() - 0.5) * 0.8,
          life: 1,
          size: Math.random() * 2.5 + 0.8 + motion.speed * 1.5,
        });

        if (trailParticles.length > 32) {
          trailParticles.shift();
        }
      }
    };

    const interactiveSelector = "a, button, input, .project-marquee-card, .live-card, .command-item";
    const onEnter = () => {
      hoverActive = true;
      gsap.to(cursorCore, { scale: 1.2, duration: 0.18, overwrite: true });
      gsap.to(dot, { scale: 1.15, duration: 0.18, overwrite: true });
    };
    const onLeave = () => {
      hoverActive = false;
      gsap.to(cursorCore, { scale: 1, duration: 0.18, overwrite: true });
      gsap.to(dot, { scale: 1, duration: 0.18, overwrite: true });
    };
    const hideCursor = () => gsap.to([cursor, dot], { autoAlpha: 0, duration: 0.16, overwrite: true });
    const onDown = () => {
      gsap.to(cursorCore, { scale: hoverActive ? 1.3 : 1.1, duration: 0.22, ease: "power3.out", overwrite: true });
      gsap.to(dot, { scale: 1.6, duration: 0.18, overwrite: true });
    };
    const onUp = () => {
      gsap.to(cursorCore, { scale: hoverActive ? 1.2 : 1, duration: 0.18, ease: "power3.out", overwrite: true });
      gsap.to(dot, { scale: hoverActive ? 1.15 : 1, duration: 0.18, overwrite: true });
    };
    const onPointerOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest(interactiveSelector)) {
        onEnter();
      }
    };
    const onPointerOut = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const relatedTarget = event.relatedTarget as HTMLElement | null;
      const leftInteractive = target?.closest(interactiveSelector);
      const nextInteractive = relatedTarget?.closest(interactiveSelector);

      if (leftInteractive && !nextInteractive) {
        onLeave();
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onPointerOver);
    document.addEventListener("mouseout", onPointerOut);
    document.addEventListener("mouseleave", hideCursor);

    let frameId = 0;
    const render = () => {
      gsap.set(cursor, { x: cursorX, y: cursorY });
      gsap.set(dot, { x: dotX, y: dotY });

      context.clearRect(0, 0, canvas.width, canvas.height);

      ambientParticles.forEach((particle) => {
        const dx = (cursorX + ringSize / 2) - particle.x;
        const dy = (cursorY + ringSize / 2) - particle.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 180) {
          const force = ((180 - distance) / 180) * (0.4 + motion.speed * 0.8);
          particle.x -= (dx / distance) * force * 1.5 || 0;
          particle.y -= (dy / distance) * force * 1.5 || 0;
        }

        particle.vx *= 0.992;
        particle.vy *= 0.992;
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        context.beginPath();
        context.fillStyle = `rgba(255, 255, 255, ${particle.alpha + motion.speed * 0.03})`;
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      });

      for (let index = trailParticles.length - 1; index >= 0; index -= 1) {
        const particle = trailParticles[index];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.97;
        particle.vy *= 0.97;
        particle.life -= 0.028;

        if (particle.life <= 0) {
          trailParticles.splice(index, 1);
          continue;
        }

        context.beginPath();
        context.fillStyle = `rgba(255, 255, 255, ${particle.life * 0.15})`;
        context.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
        context.fill();
      }

      if (trailPoints.length > 2 && motion.speed > 0.05) {
        context.beginPath();
        context.moveTo(trailPoints[0].x, trailPoints[0].y);

        for (let i = 1; i < trailPoints.length - 1; i++) {
          const p0 = trailPoints[i - 1];
          const p1 = trailPoints[i];
          const p2 = trailPoints[i + 1];

          const midX0 = (p0.x + p1.x) / 2;
          const midY0 = (p0.y + p1.y) / 2;
          const midX1 = (p1.x + p2.x) / 2;
          const midY1 = (p1.y + p2.y) / 2;

          context.quadraticCurveTo(midX0, midY0, midX1, midY1);
        }

        const lastPoint = trailPoints[trailPoints.length - 1];
        context.lineTo(lastPoint.x, lastPoint.y);

        const speedAlpha = Math.min(motion.speed * 0.6, 0.35);
        context.strokeStyle = `rgba(0, 212, 255, ${speedAlpha})`;
        context.lineWidth = 2.5;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();

        context.lineWidth = 1.2;
        context.strokeStyle = `rgba(160, 240, 255, ${speedAlpha * 0.6})`;
        context.stroke();
      }

      frameId = window.requestAnimationFrame(render);
    };

    frameId = window.requestAnimationFrame(render);

    return () => {
      body.classList.remove("custom-cursor-enabled");
      root.style.removeProperty("--pointer-x");
      root.style.removeProperty("--pointer-y");
      root.style.removeProperty("--pointer-speed");
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onPointerOver);
      document.removeEventListener("mouseout", onPointerOut);
      document.removeEventListener("mouseleave", hideCursor);
      window.cancelAnimationFrame(frameId);
    };
  }, [isLoading]);

  return (
    <BackgroundProvider>
    <AnimatePresence>
      {isLoading ? (
        <motion.div
          key="loader"
          className="fixed inset-0 flex items-center justify-center bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        >
          <div className="flex flex-col items-center gap-12">
            <UniqueLoading variant="morph" size="lg" />
            <KineticTypographyLoader />
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="portfolio"
          className="portfolio-shell"
          ref={rootRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        >
      <Suspense fallback={null}><AppBackground /></Suspense>
      {isMobile && <div className="liquid-field" aria-hidden="true" />}
      {!isMobile && <canvas className="particle-canvas" ref={particleCanvasRef} />}
      {!isMobile && <div className="cursor-ring" ref={cursorRef}>
        <div className="cursor-ring__core" ref={cursorCoreRef} />
      </div>}
      {!isMobile && <div className="cursor-dot" ref={cursorDotRef} />}
      <div className="noise-layer" aria-hidden="true" />
      <div className="ambient-blob ambient-blob--one" aria-hidden="true" />
      <div className="ambient-blob ambient-blob--two" aria-hidden="true" />

      <motion.header
        className={`site-header${scrolled ? " site-header--scrolled" : ""}`}
        animate={{ y: navHidden ? "-100%" : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <a className="site-mark" href="#top">
          <span>SB</span>
          <div>
            <strong>Sanskruti Borade</strong>
            <small>Developer & UI/UX • NIT Rourkela</small>
          </div>
        </a>

        <nav className="site-nav" aria-label="Primary">
          <button onClick={() => scrollToSelector("#story")}>Story</button>
          <button onClick={() => scrollToSelector("#capabilities")}>Toolbox</button>
          <button onClick={() => scrollToSelector("#work")}>Work</button>
          <button onClick={() => scrollToSelector("#contact")}>Contact</button>
        </nav>

        <div className="header-actions">
          <BgSwitcher />
          <motion.button
            aria-controls="command-palette"
            aria-expanded={commandOpen}
            aria-label="Open command palette"
            className="command-trigger"
            onClick={() => setCommandOpen(true)}
            type="button"
            whileTap={{ scale: 0.93 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <span className="command-trigger__icon" aria-hidden="true">
              /
            </span>
            <span className="command-trigger__hint">Shift K</span>
          </motion.button>

          <a className="resume-link" download={resumeFileName} href={resumePdf}>
            Resume
          </a>

          <button
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className={`menu-toggle${menuOpen ? " menu-toggle--active" : ""}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            type="button"
          >
            <span className="menu-toggle__bar" />
            <span className="menu-toggle__bar" />
            <span className="menu-toggle__bar" />
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="mobile-menu"
              id="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <nav className="mobile-menu__nav" aria-label="Primary">
                <button
                  onClick={() => { scrollToSelector("#story"); setMenuOpen(false); }}
                  type="button"
                >
                  Story
                </button>
                <button
                  onClick={() => { scrollToSelector("#capabilities"); setMenuOpen(false); }}
                  type="button"
                >
                  Toolbox
                </button>
                <button
                  onClick={() => { scrollToSelector("#work"); setMenuOpen(false); }}
                  type="button"
                >
                  Work
                </button>
                <button
                  onClick={() => { scrollToSelector("#contact"); setMenuOpen(false); }}
                  type="button"
                >
                  Contact
                </button>
              </nav>
              <a className="mobile-menu__resume" download={resumeFileName} href={resumePdf}>
                Resume
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AnimatePresence>
        {commandOpen && (
          <motion.div
            aria-hidden={false}
            className="command-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={() => {
              setCommandOpen(false);
              setCommandQuery("");
            }}
          >
            <motion.section
              aria-label="Command palette"
              className="command-palette"
              id="command-palette"
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="command-palette__halo" aria-hidden="true" />
              <div className="command-palette__input-shell">
                <span className="command-palette__search-icon" aria-hidden="true">
                  Search
                </span>
                <input
                  onChange={(event) => {
                    setCommandQuery(event.target.value);
                    setActiveCommandIndex(0);
                  }}
                  placeholder="Type command or search signal..."
                  ref={commandInputRef}
                  type="text"
                  value={commandQuery}
                />
                <span className="command-palette__esc">ESC</span>
              </div>

              <div className="command-results" ref={commandResultsRef} role="listbox">
                {commandGroups.length > 0 ? (
                  commandGroups.map((group) => (
                    <div className="command-group" key={group.group}>
                      <div className="command-group__label">{group.group}</div>
                      <div className="command-group__items">
                        {group.items.map((item) => {
                          const itemIndex = flatCommandItems.findIndex((entry) => entry.id === item.id);

                          return (
                            <button
                              className={`command-item${itemIndex === activeCommandIndex ? " command-item--active" : ""}`}
                              key={item.id}
                              onClick={() => {
                                const action = item.action;
                                setCommandOpen(false);
                                setCommandQuery("");
                                requestAnimationFrame(() => {
                                  action();
                                });
                              }}
                              onMouseEnter={() => setActiveCommandIndex(itemIndex)}
                              type="button"
                            >
                              <span className="command-item__glyph" aria-hidden="true">
                                {item.group.slice(0, 1)}
                              </span>
                              <span className="command-item__copy">
                                <strong>{item.title}</strong>
                                <small>{item.description}</small>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="command-empty">
                    <strong>No signal found.</strong>
                    <small>Try LEO WATCH, LifeQuest, resume, GitHub, React, skills.</small>
                  </div>
                )}
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="portfolio-main" id="top">
        <motion.section
          className="scene-section hero-scene"
          id="story"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-wash" aria-hidden="true" />

          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="hero-kicker"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", marginBottom: "10px" }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "5px 14px",
                  borderRadius: "9999px",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  background: "rgba(16, 185, 129, 0.12)",
                  color: "#34d399",
                  border: "1px solid rgba(16, 185, 129, 0.35)",
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#34d399",
                    boxShadow: "0 0 8px #34d399",
                  }}
                />
                Open to Opportunities
              </span>
              <span
                style={{
                  fontSize: "13px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "rgba(255, 255, 255, 0.55)",
                  fontWeight: 500,
                }}
              >
                Developer • UI/UX
              </span>
            </motion.div>

            <h1 className="hero-title" aria-label="Hi, I am Sanskruti Borade">
              <span className="reveal-line">
                <motion.span
                  className="reveal-line__inner"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.33, 1, 0.68, 1] }}
                >
                  Hi, I&apos;m Sanskruti Borade
                </motion.span>
              </span>
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "10px",
                color: "rgba(255, 255, 255, 0.85)",
                fontSize: "14.5px",
                fontWeight: 500,
              }}
            >
              <span style={{ fontSize: "15px" }}>📍</span>
              <span>National Institute of Technology (NIT), Rourkela</span>
            </motion.div>

            <motion.p
              className="hero-summary"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.7 }}
              style={{ marginTop: "20px", maxWidth: "620px", lineHeight: "1.75", fontSize: "15.5px", color: "rgba(255, 255, 255, 0.72)" }}
            >
              I’m a developer and designer specializing in building responsive web applications with React, Tailwind CSS, Node.js, and Express. I enjoy combining clean, thoughtful interface design with modern web architectures, data analytics, and hackathon-driven problem solving to turn ideas into functional, visually engaging, and impactful products.
            </motion.p>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
          >
            <motion.div
              className="hero-stage"
              animate={{ y: [-18, 0, -18] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="hero-canvas" aria-hidden="true">
                <LazyHeroScene />
              </div>

              <motion.div
                className="portrait-frame"
                animate={{ y: [-18, 0, -18] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  className="portrait-ring"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />
                <div className="portrait-core">
                  <picture>
                    <source media="(max-width: 768px)" srcSet={profileImageWebp} type="image/webp" />
                    <source media="(min-width: 769px)" srcSet={profileImage} type="image/png" />
                    <img alt="Portrait of Sanskruti Borade" className="portrait-image" src={profileImage} />
                  </picture>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.section>

        <motion.section
          className="scene-section capabilities-scene"
          id="capabilities"
          initial={{ opacity: 0.5 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.4 }}
        >
          <div className="section-wash" aria-hidden="true" />
          <motion.div
            className="scene-heading"
            initial={{ opacity: 0, y: 42 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
          >
            <p className="scene-label">Toolbox</p>
            <h2>What I Work With</h2>
            <p style={{ color: "rgba(255, 255, 255, 0.65)", marginTop: "12px", fontSize: "15px", maxWidth: "600px", margin: "12px auto 0" }}>
              Technologies and tools I reach for regularly across web development, analytics, and design.
            </p>
          </motion.div>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", margin: "32px 0 36px" }}>
            {[
              { id: "all", label: "All Disciplines" },
              { id: "web-dev", label: "Web Dev" },
              { id: "data-analytics", label: "Data & Analytics" },
              { id: "ui-ux", label: "UI/UX" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedSkillCategory(tab.id)}
                type="button"
                style={{
                  padding: "8px 20px",
                  borderRadius: "9999px",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  border: selectedSkillCategory === tab.id ? "1px solid rgba(255, 255, 255, 0.35)" : "1px solid var(--border-glass)",
                  background: selectedSkillCategory === tab.id ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.03)",
                  color: selectedSkillCategory === tab.id ? "#ffffff" : "rgba(255, 255, 255, 0.65)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="live-grid">
            {toolboxData
              .filter((item) => selectedSkillCategory === "all" || item.id === selectedSkillCategory)
              .map((item, index) => (
                <TiltCard key={item.id} item={item} index={index} />
              ))}
          </div>
        </motion.section>

        <motion.section
          className="scene-section projects-scene"
          id="work"
          initial={{ opacity: 0.5 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.4 }}
        >
          <div className="section-wash" aria-hidden="true" />
          <motion.div
            className="scene-heading"
            initial={{ opacity: 0, y: 42 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
          >
            <p className="scene-label">Projects</p>
            <h2>Projects that make a difference.</h2>
          </motion.div>

          <div className="project-marquee">
            {(() => {
              const ROW_COUNT = 4;
              const perRow = Math.ceil(projects.length / ROW_COUNT);
              const rows = Array.from({ length: ROW_COUNT }, (_, i) =>
                projects.slice(i * perRow, (i + 1) * perRow)
              ).filter(row => row.length > 0);
              return rows.map((row, i) => (
                <SimpleMarquee
                  key={i}
                  className={`w-full${i > 0 ? " mt-2 sm:mt-3 md:mt-4" : ""}`}
                  baseVelocity={8}
                  repeat={4}
                  slowdownOnHover
                  slowDownFactor={0.2}
                  slowDownSpringConfig={{ damping: 60, stiffness: 300 }}
                  useScrollVelocity
                  scrollAwareDirection
                  scrollSpringConfig={{ damping: 50, stiffness: 400 }}
                  direction={i % 2 === 0 ? "left" : "right"}
                >
                  {row.map((project) => (
                    <a
                      key={project.title}
                      href={project.href}
                      className="mx-3 w-72 sm:w-80 md:w-96 shrink-0 block group"
                    >
                      <div className="project-marquee-card">
                        <h3 className="text-white text-base sm:text-lg md:text-xl font-medium mb-1.5 sm:mb-2">
                          {project.title}
                        </h3>
                        <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 line-clamp-2">
                          {project.impact}
                        </p>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] sm:text-xs text-neutral-300">
                          {project.stack}
                        </span>
                      </div>
                    </a>
                  ))}
                </SimpleMarquee>
              ));
            })()}
          </div>
        </motion.section>

        <motion.section
          className="scene-section contact-scene"
          id="contact"
          initial={{ opacity: 0.5 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.4 }}
        >
          <div className="section-wash" aria-hidden="true" />
          <div className="contact-layout">
            <motion.div
              className="contact-copy"
              initial={{ opacity: 0, y: 42 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
            >
              <p className="scene-label">Contact</p>
              <h2>Let's build something extraordinary together.</h2>
              <p>
                Open to software development internships, 3D web applications, UI/UX prototyping, and creative engineering collaborations. Based at NIT Rourkela & Mumbai.
              </p>
            </motion.div>

            <motion.div
              className="contact-links"
              initial={{ opacity: 0, y: 42 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.33, 1, 0.68, 1] }}
            >
              <motion.a
                href={contactLinks[0].href}
                key={contactLinks[0].label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <CenterUnderline>
                  <span>{contactLinks[0].label}</span>
                  <strong>{contactLinks[0].value}</strong>
                </CenterUnderline>
              </motion.a>
              <motion.a
                href={contactLinks[1].href}
                key={contactLinks[1].label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.28 }}
              >
                <ComesInGoesOutUnderline direction="right">
                  <span>{contactLinks[1].label}</span>
                  <strong>{contactLinks[1].value}</strong>
                </ComesInGoesOutUnderline>
              </motion.a>
              <motion.a
                href={contactLinks[2].href}
                key={contactLinks[2].label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.36 }}
              >
                <ComesInGoesOutUnderline direction="left">
                  <span>{contactLinks[2].label}</span>
                  <strong>{contactLinks[2].value}</strong>
                </ComesInGoesOutUnderline>
              </motion.a>
              <motion.a
                download={contactLinks[3].label === "Resume" ? resumeFileName : undefined}
                href={contactLinks[3].href}
                key={contactLinks[3].label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.44 }}
              >
                <GoesOutComesInUnderline direction="left">
                  <span>{contactLinks[3].label}</span>
                  <strong>{contactLinks[3].value}</strong>
                </GoesOutComesInUnderline>
              </motion.a>
            </motion.div>
          </div>
        </motion.section>
      </main>
    </motion.div>
      )}
    </AnimatePresence>
    </BackgroundProvider>
  );
}

export default App;
