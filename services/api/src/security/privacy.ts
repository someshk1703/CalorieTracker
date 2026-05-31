const REDACTED = "[REDACTED]";

export function redactSecrets<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => {
      if (/key|token|secret|authorization/i.test(key)) {
        return [key, REDACTED];
      }

      return [key, entry];
    })
  ) as T;
}

export function shouldPersistServerMedia(options: {
  userConsentedToBackup?: boolean;
  userConsentedToShare?: boolean;
}): boolean {
  return options.userConsentedToBackup === true || options.userConsentedToShare === true;
}

export async function cleanupTransientImage(cleanup: () => Promise<void> | void): Promise<void> {
  await cleanup();
}