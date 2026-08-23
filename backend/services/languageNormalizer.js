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

const entries = Object.entries(concepts).sort(([a],[b]) => b.length - a.length);

export function expandMultilingualQuery(input = '') {
  const original = input.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
  const additions = [];
  for (const [phrase, english] of entries) if (original.includes(phrase)) additions.push(english);
  const meaningful = original.split(' ').filter((word) => !fillerWords.has(word)).join(' ');
  return [...new Set([original, meaningful, ...additions].filter(Boolean))].join(' ');
}

