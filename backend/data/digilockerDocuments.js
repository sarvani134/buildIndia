const DIGILOCKER_DOCUMENTS_URL = 'https://www.digilocker.gov.in/web/dashboard/issuers';

const document = (id, serviceName, description, keywords, destination = {}) => ({
  intent: `digilocker_${id}`, portalName: 'DigiLocker', serviceName, description,
  category: 'Education documents', buttonText: 'Find in DigiLocker',
  officialUrl: destination.orgId && destination.docTypeId
    ? `${DIGILOCKER_DOCUMENTS_URL}/${destination.orgId}/${destination.docTypeId}`
    : `${DIGILOCKER_DOCUMENTS_URL}?searchKey=${encodeURIComponent(serviceName)}`,
  keywords, logo: 'DL', documentMatch: true, ...destination,
  redirectNote: 'This opens the matched DigiLocker document form. DigiLocker may require you to sign in before entering the document details.'
});

export const digilockerDocuments = [
  document('ap_ssc_marks_memo', 'AP SSC Class X Marksheet', 'Class X Marksheet from the Board of Secondary Education, Andhra Pradesh.', ['10th certificate ap', 'ap 10th certificate', 'andhra pradesh ssc', 'ap ssc marks memo', 'ap ssc marksheet', 'class 10 marksheet ap'], { state:'andhra pradesh', documentKind:'marksheet', issuerName:'Board Of Secondary Education, Andhra Pradesh', orgId:'005725', docTypeId:'SSCER' }),
  document('ap_open_school_passing_certificate', 'AP Open School Class X Passing Certificate', 'Class X passing certificate from the Andhra Pradesh Open School Society.', ['ap open school 10th certificate', 'andhra pradesh open school class 10 passing certificate'], { state:'andhra pradesh', documentKind:'passing', issuerName:'Andhra Pradesh Open School Society', orgId:'056345', docTypeId:'SPCER' }),
  document('class_x_marksheet', 'Class X Marksheet', 'Find a Class 10 board marksheet from a participating education issuer.', ['10th certificate', '10th marksheet', 'class 10 marksheet', 'class x marksheet', 'ssc marksheet', 'secondary marksheet']),
  document('class_x_passing_certificate', 'Class X Passing Certificate', 'Find a Class 10 passing certificate from a participating education issuer.', ['10th certificate', 'class 10 certificate', 'class x certificate', 'ssc certificate', 'passing certificate']),
  document('class_x_migration_certificate', 'Class X Migration Certificate', 'Find a Class 10 migration certificate from a participating education issuer.', ['10th migration certificate', 'class 10 migration', 'class x migration']),
  document('class_xii_marksheet', 'Class XII Marksheet', 'Find a Class 12 board marksheet from a participating education issuer.', ['12th marksheet', '12th certificate', 'class 12 marksheet', 'class xii marksheet', 'hsc marksheet']),
  document('class_xii_passing_certificate', 'Class XII Passing Certificate', 'Find a Class 12 passing certificate from a participating education issuer.', ['12th certificate', 'class 12 certificate', 'class xii certificate', 'hsc certificate']),
  document('degree_certificate', 'Degree Certificate', 'Find a university degree certificate from a participating institution.', ['degree certificate', 'graduation certificate', 'university degree']),
  document('university_marksheet', 'University Marksheet / Transcript', 'Find university marksheets or transcripts from a participating institution.', ['university marksheet', 'college marksheet', 'academic transcript', 'semester marksheet'])
];

const words = (value) => value.toLowerCase().replace(/\b10(?:th)?\b/g, 'class 10').replace(/\b12(?:th)?\b/g, 'class 12').replace(/marks?\s*card|marks?\s*sheet|marks?\s*memo/g, 'marksheet').replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((word) => word.length > 1);

export function findDigiLockerDocuments(query) {
  const queryWords = [...new Set(words(query))];
  if (!/(certificate|marksheet|mark\s*(?:sheet|card)|marks?\s*memo|transcript|degree|migration|ssc|hsc|class\s*(?:10|12)|10th|12th)/i.test(query)) return [];
  const requestedLevel = /(?:10th|class\s*10|ssc)/i.test(query) ? '10' : /(?:12th|class\s*12|hsc)/i.test(query) ? '12' : null;
  const requestedState = /\b(?:ap|andhra\s*pradesh)\b/i.test(query) ? 'andhra pradesh' : null;
  const requestedKind = /marks?\s*(?:card|sheet|memo)|marksheet/i.test(query) ? 'marksheet' : /passing/i.test(query) ? 'passing' : /migration/i.test(query) ? 'migration' : null;
  const minimumScore = requestedLevel ? 3 : 2;
  return digilockerDocuments.map((item) => {
    const score = Math.max(...[item.serviceName, ...item.keywords].map(words).map((phraseWords) => queryWords.reduce((total, word) => total + (phraseWords.includes(word) ? (word === 'ap' ? 3 : 1) : 0), 0)));
    return { item, score };
  }).filter(({ item, score }) => score >= minimumScore
      && (!requestedLevel || item.keywords.some((keyword) => words(keyword).includes(requestedLevel)))
      && (!requestedState || item.state === requestedState)
      && (!requestedKind || (item.documentKind || item.serviceName.toLowerCase()).includes(requestedKind)))
    .sort((a, b) => b.score - a.score).slice(0, 6).map(({ item }) => item);
}
