function DashboardHeader({ theme, onToggleTheme }) {
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <header className="dashboard-header">
      <a className="dashboard-brand" href="#dashboard" aria-label="Service Desk home">
        <span className="brand-mark" aria-hidden="true">
          SD
        </span>
        <span>
          <strong>Service Desk</strong>
          <small>Ticket management</small>
        </span>
      </a>
      <div className="header-actions">
        <span className="demo-badge">Demo environment</span>
        <button
          className="theme-button"
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${nextTheme} theme`}
          aria-pressed={theme === "dark"}
        >
          <span aria-hidden="true">{theme === "dark" ? "☼" : "◐"}</span>
          <span>{nextTheme} theme</span>
        </button>
      </div>
    </header>
  );
}

export default DashboardHeader;
