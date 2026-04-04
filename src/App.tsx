import { Nav } from "./components/Layout/Nav";
import { PageLoader } from "./components/PageLoader/PageLoader";
import { SmoothScroll } from "./components/SmoothScroll/SmoothScroll";
import { Hero } from "./components/Hero/Hero";
import { StorySequence } from "./components/StorySequence/StorySequence";
import { BearingShowcase } from "./components/BearingShowcase/BearingShowcase";
import { ScrollSequence } from "./components/ScrollSequence/ScrollSequence";
import { ComponentShowcase } from "./components/ComponentShowcase/ComponentShowcase";
import { VideoReveal } from "./components/VideoReveal/VideoReveal";
import { ParallaxSection } from "./components/ParallaxSection/ParallaxSection";
import { PageTransition } from "./components/PageTransition/PageTransition";
import { ReducedMotionProvider } from "./motion";
import "./styles/global.css";

function App() {
  return (
    <ReducedMotionProvider>
      <SmoothScroll>
        <PageLoader />
        <Nav />
        <main>
          <Hero />
          <StorySequence />
          <BearingShowcase />
          <ScrollSequence />
          <ComponentShowcase />
          <VideoReveal />
          <ParallaxSection />
          <PageTransition />
          <footer
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              color: "var(--color-text-muted)",
              fontSize: "0.85rem",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            Motion Showcase &mdash; Frictionless. Precise. Continuous.
          </footer>
        </main>
      </SmoothScroll>
    </ReducedMotionProvider>
  );
}

export default App;
