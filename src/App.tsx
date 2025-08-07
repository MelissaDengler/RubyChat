import { useState, useRef, useEffect } from 'react';
import { Send, Plus, Menu, Settings, Download, Search, Copy, Trash2, Globe, BookOpen, Calculator, Microscope, Languages, Star, ArrowLeft } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
  isFavorite: boolean;
}

const SOUTH_AFRICAN_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'af', name: 'Afrikaans', native: 'Afrikaans' },
  { code: 'zu', name: 'isiZulu', native: 'isiZulu' },
  { code: 'xh', name: 'isiXhosa', native: 'isiXhosa' },
  { code: 'st', name: 'Sesotho', native: 'Sesotho' },
  { code: 'nso', name: 'Sepedi', native: 'Sepedi' },
  { code: 'tn', name: 'Setswana', native: 'Setswana' },
  { code: 'ss', name: 'siSwati', native: 'siSwati' },
  { code: 've', name: 'Tshivenda', native: 'Tshivenda' },
  { code: 'ts', name: 'Xitsonga', native: 'Xitsonga' },
  { code: 'nr', name: 'isiNdebele', native: 'isiNdebele' }
];

// Translation data for South African languages
const TRANSLATIONS = {
  en: {
    // Navigation & UI
    newChat: 'New Chat',
    settings: 'Settings',
    export: 'Export',
    search: 'Search conversations...',
    favorites: 'Favorites',
    home: 'Home',
    
    // Ruby Introduction
    hiRuby: "Hi! I'm Ruby",
    rubyDescription: "Your AI tutor for Grades 8-12. I'm here to help you excel in all subjects with personalized support in any of South Africa's 11 official languages.",
    
    // Grades & Subjects
    grade: 'Grade',
    subjects: 'Subjects',
    chooseSubject: 'Choose a subject to access past 5 years of exam papers for download',
    examPapers: 'Exam Papers',
    downloadPapers: 'Download past exam papers (2019-2023) to practice and prepare',
    pastPapersAvailable: 'Past Papers Available',
    downloadPdf: 'Download PDF',
    pages: 'pages',
    
    // Subjects
    mathematics: 'Mathematics',
    english: 'English',
    sciences: 'Sciences',
    languages: 'Languages',
    
    // Education Phases
    seniorPhase: 'Senior Phase',
    fetPhase: 'FET Phase',
    matricYear: 'Matric Year',
    
    // Chat
    askRuby: 'Ask Ruby anything in',
    rubyHelp: 'Ruby can help with homework, explain concepts, and provide study support for Grades 8-12',
    
    // Other
    you: 'You'
  },
  af: {
    // Navigation & UI
    newChat: 'Nuwe Gesprek',
    settings: 'Instellings',
    export: 'Uitvoer',
    search: 'Soek gesprekke...',
    favorites: 'Gunstelinge',
    home: 'Tuis',
    
    // Ruby Introduction
    hiRuby: "Hallo! Ek is Ruby",
    rubyDescription: "Jou KI-tutor vir Graad 8-12. Ek is hier om jou te help uitblink in alle vakke met persoonlike ondersteuning in enige van Suid-Afrika se 11 amptelike tale.",
    
    // Grades & Subjects
    grade: 'Graad',
    subjects: 'Vakke',
    chooseSubject: 'Kies \'n vak om toegang te kry tot die afgelope 5 jaar se eksamenvraestelle vir aflaai',
    examPapers: 'Eksamenvraestelle',
    downloadPapers: 'Laai afgelope eksamenvraestelle (2019-2023) af om te oefen en voor te berei',
    pastPapersAvailable: 'Ou Vraestelle Beskikbaar',
    downloadPdf: 'Laai PDF Af',
    pages: 'bladsye',
    
    // Subjects
    mathematics: 'Wiskunde',
    english: 'Engels',
    sciences: 'Wetenskappe',
    languages: 'Tale',
    
    // Education Phases
    seniorPhase: 'Senior Fase',
    fetPhase: 'VOO Fase',
    matricYear: 'Matriek Jaar',
    
    // Chat
    askRuby: 'Vra Ruby enigiets in',
    rubyHelp: 'Ruby kan help met huiswerk, konsepte verduidelik en studieondersteuning bied vir Graad 8-12',
    
    // Other
    you: 'Jy'
  },
  zu: {
    // Navigation & UI
    newChat: 'Ingxoxo Entsha',
    settings: 'Izilungiselelo',
    export: 'Khipha',
    search: 'Sesha izingxoxo...',
    favorites: 'Izintandokazi',
    home: 'Ikhaya',
    
    // Ruby Introduction
    hiRuby: "Sawubona! NginguRuby",
    rubyDescription: "Uthisha wakho we-AI wamabanga 8-12. Ngilapha ukusiza ukuthi uphumelele kuzo zonke izifundo ngosekelo lomuntu siqu kunoma yiluphi ulimi lwaseMzansi Afrika oluyishumi nanye olugunyaziwe.",
    
    // Grades & Subjects
    grade: 'Ibanga',
    subjects: 'Izifundo',
    chooseSubject: 'Khetha isifundo ukuze uthole amaphepha okuhlolwa eminyakeni emi-5 edlule',
    examPapers: 'Amaphepha Okuhlolwa',
    downloadPapers: 'Landa amaphepha okuhlolwa adlule (2019-2023) ukuzijwayeza nokuzilungiselela',
    pastPapersAvailable: 'Amaphepha Adlule Atholakalayo',
    downloadPdf: 'Landa i-PDF',
    pages: 'amakhasi',
    
    // Subjects
    mathematics: 'Izibalo',
    english: 'IsiNgisi',
    sciences: 'Isayensi',
    languages: 'Izilimi',
    
    // Education Phases
    seniorPhase: 'Isigaba Esiphakeme',
    fetPhase: 'Isigaba se-FET',
    matricYear: 'Unyaka we-Matric',
    
    // Chat
    askRuby: 'Buza uRuby noma yini nge',
    rubyHelp: 'URuby angakusiza ngemisebenzi yasekhaya, achaze imiqondo, futhi anikeze usekelo lwezifundo zamabanga 8-12',
    
    // Other
    you: 'Wena'
  },
  xh: {
    // Navigation & UI
    newChat: 'Incoko Entsha',
    settings: 'Iisetingi',
    export: 'Khupha',
    search: 'Khangela iincoko...',
    favorites: 'Ezithandwayo',
    home: 'Ekhaya',
    
    // Ruby Introduction
    hiRuby: "Molo! NdinguRuby",
    rubyDescription: "Utitshala wakho we-AI wamabanga 8-12. Ndilapha ukukunceda uphumelele kuzo zonke izifundo ngenkxaso yomntu ngamnye nakweyiphi na yeelwimi ezili-11 ezisemthethweni zaseMzantsi Afrika.",
    
    // Grades & Subjects
    grade: 'Ibanga',
    subjects: 'Izifundo',
    chooseSubject: 'Khetha isifundo ukuze ufumane amaphepha ovavanyo eminyakeni emi-5 edlulileyo',
    examPapers: 'Amaphepha Ovavanyo',
    downloadPapers: 'Khuphela amaphepha ovavanyo adlulileyo (2019-2023) ukuze uziqhelise kwaye ulungiselele',
    pastPapersAvailable: 'Amaphepha Adlulileyo Afumanekayo',
    downloadPdf: 'Khuphela i-PDF',
    pages: 'amaphepha',
    
    // Subjects
    mathematics: 'IiMathematics',
    english: 'IsiNgesi',
    sciences: 'IiNzululwazi',
    languages: 'IiLwimi',
    
    // Education Phases
    seniorPhase: 'Inqanaba Eliphezulu',
    fetPhase: 'Inqanaba le-FET',
    matricYear: 'Unyaka we-Matric',
    
    // Chat
    askRuby: 'Buza uRuby nantoni na nge',
    rubyHelp: 'URuby angakunceda ngemisebenzi yasekhaya, acacise iingcamango, kwaye anike inkxaso yokufunda yamabanga 8-12',
    
    // Other
    you: 'Wena'
  },
  nso: {
    // Navigation & UI
    newChat: 'Poledišano ye Mpsha',
    settings: 'Dipeakanyo',
    export: 'Tšweletša',
    search: 'Nyaka dipoledišano...',
    favorites: 'Tše di ratiwago',
    home: 'Gae',
    
    // Ruby Introduction
    hiRuby: "Dumela! Ke Ruby",
    rubyDescription: "Morutiši wa gago wa AI wa mephato ya 8-12. Ke mo go thušang gore o atlege ditheong tšohle ka thekgo ya motho ka noši polelong efe goba efe ya dipolelo tše 11 tša semmušo tša Afrika Borwa.",
    
    // Grades & Subjects
    grade: 'Mophato',
    subjects: 'Ditheto',
    chooseSubject: 'Kgetha theto go hwetša maphepha a diteko a mengwaga ye 5 ye e fetilego',
    examPapers: 'Maphepha a Diteko',
    downloadPapers: 'Laolla maphepha a diteko a fetilego (2019-2023) go itlwaetša le go itokišetša',
    pastPapersAvailable: 'Maphepha a Fetilego a Hwetšagala',
    downloadPdf: 'Laolla PDF',
    pages: 'matlakala',
    
    // Subjects
    mathematics: 'Dipalo',
    english: 'Seisemane',
    sciences: 'Disaense',
    languages: 'Dipolelo',
    
    // Education Phases
    seniorPhase: 'Kgato ya Godimo',
    fetPhase: 'Kgato ya FET',
    matricYear: 'Ngwaga wa Matric',
    
    // Chat
    askRuby: 'Botšiša Ruby sengwe le sengwe ka',
    rubyHelp: 'Ruby a ka go thuša ka mešomo ya gae, a hlaloše dikgopolo, gomme a fe thekgo ya thuto ya mephato ya 8-12',
    
    // Other
    you: 'Wena'
  },
  tn: {
    // Navigation & UI
    newChat: 'Puisano e Ncha',
    settings: 'Dithulaganyo',
    export: 'Ntsha',
    search: 'Batla dipuisano...',
    favorites: 'Tse di ratiwang',
    home: 'Gae',
    
    // Ruby Introduction
    hiRuby: "Dumela! Ke Ruby",
    rubyDescription: "Morutabana wa gago wa AI wa mekgahlelo ya 8-12. Ke mo go go thusang gore o atlege mo dithutong tsotlhe ka tshegetso ya motho mongwe le mongwe mo polelong epe fela ya dipolelo tse 11 tsa semolao tsa Aforika Borwa.",
    
    // Grades & Subjects
    grade: 'Mekgahlelo',
    subjects: 'Dithuto',
    chooseSubject: 'Tlhopha thuto go bona maphepha a ditlhatlhobo a dingwaga tse 5 tse di fetileng',
    examPapers: 'Maphepha a Ditlhatlhobo',
    downloadPapers: 'Laolla maphepha a ditlhatlhobo a fetileng (2019-2023) go itlwaetsa le go ipaakanyetsa',
    pastPapersAvailable: 'Maphepha a Fetileng a Bonalang',
    downloadPdf: 'Laolla PDF',
    pages: 'matlakala',
    
    // Subjects
    mathematics: 'Dipalo',
    english: 'Sekgowa',
    sciences: 'Saense',
    languages: 'Dipolelo',
    
    // Education Phases
    seniorPhase: 'Kgato e Kgolo',
    fetPhase: 'Kgato ya FET',
    matricYear: 'Ngwaga wa Matric',
    
    // Chat
    askRuby: 'Botsa Ruby sengwe le sengwe ka',
    rubyHelp: 'Ruby a ka go thusa ka ditiro tsa gae, a tlhalosa dikgopolo, le go neela tshegetso ya thuto ya mekgahlelo ya 8-12',
    
    // Other
    you: 'Wena'
  },
  st: {
    // Navigation & UI
    newChat: 'Puisano e Ncha',
    settings: 'Litokiso',
    export: 'Ntsha',
    search: 'Batla lipuisano...',
    favorites: 'Tse ratoang',
    home: 'Lapeng',
    
    // Ruby Introduction
    hiRuby: "Dumela! Ke Ruby",
    rubyDescription: "Morutisi wa hao wa AI wa dikereiti tsa 8-12. Ke mona ho o thusa hore o atlehe lithutong tsohle ka tšehetso ea motho ka mong polelong efe kapa efe ea maleme a 11 a molao a Afrika Borwa.",
    
    // Grades & Subjects
    grade: 'Kereiti',
    subjects: 'Lithuto',
    chooseSubject: 'Khetha thuto ho fumana maqephe a liteko tsa lilemo tse 5 tse fetileng',
    examPapers: 'Maqephe a Liteko',
    downloadPapers: 'Jarolla maqephe a liteko tse fetileng (2019-2023) ho ikoetlisa le ho ipokella',
    pastPapersAvailable: 'Maqephe a Fetileng a Fumanehang',
    downloadPdf: 'Jarolla PDF',
    pages: 'maqephe',
    
    // Subjects
    mathematics: 'Lipalo',
    english: 'Senyesemane',
    sciences: 'Saense',
    languages: 'Maleme',
    
    // Education Phases
    seniorPhase: 'Mohato o Moholo',
    fetPhase: 'Mohato oa FET',
    matricYear: 'Selemo sa Matric',
    
    // Chat
    askRuby: 'Botsa Ruby ntho efe kapa efe ka',
    rubyHelp: 'Ruby a ka o thusa ka mesebetsi ea lapeng, a hlalosa maikutlo, le ho fana ka tšehetso ea thuto ea dikereiti tsa 8-12',
    
    // Other
    you: 'Uena'
  },
  ss: {
    // Navigation & UI
    newChat: 'Inkhulumisano Lentsha',
    settings: 'Tinhlamulo',
    export: 'Khupha',
    search: 'Funa tinkhulumisano...',
    favorites: 'Letitandvwako',
    home: 'Ekhaya',
    
    // Ruby Introduction
    hiRuby: "Sawubona! NginguRuby",
    rubyDescription: "Umfundvisi wakho we-AI wemabanga la-8-12. Ngilapha kukusita kutsi uphumelele kutonkhe tifundvo ngekusekela komuntfu ngamunye kunoma yiluphi lulwimi lwetinhlanu netishumi nanye tetemtsetfo taseNingizimu Afrika.",
    
    // Grades & Subjects
    grade: 'Libanga',
    subjects: 'Tifundvo',
    chooseSubject: 'Khetsa sifundvo kutsi utfole emaphepha etinhlolo teminyaka le-5 ledlule',
    examPapers: 'Emaphepha Etinhlolo',
    downloadPapers: 'Layisha emaphepha etinhlolo ladlule (2019-2023) kutsi uticecetje futsi utilungiselele',
    pastPapersAvailable: 'Emaphepha Ladlule Latfolakala',
    downloadPdf: 'Layisha i-PDF',
    pages: 'emakhasi',
    
    // Subjects
    mathematics: 'Tibalo',
    english: 'SiNgisi',
    sciences: 'Sayensi',
    languages: 'Tilwimi',
    
    // Education Phases
    seniorPhase: 'Sigaba Lesiphakeme',
    fetPhase: 'Sigaba se-FET',
    matricYear: 'Umnyaka we-Matric',
    
    // Chat
    askRuby: 'Butsa uRuby noma yini nge',
    rubyHelp: 'URuby angakusita ngemisebenti yasekhaya, achaze imibono, futsi anikete lusekelo lwekufundza kwemabanga la-8-12',
    
    // Other
    you: 'Wena'
  },
  ve: {
    // Navigation & UI
    newChat: 'Nyamubvudzano Muswa',
    settings: 'Zwithulukanyo',
    export: 'Bvisa',
    search: 'Todani nyamubvudzano...',
    favorites: 'Zwo funwaho',
    home: 'Hayani',
    
    // Ruby Introduction
    hiRuby: "Ndaa! Ndi Ruby",
    rubyDescription: "Mudzulapo wanu wa AI wa gireidzi dza 8-12. Ndi hone u ni thusa uri ni kone zwikolodo zwothe nga thuso ya munwe na munwe kha luambo lufhio na lufhio lwa nyambo dzi 11 dza mulayo dza Afurika Tshipembe.",
    
    // Grades & Subjects
    grade: 'Gireidzi',
    subjects: 'Zwikolodo',
    chooseSubject: 'Nangani tshikolodo u wana mabugu a mulingo wa minwaha i 5 yo fhelaho',
    examPapers: 'Mabugu a Mulingo',
    downloadPapers: 'Kanzhelani mabugu a mulingo a fhelaho (2019-2023) u kone u guda na u lugiselelwa',
    pastPapersAvailable: 'Mabugu a Fhelaho a Wanaleaho',
    downloadPdf: 'Kanzhela PDF',
    pages: 'makhasi',
    
    // Subjects
    mathematics: 'Mbalombalo',
    english: 'Tshiisimane',
    sciences: 'Sayensi',
    languages: 'Nyambo',
    
    // Education Phases
    seniorPhase: 'Tshigaba tsha Ntha',
    fetPhase: 'Tshigaba tsha FET',
    matricYear: 'Nwaha wa Matric',
    
    // Chat
    askRuby: 'Vhudzani Ruby tshithu tshifhio na tshifhio nga',
    rubyHelp: 'Ruby a nga ni thusa nga mishumo ya hayani, a talutshedzeni mihumbulo, na u ni nea thuso ya u guda ha gireidzi dza 8-12',
    
    // Other
    you: 'Inwi'
  },
  ts: {
    // Navigation & UI
    newChat: 'Vulavurisano Bya Ntswa',
    settings: 'Swikongomiso',
    export: 'Humesa',
    search: 'Lava tivulavurisano...',
    favorites: 'Leswi rhandiwako',
    home: 'Ekaya',
    
    // Ruby Introduction
    hiRuby: "Xewani! I Ruby",
    rubyDescription: "Mudyondzisi wa n'wina wa AI wa swiyenge swa 8-12. Ndzi laha ku n'wina pfuna leswaku mi hluvuka eka swifundo hinkwaswo hi nseketelo wa munhu hi wun'we eka ririmi rihi na rihi ra tinhlayo-nkume na yin'we ta nawu ta Afrika Dzonga.",
    
    // Grades & Subjects
    grade: 'Xiyenge',
    subjects: 'Swifundo',
    chooseSubject: 'Hlawula xifundo ku kuma maphepha ya swikambelo swa malembe ya 5 lama hundzeke',
    examPapers: 'Maphepha ya Swikambelo',
    downloadPapers: 'Dawuniloda maphepha ya swikambelo lama hundzeke (2019-2023) ku tlhariha na ku tirhisela',
    pastPapersAvailable: 'Maphepha Lama Hundzeke Lama Kumekaka',
    downloadPdf: 'Dawuniloda PDF',
    pages: 'matluka',
    
    // Subjects
    mathematics: 'Tinhlayo',
    english: 'Xinghezi',
    sciences: 'Sayense',
    languages: 'Tindzimi',
    
    // Education Phases
    seniorPhase: 'Xiteji xa Le Henhla',
    fetPhase: 'Xiteji xa FET',
    matricYear: 'Lembe ra Matric',
    
    // Chat
    askRuby: 'Vutisa Ruby nchumu wo biha hi',
    rubyHelp: 'Ruby a nga mi pfuna hi ntirho wa le kaya, a hlamusela miehleketo, na ku nyika nseketelo wa dyondzo wa swiyenge swa 8-12',
    
    // Other
    you: 'N\'wina'
  },
  nr: {
    // Navigation & UI
    newChat: 'Inkulumo Entsha',
    settings: 'Izilungiselelo',
    export: 'Khupha',
    search: 'Funa izinkulumo...',
    favorites: 'Ezithandwayo',
    home: 'Ekhaya',
    
    // Ruby Introduction
    hiRuby: "Lotjhani! NginguRuby",
    rubyDescription: "Umfundisi wakho we-AI wamabanga 8-12. Ngilapha ukukusiza ukuthi uphumelele kuzo zonke izifundo ngosekelo lomuntu ngamunye kunoma yiluphi ulimi lwezilimi ezili-11 ezisemthethweni zaseNingizimu Afrika.",
    
    // Grades & Subjects
    grade: 'Ibanga',
    subjects: 'Izifundo',
    chooseSubject: 'Khetha isifundo ukuze uthole amaphepha okuhlolwa eminyakeni emi-5 edlule',
    examPapers: 'Amaphepha Okuhlolwa',
    downloadPapers: 'Landa amaphepha okuhlolwa adlule (2019-2023) ukuzijwayeza nokuzilungiselela',
    pastPapersAvailable: 'Amaphepha Adlule Atholakalayo',
    downloadPdf: 'Landa i-PDF',
    pages: 'amakhasi',
    
    // Subjects
    mathematics: 'Izibalo',
    english: 'IsiNgisi',
    sciences: 'Isayensi',
    languages: 'Izilimi',
    
    // Education Phases
    seniorPhase: 'Isigaba Esiphakeme',
    fetPhase: 'Isigaba se-FET',
    matricYear: 'Unyaka we-Matric',
    
    // Chat
    askRuby: 'Buza uRuby noma yini nge',
    rubyHelp: 'URuby angakusiza ngemisebenzi yasekhaya, achaze imiqondo, futhi anikeze usekelo lwezifundo zamabanga 8-12',
    
    // Other
    you: 'Wena'
  }
} as const;

const GRADE_LEVELS = [
  { grade: 8, label: "Grade 8", description: "Senior Phase" },
  { grade: 9, label: "Grade 9", description: "Senior Phase" },
  { grade: 10, label: "Grade 10", description: "FET Phase" },
  { grade: 11, label: "Grade 11", description: "FET Phase" },
  { grade: 12, label: "Grade 12", description: "Matric Year" }
];

const GRADE_SUBJECTS = {
  8: ['Mathematics', 'English', 'Natural Sciences', 'Social Sciences', 'Afrikaans', 'Technology', 'Arts and Culture', 'Life Orientation'],
  9: ['Mathematics', 'English', 'Natural Sciences', 'Social Sciences', 'Afrikaans', 'Technology', 'Arts and Culture', 'Life Orientation'],
  10: ['Mathematics', 'English', 'Physical Sciences', 'Life Sciences', 'History', 'Geography', 'Afrikaans', 'Business Studies', 'Economics', 'Life Orientation'],
  11: ['Mathematics', 'English', 'Physical Sciences', 'Life Sciences', 'History', 'Geography', 'Afrikaans', 'Business Studies', 'Economics', 'Accounting', 'Life Orientation'],
  12: ['Mathematics', 'English', 'Physical Sciences', 'Life Sciences', 'History', 'Geography', 'Afrikaans', 'Business Studies', 'Economics', 'Accounting', 'Life Orientation']
};

// Mock exam papers with downloadable PDFs
const generateExamPapers = (grade: number, subject: string) => {
  const years = [2023, 2022, 2021, 2020, 2019];
  const suffix = grade === 12 ? ' - NSC' : '';
  
  return years.map(year => ({
    year,
    title: `Grade ${grade} ${subject} Final Exam ${year}${suffix}`,
    filename: `grade${grade}_${subject.toLowerCase().replace(/\s+/g, '_')}_${year}.pdf`,
    size: `${Math.floor(Math.random() * 3 + 1)}.${Math.floor(Math.random() * 9)}MB`,
    pages: Math.floor(Math.random() * 20 + 8)
  }));
};

// Mock exam content generator
const generateExamContent = (grade: number, subject: string, _year: number) => {
  const examContent = {
    Mathematics: {
      sections: [
        {
          title: "Section A: Multiple Choice",
          questions: [
            "1. Solve for x: 2x + 5 = 13\na) x = 4  b) x = 6  c) x = 8  d) x = 9",
            "2. What is the gradient of the line y = 3x - 2?\na) -2  b) 2  c) 3  d) -3",
            "3. Factorize: x² - 9\na) (x-3)(x+3)  b) (x-9)(x+1)  c) x(x-9)  d) (x-3)²"
          ]
        },
        {
          title: "Section B: Problem Solving",
          questions: [
            "4. A rectangular garden has a length of 15m and width of 8m. Calculate:\na) The perimeter\nb) The area\nc) Cost of fencing at R25 per meter",
            "5. Solve the quadratic equation: x² - 5x + 6 = 0\nShow all working steps.",
            "6. In a right-angled triangle, sides are 3cm and 4cm.\nCalculate the hypotenuse length."
          ]
        }
      ]
    },
    English: {
      sections: [
        {
          title: "Section A: Comprehension",
          questions: [
            "Read the passage and answer:\n\n'The baobab tree, called the Tree of Life, is one of Africa's most iconic trees. These ancient giants can live for thousands of years and store water in their massive trunks.'\n\n1. Why is it called 'Tree of Life'?",
            "2. How do baobab trees survive dry seasons?",
            "3. Use 'iconic' in your own sentence."
          ]
        },
        {
          title: "Section B: Language",
          questions: [
            "4. Identify parts of speech:\n'The beautiful butterfly flew gracefully over the colorful garden.'",
            "5. Write in passive voice:\na) The teacher explained the lesson.\nb) Students completed the assignment.",
            "6. Correct errors:\n'Their going to there house after school. Its a beautiful day.'"
          ]
        }
      ]
    },
    "Physical Sciences": {
      sections: [
        {
          title: "Section A: Physics",
          questions: [
            "1. Calculate velocity: object travels 100m in 20 seconds.",
            "2. Force 50N applied to 10kg object. Calculate acceleration.",
            "3. Explain difference between speed and velocity with examples."
          ]
        },
        {
          title: "Section B: Chemistry", 
          questions: [
            "4. Balance equation: Na + Cl₂ → NaCl",
            "5. Calculate molar mass of H₂O (H=1, O=16)",
            "6. Describe neutralization reaction process."
          ]
        }
      ]
    }
  };

  const defaultContent = {
    sections: [
      {
        title: "Section A: Knowledge",
        questions: [
          `1. Define three key concepts in ${subject}.`,
          `2. Explain the importance of ${subject} in Grade ${grade}.`,
          `3. Give practical examples of ${subject} in daily life.`
        ]
      },
      {
        title: "Section B: Application", 
        questions: [
          `4. Analyze a case study related to ${subject}.`,
          `5. Compare two aspects of ${subject}.`,
          `6. Evaluate impact of ${subject} on society.`
        ]
      }
    ]
  };

  return examContent[subject as keyof typeof examContent] || defaultContent;
};

const EXAM_PAPERS: Record<number, Record<string, Array<{year: number, title: string, filename: string, size: string, pages: number, content: any}>>> = {};

// Generate exam papers for all grades and subjects
[8, 9, 10, 11, 12].forEach(grade => {
  EXAM_PAPERS[grade] = {};
  GRADE_SUBJECTS[grade as keyof typeof GRADE_SUBJECTS].forEach(subject => {
    EXAM_PAPERS[grade][subject] = generateExamPapers(grade, subject).map(paper => ({
      ...paper,
      content: generateExamContent(grade, subject, paper.year)
    }));
  });
});

// Translation helper function
const t = (key: keyof typeof TRANSLATIONS.en, languageCode: string = 'en'): string => {
  const langCode = languageCode as keyof typeof TRANSLATIONS;
  return TRANSLATIONS[langCode]?.[key] || TRANSLATIONS.en[key];
};

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Mathematics Help - Quadratic Equations',
      messages: [],
      lastUpdated: new Date(Date.now() - 86400000), // 1 day ago
      isFavorite: true
    },
    {
      id: '2',
      title: 'Science Notes - Photosynthesis',
      messages: [],
      lastUpdated: new Date(Date.now() - 172800000), // 2 days ago
      isFavorite: false
    },
    {
      id: '3',
      title: 'History Essay - Apartheid Timeline',
      messages: [],
      lastUpdated: new Date(Date.now() - 259200000), // 3 days ago
      isFavorite: true
    }
  ]);
  const [activeConversationId, setActiveConversationId] = useState<string>('');
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(SOUTH_AFRICAN_LANGUAGES[0]);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [sidebarLanguageMenuOpen, setSidebarLanguageMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'grade' | 'subject' | 'exam'>('home');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedExamPaper, setSelectedExamPaper] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  // Close language dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Check if click is outside language dropdowns
      if (!target.closest('.language-dropdown')) {
        setLanguageMenuOpen(false);
        setSidebarLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      lastUpdated: new Date(),
      isFavorite: false
    };
    setConversations([newConversation, ...conversations]);
    setActiveConversationId(newConversation.id);
    setSidebarOpen(false);
    
    // Reset to home screen when creating new chat
    setCurrentPage('home');
    setSelectedGrade(null);
    setSelectedSubject(null);
    setSelectedExamPaper(null);
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    let conversation = activeConversation;
    if (!conversation) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: currentMessage.slice(0, 50) + (currentMessage.length > 50 ? '...' : ''),
        messages: [],
        lastUpdated: new Date(),
        isFavorite: false
      };
      setConversations([newConversation, ...conversations]);
      setActiveConversationId(newConversation.id);
      conversation = newConversation;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      isUser: true,
      timestamp: new Date()
    };

    const updatedConversations = conversations.map(c => 
      c.id === conversation!.id 
        ? { ...c, messages: [...c.messages, userMessage], lastUpdated: new Date() }
        : c
    );
    
    if (!activeConversation) {
      updatedConversations.unshift(conversation);
    }
    
    setConversations(updatedConversations);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate Ruby's response
    setTimeout(() => {
      const rubyMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Hello! I'm Ruby, your AI tutor. I'm here to help you with your studies from Grade 8-12. I can assist with Mathematics, Science, English, History, and many other subjects. What would you like to learn about today? (Currently responding in ${selectedLanguage.native})`,
        isUser: false,
        timestamp: new Date()
      };

      setConversations(prev => prev.map(c => 
        c.id === conversation!.id 
          ? { ...c, messages: [...c.messages, rubyMessage] }
          : c
      ));
      setIsTyping(false);
    }, 2000);
  };

  const deleteConversation = (id: string) => {
    setConversations(conversations.filter(c => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId('');
    }
  };

  const exportChat = () => {
    if (!activeConversation) return;
    
    const chatData = {
      title: activeConversation.title,
      messages: activeConversation.messages,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ruby-chat-${activeConversation.title.replace(/[^a-zA-Z0-9]/g, '-')}.json`;
    a.click();
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleFavorite = (id: string) => {
    setConversations(conversations.map(c => 
      c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
    ));
  };

  const selectGrade = (grade: number) => {
    setSelectedGrade(grade);
    setCurrentPage('grade');
  };

  const selectSubject = (subject: string) => {
    setSelectedSubject(subject);
    setCurrentPage('subject');
  };

  const goHome = () => {
    setCurrentPage('home');
    setSelectedGrade(null);
    setSelectedSubject(null);
  };

  const goBackToGrade = () => {
    setCurrentPage('grade');
    setSelectedSubject(null);
    setSelectedExamPaper(null);
  };

  const openExamStudyMode = (examPaper: any) => {
    setSelectedExamPaper(examPaper);
    setCurrentPage('exam');
    
    // Create or switch to exam-specific conversation
    const examConversationTitle = `${selectedSubject} ${examPaper.year} - Study Mode`;
    let examConversation = conversations.find(c => c.title === examConversationTitle);
    
    if (!examConversation) {
      examConversation = {
        id: Date.now().toString(),
        title: examConversationTitle,
        messages: [{
          id: Date.now().toString(),
          text: `Hi! I'm Ruby 🤖 I'm here to help you study for your ${selectedSubject} ${examPaper.year} exam. I can explain any question, help you understand concepts, or guide you through problem-solving steps. What would you like to work on first?`,
          isUser: false,
          timestamp: new Date()
        }],
        lastUpdated: new Date(),
        isFavorite: false
      };
      setConversations([examConversation, ...conversations]);
    }
    
    setActiveConversationId(examConversation.id);
  };

  const goBackToSubject = () => {
    setCurrentPage('subject');
    setSelectedExamPaper(null);
  };

  const downloadExamPaper = (filename: string, title: string, _size: string, pages: number) => {
    // Create mock PDF content
    const mockPdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 24 Tf
50 750 Td
(${title}) Tj
0 -50 Td
/F1 12 Tf
(This is a mock exam paper for practice purposes.) Tj
0 -20 Td
(Pages: ${pages}) Tj
0 -20 Td
(Generated for RubyChat educational platform) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000015 00000 n 
0000000074 00000 n 
0000000131 00000 n 
0000000295 00000 n 
0000000547 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
625
%%EOF`;

    // Create blob and download
    const blob = new Blob([mockPdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorites = !showFavoritesOnly || c.isFavorite;
    return matchesSearch && matchesFavorites;
  });

  return (
    <div className="min-h-screen bg-blue-500 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-blue-600 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl md:text-2xl font-bold text-yellow-400 flex items-center gap-3">
                <BookOpen className="w-8 h-8 md:w-7 md:h-7" />
                Ruby Tutor
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-white hover:text-yellow-400 transition-colors text-3xl w-10 h-10 flex items-center justify-center"
              >
                ×
              </button>
            </div>
            <button
              onClick={createNewConversation}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold px-4 py-4 md:py-3 rounded-lg flex items-center gap-3 transition-colors text-lg md:text-base"
            >
              <Plus className="w-6 h-6 md:w-5 md:h-5" />
{t('newChat', selectedLanguage.code)}
            </button>

            {/* Language Selector - Sidebar */}
            <div className="mt-3">
              <div className="relative language-dropdown">
                <button
                  onClick={() => setSidebarLanguageMenuOpen(!sidebarLanguageMenuOpen)}
                  className={`w-full font-semibold px-4 py-3 md:py-2.5 rounded-lg flex items-center justify-between gap-3 transition-all duration-200 text-base md:text-sm border-2 ${
                    sidebarLanguageMenuOpen 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500' 
                      : 'bg-blue-700 hover:bg-blue-600 text-white border-blue-600 hover:border-blue-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 md:w-4 md:h-4" />
                    <div className="text-left">
                      <div className="font-semibold">{selectedLanguage.name}</div>
                      <div className="text-xs text-blue-200 font-normal">{selectedLanguage.native}</div>
                    </div>
                  </div>
                  <div className={`transform transition-transform duration-200 ${sidebarLanguageMenuOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                {sidebarLanguageMenuOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border-2 border-blue-200 py-3 z-50 backdrop-blur-sm">
                    {SOUTH_AFRICAN_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLanguage(lang);
                          setSidebarLanguageMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 transition-all duration-300 text-sm font-medium border-l-4 group ${
                          selectedLanguage.code === lang.code 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400 shadow-lg transform scale-[1.02] mx-1 rounded-lg' 
                            : 'text-gray-700 border-transparent hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:border-blue-400 hover:text-blue-800 hover:shadow-md hover:transform hover:scale-[1.01] hover:mx-1 hover:rounded-lg'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`font-semibold ${selectedLanguage.code === lang.code ? 'text-white' : 'group-hover:text-blue-800'}`}>
                              {lang.name}
                            </div>
                            <div className={`text-xs mt-0.5 ${selectedLanguage.code === lang.code ? 'text-blue-100' : 'opacity-75 group-hover:text-blue-700'}`}>
                              {lang.native}
                            </div>
                          </div>
                          {selectedLanguage.code === lang.code && (
                            <div className="text-white font-bold text-lg animate-pulse">✓</div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative mb-4">
              <Search className="w-6 h-6 md:w-5 md:h-5 absolute left-3 top-3.5 md:top-3 text-blue-300" />
              <input
                type="text"
                placeholder={t('search', selectedLanguage.code)}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-blue-700 text-white placeholder-blue-300 pl-12 md:pl-11 pr-4 py-4 md:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg md:text-base"
              />
            </div>
            
            {/* Favorites Filter */}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-lg md:text-base font-semibold transition-colors ${
                showFavoritesOnly 
                  ? 'bg-yellow-400 text-blue-900' 
                  : 'bg-blue-700 text-white hover:bg-blue-800'
              }`}
            >
              <Star className="w-5 h-5 md:w-4 md:h-4" />
              {showFavoritesOnly ? 'Show All Chats' : 'Show Favorites Only'}
            </button>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                  activeConversationId === conversation.id 
                    ? 'bg-blue-700 text-white' 
                    : 'text-blue-100 hover:bg-blue-700'
                }`}
                onClick={() => {
                  setActiveConversationId(conversation.id);
                  setSidebarOpen(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-lg md:text-base font-semibold truncate">{conversation.title}</p>
                      {conversation.isFavorite && (
                        <Star className="w-4 h-4 md:w-3 md:h-3 text-yellow-400 fill-current flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-base md:text-sm text-blue-300">
                      {conversation.lastUpdated.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 md:gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(conversation.id);
                      }}
                      className={`p-2 md:p-1 rounded transition-colors ${
                        conversation.isFavorite 
                          ? 'text-yellow-400 hover:text-yellow-300' 
                          : 'opacity-0 group-hover:opacity-100 text-blue-300 hover:text-yellow-400'
                      }`}
                    >
                      <Star className="w-5 h-5 md:w-4 md:h-4" />
                    </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conversation.id);
                    }}
                      className="opacity-0 group-hover:opacity-100 text-blue-300 hover:text-red-400 transition-all p-2 md:p-1"
                  >
                      <Trash2 className="w-5 h-5 md:w-4 md:h-4" />
                  </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-blue-500">
            <div className="flex gap-2">
              <button
                onClick={() => setSettingsOpen(true)}
                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white px-3 py-4 md:py-3 rounded-lg flex items-center justify-center gap-3 transition-colors text-lg md:text-base font-semibold"
              >
                <Settings className="w-6 h-6 md:w-5 md:h-5" />
{t('settings', selectedLanguage.code)}
              </button>
              <button
                onClick={exportChat}
                disabled={!activeConversation}
                className="flex-1 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-4 md:py-3 rounded-lg flex items-center justify-center gap-3 transition-colors text-lg md:text-base font-semibold"
              >
                <Download className="w-6 h-6 md:w-5 md:h-5" />
                {t('export', selectedLanguage.code)}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Bar */}
        <div className="bg-blue-600 p-4 flex items-center justify-between border-b border-blue-500">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white hover:text-yellow-400 transition-colors p-2"
            >
              <Menu className="w-8 h-8 md:w-7 md:h-7" />
            </button>
            <h2 className="text-white font-semibold text-xl md:text-lg">
              {activeConversation?.title || 'Ruby Tutor'}
            </h2>
          </div>
          
          {/* Language Selector */}
          <div className="relative language-dropdown">
            <button
              onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-3 md:py-2 rounded-lg flex items-center gap-3 transition-colors text-lg md:text-base font-semibold"
            >
              <Globe className="w-6 h-6 md:w-5 md:h-5" />
              {selectedLanguage.native}
            </button>
            
            {languageMenuOpen && (
              <div className="absolute right-0 top-12 bg-white rounded-xl shadow-2xl border border-blue-200 py-3 w-48 z-50 backdrop-blur-sm">
                {SOUTH_AFRICAN_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setLanguageMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 md:py-2 transition-all duration-200 text-lg md:text-base font-medium group ${
                      selectedLanguage.code === lang.code 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-[1.02] mx-2 rounded-lg' 
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 hover:shadow-sm hover:transform hover:scale-[1.01] hover:mx-2 hover:rounded-lg'
                    }`}
                  >
                    <span className="flex items-center justify-between">
                    {lang.native}
                      {selectedLanguage.code === lang.code && (
                        <span className="text-white animate-pulse">✓</span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Messages or Exam Study Mode */}
        <div className="flex-1 overflow-y-auto p-4">
          {currentPage === 'exam' && selectedExamPaper ? (
            // Exam Study Mode - Split Screen Layout
            <div className="h-full flex gap-4">
              {/* Left Side - Exam Paper */}
              <div className="w-1/2 bg-white rounded-xl shadow-lg p-6 overflow-y-auto">
                {/* Exam Header */}
                <div className="border-b pb-4 mb-6">
                  <button
                    onClick={goBackToSubject}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to {selectedSubject}
                  </button>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">{selectedExamPaper.title}</h1>
                  <div className="text-gray-600">
                    📄 {selectedExamPaper.pages} pages • {selectedExamPaper.year} • {selectedSubject}
                  </div>
                </div>

                {/* Exam Content */}
                <div className="space-y-6">
                  {selectedExamPaper.content.sections.map((section: any, sectionIndex: number) => (
                    <div key={sectionIndex} className="bg-gray-50 rounded-lg p-4">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                        {section.title}
                      </h2>
                      <div className="space-y-4">
                        {section.questions.map((question: string, questionIndex: number) => (
                          <div key={questionIndex} className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                              {question}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - AI Chat */}
              <div className="w-1/2 bg-blue-50 rounded-xl shadow-lg flex flex-col">
                {/* Chat Header */}
                <div className="bg-blue-600 text-white p-4 rounded-t-xl">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🤖</div>
                    <div>
                      <h2 className="font-semibold">Ruby - Study Assistant</h2>
                      <p className="text-blue-100 text-sm">{selectedSubject} {selectedExamPaper.year} Exam Help</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {activeConversation?.messages.map((message) => (
                    <div key={message.id} className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.isUser 
                          ? 'bg-blue-600 text-white ml-12' 
                          : 'bg-white text-gray-800 shadow-sm mr-12'
                      }`}>
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</div>
                        <div className={`text-xs mt-2 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="bg-white text-gray-800 shadow-sm p-3 rounded-lg mr-12">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t bg-white rounded-b-xl">
                  <div className="relative">
                    <input
                      type="text"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Ask Ruby about any question or concept..."
                      className="w-full bg-gray-50 text-gray-800 placeholder-gray-500 pl-4 pr-12 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                      disabled={isTyping}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!currentMessage.trim() || isTyping}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : !activeConversation || activeConversation.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-10 max-w-6xl mx-auto w-full">
                {/* Home Page */}
                {currentPage === 'home' && (
                  <>
                    <div className="text-7xl md:text-8xl mb-6">🤖</div>
                                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('hiRuby', selectedLanguage.code)}</h2>
                    <p className="text-blue-100 text-xl md:text-2xl mb-8 md:mb-10 leading-relaxed font-medium">
                      {t('rubyDescription', selectedLanguage.code)}
                    </p>
                
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                      {GRADE_LEVELS.map((gradeLevel) => (
                    <button
                          key={gradeLevel.grade}
                          onClick={() => selectGrade(gradeLevel.grade)}
                          className="text-center p-6 md:p-5 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors border-2 border-white/30 hover:border-white/50"
                        >
                          <div className="text-3xl md:text-2xl font-bold mb-2">{t('grade', selectedLanguage.code)} {gradeLevel.grade}</div>
                          <div className="text-base md:text-sm text-blue-100 font-medium">{gradeLevel.description}</div>
                    </button>
                  ))}
                </div>
                
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-blue-200 text-lg md:text-base">
                      <div className="flex items-center gap-3">
                        <Calculator className="w-7 h-7 md:w-6 md:h-6" />
                                            <span className="font-medium">{t('mathematics', selectedLanguage.code)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Microscope className="w-7 h-7 md:w-6 md:h-6" />
                    <span className="font-medium">{t('sciences', selectedLanguage.code)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Languages className="w-7 h-7 md:w-6 md:h-6" />
                    <span className="font-medium">{t('languages', selectedLanguage.code)}</span>
                  </div>
                </div>
                  </>
                )}

                {/* Grade Subjects Page */}
                {currentPage === 'grade' && selectedGrade && (
                  <>
                    {/* Breadcrumb Navigation */}
                    <div className="flex items-center justify-center mb-8">
                      <button
                        onClick={goHome}
                        className="text-blue-300 hover:text-white transition-colors text-lg font-medium"
                      >
                        {t('home', selectedLanguage.code)}
                      </button>
                      <span className="text-blue-200 mx-3">→</span>
                      <span className="text-white text-lg font-medium">{t('grade', selectedLanguage.code)} {selectedGrade}</span>
                    </div>

                    <div className="text-6xl md:text-7xl mb-6">📚</div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('grade', selectedLanguage.code)} {selectedGrade} {t('subjects', selectedLanguage.code)}</h2>
                    <p className="text-blue-100 text-xl md:text-2xl mb-8 md:mb-10 leading-relaxed font-medium">
                      {t('chooseSubject', selectedLanguage.code)}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                      {GRADE_SUBJECTS[selectedGrade as keyof typeof GRADE_SUBJECTS]?.map((subject) => (
                        <button
                          key={subject}
                          onClick={() => selectSubject(subject)}
                          className="text-center p-6 md:p-5 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors border-2 border-white/30 hover:border-white/50 group"
                        >
                          <div className="text-xl md:text-2xl font-bold mb-2 group-hover:text-yellow-200 transition-colors">{subject}</div>
                          <div className="text-sm text-blue-100 font-medium">5 {t('pastPapersAvailable', selectedLanguage.code)}</div>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Subject Exam Papers Page */}
                {currentPage === 'subject' && selectedGrade && selectedSubject && (
                  <>
                    {/* Breadcrumb Navigation */}
                    <div className="flex items-center justify-center mb-8">
                      <button
                        onClick={goHome}
                        className="text-blue-300 hover:text-white transition-colors text-lg font-medium"
                      >
                        {t('home', selectedLanguage.code)}
                      </button>
                      <span className="text-blue-200 mx-3">→</span>
                      <button
                        onClick={goBackToGrade}
                        className="text-blue-300 hover:text-white transition-colors text-lg font-medium"
                      >
                        {t('grade', selectedLanguage.code)} {selectedGrade}
                      </button>
                      <span className="text-blue-200 mx-3">→</span>
                      <span className="text-white text-lg font-medium">{selectedSubject}</span>
                  </div>

                    <div className="text-6xl md:text-7xl mb-6">📄</div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('grade', selectedLanguage.code)} {selectedGrade} - {selectedSubject}</h2>
                    <p className="text-blue-100 text-xl md:text-2xl mb-8 md:mb-10 leading-relaxed font-medium">
                      {t('downloadPapers', selectedLanguage.code)}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      {EXAM_PAPERS[selectedGrade as keyof typeof EXAM_PAPERS]?.[selectedSubject]?.map((paper) => (
                        <div
                          key={`${paper.year}-${selectedSubject}`}
                          className="bg-white/20 hover:bg-white/30 rounded-xl p-6 border-2 border-white/30 hover:border-white/50 transition-all duration-200 group"
                        >
                          <div className="text-center">
                            <div className="text-3xl font-bold text-yellow-400 mb-3">{paper.year}</div>
                            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-yellow-200 transition-colors">
                              {paper.title}
                            </h3>
                                                        <div className="text-sm text-blue-200 mb-4">
                              📄 {paper.pages} {t('pages', selectedLanguage.code)} • 💾 {paper.size}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => openExamStudyMode(paper)}
                                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                              >
                                <BookOpen className="w-5 h-5" />
                                Study Mode
                              </button>
                              <button
                                onClick={() => downloadExamPaper(paper.filename, paper.title, paper.size, paper.pages)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                              >
                                <Download className="w-5 h-5" />
                                {t('downloadPdf', selectedLanguage.code)}
                              </button>
                            </div>
                  </div>
                </div>
                      )) || (
                        <div className="col-span-full text-center">
                          <p className="text-blue-200 text-lg">No exam papers available for this subject yet.</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {activeConversation.messages.map((message) => (
                <div key={message.id} className={`mb-6 flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs md:max-w-2xl ${message.isUser ? 'order-2' : 'order-1'}`}>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.isUser 
                        ? 'bg-yellow-400 text-blue-900' 
                        : 'bg-white text-gray-800'
                    }`}>
                      <p className="whitespace-pre-wrap text-lg md:text-base leading-relaxed font-medium">{message.text}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className={`text-base md:text-sm font-medium ${message.isUser ? 'text-blue-700' : 'text-gray-500'}`}>
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        <button
                          onClick={() => copyMessage(message.text)}
                          className={`p-2 md:p-1 rounded hover:bg-black/10 transition-colors ${
                            message.isUser ? 'text-blue-700' : 'text-gray-500'
                          }`}
                        >
                          <Copy className="w-5 h-5 md:w-4 md:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className={`w-12 h-12 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-semibold text-base md:text-sm ${
                    message.isUser 
                      ? 'bg-yellow-400 text-blue-900 order-1 mr-4 md:mr-3' 
                      : 'bg-white text-blue-500 order-2 ml-4 md:ml-3'
                  }`}>
                    {message.isUser ? t('you', selectedLanguage.code) : '🤖'}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="mb-6 flex justify-start">
                  <div className="max-w-xs md:max-w-2xl order-1">
                    <div className="bg-white text-gray-800 rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-4 h-4 md:w-3 md:h-3 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-4 h-4 md:w-3 md:h-3 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-4 h-4 md:w-3 md:h-3 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                  <div className="w-12 h-12 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center text-blue-500 order-2 ml-4 md:ml-3 text-base md:text-sm font-semibold">
                    🤖
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-blue-400">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.jpg,.png"
              />
              
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={`${t('askRuby', selectedLanguage.code)} ${selectedLanguage.native}...`}
                  className="w-full bg-white text-gray-800 placeholder-gray-500 pl-6 pr-32 py-6 md:py-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg md:text-base font-medium"
                  disabled={isTyping}
                />
                
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2 items-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 md:p-2 text-gray-500 hover:text-blue-500 transition-colors text-3xl md:text-2xl flex items-center justify-center"
                    title="Upload file"
                  >
                    📎
                  </button>
                  <button
                    onClick={sendMessage}
                    disabled={!currentMessage.trim() || isTyping}
                    className="p-3 md:p-2.5 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-blue-900 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Send className="w-6 h-6 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <p className="text-center text-blue-200 text-lg md:text-base mt-4 md:mt-3 leading-relaxed font-medium">
              {t('rubyHelp', selectedLanguage.code)}
            </p>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl md:text-xl font-bold text-gray-800">Settings</h3>
              <button
                onClick={() => setSettingsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl w-12 h-12 md:w-10 md:h-10 flex items-center justify-center"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-8 md:space-y-6">
              <div>
                <label className="block text-lg md:text-base font-semibold text-gray-700 mb-4 md:mb-3">
                  Preferred Language
                </label>
                <select
                  value={selectedLanguage.code}
                  onChange={(e) => setSelectedLanguage(SOUTH_AFRICAN_LANGUAGES.find(l => l.code === e.target.value)!)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg md:text-base font-medium"
                >
                  {SOUTH_AFRICAN_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.native}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <h4 className="text-lg md:text-base font-semibold text-gray-700 mb-4 md:mb-3">About Ruby</h4>
                <div className="bg-blue-50 rounded-lg p-5 md:p-4 text-lg md:text-base text-blue-800 leading-relaxed">
                  <p className="mb-3 md:mb-2 font-medium">
                    <strong>Ruby AI Tutor</strong> - Designed specifically for South African students in Grades 8-12.
                  </p>
                  <p className="mb-3 md:mb-2">
                    • Supports all 11 official languages
                  </p>
                  <p className="mb-3 md:mb-2">
                    • Covers all major subjects
                  </p>
                  <p>
                    • Provides personalized learning support
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;