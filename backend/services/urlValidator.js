// Explicit non-gov.in hosts below are official institutional portals; additions require manual review.
const TRUSTED_HOSTS = ['gov.in','nic.in','uidai.gov.in','epfindia.gov.in','irctc.co.in','jeevanpramaan.gov.in','pensionersportal.gov.in','digilocker.gov.in','abc.gov.in','incometax.gov.in','nta.ac.in','pmvidyalaxmi.co.in','pfrda.org.in','enps.nsdl.com','ihmcl.co.in','mylpg.in','mudra.org.in','standupmitra.in','udgam.rbi.org.in','cms.rbi.org.in'];

export function isTrustedOfficialUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && TRUSTED_HOSTS.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));
  } catch { return false; }
}
