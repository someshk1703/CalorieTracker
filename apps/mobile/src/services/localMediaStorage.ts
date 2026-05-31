export interface LocalMediaReference {
  localUri: string;
  cloudMediaId?: string;
  userConsentedToBackup: boolean;
  userConsentedToShare: boolean;
}

export function createLocalMediaReference(
  localUri: string,
  options: { userConsentedToBackup?: boolean; userConsentedToShare?: boolean } = {}
): LocalMediaReference {
  return {
    localUri,
    userConsentedToBackup: options.userConsentedToBackup ?? false,
    userConsentedToShare: options.userConsentedToShare ?? false
  };
}

export function canUploadMedia(reference: LocalMediaReference): boolean {
  return reference.userConsentedToBackup || reference.userConsentedToShare;
}