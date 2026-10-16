import { useState } from "react";

function ThemeIcon({ theme }) {
  if (theme === "dark") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20.1 15.4A8.5 8.5 0 0 1 8.6 3.9 8.5 8.5 0 1 0 20.1 15.4Z" />
    </svg>
  );
}

function App() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || "light",
  );

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);

    try {
      localStorage.setItem("portfolio-theme", nextTheme);
    } catch (error) {
      console.warn("Could not save the theme preference.", error);
    }
  }

  return (
    <div className="page-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Your Name, home">
          <span className="wordmark-mark" aria-hidden="true">
            YN
          </span>
          <span>Your Name</span>
        </a>

        <nav className="navigation" aria-label="Main navigation">
          <a className="nav-link" href="#projects">
            Projects
          </a>
          <a className="nav-link" href="#contact">
            Contact
          </a>
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle colour theme"
            aria-pressed={theme === "dark"}
          >
            <ThemeIcon theme={theme} />
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
        </nav>
      </header>

      <main id="main">
        <section className="hero section-wrap" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" aria-hidden="true" />
              Web developer · United Kingdom
            </p>
            <h1 id="hero-title">
              Building thoughtful
              <br />
              <span>experiences for the web.</span>
            </h1>
            <p className="hero-intro">
              I’m a developer with over three years of experience working with
              JavaScript, React and Node.js. I currently work in first-line IT
              support and am focused on my next opportunity in web development.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">
                View Projects
                <span aria-hidden="true">↗</span>
              </a>
              <a className="button button-secondary" href="#contact">
                Contact Me
                <span aria-hidden="true">→</span>
              </a>
            </div>
            <p className="hero-note">
              Open to professional web development opportunities
            </p>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-outer" />
            <div className="orbit orbit-inner" />
            <div className="code-card">
              <div className="code-card-top">
                <span />
                <span />
                <span />
                <i>portfolio.js</i>
              </div>
              <div className="code-lines">
                <p>
                  <span className="code-muted">01</span>
                  <span className="code-purple">const</span> developer = {"{"}
                </p>
                <p>
                  <span className="code-muted">02</span>
                  &nbsp; focus: <span className="code-green">"the web"</span>,
                </p>
                <p>
                  <span className="code-muted">03</span>
                  &nbsp; tools: [
                </p>
                <p>
                  <span className="code-muted">04</span>
                  &nbsp;&nbsp; <span className="code-yellow">"React"</span>,
                </p>
                <p>
                  <span className="code-muted">05</span>
                  &nbsp;&nbsp; <span className="code-yellow">"Node.js"</span>
                </p>
                <p>
                  <span className="code-muted">06</span>
                  &nbsp; ],
                </p>
                <p>
                  <span className="code-muted">07</span>
                  &nbsp; mindset: <span className="code-green">"curious"</span>
                </p>
                <p>
                  <span className="code-muted">08</span>
                  {"}"};
                </p>
              </div>
              <div className="code-card-foot">
                <span className="code-foot-dot" />
                Ready for what’s next
              </div>
            </div>
            <span className="art-spark spark-one">✳</span>
            <span className="art-spark spark-two">✳</span>
          </div>
        </section>

        <section className="placeholder-section section-wrap" id="projects">
          <p className="eyebrow">Selected work</p>
          <h2>Projects will appear here.</h2>
          <p>
            This space is ready for project details when you’re ready to add
            them.
          </p>
        </section>

        <section className="contact-strip section-wrap" id="contact">
          <div>
            <p className="eyebrow">Get in touch</p>
            <h2>Let’s talk about what’s next.</h2>
          </div>
          <p>Contact details can be added here.</p>
        </section>
      </main>

      <footer className="site-footer section-wrap">
        <span>© {new Date().getFullYear()} Your Name</span>
        <span>Designed with care.</span>
      </footer>
    </div>
  );
}

export default App;
