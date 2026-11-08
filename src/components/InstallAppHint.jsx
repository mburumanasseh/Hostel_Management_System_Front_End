import { useEffect, useState } from "react";

/**
 * Shows a soft "Install app" prompt when the browser supports it
 * (Chrome/Edge on Windows, Android, some desktop).
 * iPhone: users use Share → Add to Home Screen.
 */
export default function InstallAppHint() {
  const [deferred, setDeferred] = useState(null);
  const [hidden, setHidden] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent || "";
    const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIos(ios && !window.navigator.standalone);

    const onPrompt = (e) => {
      e.preventDefault();
      setDeferred(e);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (hidden) return null;
  if (!deferred && !isIos) return null;

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setHidden(true);
  };

  return (
    <div className="install-hint">
      <div>
        <strong>Install Zabe</strong>
        <p>
          {isIos
            ? "On iPhone: tap Share, then Add to Home Screen."
            : "Install this app on your device for quick access."}
        </p>
      </div>
      <div className="install-hint-actions">
        {!isIos && deferred && (
          <button type="button" className="public-btn public-btn-primary" onClick={install}>
            Install
          </button>
        )}
        <button
          type="button"
          className="public-btn public-btn-ghost"
          onClick={() => setHidden(true)}
        >
          Not now
        </button>
      </div>
    </div>
  );
}
