// IUM Programme Data — sourced from official IUM website (Nov 2026 fetch).
// Source pages:
//   Postgraduate:            https://www.ium.edu.mv/coursecategory/post-graduate-programmes
//   Undergraduate:           https://www.ium.edu.mv/coursecategory/undergraduate-programmes
//   Certificate & Diploma:   https://www.ium.edu.mv/coursecategory/certificate-and-diploma-programmes
//
// Each programme links to its official page at https://www.ium.edu.mv/course/{id}.
// Edit fields below as needed — fee/seats/durations marked “Contact admissions” are not exposed
// on the category pages and should be filled by the admissions team.

export const FACULTIES = [
  'Kulliyyah of Shariʿah and Law',
  'Kulliyyah of Education',
  'Kulliyyah of Economics and Management Studies',
  'Kulliyyah of Islamic Revealed Knowledge and Human Sciences',
  'Kulliyyah of Quran and Sunnah',
  'Kulliyyah of Arabic Language',
  'Centre for Continuing Education',
  'Centre for Postgraduate Studies'
]

export const CAMPUSES = ['Male’ Main Campus', 'Hulhumalé Campus', 'Online', 'Regional Centre']

// Helper to keep programme objects terse.
const make = (id, name, category, faculty, level, opts = {}) => ({
  id: `p-${id}`,
  programmeName: name,
  category,
  faculty,
  level,
  duration: opts.duration || defaultDuration(level),
  studyMode: opts.studyMode || 'Full-time',
  campus: opts.campus || 'Male’ Main Campus',
  intake: 'August 2026',
  intakeStatus: opts.intakeStatus || 'Open',
  fee: opts.fee || 'Contact admissions',
  seats: opts.seats ?? 30,
  description: opts.description || `${name} — offered by ${faculty}. Visit the official page for full syllabus and entry criteria.`,
  entryRequirements: opts.entryRequirements || defaultRequirements(level),
  keywords: opts.keywords || autoKeywords(name),
  interests: opts.interests || autoInterests(name, faculty),
  careerPaths: opts.careerPaths || autoCareers(name),
  skills: opts.skills || autoSkills(name),
  applyLink: 'https://www.ium.edu.mv/application-procedure',
  brochureLink: '',
  officialPageLink: `https://www.ium.edu.mv/course/${id}`,
  featured: !!opts.featured
})

function defaultDuration(level) {
  switch (level) {
    case 'PhD': return '3–5 years'
    case 'Master': return '1.5–2 years'
    case 'Bachelor': return '4 years'
    case 'Associate Degree': return '2 years'
    case 'Diploma': return '1–2 years'
    case 'Certificate': return '6–12 months'
    default: return 'Contact admissions'
  }
}
function defaultRequirements(level) {
  switch (level) {
    case 'PhD': return ['Master’s degree in a related field (min CGPA 3.0)', 'Research proposal', 'Interview']
    case 'Master': return ['Bachelor degree in a related field (min CGPA 2.5)', 'Interview']
    case 'Bachelor': return ['5 GCE/IGCSE O-Level passes incl. Dhivehi & Islam', '2 A-Level / HSC passes or Foundation']
    case 'Associate Degree': return ['3 GCE O-Level passes', 'Foundation or equivalent']
    case 'Diploma': return ['Foundation pass or 3 GCE O-Level passes', 'Interview']
    case 'Certificate': return ['Open entry', 'Basic literacy in English/Dhivehi']
    default: return ['Contact admissions']
  }
}
function autoKeywords(name) {
  return name.toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !['with','honours','of','and','the','in','for','from','to'].includes(w))
}
function autoInterests(name, faculty) {
  const n = name.toLowerCase()
  const interests = []
  if (/teach|education|pedagog|child/i.test(n)) interests.push('Teaching')
  if (/business|management|finance|account|bank|hr|economic|leadership/i.test(n)) interests.push('Business')
  if (/law|shari/i.test(n)) interests.push('Law')
  if (/quran|qira|hifz|hadith/i.test(n)) interests.push('Qur’an')
  if (/islam|aqidah|imaam|fiqh/i.test(n)) interests.push('Islamic Studies')
  if (/arabic|language|tesol|english/i.test(n)) interests.push('Arabic')
  if (/journal|media|communication/i.test(n)) interests.push('Communication')
  if (/governance|public|administration|policy/i.test(n)) interests.push('Project Management')
  if (/research|publication/i.test(n)) interests.push('Research')
  if (faculty.includes('Quran')) interests.push('Qur’an')
  if (faculty.includes('Education')) interests.push('Teaching')
  return [...new Set(interests)]
}
function autoCareers(name) {
  const n = name.toLowerCase()
  const c = []
  if (/teach|education|early childhood/i.test(n)) c.push('Teacher', 'Education Officer')
  if (/business|management|leadership/i.test(n)) c.push('Manager', 'Team Lead')
  if (/finance|account|bank/i.test(n)) c.push('Accountant', 'Banker', 'Financial Analyst')
  if (/law|shari/i.test(n)) c.push('Lawyer', 'Legal Advisor')
  if (/imaam/i.test(n)) c.push('Imaam', 'Mosque Officer')
  if (/quran|qira|hifz/i.test(n)) c.push('Quran Teacher', 'Reciter')
  if (/hadith|islam|aqidah|fiqh/i.test(n)) c.push('Islamic Scholar', 'Researcher', 'Lecturer')
  if (/arabic/i.test(n)) c.push('Arabic Teacher', 'Translator')
  if (/tesol|english/i.test(n)) c.push('English Teacher', 'Tutor')
  if (/journal|media/i.test(n)) c.push('Journalist', 'Media Producer')
  if (/hr|human resource/i.test(n)) c.push('HR Officer', 'People Manager')
  if (/governance|public administration|policy/i.test(n)) c.push('Civil Servant', 'Policy Officer')
  if (/research|publication/i.test(n)) c.push('Researcher', 'Lecturer')
  return c.length ? [...new Set(c)] : ['Graduate roles in related sector']
}
function autoSkills(name) {
  const n = name.toLowerCase()
  const s = []
  if (/teach|education/i.test(n)) s.push('Lesson planning', 'Classroom leadership')
  if (/management|leadership|business/i.test(n)) s.push('Strategy', 'Decision making')
  if (/finance|account|bank/i.test(n)) s.push('Financial analysis', 'Reporting')
  if (/law|shari|fiqh|judicial/i.test(n)) s.push('Legal reasoning', 'Research')
  if (/quran|qira|hifz/i.test(n)) s.push('Recitation', 'Tajweed', 'Memorization')
  if (/arabic|language|tesol|english/i.test(n)) s.push('Linguistic analysis', 'Communication')
  if (/research|publication/i.test(n)) s.push('Research methodology', 'Academic writing')
  if (/governance|public/i.test(n)) s.push('Policy analysis', 'Public communication')
  return s.length ? s : ['Critical thinking', 'Communication']
}

// Faculty mapper — picks the most relevant Kulliyyah from a programme name.
const F = {
  shariah: 'Kulliyyah of Shariʿah and Law',
  education: 'Kulliyyah of Education',
  econ: 'Kulliyyah of Economics and Management Studies',
  islamic: 'Kulliyyah of Islamic Revealed Knowledge and Human Sciences',
  quran: 'Kulliyyah of Quran and Sunnah',
  arabic: 'Kulliyyah of Arabic Language',
  cce: 'Centre for Continuing Education',
  pg: 'Centre for Postgraduate Studies'
}

// ─────────────────────────── POSTGRADUATE (29 entries from IUM site) ───────────────────────────
const POSTGRAD = [
  make(1,  'Master of Qiraʾath',                                                 'Postgraduate', F.quran,    'Master', { featured: true }),
  make(3,  'Master of Arts in Quranic Sciences',                                 'Postgraduate', F.quran,    'Master', { featured: true }),
  make(4,  'Master of Arts in Science of Hadith',                                'Postgraduate', F.islamic,  'Master'),
  make(10, 'Doctor of Philosophy in Fiqh and Usul-al-Fiqh',                      'Postgraduate', F.shariah,  'PhD'),
  make(11, 'Master of Fiqh and Usul-al-Fiqh',                                    'Postgraduate', F.shariah,  'Master'),
  make(12, 'Master of Islamic Revealed Knowledge, Leadership and Administration','Postgraduate', F.islamic,  'Master'),
  make(13, 'Master of Aqidah and Islamic Thoughts',                              'Postgraduate', F.islamic,  'Master'),
  make(14, 'Master of Arts in Journalism and Media Communications',              'Postgraduate', F.islamic,  'Master', { featured: true }),
  make(19, 'Doctor of Philosophy in Islamic Judicial Sciences and Legislative Policy', 'Postgraduate', F.shariah, 'PhD'),
  make(20, 'Master of Islamic Judicial Sciences and Shariʿah Policy',            'Postgraduate', F.shariah,  'Master'),
  make(21, 'Master of Comparative Laws',                                         'Postgraduate', F.shariah,  'Master'),
  make(27, 'Master of Arts in TESOL (Teaching English to Speakers of Other Languages)', 'Postgraduate', F.education, 'Master', { featured: true }),
  make(28, 'Master of Teaching and Learning',                                    'Postgraduate', F.education,'Master', { featured: true }),
  make(29, 'Master of Education in Leadership and Administration',               'Postgraduate', F.education,'Master'),
  make(31, 'Postgraduate Diploma in Teaching',                                   'Postgraduate', F.education,'Master', { duration: '1 year', studyMode: 'Part-time' }),
  make(48, 'Master of Arts in Arabic Linguistics',                               'Postgraduate', F.arabic,   'Master'),
  make(85, 'Master of Teaching and Learning — Islamic Education',                'Postgraduate', F.education,'Master'),
  make(86, 'Master of Teaching and Learning — Quran',                            'Postgraduate', F.education,'Master'),
  make(88, 'Master of Law (Comparative Jurisprudence)',                          'Postgraduate', F.shariah,  'Master'),
  make(94, 'Executive Masters in Islamic Finance (eMIF by INCEIF)',              'Postgraduate', F.econ,     'Master', { featured: true, studyMode: 'Part-time' }),
  make(95, 'Master of Business Management',                                      'Postgraduate', F.econ,     'Master', { featured: true }),
  make(96, 'Master of Public Administration and Governance',                     'Postgraduate', F.econ,     'Master'),
  make(99, 'Doctor of Philosophy in Education',                                  'Postgraduate', F.education,'PhD'),
  make(109,'Doctor of Philosophy in Management and Leadership',                  'Postgraduate', F.econ,     'PhD'),
  make(110,'Master in Research and Publications',                                'Postgraduate', F.pg,       'Master'),
  make(111,'Master of Teaching and Learning in Higher Education',                'Postgraduate', F.education,'Master')
]

// ─────────────────────────── UNDERGRADUATE (15 entries from IUM site) ───────────────────────────
const UNDERGRAD = [
  make(5,   'Bachelor of Quranic Studies',                          'Undergraduate', F.quran,    'Bachelor', { featured: true }),
  make(15,  'Bachelor of Islamic Studies',                          'Undergraduate', F.islamic,  'Bachelor', { featured: true }),
  make(16,  'Bachelor of Imaamship',                                'Undergraduate', F.quran,    'Bachelor'),
  make(24,  'Bachelor of Shariʿah and Law with Honours',            'Undergraduate', F.shariah,  'Bachelor', { featured: true, duration: '4 years' }),
  make(32,  'Bachelor of Teaching Quran',                           'Undergraduate', F.education,'Bachelor'),
  make(33,  'Bachelor of Teaching Islamic Studies',                 'Undergraduate', F.education,'Bachelor'),
  make(34,  'Bachelor of Teaching Arabic Language',                 'Undergraduate', F.education,'Bachelor'),
  make(35,  'Bachelor of Education (Primary)',                      'Undergraduate', F.education,'Bachelor', { featured: true }),
  make(36,  'Bachelor of Early Childhood Education',                'Undergraduate', F.education,'Bachelor'),
  make(58,  'Bachelor of Accounting and Finance',                   'Undergraduate', F.econ,     'Bachelor', { featured: true }),
  make(89,  'Bachelor of Human Resource Management',                'Undergraduate', F.econ,     'Bachelor'),
  make(90,  'Bachelor of Islamic Banking and Finance',              'Undergraduate', F.econ,     'Bachelor', { featured: true }),
  make(91,  'Bachelors in Local Governance and Administration',     'Undergraduate', F.econ,     'Bachelor'),
  make(106, 'Bachelor of Shariʿah and Law',                         'Undergraduate', F.shariah,  'Bachelor'),
  make(108, 'Bachelor of Arts in Arabic Language',                  'Undergraduate', F.arabic,   'Bachelor')
]

// ─────────────────────────── CERTIFICATE & DIPLOMA (from IUM site) ───────────────────────────
const CERT_DIP = [
  make(6,   'Advanced Certificate in Quran Memorization',                  'Certificate & Diploma', F.quran,    'Certificate'),
  make(7,   'Certificate 3 in Quran Memorization',                         'Certificate & Diploma', F.quran,    'Certificate'),
  make(8,   'Certificate 2 in Quran Memorization',                         'Certificate & Diploma', F.quran,    'Certificate'),
  make(9,   'Certificate 1 in Quran Memorization',                         'Certificate & Diploma', F.quran,    'Certificate'),
  make(17,  'Associate Degree of Imaamship',                               'Certificate & Diploma', F.quran,    'Associate Degree'),
  make(18,  'Diploma of Imaamship',                                        'Certificate & Diploma', F.quran,    'Diploma'),
  make(25,  'Associate Degree in Shariʿah and Law',                        'Certificate & Diploma', F.shariah,  'Associate Degree'),
  make(26,  'Diploma in Shariʿah and Law',                                 'Certificate & Diploma', F.shariah,  'Diploma'),
  make(37,  'Associate Degree in Teaching Quran',                          'Certificate & Diploma', F.education,'Associate Degree'),
  make(38,  'Associate Degree in Teaching Islamic Studies',                'Certificate & Diploma', F.education,'Associate Degree'),
  make(39,  'Associate Degree in Teaching Arabic Language',                'Certificate & Diploma', F.education,'Associate Degree'),
  make(40,  'Associate Degree in Education (Primary)',                     'Certificate & Diploma', F.education,'Associate Degree', { featured: true }),
  make(41,  'Diploma in Early Childhood Education',                        'Certificate & Diploma', F.education,'Diploma'),
  make(42,  'Diploma in Teaching Arabic Language',                         'Certificate & Diploma', F.education,'Diploma'),
  make(43,  'Diploma in Teaching Islamic Studies',                         'Certificate & Diploma', F.education,'Diploma'),
  make(44,  'Diploma in Teaching Quran',                                   'Certificate & Diploma', F.education,'Diploma'),
  make(45,  'Diploma in Arabic Language for Diplomacy',                    'Certificate & Diploma', F.arabic,   'Diploma'),
  make(46,  'Diploma in Arabic Language for Business and Marketing',       'Certificate & Diploma', F.arabic,   'Diploma'),
  make(47,  'Diploma in Arabic Language for Journalism and Media',         'Certificate & Diploma', F.arabic,   'Diploma'),
  make(49,  'Diploma in Arabic Language for Islamic Studies',              'Certificate & Diploma', F.arabic,   'Diploma'),
  make(50,  'Diploma in Arabic Language for Hospitality and Tourism',      'Certificate & Diploma', F.arabic,   'Diploma'),
  make(51,  'Diploma in Arabic Language',                                  'Certificate & Diploma', F.arabic,   'Diploma'),
  make(52,  'Advanced Certificate in Arabic Language',                     'Certificate & Diploma', F.arabic,   'Certificate'),
  make(53,  'Certificate 3 in Arabic Language',                            'Certificate & Diploma', F.arabic,   'Certificate'),
  make(54,  'Certificate 2 in Arabic Language',                            'Certificate & Diploma', F.arabic,   'Certificate'),
  make(55,  'Certificate 1 in Arabic Language',                            'Certificate & Diploma', F.arabic,   'Certificate'),
  make(56,  'Certificate 1 in Arabic for Travel and Tourism',              'Certificate & Diploma', F.arabic,   'Certificate'),
  make(61,  'Advance Diploma in Public Financial Management',              'Certificate & Diploma', F.econ,     'Diploma', { featured: true }),
  make(62,  'Associate Degree in Human Resources Management',              'Certificate & Diploma', F.econ,     'Associate Degree'),
  make(64,  'Diploma in Islamic Banking and Finance',                      'Certificate & Diploma', F.econ,     'Diploma'),
  make(66,  'Diploma in Accounting and Finance',                           'Certificate & Diploma', F.econ,     'Diploma'),
  make(67,  'Diploma in Human Resources Management',                       'Certificate & Diploma', F.econ,     'Diploma'),
  make(70,  'Advanced Certificate in Shariʿah and Law',                    'Certificate & Diploma', F.shariah,  'Certificate'),
  make(71,  'Advanced Certificate in Teaching',                            'Certificate & Diploma', F.education,'Certificate'),
  make(72,  'Advanced Certificate in Quranic Studies',                     'Certificate & Diploma', F.quran,    'Certificate'),
  make(73,  'Advanced Certificate for Imaamship',                          'Certificate & Diploma', F.quran,    'Certificate'),
  make(74,  'Advanced Certificate in Business Management',                 'Certificate & Diploma', F.econ,     'Certificate', { featured: true }),
  make(75,  'Advanced Certificate in English for Travel and Tourism',      'Certificate & Diploma', F.cce,      'Certificate'),
  make(76,  'Certificate 3 in Qiraʾath al-Quran',                          'Certificate & Diploma', F.quran,    'Certificate'),
  make(77,  'Certificate 2 in Qiraʾath al-Quran',                          'Certificate & Diploma', F.quran,    'Certificate'),
  make(78,  'Certificate 1 in Qiraʾath al-Quran',                          'Certificate & Diploma', F.quran,    'Certificate'),
  make(79,  'Certificate 3 for Imaams',                                    'Certificate & Diploma', F.quran,    'Certificate'),
  make(80,  'Certificate 3 in English for General Purpose',                'Certificate & Diploma', F.cce,      'Certificate'),
  make(81,  'Certificate 2 in English for General Purpose',                'Certificate & Diploma', F.cce,      'Certificate'),
  make(82,  'Certificate 1 in English for General Purpose',                'Certificate & Diploma', F.cce,      'Certificate'),
  make(83,  'Certificate 1 in Basic English',                              'Certificate & Diploma', F.cce,      'Certificate'),
  make(84,  'Vaahaka Dhehkumuge Hunaruverikan Dhaskohdhey Course Level 1', 'Certificate & Diploma', F.cce,      'Certificate', { duration: 'Short course' }),
  make(92,  'Diploma in Local Governance and Administration',              'Certificate & Diploma', F.econ,     'Diploma'),
  make(93,  'Associate Degree in Local Governance and Administration',     'Certificate & Diploma', F.econ,     'Associate Degree'),
  make(101, 'Quran Hifz Kurumuge Course',                                  'Certificate & Diploma', F.quran,    'Certificate', { duration: 'Open ended' }),
  make(105, 'Certificate 3 in Janaza',                                     'Certificate & Diploma', F.quran,    'Certificate'),
  make(112, 'Diploma in Teaching — Special Education Needs',               'Certificate & Diploma', F.education,'Diploma', { featured: true })
]

export const PROGRAMMES = [...POSTGRAD, ...UNDERGRAD, ...CERT_DIP]

export const INTEREST_CHIPS = [
  'Teaching', 'Business', 'IT', 'Law', 'Qur’an', 'Arabic', 'Psychology', 'Health', 'Project Management'
]
