export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

const UTM_STORAGE_KEY = 'garvi_utm_params';

export function captureUtmParamsFromUrl(): UtmParams {
  if (typeof window === 'undefined') return {};

  const urlParams = new URLSearchParams(window.location.search);
  const utmParams: UtmParams = {};

  const keys: (keyof UtmParams)[] = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
  ];

  let hasAny = false;
  keys.forEach((key) => {
    const val = urlParams.get(key);
    if (val) {
      utmParams[key] = val;
      hasAny = true;
    }
  });

  if (hasAny) {
    try {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmParams));
    } catch (e) {
      // Ignore storage errors in private browsing
    }
    return utmParams;
  }

  // Fallback to existing stored UTM params if available
  try {
    const saved = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // Ignore
  }

  return {};
}

export function getStoredUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {};
  try {
    const saved = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    // Ignore
  }
  return {};
}
