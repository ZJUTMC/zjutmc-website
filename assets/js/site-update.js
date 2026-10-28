/* One automatic check per tab session; explicit clicks can always retry. */
(() => {
  "use strict";
  const script = document.currentScript;
  if (!script) return;
  const pageVersion = script.dataset.siteVersion;
  if (!/^\d{14}$/.test(pageVersion || "")) return;
  const manifestURL = new URL(script.dataset.versionUrl, location.href);
  if (manifestURL.origin !== location.origin) return;
  const badge = document.getElementById("site-build-version");
  const status = document.getElementById("site-version-status");
  const originalTitle = badge ? badge.title : "";
  const parameter = "_site_version";
  const key = "zjutmc:update-session:v2";
  let checking = false;
  let navigating = false;

  function show(state, message) {
    if (badge) {
      badge.dataset.state = state;
      badge.setAttribute("aria-busy", String(state === "loading"));
      badge.setAttribute("aria-disabled", String(state === "loading"));
      badge.title = originalTitle + (message ? "；" + message : "");
    }
    if (status) status.textContent = message;
  }

  function claimSession() {
    try { sessionStorage.setItem(key, "checked"); } catch (_) {}
  }

  async function check(manual) {
    if (checking || navigating) return;
    checking = true;
    // Manual checks also count as the session's check, but are never blocked by it.
    claimSession();
    show("loading", "正在检查网站更新");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      if (!navigator.onLine) throw new Error("offline");
      const url = new URL(manifestURL);
      const nonce = globalThis.crypto && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID() : String(Date.now()) + "-" + Math.random().toString(36).slice(2);
      url.searchParams.set("_check", nonce);
      const response = await fetch(url.href, {
        cache: "no-store", credentials: "same-origin", signal: controller.signal
      });
      if (!response.ok) throw new Error("http");
      const data = await response.json();
      const latest = data && data.version;
      if (typeof latest !== "string" || !/^\d{14}$/.test(latest)) throw new Error("invalid");
      if (latest === pageVersion) {
        show("current", "已检查，当前已是最新版本");
        return;
      }
      // Do not mistake a stale CDN manifest for proof that the page is current.
      if (latest < pageVersion) {
        show("warning", "版本信息暂未同步，请稍后点击重试");
        return;
      }
      const active = document.activeElement;
      if (!manual && active && (active.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName))) {
        show("warning", "发现新版本；为避免打断输入，请点击版本号更新");
        return;
      }
      const target = new URL(location.href);
      target.searchParams.set(parameter, latest);
      show("loading", "发现新版本，正在重新加载");
      navigating = true;
      location.replace(target.href);
    } catch (_) {
      navigating = false;
      show("error", "检查失败，请确认网络后点击重试");
    } finally {
      clearTimeout(timeout);
      checking = false;
    }
  }

  // Register manual interaction before any automatic-check/session early return.
  if (badge) badge.addEventListener("click", () => { check(true); });

  const currentURL = new URL(location.href);
  const requestedVersion = currentURL.searchParams.get(parameter);
  if (requestedVersion && /^\d{14}$/.test(requestedVersion)) {
    claimSession();
    if (requestedVersion === pageVersion) {
      currentURL.searchParams.delete(parameter);
      try { history.replaceState(history.state, "", currentURL.href); } catch (_) {}
      show("current", "已加载目标版本");
    } else {
      show("warning", "更新后仍收到旧页面，可能是缓存或部署未完成；请稍后点击重试");
    }
    return; // Never start another automatic request after the version reload.
  }

  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "checked");
    if (sessionStorage.getItem(key) !== "checked") return;
  } catch (_) {
    return; // Manual checks still work without storage; automatic checks fail closed.
  }
  check(false);
})();
