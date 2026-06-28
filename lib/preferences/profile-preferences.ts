export const PREFERENCES_STORAGE_KEY = "kidney-breathalyzer-preferences";

export type AppLocale = "th" | "en";
export type DisplayMode = "standard" | "comfort";
export type AvatarType = "initials" | "emoji" | "photo";

export interface AvatarPreference {
  type: AvatarType;
  emoji?: string;
  photoDataUrl?: string;
}

export interface ProfilePreferences {
  locale: AppLocale;
  displayMode: DisplayMode;
  notificationsEnabled: boolean;
  avatar: AvatarPreference;
}

export const DEFAULT_PREFERENCES: ProfilePreferences = {
  locale: "th",
  displayMode: "standard",
  notificationsEnabled: true,
  avatar: { type: "initials" },
};

export const AVATAR_EMOJI_OPTIONS = [
  "😊",
  "🙂",
  "😎",
  "🌿",
  "💧",
  "❤️",
  "🫁",
  "⭐",
  "🌸",
  "🎯",
  "🧘",
  "💪",
] as const;

const MAX_PHOTO_BYTES = 400_000;

export function getStoredPreferences(): ProfilePreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;

  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw) as Partial<ProfilePreferences>;
    return {
      ...DEFAULT_PREFERENCES,
      ...parsed,
      avatar: {
        ...DEFAULT_PREFERENCES.avatar,
        ...parsed.avatar,
      },
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(
  patch: Partial<ProfilePreferences> & { avatar?: Partial<AvatarPreference> }
): ProfilePreferences {
  const current = getStoredPreferences();
  const next: ProfilePreferences = {
    ...current,
    ...patch,
    avatar: {
      ...current.avatar,
      ...patch.avatar,
    },
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(next));
  }

  return next;
}

export function applyDisplayMode(mode: DisplayMode) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.display = mode;
}

export function applyLocale(locale: AppLocale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale === "th" ? "th" : "en";
}

export async function readAvatarPhotoFile(
  file: File
): Promise<string | null> {
  if (!file.type.startsWith("image/")) return null;
  if (file.size > MAX_PHOTO_BYTES * 4) return null;

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  if (dataUrl.length <= MAX_PHOTO_BYTES) return dataUrl;

  return compressImageDataUrl(dataUrl, MAX_PHOTO_BYTES);
}

async function compressImageDataUrl(
  dataUrl: string,
  maxBytes: number
): Promise<string | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const maxSide = 256;
      const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      let quality = 0.85;
      let result = canvas.toDataURL("image/jpeg", quality);
      while (result.length > maxBytes && quality > 0.35) {
        quality -= 0.1;
        result = canvas.toDataURL("image/jpeg", quality);
      }
      resolve(result.length <= maxBytes ? result : null);
    };
    image.onerror = () => resolve(null);
    image.src = dataUrl;
  });
}
