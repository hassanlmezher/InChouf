const productionSiteUrl = "https://inchouf.com";

export function getSiteUrl() {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredSiteUrl) {
    return configuredSiteUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);

    if (!isLocalhost) {
      return window.location.origin;
    }
  }

  return productionSiteUrl;
}

export function getAuthCallbackUrl() {
  return `${getSiteUrl()}/auth/callback`;
}
