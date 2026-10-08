import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react"
import { useRef, useState } from "react"

const imagePath = "/assets/Fundo.jpg"

const SOCIALS = [
  {
    id: "linkedin",
    label: "Linkedin",
    href: "https://www.linkedin.com/in/eduardo-navis/",
    detail: "linkedin.com/in/eduardo-navis",
    icon: "/assets/LinkedinIcon.png",
  },
  {
    id: "github",
    label: "Github",
    href: "https://github.com/Eduardo-Navis",
    detail: "github.com/Eduardo-Navis",
    icon: "/assets/GithubIcon.png",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/_eduardonavis/",
    detail: "instagram.com/_eduardonavis",
    icon: "/assets/InstaIcon.png",
  },
]

const SOCIAL_PROGRESS = [0.47, 0.69, 0.9]

function SocialCard({ social, visible, reduceMotion }) {
  return (
    <motion.a
      className="social-card"
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Acessar ${social.label}`}
      tabIndex={visible ? 0 : -1}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
    >
      <AnimatePresence mode="sync" initial={false}>
        <motion.span
          key={social.id}
          className="social-card__content"
          initial={reduceMotion ? false : { opacity: 0, y: 18, filter: "blur(7px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -14, filter: "blur(6px)" }}
          transition={{ duration: reduceMotion ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="social-card__icon" aria-hidden="true">
            <img
              className={social.id === "github" ? "social-card__icon-image--github" : undefined}
              src={social.icon}
              alt=""
            />
          </span>

          <span className="social-card__copy">
            <span>Acessar</span>
            <strong>{social.label}</strong>
            <small>{social.detail}</small>
          </span>

          <span className="social-card__arrow" aria-hidden="true">
            <img src="/assets/SetaIcon.png" alt="" />
          </span>
        </motion.span>
      </AnimatePresence>
    </motion.a>
  )
}

function ScrollExperience() {
  const journeyRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [navigationVisible, setNavigationVisible] = useState(false)
  const { scrollYProgress } = useScroll({
    target: journeyRef,
    offset: ["start start", "end end"],
  })

  const backgroundScale = useTransform(scrollYProgress, [0, 0.35, 1], [1, 1.035, 1.08])
  const backgroundFilter = useTransform(
    scrollYProgress,
    [0, 0.08, 0.34, 1],
    [
      "blur(0px) brightness(0.94)",
      "blur(1px) brightness(0.82)",
      "blur(9px) brightness(0.54)",
      "blur(12px) brightness(0.46)",
    ],
  )
  const shadeOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.18, 0.46, 0.58])
  const metaOpacity = useTransform(scrollYProgress, (value) => {
    const progress = Math.min(Math.max((value - 0.11) / 0.11, 0), 1)
    return 1 - progress
  })
  const scrollLineScale = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  const horizontalOpacity = useTransform(scrollYProgress, (value) => {
    const progress = Math.min(Math.max((value - 0.07) / 0.17, 0), 1)
    return 1 - progress
  })

  const navigationOpacity = useTransform(scrollYProgress, (value) =>
    Math.min(Math.max((value - 0.25) / 0.13, 0), 1),
  )
  const navigationY = useTransform(scrollYProgress, [0.25, 0.4], ["5vh", "0vh"])
  const cardOpacity = useTransform(scrollYProgress, (value) =>
    Math.min(Math.max((value - 0.31) / 0.12, 0), 1),
  )
  const cardX = useTransform(scrollYProgress, [0.31, 0.45], ["5vw", "0vw"])

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const nextIndex = progress < 0.59 ? 0 : progress < 0.8 ? 1 : 2
    setActiveIndex((currentIndex) => currentIndex === nextIndex ? currentIndex : nextIndex)

    const shouldShowNavigation = progress >= 0.28
    setNavigationVisible((isVisible) => isVisible === shouldShowNavigation ? isVisible : shouldShowNavigation)
  })

  const scrollToSocial = (index) => {
    const journey = journeyRef.current
    if (!journey) return

    const bounds = journey.getBoundingClientRect()
    const journeyTop = window.scrollY + bounds.top
    const scrollDistance = journey.offsetHeight - window.innerHeight

    window.scrollTo({
      top: journeyTop + scrollDistance * SOCIAL_PROGRESS[index],
      behavior: reduceMotion ? "auto" : "smooth",
    })
  }

  const activeSocial = SOCIALS[activeIndex]

  return (
    <section ref={journeyRef} className="scene-journey" aria-label="Links sociais">
      <div className="scene-stage">
        <div className="scene-background" aria-hidden="true">
          <motion.img
            src={imagePath}
            alt=""
            style={reduceMotion ? {
              scale: 1,
              filter: "blur(0px) brightness(0.68)",
            } : {
              scale: backgroundScale,
              filter: backgroundFilter,
            }}
          />
          <motion.div
            className="scene-shade"
            style={{ opacity: reduceMotion ? 0.42 : shadeOpacity }}
          />
        </div>

        <motion.div className="scene-meta" style={{ opacity: metaOpacity }}>
          <span>ED - 2026</span>
          <span>Eduardonavis.unip@gmail.com</span>
        </motion.div>

        <motion.div
          className="scene-scroll-indicator"
          style={{ opacity: metaOpacity }}
          aria-hidden="true"
        >
          <span>Scroll</span>
          <span className="scene-scroll-indicator__track">
            <motion.span style={{ scaleX: reduceMotion ? 1 : scrollLineScale }} />
          </span>
        </motion.div>

        <motion.div
          className="mobile-scroll-indicator"
          style={{ opacity: navigationOpacity }}
          aria-hidden="true"
        >
          <span>Scroll</span>
          <span className="mobile-scroll-indicator__arrow">↓</span>
        </motion.div>

        <motion.div className="links-horizontal" style={{ opacity: horizontalOpacity }}>
          <h1>LINKS</h1>
        </motion.div>

        <motion.div
          className="experience-panel"
          style={reduceMotion ? {
            opacity: navigationOpacity,
          } : {
            opacity: navigationOpacity,
            y: navigationY,
          }}
          aria-hidden={navigationVisible ? undefined : "true"}
        >
          <nav className="social-navigation" aria-label="Selecionar rede social">
            <ul>
              {SOCIALS.map((social, index) => {
                const isActive = activeIndex === index

                return (
                  <li key={social.id}>
                    <button
                      type="button"
                      className={isActive ? "is-active" : undefined}
                      aria-current={isActive ? "true" : undefined}
                      tabIndex={navigationVisible ? 0 : -1}
                      onClick={() => scrollToSocial(index)}
                    >
                      <span className="social-navigation__dot" aria-hidden="true" />
                      <span>{social.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          <motion.div
            className="social-card-position"
            style={reduceMotion ? { opacity: cardOpacity } : { opacity: cardOpacity, x: cardX }}
          >
            <SocialCard
              social={activeSocial}
              visible={navigationVisible}
              reduceMotion={reduceMotion}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <main>
      <ScrollExperience />
    </main>
  )
}
