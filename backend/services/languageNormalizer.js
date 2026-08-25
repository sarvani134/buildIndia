// Roman-script language normalization. It adds English concepts without discarding the user's words.
// This is intentionally deterministic: it never produces service metadata, intents, or URLs.
const concepts = {
  // Common requests and actions across Indian languages
  'mujhe chahiye':'need', 'mujhe karna hai':'want apply', 'kaise karu':'how apply', 'kahan milega':'where find',
  'dekhna hai':'check', 'check karna':'check', 'pata karna':'check status', 'bharna hai':'file apply',
  'jama karna':'submit', 'badalna hai':'update change', 'shikayat karni':'file complaint', 'madad chahiye':'need help',
  'naaku kavali':'need', 'naaku kaavali':'need', 'cheyali':'apply do', 'ela cheyali':'how apply', 'chudali':'check',
  'choosukovali':'check', 'marchali':'update change', 'firyadu cheyali':'file complaint', 'dabbu kattali':'pay money',
  'nanage beku':'need', 'hege madodu':'how apply', 'madbeku':'apply do', 'nodbeku':'check', 'badalayisbeku':'update change',
  'duru kodbeku':'file complaint', 'hana kattbeku':'pay money', 'nanage sahaya':'need help',
  'mala pahije':'need', 'mala hava':'need', 'kasa karaycha':'how apply', 'baghaycha ahe':'check', 'tapasaicha ahe':'check status',
  'badalaycha ahe':'update change', 'takrar karaychi':'file complaint', 'paise bharayche':'pay money',
  'enikku venam':'need', 'engane cheyyum':'how apply', 'cheyyanam':'apply do', 'nokkanam':'check', 'maattanam':'update change',
  'parathi nalkanam':'file complaint', 'panam adakkanam':'pay money', 'sahayam venam':'need help',
  'enakku venum':'need', 'eppadi seiyanum':'how apply', 'seiyanum':'apply do', 'paakanum':'check', 'maathanum':'update change',
  'pugaar seiyanum':'file complaint', 'panam kattanum':'pay money', 'udhavi venum':'need help',
  'amar dorkar':'need', 'amar chai':'need', 'kibhabe korbo':'how apply', 'dekhte chai':'check', 'bodlate chai':'update change',
  'ovijog korte chai':'file complaint', 'taka dite chai':'pay money', 'sahajjo chai':'need help',
  'mane joie':'need', 'kevi rite karvu':'how apply', 'karvu che':'apply do', 'jovu che':'check', 'badalvu che':'update change',
  'fariyad karvi':'file complaint', 'paisa bharva':'pay money', 'madad joie':'need help',
  'mainu chahida':'need', 'kiven kara':'how apply', 'karna chaunda':'apply do', 'vekhna chaunda':'check', 'badalna chaunda':'update change',
  'shikayat karni':'file complaint', 'paise bharne':'pay money', 'madad chahidi':'need help',
  'mote darkar':'need', 'kemiti karibi':'how apply', 'karibaku chahen':'apply do', 'dekhibaku chahen':'check',
  'badalaibaku chahen':'update change', 'abhijog karibaku':'file complaint',

  // Certificates and identity
  'aay praman patra':'income certificate', 'aay certificate':'income certificate', 'utpanna dakhala':'income certificate',
  'utpannacha dakhala':'income certificate', 'varumana certificate':'income certificate', 'varumanam certificate':'income certificate',
  'aadaaya pramana patra':'income certificate', 'aadaya pramanapatra':'income certificate', 'ay sartifikat':'income certificate',
  'janam praman patra':'birth certificate', 'janma dakhala':'birth certificate', 'janana certificate':'birth certificate',
  'pirappu certificate':'birth certificate', 'janma pramana patra':'birth certificate', 'jonmo certificate':'birth certificate',
  'mrityu praman patra':'death certificate', 'mrutyu dakhala':'death certificate', 'marana certificate':'death certificate',
  'irappu certificate':'death certificate', 'jaati praman patra':'caste certificate', 'jaat praman patra':'caste certificate',
  'jati dakhala':'caste certificate', 'jaathi certificate':'caste certificate', 'saathi certificate':'caste certificate',
  'nivas praman patra':'domicile certificate', 'rahivasi dakhala':'domicile certificate', 'residence dakhala':'domicile certificate',
  'vivah praman patra':'marriage certificate', 'lagna dakhala':'marriage certificate', 'thirumana certificate':'marriage certificate',
  'pelli certificate':'marriage certificate', 'maduve certificate':'marriage certificate',
  'aadhaar ka pata':'aadhaar address', 'aadhaar pata badlo':'update aadhaar address', 'aadhaar address marchali':'update aadhaar address',
  'aadhaar vilasam maattanam':'update aadhaar address', 'aadhaar mugavari maathanum':'update aadhaar address',

  // Employment, money and pensions
  'naukri chahiye':'find job', 'kaam chahiye':'find job', 'udyogam kavali':'find job', 'kelasa beku':'find job',
  'nokri pahije':'find job', 'joli venam':'find job', 'velai venum':'find job', 'chakri chai':'find job',
  'nokri joie':'find job', 'naukri chahidi':'find job', 'chakiri darkar':'find job',
  'pf paisa':'pf balance', 'pf ka paisa':'pf balance', 'pf dabbu':'pf balance', 'pf hana':'pf balance',
  'pf paise':'pf balance', 'pf panam':'pf balance', 'pf amount paakanum':'pf balance',
  'pension nahi aayi':'pension not received', 'pension raledu':'pension not received', 'pension bandilla':'pension not received',
  'pension aali nahi':'pension not received', 'pension kittiyilla':'pension not received', 'pension varala':'pension not received',
  'pension aseni':'pension not received',

  // Transport and travel
  'gaadi ka licence':'driving licence', 'license renew karna':'renew driving licence', 'driving license navikaran':'renew driving licence',
  'licence renew cheyali':'renew driving licence', 'license renew madbeku':'renew driving licence', 'licence renew karaycha':'renew driving licence',
  'license puthukkanam':'renew driving licence', 'license pudupikkanum':'renew driving licence',
  'gaadi challan':'vehicle challan', 'bandi challan':'vehicle challan', 'vahana challan':'vehicle challan',
  'train ticket book karna':'book train', 'rail ticket chahiye':'book train', 'rail ticket kavali':'book train',
  'train ticket beku':'book train', 'railway ticket pahije':'book train', 'train ticket venam':'book train',
  'rayil ticket venum':'book train', 'train ticket chai':'book train', 'train ticket joie':'book train',

  // Common English and Indian-English ways of asking for the same action
  'train booking':'book train', 'rail booking':'book train', 'railway reservation':'book train', 'train reservation':'book train',
  'ticket reservation':'book train', 'check pnr':'pnr status', 'train timings':'train schedule',
  'gas cylinder booking':'gas booking', 'book cylinder':'gas booking', 'hospital booking':'hospital appointment',
  'pan application':'apply pan', 'passport application':'apply passport', 'voter registration':'register voter',
  'job vacancies':'find job', 'sarkari naukri':'government job', 'scheme eligibility':'government scheme eligibility',

  // Health, agriculture, utilities and complaints
  'doctor ko dikhana':'doctor appointment', 'aspatal appointment':'hospital appointment', 'doctor appointment kavali':'doctor appointment',
  'doctor appointment beku':'doctor appointment', 'doctor chi appointment':'doctor appointment', 'doctor appointment venam':'doctor appointment',
  'kisan yojana':'farmer scheme', 'rythu pathakam':'farmer scheme', 'raita yojane':'farmer scheme', 'shetkari yojana':'farmer scheme',
  'karshaka padhathi':'farmer scheme', 'vivasayi thittam':'farmer scheme', 'krishok prokolpo':'farmer scheme',
  'bijli bill':'electricity bill', 'current bill kattali':'pay electricity bill', 'current bill kattbeku':'pay electricity bill',
  'veej bill':'electricity bill', 'current bill adakkanam':'pay electricity bill', 'min bill kattanum':'pay electricity bill',
  'online dhokha':'online fraud', 'paisa scam':'financial fraud', 'online mosam':'online fraud', 'online vanchane':'online fraud',
  'online fasavnuk':'online fraud', 'online thattippu':'online fraud', 'online mosadi':'online fraud',
  'sarkari shikayat':'government complaint', 'prabhutva firyadu':'government complaint', 'sarkari takrar':'government complaint',
  'sarkara parathi':'government complaint', 'arasu pugaar':'government complaint', 'sarkari ovijog':'government complaint'
};

// Script terms map to the same canonical concepts as Roman-script phrases.
// They are intentionally intent vocabulary, not localized service records.
const nativeConcepts = {
  'आधार':'aadhaar', 'पता':'address', 'बदलना':'update', 'बदल':'update', 'पेंशन':'pension', 'स्टेटस':'status', 'चेक':'check', 'ड्राइविंग लाइसेंस':'driving licence',
  'ఆధార్':'aadhaar', 'చిరునామా':'address', 'మార్చ':'update', 'పెన్షన్':'pension', 'స్టేటస్':'status', 'చెక్':'check', 'చేయాలి':'check', 'డ్రైవింగ్ లైసెన్స్':'driving licence',
  'ஆதார்':'aadhaar', 'முகவரி':'address', 'மாற்ற':'update', 'ஓய்வூதிய':'pension', 'நிலை':'status', 'பார்க்க':'check', 'ஓட்டுநர் உரிமம்':'driving licence',
  'ಆಧಾರ್':'aadhaar', 'ವಿಳಾಸ':'address', 'ಬದಲಾಯ':'update', 'ಪಿಂಚಣಿ':'pension', 'ಸ್ಥಿತಿ':'status', 'ಪರಿಶೀಲ':'check', 'ಚಾಲನಾ ಪರವಾನಗಿ':'driving licence',
  'ആധാർ':'aadhaar', 'വിലാസം':'address', 'മാറ്റ':'update', 'പെൻഷൻ':'pension', 'നില':'status', 'പരിശോധ':'check', 'ഡ്രൈവിംഗ് ലൈസൻസ്':'driving licence',
  'आधार':'aadhaar', 'पत्ता':'address', 'बदलाय':'update', 'पेन्शन':'pension', 'स्थिती':'status', 'तपास':'check',
  'আধার':'aadhaar', 'ঠিকানা':'address', 'পরিবর্তন':'update', 'পেনশন':'pension', 'স্থিতি':'status', 'চেক':'check',
  'આધાર':'aadhaar', 'સરનામું':'address', 'બદલ':'update', 'પેન્શન':'pension', 'સ્થિતિ':'status', 'ચેક':'check',
  'ਆਧਾਰ':'aadhaar', 'ਪਤਾ':'address', 'ਬਦਲ':'update', 'ਪੈਨਸ਼ਨ':'pension', 'ਸਥਿਤੀ':'status', 'ਚੈੱਕ':'check',
  'ଆଧାର':'aadhaar', 'ଠିକଣା':'address', 'ପରିବର୍ତ୍ତନ':'update', 'ପେନସନ':'pension', 'ସ୍ଥିତି':'status', 'ଯାଞ୍ଚ':'check',
  'آدھار':'aadhaar', 'پتہ':'address', 'تبدیل':'update', 'پنشن':'pension', 'اسٹیٹس':'status', 'چیک':'check'
};

const fillerWords = new Set([
  'mujhe','mera','meri','mere','chahiye','karna','hai','ka','ki','ko','main','apna','dikhao','batao',
  'naaku','naa','kavali','kaavali','cheyali','ela','undi','undhi','kawali',
  'nanage','nanna','beku','hege','maadi','madbeku','ide',
  'mala','majha','majhi','pahije','hava','ahe','kasa','kara',
  'enikku','ente','venam','engane','cheyyanam','undo',
  'enakku','ennoda','venum','eppadi','pannanum','irukku',
  'amar','ami','chai','dorkar','kibhabe','korbo',
  'mane','maru','joie','kem','karvu','che',
  'mainu','mera','chahida','kiven','karna','aa',
  'mote','mora','darkar','kemiti','karibi'
]);

const entries = Object.entries({ ...concepts, ...nativeConcepts })
  .map(([phrase, english]) => [normalizeSearchText(phrase), english])
  .sort(([a],[b]) => b.length - a.length);

// Canonical entity aliases are shared by deterministic and provider-backed matching.
export function normalizeSearchText(input = '') {
  return input.toLowerCase()
    .replace(/\b(?:aadhaar|aadhar|adhaar|adhar)\b/g, 'aadhaar')
    .replace(/\b(?:pasport|passprt)\b/g, 'passport')
    .replace(/\b(?:licence|lisence|lisense)\b/g, 'license')
    .replace(/\b(?:pancard|pan-card)\b/g, 'pan card')
    .replace(/\b(?:rationcard|ration-card)\b/g, 'ration card')
    .replace(/\bdl\b/g, 'driving license')
    .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b(?:booking|bookings|booked|reservation|reservations|reserved)\b/g, 'book')
    .replace(/\b(?:applying|applied|application|applications)\b/g, 'apply')
    .replace(/\b(?:registration|registrations|registering|registered)\b/g, 'register')
    .replace(/\b(?:renewal|renewing|renewed)\b/g, 'renew')
    .replace(/\b(?:payments|payment|paying|paid)\b/g, 'pay')
    .replace(/\b(?:complaints|complaining|complain|grievances|grievance)\b/g, 'complaint')
    .replace(/\b(?:searching|searched|locate|looking)\b/g, 'find')
    .replace(/\b(?:downloads|downloading|downloaded)\b/g, 'download')
    .replace(/\b(?:tickets)\b/g, 'ticket')
    .replace(/\b(?:trains)\b/g, 'train')
    .replace(/\b(?:jobs|vacancies)\b/g, 'job')
    .replace(/\b(?:certificates)\b/g, 'certificate')
    .replace(/\b(?:timings)\b/g, 'time')
    .trim();
}

export function detectLanguage(input = '') {
  const scripts = [
    [/\p{Script=Devanagari}/u, 'hi'], [/\p{Script=Telugu}/u, 'te'], [/\p{Script=Tamil}/u, 'ta'],
    [/\p{Script=Kannada}/u, 'kn'], [/\p{Script=Malayalam}/u, 'ml'], [/\p{Script=Bengali}/u, 'bn'],
    [/\p{Script=Gujarati}/u, 'gu'], [/\p{Script=Gurmukhi}/u, 'pa'], [/\p{Script=Oriya}/u, 'or'], [/\p{Script=Arabic}/u, 'ur']
  ];
  return scripts.find(([pattern]) => pattern.test(input))?.[1] || 'en';
}

export function expandMultilingualQuery(input = '') {
  const original = normalizeSearchText(input);
  const additions = [];
  for (const [phrase, english] of entries) if (original.includes(phrase)) additions.push(english);
  const meaningful = original.split(' ').filter((word) => !fillerWords.has(word)).join(' ');
  return [...new Set([original, meaningful, ...additions].filter(Boolean))].join(' ');
}

