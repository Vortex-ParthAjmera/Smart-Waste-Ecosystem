"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

const translations = {
  en: {
    // Brand
    brandName: "SGV 2.0",
    brandTagline: "Smart Waste Ecosystem",
    skipToContent: "Skip to content",

    // Nav / roles
    dashboard: "Dashboard",
    disposals: "Disposals",
    ecoCredits: "EcoCredits",
    verification: "Verification",
    edgeQueue: "Edge Queue",
    mlEvidence: "ML Evidence",
    previews: "Previews",
    citizen: "Citizen",
    municipal: "Municipal",
    developer: "Developer",
    productView: "Product view",
    dataProvenanceLegend: "Data provenance legend",

    // Auth actions
    citizenSignIn: "Citizen sign in",
    municipalSignIn: "Municipal sign in",
    developerSignIn: "Developer sign in",
    chooseAccess: "Choose your SGV access",
    fictionalAccounts: "Fictional accounts",
    localDemoFallback: "Local demo fallback",
    openCitizenDashboard: "Open citizen dashboard",
    openMunicipalConsole: "Open municipal console",
    openDeveloperConsole: "Open developer console",
    continueWithGoogle: "Continue with Google",
    backToProductView: "Back to product view",

    // Truth badges
    truthReal: "REAL - live hardware or local ML",
    truthSimulated: "SIMULATED - rules replayed offline",
    truthPreview: "PREVIEW/SEEDED - fixture data",

    // Login page — hero / story column
    accessEnvironment: "Access environment",
    identityChainEyebrow: "Identity chain · role-scoped entry",
    loginHeroTitle: "Every trusted record starts with the right role.",
    loginHeroLead: "Enter the fictional SGV workspace as a citizen, municipal operator, or developer. Each route reveals only the tools that role is meant to use.",
    accessVerificationSequence: "Access verification sequence",
    stepIdentity: "IDENTITY",
    stepAccess: "ACCESS",
    stepRoleView: "ROLE VIEW",
    stepAudit: "AUDIT",
    demoPrivacyNote: "Demo privacy note",
    privacySafe: "PRIVACY SAFE",
    privacyNoteBody: "Seeded credentials belong only to fictional rehearsal accounts—never to a real citizen, worker, or device.",

    // Login page — ticket column
    accessReceiptEyebrow: "Access receipt · SGV-AUTH-002",
    demoAccess: "DEMO ACCESS",
    ticketIntro: "Use the seeded flow that matches the dashboard you need to demonstrate.",
    chooseAccountRole: "Choose an account role",

    // Citizen login panel
    citizenLedgerEyebrow: "Citizen ledger",
    citizenSignInTitle: "Sign in to your disposal record",
    citizenSignInBody: "Review points, badges, QR access, and traceable disposal history.",
    citizenUserIdLabel: "Citizen user ID",
    citizenPasswordLabel: "Citizen password",
    citizenPasswordPlaceholder: "Enter citizen password",
    showPassword: "Show",
    hidePassword: "Hide",
    citizenInvalidCreds: "Invalid citizen credentials. Use the seeded citizen credentials below.",
    citizenAcceptedCreds: "Citizen credentials accepted. Continue to the citizen dashboard.",

    // Municipal login panel
    municipalReviewEyebrow: "Municipal review",
    municipalContinueTitle: "Continue to operator tools",
    municipalContinueBody: "Open disposal sessions, flagged cases, and zone review workflows.",
    verifiedStaffAccount: "Verified staff account",
    municipalGoogleHint: "This local demo mirrors Google sign-in. No real Google request is made.",
    municipalAcceptedDemo: "Municipal demo access accepted. Continue to operator tools.",
    municipalDomainHint: "Production access is restricted to verified municipal domains.",

    // Developer login panel
    restrictedAccessEyebrow: "Restricted access",
    iotConsoleTitle: "IoT control console",
    iotConsoleSubtitle: "ESP32-001 · Edge Gateway · Model Registry",
    developerUsernameLabel: "Developer username",
    developerPasswordLabel: "Developer password",
    developerPasswordPlaceholder: "Enter developer password",
    developerInvalidCreds: "401 Unauthorized — simulated invalid credentials blocked.",
    developerAcceptedCreds: "Developer credentials accepted. Continue to the IoT console.",
    tryInvalidCredsDemo: "Try invalid credentials demo",

    // Credentials receipt aside
    seededLocalEyebrow: "Seeded / local",
    rehearsalReceipt: "REHEARSAL RECEIPT",
    fictionalCredentialsTitle: "Fictional credentials for judging",
    municipalOptionLabel: "Municipal option",
    continueWithGoogleDemo: "Continue with Google demo",

    // Console — reason labels
    reasonDryMatch: "Dry category matched",
    reasonWetMatch: "Wet category matched",
    reasonEnvWetting: "Environmental wetting reviewed",
    reasonMismatch: "Category mismatch · reviewed",
    reasonMlUnavailable: "Camera classification unavailable",
    reasonMlUncertain: "Low-confidence result",
    evidencePendingReview: "Evidence pending review",

    // Console — citizen view
    chainOfCustody: "Chain of custody",
    citizenHeroTitle: "Your disposal record is traceable, end to end.",
    citizenHeroLead: "One event ID links the QR session, compartment sensor, edge custody, local ML evidence, the rules that decided it, and the ledger entry it produced. Nothing here is a black box.",
    cloudAcknowledged: "Cloud acknowledged",
    savedLocallyCloudPending: "Saved locally · cloud pending",
    traceReceiptFor: "Trace receipt for",
    stepBin: "Bin",
    stepEdge: "Edge",
    stepRules: "Rules",
    stepReview: "Review",
    stepLedger: "Ledger",
    modelScore: "Model score",
    scoreUnavailable: "unavailable",
    moisture: "Moisture",
    moistureNotRequired: "not required",
    pointEffect: "Point effect",
    pointsToNextTier: "Points to next tier",
    topSeededTierReached: "Top seeded tier reached",
    pendingReview: "Pending review",
    componentsHealthy: "Components healthy",
    opaqueIdentityKicker: "Opaque identity",
    myQrPassTitle: "My QR pass",
    displaySuffix: "Display suffix",
    qrPrivacyNote: "Seeded visual preview. A production QR contains no name, address, phone, balance, or role.",
    citizenRewardsKicker: "Citizen rewards",
    rewardsBadgesTitle: "Rewards & badges",
    badgeComplete: "Complete",
    appendOnlyLedger: "Append-only ledger",
    recentDisposalHistory: "Recent disposal history",
    fictionalRecords: "fictional records",
    disposalSuffix: "disposal",
    fictionalAliasesOnly: "Fictional aliases only",
    privacySafeLeaderboard: "Privacy-safe leaderboard",
    roadmapInterfaceKicker: "Roadmap interface · no live backend",
    truckTrackingTitle: "Truck tracking",
    kmFixtureDistance: "km fixture distance",
    routeScheduled: "Scheduled",
    routeDispatched: "Dispatched",
    routeOnRoute: "On route",
    routeNearYou: "Near you",
    routeCollected: "Collected",
    disputeAlertKicker: "Needs your attention",
    disputeAlertTitle: "You have a ledger entry you can dispute",
    disputeAlertBody: "reviewed entries are eligible for a municipal re-check.",
    weeklyImpactKicker: "This week · derived from your own ledger",
    weeklyImpactTitle: "Sorting impact",
    sortingAccuracy: "Sorting accuracy",
    disposalsThisWeek: "Disposals this week",
    wetShare: "Wet share",
    dryShare: "Dry share",
    civicDiscountKicker: "Civic cess · simulated",
    civicDiscountTitle: "EcoCredits civic discount",
    civicDiscountApplied: "discount applied from your balance",
    civicCessBase: "Base cess",
    civicCessPayable: "Payable after discount",
    redeemCreditsCta: "Redeem toward next cess cycle",
    redeemSimulatedNote: "Simulated redemption — no live payment integration in this preview.",

    // Console — municipal view
    humanReviewWorkspace: "Human review workspace",
    municipalOperatorWorkspace: "Municipal operator workspace",
    verifyEvidenceTitle: "Verify evidence before value changes.",
    bindDisposalTitle: "Bind each disposal to one accountable session.",
    openReviews: "Open reviews",
    fictionalEvents: "Fictional events",
    cloudAckPending: "Cloud ACK pending",
    orderedReviewQueueKicker: "Ordered review queue",
    verificationTitle: "Verification",
    casesSuffix: "cases",
    selectedEvidenceKicker: "Selected evidence",
    compartmentLabel: "Compartment",
    eventSourceLabel: "Event source",
    mlSourceLabel: "ML source",
    ruleLabel: "Rule",
    immediateEffectLabel: "Immediate effect",

    // Console — developer view
    restrictedOperationalTruth: "Restricted operational truth",
    developerHeroTitle: "See every boundary without hiding degraded states.",
    provenanceExplainer: "Sensor and model output are evidence. Provenance, transport, decision, and human review remain separate.",
    boundedRedactedKicker: "Bounded and redacted",
    systemLogsTitle: "System logs",
    lastSeen: "Last seen",
    secondsAgo: "s ago",

    // Locked views
    authenticatedRoleSurface: "Authenticated role surface",
    municipalLockedTitle: "Municipal review queue",
    municipalLockedBody: "Sign in with a verified municipal account to inspect disposal decisions, evidence, and review cases for your zone. No operational records load here before authentication.",
    developerLockedTitle: "Developer truth console",
    developerLockedBody: "Device telemetry, edge custody, simulations, and ML evidence are restricted to the developer role. Provenance labels remain attached after sign in."
  },
  hi: {
    // Brand
    brandName: "SGV 2.0",
    brandTagline: "स्मार्ट वेस्ट इकोसिस्टम",
    skipToContent: "सामग्री पर जाएं",

    // Nav / roles
    dashboard: "डैशबोर्ड",
    disposals: "निपटान",
    ecoCredits: "इको-क्रेडिट्स",
    verification: "सत्यापन",
    edgeQueue: "एज क्यू",
    mlEvidence: "एमएल साक्ष्य",
    previews: "पूर्वावलोकन",
    citizen: "नागरिक",
    municipal: "नगरपालिका",
    developer: "डेवलपर",
    productView: "प्रोडक्ट व्यू",
    dataProvenanceLegend: "डेटा उद्गम लेजेंड",

    // Auth actions
    citizenSignIn: "नागरिक साइन इन",
    municipalSignIn: "नगरपालिका साइन इन",
    developerSignIn: "डेवलपर साइन इन",
    chooseAccess: "अपना SGV एक्सेस चुनें",
    fictionalAccounts: "काल्पनिक खाते",
    localDemoFallback: "लोकल डेमो फॉलबैक",
    openCitizenDashboard: "नागरिक डैशबोर्ड खोलें",
    openMunicipalConsole: "नगरपालिका कंसोल खोलें",
    openDeveloperConsole: "डेवलपर कंसोल खोलें",
    continueWithGoogle: "Google के साथ जारी रखें",
    backToProductView: "प्रोडक्ट व्यू पर वापस जाएं",

    // Truth badges
    truthReal: "REAL - लाइव हार्डवेयर या लोकल ML",
    truthSimulated: "SIMULATED - ऑफलाइन नियम रीप्ले",
    truthPreview: "PREVIEW/SEEDED - फिक्स्चर डेटा",

    // Login page — hero / story column
    accessEnvironment: "एक्सेस वातावरण",
    identityChainEyebrow: "पहचान श्रृंखला · भूमिका-आधारित प्रवेश",
    loginHeroTitle: "हर भरोसेमंद रिकॉर्ड सही भूमिका से शुरू होता है।",
    loginHeroLead: "काल्पनिक SGV वर्कस्पेस में नागरिक, नगरपालिका ऑपरेटर या डेवलपर के रूप में प्रवेश करें। हर रूट केवल उन्हीं टूल्स को दिखाता है जो उस भूमिका के लिए बने हैं।",
    accessVerificationSequence: "एक्सेस सत्यापन क्रम",
    stepIdentity: "पहचान",
    stepAccess: "एक्सेस",
    stepRoleView: "भूमिका दृश्य",
    stepAudit: "ऑडिट",
    demoPrivacyNote: "डेमो गोपनीयता नोट",
    privacySafe: "गोपनीयता सुरक्षित",
    privacyNoteBody: "सीड किए गए क्रेडेंशियल केवल काल्पनिक रिहर्सल खातों के हैं—किसी वास्तविक नागरिक, कर्मचारी या डिवाइस के नहीं।",

    // Login page — ticket column
    accessReceiptEyebrow: "एक्सेस रसीद · SGV-AUTH-002",
    demoAccess: "डेमो एक्सेस",
    ticketIntro: "उसी सीड फ्लो का उपयोग करें जो आपके दिखाए जाने वाले डैशबोर्ड से मेल खाता है।",
    chooseAccountRole: "एक खाता भूमिका चुनें",

    // Citizen login panel
    citizenLedgerEyebrow: "नागरिक लेजर",
    citizenSignInTitle: "अपने निपटान रिकॉर्ड में साइन इन करें",
    citizenSignInBody: "पॉइंट्स, बैज, QR एक्सेस और ट्रेस करने योग्य निपटान इतिहास देखें।",
    citizenUserIdLabel: "नागरिक यूज़र आईडी",
    citizenPasswordLabel: "नागरिक पासवर्ड",
    citizenPasswordPlaceholder: "नागरिक पासवर्ड दर्ज करें",
    showPassword: "दिखाएं",
    hidePassword: "छुपाएं",
    citizenInvalidCreds: "अमान्य नागरिक क्रेडेंशियल। नीचे दिए गए सीड किए गए नागरिक क्रेडेंशियल का उपयोग करें।",
    citizenAcceptedCreds: "नागरिक क्रेडेंशियल स्वीकार किए गए। नागरिक डैशबोर्ड पर जारी रखें।",

    // Municipal login panel
    municipalReviewEyebrow: "नगरपालिका समीक्षा",
    municipalContinueTitle: "ऑपरेटर टूल्स पर जारी रखें",
    municipalContinueBody: "निपटान सत्र, फ्लैग किए गए मामले और ज़ोन समीक्षा वर्कफ़्लो खोलें।",
    verifiedStaffAccount: "सत्यापित स्टाफ खाता",
    municipalGoogleHint: "यह लोकल डेमो Google साइन-इन को दर्शाता है। कोई वास्तविक Google अनुरोध नहीं भेजा जाता।",
    municipalAcceptedDemo: "नगरपालिका डेमो एक्सेस स्वीकार किया गया। ऑपरेटर टूल्स पर जारी रखें।",
    municipalDomainHint: "उत्पादन एक्सेस केवल सत्यापित नगरपालिका डोमेन तक सीमित है।",

    // Developer login panel
    restrictedAccessEyebrow: "प्रतिबंधित एक्सेस",
    iotConsoleTitle: "IoT नियंत्रण कंसोल",
    iotConsoleSubtitle: "ESP32-001 · एज गेटवे · मॉडल रजिस्ट्री",
    developerUsernameLabel: "डेवलपर यूज़रनेम",
    developerPasswordLabel: "डेवलपर पासवर्ड",
    developerPasswordPlaceholder: "डेवलपर पासवर्ड दर्ज करें",
    developerInvalidCreds: "401 अनधिकृत — नकली अमान्य क्रेडेंशियल को अवरुद्ध किया गया।",
    developerAcceptedCreds: "डेवलपर क्रेडेंशियल स्वीकार किए गए। IoT कंसोल पर जारी रखें।",
    tryInvalidCredsDemo: "अमान्य क्रेडेंशियल डेमो आज़माएं",

    // Credentials receipt aside
    seededLocalEyebrow: "सीड किया गया / लोकल",
    rehearsalReceipt: "रिहर्सल रसीद",
    fictionalCredentialsTitle: "जज करने के लिए काल्पनिक क्रेडेंशियल",
    municipalOptionLabel: "नगरपालिका विकल्प",
    continueWithGoogleDemo: "Google डेमो के साथ जारी रखें",

    // Console — reason labels
    reasonDryMatch: "सूखा वर्ग मेल खाया",
    reasonWetMatch: "गीला वर्ग मेल खाया",
    reasonEnvWetting: "पर्यावरणीय नमी की समीक्षा की गई",
    reasonMismatch: "वर्ग बेमेल · समीक्षा की गई",
    reasonMlUnavailable: "कैमरा वर्गीकरण अनुपलब्ध",
    reasonMlUncertain: "कम-विश्वास परिणाम",
    evidencePendingReview: "साक्ष्य समीक्षा लंबित",

    // Console — citizen view
    chainOfCustody: "अभिरक्षा श्रृंखला",
    citizenHeroTitle: "आपका निपटान रिकॉर्ड शुरू से अंत तक ट्रेस करने योग्य है।",
    citizenHeroLead: "एक इवेंट आईडी QR सत्र, कंपार्टमेंट सेंसर, एज कस्टडी, लोकल ML साक्ष्य, निर्णय लेने वाले नियमों और उससे बनी लेजर एंट्री को जोड़ती है। यहां कुछ भी छिपा हुआ नहीं है।",
    cloudAcknowledged: "क्लाउड द्वारा स्वीकृत",
    savedLocallyCloudPending: "लोकल रूप से सहेजा गया · क्लाउड लंबित",
    traceReceiptFor: "ट्रेस रसीद",
    stepBin: "बिन",
    stepEdge: "एज",
    stepRules: "नियम",
    stepReview: "समीक्षा",
    stepLedger: "लेजर",
    modelScore: "मॉडल स्कोर",
    scoreUnavailable: "अनुपलब्ध",
    moisture: "नमी",
    moistureNotRequired: "आवश्यक नहीं",
    pointEffect: "पॉइंट प्रभाव",
    pointsToNextTier: "अगले स्तर तक पॉइंट्स",
    topSeededTierReached: "शीर्ष सीड स्तर प्राप्त किया",
    pendingReview: "समीक्षा लंबित",
    componentsHealthy: "स्वस्थ घटक",
    opaqueIdentityKicker: "अपारदर्शी पहचान",
    myQrPassTitle: "मेरा QR पास",
    displaySuffix: "प्रदर्शन प्रत्यय",
    qrPrivacyNote: "सीड किया गया विज़ुअल पूर्वावलोकन। उत्पादन QR में नाम, पता, फोन, बैलेंस या भूमिका शामिल नहीं है।",
    citizenRewardsKicker: "नागरिक पुरस्कार",
    rewardsBadgesTitle: "पुरस्कार और बैज",
    badgeComplete: "पूर्ण",
    appendOnlyLedger: "केवल-जोड़ने योग्य लेजर",
    recentDisposalHistory: "हाल का निपटान इतिहास",
    fictionalRecords: "काल्पनिक रिकॉर्ड",
    disposalSuffix: "निपटान",
    fictionalAliasesOnly: "केवल काल्पनिक उपनाम",
    privacySafeLeaderboard: "गोपनीयता-सुरक्षित लीडरबोर्ड",
    roadmapInterfaceKicker: "रोडमैप इंटरफ़ेस · कोई लाइव बैकएंड नहीं",
    truckTrackingTitle: "ट्रक ट्रैकिंग",
    kmFixtureDistance: "किमी फिक्स्चर दूरी",
    routeScheduled: "निर्धारित",
    routeDispatched: "भेजा गया",
    routeOnRoute: "रास्ते में",
    routeNearYou: "आपके पास",
    routeCollected: "एकत्रित",
    disputeAlertKicker: "आपके ध्यान की आवश्यकता है",
    disputeAlertTitle: "आपकी एक लेजर एंट्री है जिसे आप चुनौती दे सकते हैं",
    disputeAlertBody: "समीक्षा की गई एंट्रियां नगरपालिका पुनः-जांच के लिए पात्र हैं।",
    weeklyImpactKicker: "इस सप्ताह · आपके अपने लेजर से लिया गया",
    weeklyImpactTitle: "सॉर्टिंग प्रभाव",
    sortingAccuracy: "सॉर्टिंग सटीकता",
    disposalsThisWeek: "इस सप्ताह के निपटान",
    wetShare: "गीला हिस्सा",
    dryShare: "सूखा हिस्सा",
    civicDiscountKicker: "नागरिक उपकर · सिम्युलेटेड",
    civicDiscountTitle: "EcoCredits नागरिक छूट",
    civicDiscountApplied: "आपके बैलेंस से लागू छूट",
    civicCessBase: "मूल उपकर",
    civicCessPayable: "छूट के बाद देय",
    redeemCreditsCta: "अगले उपकर चक्र की ओर भुनाएं",
    redeemSimulatedNote: "सिम्युलेटेड रिडेम्पशन — इस पूर्वावलोकन में कोई लाइव भुगतान एकीकरण नहीं है।",

    // Console — municipal view
    humanReviewWorkspace: "मानव समीक्षा वर्कस्पेस",
    municipalOperatorWorkspace: "नगरपालिका ऑपरेटर वर्कस्पेस",
    verifyEvidenceTitle: "मूल्य बदलने से पहले साक्ष्य सत्यापित करें।",
    bindDisposalTitle: "हर निपटान को एक जवाबदेह सत्र से जोड़ें।",
    openReviews: "खुली समीक्षाएं",
    fictionalEvents: "काल्पनिक इवेंट्स",
    cloudAckPending: "क्लाउड ACK लंबित",
    orderedReviewQueueKicker: "क्रमबद्ध समीक्षा कतार",
    verificationTitle: "सत्यापन",
    casesSuffix: "मामले",
    selectedEvidenceKicker: "चयनित साक्ष्य",
    compartmentLabel: "कंपार्टमेंट",
    eventSourceLabel: "इवेंट स्रोत",
    mlSourceLabel: "ML स्रोत",
    ruleLabel: "नियम",
    immediateEffectLabel: "तत्काल प्रभाव",

    // Console — developer view
    restrictedOperationalTruth: "प्रतिबंधित परिचालन सत्य",
    developerHeroTitle: "बिना छिपाए हर सीमा और डिग्रेडेड स्थिति देखें।",
    provenanceExplainer: "सेंसर और मॉडल आउटपुट साक्ष्य हैं। उद्गम, ट्रांसपोर्ट, निर्णय और मानव समीक्षा अलग-अलग रहते हैं।",
    boundedRedactedKicker: "सीमित और संपादित",
    systemLogsTitle: "सिस्टम लॉग",
    lastSeen: "अंतिम बार देखा गया",
    secondsAgo: "सेकंड पहले",

    // Locked views
    authenticatedRoleSurface: "प्रमाणित भूमिका सतह",
    municipalLockedTitle: "नगरपालिका समीक्षा कतार",
    municipalLockedBody: "अपने ज़ोन के लिए निपटान निर्णय, साक्ष्य और समीक्षा मामलों की जांच करने हेतु एक सत्यापित नगरपालिका खाते से साइन इन करें। प्रमाणीकरण से पहले यहां कोई परिचालन रिकॉर्ड लोड नहीं होता।",
    developerLockedTitle: "डेवलपर सत्य कंसोल",
    developerLockedBody: "डिवाइस टेलीमेट्री, एज कस्टडी, सिमुलेशन और ML साक्ष्य केवल डेवलपर भूमिका तक सीमित हैं। साइन इन के बाद भी उद्गम लेबल जुड़े रहते हैं।"
  }
} as const;

type Language = keyof typeof translations;
type TranslationKey = keyof typeof translations.en;

type LanguageContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  const value = useMemo<LanguageContextValue>(() => ({
    lang,
    setLang,
    t: (key) => translations[lang][key] ?? translations.en[key] ?? key
  }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
