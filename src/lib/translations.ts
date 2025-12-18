export type Language =
    | "en" | "hi" | "kn" | "bn" | "te" | "mr" | "ta" | "ur" | "gu" | "ml"
    | "pa" | "or" | "as" | "mai" | "sat" | "ks" | "ne" | "sd" | "kok" | "doi"
    | "mni" | "bho" | "raj" | "awa" | "mag" | "chat" | "hary" | "marw" | "tulu" | "sa";

export const languages: { id: Language; name: string; native: string }[] = [
    { id: "en", name: "English", native: "English" },
    { id: "hi", name: "Hindi", native: "हिंदी" },
    { id: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
    { id: "bn", name: "Bengali", native: "বাংলা" },
    { id: "te", name: "Telugu", native: "తెలుగు" },
    { id: "mr", name: "Marathi", native: "मराठी" },
    { id: "ta", name: "Tamil", native: "தமிழ்" },
    { id: "ur", name: "Urdu", native: "اردو" },
    { id: "gu", name: "Gujarati", native: "ગુજરાતી" },
    { id: "ml", name: "Malayalam", native: "മലയാളം" },
    { id: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
    { id: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
    { id: "as", name: "Assamese", native: "অসমীয়া" },
    { id: "mai", name: "Maithili", native: "मैथिली" },
    { id: "sat", name: "Santali", native: "ᱥᱟᱱᱛᱟᱲᱤ" },
    { id: "ks", name: "Kashmiri", native: "कश्मीरी" },
    { id: "ne", name: "Nepali", native: "नेपाली" },
    { id: "sd", name: "Sindhi", native: "सिंधी" },
    { id: "kok", name: "Konkani", native: "कोंकणी" },
    { id: "doi", name: "Dogri", native: "डोगरी" },
    { id: "mni", name: "Manipuri", native: "মণিপুরী" },
    { id: "bho", name: "Bhojpuri", native: "भोजपुरी" },
    { id: "raj", name: "Rajasthani", native: "राजस्थानी" },
    { id: "awa", name: "Awadhi", native: "अवधी" },
    { id: "mag", name: "Magahi", native: "मगही" },
    { id: "chat", name: "Chhattisgarhi", native: "छत्तीसगढ़ी" },
    { id: "hary", name: "Haryanvi", native: "हरियाणवी" },
    { id: "marw", name: "Marwari", native: "मारवाड़ी" },
    { id: "tulu", name: "Tulu", native: "ತುಳು" },
    { id: "sa", name: "Sanskrit", native: "संस्कृतम्" },
];

const defaultTranslations = {
    // Navigation
    nav_overview: "Overview",
    nav_submit: "Submit Grievance",
    nav_analytics: "Analytics",
    nav_ledger: "Public Ledger",
    nav_settings: "Settings",
    nav_about: "About",
    nav_login: "Login",
    nav_signup: "Sign Up",

    // Sidebar
    apps_label: "APPS",
    citizen_lvl: "Citizen Lvl",
    sign_out: "Sign Out",

    // Landing Page
    hero_title: "Governance at the Speed of AI",
    hero_subtitle: "Jan-Mitra empowers citizens with AI-driven grievance redressal, real-time tracking, and blockchain accountability.",
    cta_start: "Get Started",
    cta_learn: "Learn More",

    // Landing Page - Why We Built This
    why_title: "Why We Built This",
    why_desc: "The current system is overwhelmed. The data speaks for itself.",
    stat_complaints_val: "1.2 Cr+",
    stat_complaints_label: "Public Complaints",
    stat_complaints_desc: "Filed in the last 5 years. The volume is massive.",
    stat_deadlines_val: "36%",
    stat_deadlines_label: "Missed Deadlines",
    stat_deadlines_desc: "Cases crossing SLA timelines without accountability.",
    stat_pending_val: "63,000",
    stat_pending_label: "Pending Monthly",
    stat_pending_desc: "New backlog added every single month.",

    // Landing Page - Features
    feat_ai_title: "AI Prioritization",
    feat_ai_desc: "Natural Language Processing understands urgency instantly. No more \"first come, first served\" for critical issues like fire or flooding.",
    feat_blockchain_title: "Blockchain Audit",
    feat_blockchain_desc: "Every status change is hashed on Polygon. Immutable proof of SLA compliance that cannot be tampered with by officials.",
    feat_sla_title: "Auto-Escalation",
    feat_sla_desc: "Smart timers auto-escalate unresolved grievances to supervisors. Accountability is enforced by code, not bureaucracy.",

    // Landing Page - How It Works
    how_title: "From Complaint to Resolution",
    how_desc: "A transparent journey powered by automation.",
    step_1_title: "Citizen Reports",
    step_1_desc: "Upload photo/video. AI auto-tags location and category.",
    step_2_title: "AI Analyzes",
    step_2_desc: "Severity score assigned. Routed to correct department instantly.",
    step_3_title: "Action Taken",
    step_3_desc: "Crews dispatched. Status updated on public ledger.",

    // Landing Page - Live Stats
    live_resolved: "Grievances Resolved",
    live_sla: "SLA Compliance",
    live_time: "Avg. Response Time",
    live_depts: "Civic Departments",

    // Dashboard
    welcome_back: "Welcome back",
    active_grievances: "Active Grievances",
    resolved_grievances: "Resolved",
    avg_resolution: "Avg. Resolution",
    days: "days",

    // Common
    loading: "Loading...",
    success: "Success",
    error: "Error",
};

// Helper to generate translations (simulated for now, would use real API in prod)
// For the prototype, we will populate a few key languages and fallback to English for others or use simple transliteration/mock
const createTranslation = (overrides: Partial<typeof defaultTranslations>) => ({ ...defaultTranslations, ...overrides });

export const translations: Record<Language, typeof defaultTranslations> = {
    en: defaultTranslations,
    hi: createTranslation({
        nav_overview: "अवलोकन",
        nav_submit: "शिकायत दर्ज करें",
        nav_analytics: "विश्लेषण",
        nav_ledger: "सार्वजनिक बहीखाता",
        nav_settings: "सेटिंग्स",
        apps_label: "ऐप्स",
        citizen_lvl: "नागरिक स्तर",
        sign_out: "साइन आउट",
        hero_title: "एआई की गति से शासन",
        hero_subtitle: "जन-मित्र नागरिकों को एआई-संचालित शिकायत निवारण, रीयल-टाइम ट्रैकिंग और ब्लॉकचेन जवाबदेही के साथ सशक्त बनाता है।",
        cta_start: "शुरू करें",
        cta_learn: "और जानें",
        welcome_back: "वापसी पर स्वागत है",
        active_grievances: "सक्रिय शिकायतें",
        resolved_grievances: "हल किया गया",
        avg_resolution: "औसत समाधान",
        days: "दिन",
        loading: "लोड हो रहा है...",
        success: "सफल",
        error: "त्रुटि",
    }),
    kn: createTranslation({
        nav_overview: "ಅವಲೋಕನ",
        nav_submit: "ದೂರು ಸಲ್ಲಿಸಿ",
        nav_analytics: "ವಿಶ್ಲೇಷಣೆ",
        nav_ledger: "ಸಾರ್ವಜನಿಕ ಲೆಕ್ಕಪತ್ರ",
        nav_settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
        apps_label: "ಅಪ್ಲಿಕೇಶನ್‌ಗಳು",
        citizen_lvl: "ನಾಗರಿಕ ಮಟ್ಟ",
        sign_out: "ಸೈನ್ ಔಟ್",
        hero_title: "ಎಐ ವೇಗದಲ್ಲಿ ಆಡಳಿತ",
        hero_subtitle: "ಜನ್-ಮಿತ್ರ ನಾಗರಿಕರಿಗೆ ಎಐ-ಚಾಲಿತ ಕುಂದುಕೊರತೆ ಪರಿಹಾರ, ನೈಜ-ಸಮಯದ ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ಬ್ಲಾಕ್‌ಚೈನ್ ಉತ್ತರದಾಯಿತ್ವದೊಂದಿಗೆ ಅಧಿಕಾರ ನೀಡುತ್ತದೆ.",
        cta_start: "ಪ್ರಾರಂಭಿಸಿ",
        cta_learn: "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ",
        welcome_back: "ಸ್ವಾಗತ",
        active_grievances: "ಸಕ್ರಿಯ ದೂರುಗಳು",
        resolved_grievances: "ಪರಿಹರಿಸಲಾಗಿದೆ",
        avg_resolution: "ಸರಾಸರಿ ಪರಿಹಾರ",
        days: "ದಿನಗಳು",
        loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
        success: "ಯಶಸ್ಸು",
        error: "ದೋಷ",
    }),
    bn: createTranslation({ nav_overview: "সংক্ষিপ্তসার", nav_submit: "অভিযোগ জমা দিন", hero_title: "এআই গতিতে শাসন" }),
    te: createTranslation({ nav_overview: "అవలోకనం", nav_submit: "ఫిర్యాదు చేయండి", hero_title: "AI వేగంతో పాలన" }),
    mr: createTranslation({ nav_overview: "आढावा", nav_submit: "तक्रार नोंदवा", hero_title: "AI च्या वेगाने प्रशासन" }),
    ta: createTranslation({ nav_overview: "கண்ணோட்டம்", nav_submit: "குறை சமர்ப்பிக்கவும்", hero_title: "AI வேகத்தில் ஆட்சி" }),
    ur: createTranslation({ nav_overview: "जायज़ा", nav_submit: "शिकायत दर्ज करें", hero_title: "AI की रफ़्तार से हुकूमत" }),
    gu: createTranslation({ nav_overview: "ઝાંખી", nav_submit: "ફરિયાદ સબમિટ કરો", hero_title: "AI ની ઝડપે શાસન" }),
    ml: createTranslation({ nav_overview: "അവലോകനം", nav_submit: "പരാതി നൽകുക", hero_title: "AI വേഗതയിൽ ഭരണം" }),
    pa: createTranslation({ nav_overview: "ਸੰਖੇਪ", nav_submit: "ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ", hero_title: "AI ਦੀ ਰਫਤਾਰ ਨਾਲ ਸ਼ਾਸਨ" }),
    or: createTranslation({ nav_overview: "ସମୀକ୍ଷା", nav_submit: "ଅଭିଯୋଗ ଦାଖଲ କରନ୍ତୁ", hero_title: "AI ଗତିରେ ଶାସନ" }),
    // Fallback for others (would be fully translated in prod)
    as: createTranslation({}),
    mai: createTranslation({}),
    sat: createTranslation({}),
    ks: createTranslation({}),
    ne: createTranslation({}),
    sd: createTranslation({}),
    kok: createTranslation({}),
    doi: createTranslation({}),
    mni: createTranslation({}),
    bho: createTranslation({}),
    raj: createTranslation({}),
    awa: createTranslation({}),
    mag: createTranslation({}),
    chat: createTranslation({}),
    hary: createTranslation({}),
    marw: createTranslation({}),
    tulu: createTranslation({}),
    sa: createTranslation({ nav_overview: "सिंहावलोकनम्", nav_submit: "परिवादं प्रस्तौतु", hero_title: "AI वेगेन शासनम्" }),
};
