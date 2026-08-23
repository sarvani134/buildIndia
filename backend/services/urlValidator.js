const TRUSTED_HOSTS = ['gov.in','nic.in','uidai.gov.in','epfindia.gov.in','irctc.co.in','jeevanpramaan.gov.in','pensionersportal.gov.in','digilocker.gov.in','abc.gov.in','incometax.gov.in'];

export function isTrustedOfficialUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && TRUSTED_HOSTS.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));
  } catch { return false; }
}

