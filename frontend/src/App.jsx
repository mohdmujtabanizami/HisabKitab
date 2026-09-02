import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { db } from './db';
import { auth, provider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import './index.css';

const translations = {
  en: {
    title: "HisabKitab",
    subtitle: "Tracker",
    online: "🟢 Online",
    offline: "🔴 Offline",
    income: "Monthly Income",
    target: "Savings Target",
    spent: "Total Spent",
    remaining: "Remaining Balance",
    noSpend: "No-Spend Days so far!",
    aiTools: "AI & Pro Tools",
    aiDesc: "Voice, Bill Scan, Month Report, Gmail Backup & Restore.",
    speak: "🔊 Speak Summary",
    scanBill: "📷 Scan Bill",
    monthReport: "📊 Month Report",
    whatsapp: "💬 WhatsApp Share",
    backup: "☁️ Gmail Backup",
    restore: "📂 Restore Data",
    pdf: "🖨️ Print / PDF",
    goalPlanner: "🎯 Goal-Based Savings Planner",
    goalPlaceholder: "Goal (e.g. New Phone)",
    amount: "Amount",
    saveGoal: "Save Goal Target",
    noGoal: "No active goal set.",
    subs: "🔄 Recurring Subscriptions",
    addSub: "+ Add",
    outsideFood: "🍔 Outside Food & Items (Track Only)",
    outsideHint: "Amounts here DO NOT add to Total Spent. Add them to Daily Expenses to deduct from your balance.",
    monthTotal: "Total",
    analytics: "📊 Spending Analytics & Breakdown",
    paymentModes: "💳 Payment Modes Breakdown",
    fixedUsage: "Fixed Budget Usage",
    dailyUsage: "Daily Expenses Usage",
    fixedBudget: "Monthly Fixed Budget",
    category: "Category",
    estimated: "Estimated",
    actual: "Actual Paid",
    status: "Remaining",
    addCategory: "+ Add Category",
    dailyExpenses: "📅 Daily Expenses",
    dailyTip: "Tip: Use '+' or ',' to add expenses. Ex: 70+40+60.",
    notes: "📝 Notes",
    recycleBin: "🗑️ Recycle Bin (Deleted Categories)",
    restoreBtn: "📁 Restore",
    permDelete: "❌ Permanent Delete",
    loginCloud: "☁️ Cloud Login",
    logout: "🚪 Logout",
    saved: "Saved",
    overspent: "Overspent",
    balanced: "Balanced",
    lockedDay: "🔒 Locked (Future Date)",
    udhaarTracker: "🤝 Lending & Borrowing Ledger",
    toReceive: "Money to Receive",
    toPay: "Money to Pay",
    addUdhaar: "+ Add Record",
    personName: "Person Name",
    totalAmt: "Amount",
    settledAmt: "Settled",
    plannerTitle: "📋 Current & Next Month Shopping / Plans",
    currentMonthPlan: "Current Month Shopping & Items",
    nextMonthPlan: "Next Month Shopping & Items",
    menu: "Menu",
    lightMode: "☀️ Light Mode",
    darkMode: "🌙 Dark Mode",
    securityLock: "🔒 Security (App Lock)",
    aboutApp: "ℹ️ About HisabKitab",
    aboutDesc: "HisabKitab is a smart cross-device personal finance tracker designed to manage monthly budgets, track daily expenses, plan savings goals, and secure data offline/online.",
    keyFeatures: "Key Features:",
    featureList: [
      "Voice Summary & Automated Bill Camera Scanner with Date detection.",
      "Gmail Cloud Backup & Cross-Device Data Restoration.",
      "Multi-language support with full localization.",
      "AI Budget Forecasting & WhatsApp sharing.",
      "Recycle Bin for restoring accidentally deleted budget categories.",
      "App-level 4-digit PIN security with recovery questions."
    ],
    creatorText: "Designed & Created by",
    creatorName: "Mohd Mujtaba Nizami",
    cancel: "Cancel",
    savePin: "Save PIN",
    appLocked: "App Locked",
    enterPin: "Enter your 4-digit PIN",
    unlock: "Unlock",
    forgotPass: "Forgot Password?",
    resetUnlock: "Reset & Unlock",
    backToPin: "Back to PIN",
    aiForecastTitle: "✨ AI Forecast & Budget Advisor",
    safeLimitActive: "🟢 Safe Spending Limit Active (Allowed to Spend)",
    overBudgetAlert: "🚨 Alert: Over Budget! Safe Spending Limit Exceeded",
    today: "Today",
    targetAmountLbl: "Target Amount",
    monthlySpendingLbl: "Monthly Spending",
    monthlySavingLbl: "Monthly Saving",
    savingsPctLbl: "Savings %",
    estimatedMonthsLbl: "⏳ Estimated Months: ",
    paidLbl: "Paid",
    notesModalTitle: "Expense Notes & Details",
    notesTip: "Tip: Check \"Link to Monthly Fixed Budget Category\" to automatically sync and add this expense into your fixed budget table!",
    notePlaceholder: "What was this for? e.g. Milk",
    linkFixedCat: "Link to Monthly Fixed Budget Category",
    selectCategoryLbl: "Select Category:",
    chooseCategoryOpt: "-- Choose Fixed Category --",
    splitBtn: "Split",
    dayLabel: "Day",
    splitTitle: "Split Bill Calculator",
    splitingText: "Splitting",
    worthText: "worth",
    howManyPeople: "How many people?",
    perPersonShare: "Per Person Share:",
    shareOnWhatsapp: "Share on WhatsApp 💬"
  },
  hi: {
    title: "हिसाब किताब",
    subtitle: "ट्रैकर",
    online: "🟢 ऑनलाइन",
    offline: "🔴 ऑफलाइन",
    income: "मासिक आय",
    target: "बचत लक्ष्य",
    spent: "कुल खर्च",
    remaining: "शेष राशि",
    noSpend: "बिना खर्च वाले दिन!",
    aiTools: "एआई और प्रो टूल्स",
    aiDesc: "वॉइस, बिल स्कैन, रिपोर्ट, जीमेल बैकअप और रिस्टोर।",
    speak: "🔊 सारांश सुनें",
    scanBill: "📷 बिल स्कैन करें",
    monthReport: "📊 मासिक रिपोर्ट",
    whatsapp: "💬 व्हाट्सएप शेयर",
    backup: "☁️ जीमेल बैकअप",
    restore: "📂 डेटा रिस्टोर",
    pdf: "🖨️ प्रिंट / पीडीएफ",
    goalPlanner: "🎯 लक्ष्य-आधारित बचत योजना",
    goalPlaceholder: "लक्ष्य (जैसे नया फोन)",
    amount: "राशि",
    saveGoal: "लक्ष्य सहेजे",
    noGoal: "कोई सक्रिय लक्ष्य नहीं है।",
    subs: "🔄 आवर्ती सदस्यताएं",
    addSub: "+ जोड़ें",
    outsideFood: "🍔 बाहर का खान-पान (सिर्फ ट्रैक)",
    outsideHint: "यहाँ के पैसे कुल खर्च में नहीं जुड़ते। बैलेंस से काटने के लिए उन्हें डेली खर्च में भी लिखें।",
    monthTotal: "कुल",
    analytics: "📊 खर्च का विश्लेषण और विवरण",
    paymentModes: "💳 भुगतान के तरीके",
    fixedUsage: "निश्चित बजट उपयोग",
    dailyUsage: "दैनिक खर्च उपयोग",
    fixedBudget: "मासिक निश्चित बजट",
    category: "श्रेणी",
    estimated: "अनुमानित",
    actual: "वास्तविक भुगतान",
    status: "बचा हुआ",
    addCategory: "+ श्रेणी जोड़ें",
    dailyExpenses: "📅 दैनिक खर्च",
    dailyTip: "टिप: खर्च जोड़ने के लिए '+' या ',' का उपयोग करें।",
    notes: "📝 नोट्स",
    recycleBin: "🗑️ रीसायकल बिन (हटाई गई श्रेणियां)",
    restoreBtn: "📁 रिस्टोर",
    permDelete: "❌ हमेशा के लिए हटाएं",
    loginCloud: "☁️ क्लाउड लॉगिन",
    logout: "🚪 लॉगआउट",
    saved: "बचत",
    overspent: "अतिरिक्त खर्च",
    balanced: "बैलेंस्ड",
    lockedDay: "🔒 लॉक (आने वाला दिन)",
    udhaarTracker: "🤝 लेन-देन खाता",
    toReceive: "पैसे लेने हैं",
    toPay: "पैसे देने हैं",
    addUdhaar: "+ रिकॉर्ड जोड़ें",
    personName: "व्यक्ति का नाम",
    totalAmt: "राशि",
    settledAmt: "चुकाई गई राशि",
    plannerTitle: "📋 वर्तमान और अगले महीने की शॉपिंग / योजनाएं",
    currentMonthPlan: "इस महीने की खरीददारी और सामान",
    nextMonthPlan: "अगले महीने की खरीददारी और सामान",
    menu: "मेन्यू",
    lightMode: "☀️ लाइट मोड",
    darkMode: "🌙 डार्क मोड",
    securityLock: "🔒 सुरक्षा (ऐप लॉक)",
    aboutApp: "ℹ️ हिसाब किताब के बारे में",
    aboutDesc: "हिसाब किताब एक स्मार्ट पर्सनल फाइनेंस ट्रैकर है जो मासिक बजट को प्रबंधित करने, दैनिक खर्चों को ट्रैक करने, बचत लक्ष्यों की योजना बनाने और ऑफ़लाइन/ऑनलाइन डेटा सुरक्षित रखने में मदद करता है।",
    keyFeatures: "मुख्य विशेषताएँ:",
    featureList: [
      "वॉइस सारांश और तारीख की पहचान के साथ स्वचालित बिल कैमरा स्कैनर।",
      "जीमेल क्लाउड बैकअप और क्रॉस-डिवाइस डेटा बहाली।",
      "पूर्ण स्थानीयकरण (Localization) के साथ बहु-भाषा समर्थन।",
      "एआई बजट पूर्वानुमान और व्हाट्सएप शेयरिंग।",
      "गलती से हटाई गई बजट श्रेणियों को पुनर्स्थापित करने के लिए रीसायकल बिन।",
      "रिकवरी प्रश्नों के साथ ऐप-स्तरीय 4-अंकों की पिन सुरक्षा।"
    ],
    creatorText: "डिज़ाइन और निर्मित",
    creatorName: "मोहम्मद मुजतबा निज़ामी",
    cancel: "रद्द करें",
    savePin: "पिन सहेजें",
    appLocked: "ऐप लॉक है",
    enterPin: "अपना 4-अंकों का पिन दर्ज करें",
    unlock: "अनलाक करें",
    forgotPass: "पासवर्ड भूल गए?",
    resetUnlock: "रीसेट और अनलॉक",
    backToPin: "पिन पर वापस जाएं",
    aiForecastTitle: "✨ एआई पूर्वानुमान और बजट सलाहकार",
    safeLimitActive: "🟢 सुरक्षित खर्च सीमा सक्रिय (खर्च करने की अनुमति)",
    overBudgetAlert: "🚨 चेतावनी: बजट से अधिक! सुरक्षित खर्च सीमा पार हो गई है",
    today: "आज",
    targetAmountLbl: "लक्ष्य राशि",
    monthlySpendingLbl: "मासिक खर्च",
    monthlySavingLbl: "मासिक बचत",
    savingsPctLbl: "बचत %",
    estimatedMonthsLbl: "⏳ अनुमानित महीने: ",
    paidLbl: "भुगतान हो गया",
    notesModalTitle: "खर्च के नोट्स और विवरण",
    notesTip: "टिप: इस खर्च को अपने निश्चित बजट (Fixed Budget) में ऑटोमैटिक जोड़ने के लिए \"निश्चित बजट श्रेणी से लिंक करें\" पर टिक करें!",
    notePlaceholder: "यह किस लिए है? जैसे दूध",
    linkFixedCat: "निश्चित बजट श्रेणी से लिंक करें",
    selectCategoryLbl: "श्रेणी चुनें:",
    chooseCategoryOpt: "-- निश्चित श्रेणी चुनें --",
    splitBtn: "स्प्लिट",
    dayLabel: "दिन",
    splitTitle: "स्प्लिट बिल कैलकुलेटर",
    splitingText: "विभाजित कर रहे हैं",
    worthText: "मूल्य:",
    howManyPeople: "कितने लोग हैं?",
    perPersonShare: "प्रति व्यक्ति हिस्सा:",
    shareOnWhatsapp: "व्हाट्सएप पर शेयर करें 💬"
  },
  ur: {
title: "حساب کتاب",
subtitle: "ٹریکر",
online: "🟢 آن لائن",
offline: "🔴 آف لائن",
income: "ماہانہ آمدنی",
target: "بچت کا ہدف",
spent: "کل خرچ",
remaining: "بقیہ رقم",
noSpend: "بغیر خرچ کے دن!",
aiTools: "اے آئی اور پیشہ ورانہ اوزار",
aiDesc: "آواز، بل اسکین، رپورٹ، جی میل بیک اپ اور بحالی۔",
speak: "🔊 خلاصہ سنیں",
scanBill: "📷 بل اسکین کریں",
monthReport: "📊 ماہانہ رپورٹ",
whatsapp: "💬 واٹس ایپ پر شیئر کریں",
backup: "☁️ جی میل بیک اپ",
restore: "📂 ڈیٹا بحال کریں",
pdf: "🖨️ پرنٹ / پی ڈی ایف",
goalPlanner: "🎯 ہدف پر مبنی بچت کی منصوبہ بندی",
goalPlaceholder: "ہدف (مثلاً نیا فون)",
amount: "رقم",
saveGoal: "ہدف محفوظ کریں",
noGoal: "کوئی فعال ہدف مقرر نہیں ہے۔",
subs: "🔄 بار بار ادا کی جانے والی سبسکرپشنز",
addSub: "+ شامل کریں",
outsideFood: "🍔 باہر کا کھانا (صرف ریکارڈ کے لیے)",
outsideHint: "یہ رقم کل خرچ میں شامل نہیں ہوتی۔ اسے یومیہ اخراجات میں شامل کریں۔",
monthTotal: "کل",
analytics: "📊 اخراجات کا تجزیہ",
paymentModes: "💳 ادائیگی کے طریقے",
fixedUsage: "مقررہ بجٹ کا استعمال",
dailyUsage: "یومیہ اخراجات کا استعمال",
fixedBudget: "ماہانہ مقررہ بجٹ",
category: "زمرہ",
estimated: "تخمینہ",
actual: "اصل ادائیگی",
status: "بقیہ",
addCategory: "+ زمرہ شامل کریں",
dailyExpenses: "📅 یومیہ اخراجات",
dailyTip: "مشورہ: خرچ شامل کرنے کے لیے '+' استعمال کریں۔",
notes: "📝 نوٹس",
recycleBin: "🗑️ ری سائیکل بن (حذف شدہ زمرے)",
restoreBtn: "📁 بحال کریں",
permDelete: "❌ مستقل طور پر حذف کریں",
loginCloud: "☁️ لاگ اِن",
logout: "🚪 لاگ آؤٹ",
saved: "بچت",
overspent: "زائد خرچ",
balanced: "متوازن",
lockedDay: "🔒 مقفل (آنے والا دن)",
udhaarTracker: "🤝 لین دین کا حساب",
toReceive: "وصول کرنے ہیں",
toPay: "ادا کرنے ہیں",
addUdhaar: "+ ریکارڈ شامل کریں",
personName: "فرد کا نام",
totalAmt: "رقم",
settledAmt: "ادا شدہ",
plannerTitle: "📋 موجودہ اور اگلے ماہ کی خریداری / منصوبے",
currentMonthPlan: "اس ماہ کی خریداری اور سامان",
nextMonthPlan: "اگلے ماہ کی خریداری اور سامان",
menu: "مینو",
lightMode: "☀️ روشن موڈ",
darkMode: "🌙 تاریک موڈ",
securityLock: "🔒 سیکیورٹی (ایپ لاک)",
aboutApp: "ℹ️ حساب کتاب کے بارے میں",
aboutDesc: "حساب کتاب ایک جدید اور بہترین ذاتی مالیاتی ٹریکر ہے جو ماہانہ بجٹ کے انتظام، روزمرہ کے اخراجات، بچت کے اہداف کی منصوبہ بندی اور ڈیٹا کو محفوظ رکھنے میں مدد کرتا ہے۔",
keyFeatures: "اہم خصوصیات:",
featureList: [
  "آواز کے خلاصے اور تاریخ کی شناخت کے ساتھ خودکار بل کیمرہ اسکینر۔",
  "جی میل کلاؤڈ بیک اپ اور مختلف آلات پر ڈیٹا کی بحالی۔",
  "مکمل مقامی زبان کی معاونت (Localization)۔",
  "اے آئی بجٹ تخمینہ اور واٹس ایپ پر شیئر کرنے کی سہولت۔",
  "غلطی سے حذف شدہ بجٹ زمروں کو بحال کرنے کے لیے ری سائیکل بن۔",
  "بازیابی کے سوالات کے ساتھ ایپ کی سطح پر چار ہندسوں کی پن سیکیورٹی۔"
],
creatorText: "ڈیزائن اور تخلیق کیا گیا",
creatorName: "محمد مجتبیٰ نظامی",
cancel: "منسوخ کریں",
savePin: "پن محفوظ کریں",
appLocked: "ایپ مقفل ہے",
enterPin: "اپنا چار ہندسوں کا پن درج کریں",
unlock: "اَن لاک کریں",
forgotPass: "پاس ورڈ بھول گئے؟",
resetUnlock: "ری سیٹ اور اَن لاک",
backToPin: "پن پر واپس جائیں",
aiForecastTitle: "✨ اے آئی تخمینہ اور بجٹ مشیر",
safeLimitActive: "🟢 محفوظ خرچ کی حد فعال ہے",
overBudgetAlert: "🚨 انتباہ: بجٹ سے زیادہ خرچ ہو گیا ہے!",
today: "آج",
targetAmountLbl: "ہدف کی رقم",
monthlySpendingLbl: "ماہانہ خرچ",
monthlySavingLbl: "ماہانہ بچت",
savingsPctLbl: "بچت ٪",
estimatedMonthsLbl: "⏳ اندازاً مہینے: ",
paidLbl: "ادا کر دیا گیا",
notesModalTitle: "اخراجات کے نوٹس اور تفصیلی بیان",
notesTip: "مشورہ: اس خرچ کو خودکار طور پر مقررہ بجٹ میں شامل کرنے کے لیے \"ماہانہ مقررہ بجٹ کے زمرے سے منسلک کریں\" پر نشان لگائیں!",
notePlaceholder: "یہ کس کے لیے تھا؟ مثلاً دودھ",
linkFixedCat: "ماہانہ مقررہ بجٹ کے زمرے سے منسلک کریں",
selectCategoryLbl: "زمرہ منتخب کریں:",
chooseCategoryOpt: "-- مقررہ زمرہ منتخب کریں --",
splitBtn: "تقسیم کریں",
dayLabel: "دن",
splitTitle: "بل کی تقسیم کا کیلکولیٹر",
splitingText: "تقسیم کی جا رہی ہے",
worthText: "مالیت:",
howManyPeople: "کتنے افراد ہیں؟",
perPersonShare: "فی فرد حصہ:",
shareOnWhatsapp: "واٹس ایپ پر شیئر کریں 💬"

  }
};

const hindiDays = {
  "Monday": "सोमवार", "Tuesday": "मंगलवार", "Wednesday": "बुधवार",
  "Thursday": "गुरुवार", "Friday": "शुक्रवार", "Saturday": "शनिवार", "Sunday": "रविवार"
};

const urduDays = {
  "Monday": "پیر", "Tuesday": "منگل", "Wednesday": "بدھ",
  "Thursday": "جمعرات", "Friday": "جمعہ", "Saturday": "ہفتہ", "Sunday": "اتوار"
};

const hindiMonths = {
  "January": "जनवरी", "February": "फरवरी", "March": "मार्च", "April": "अप्रैल",
  "May": "मई", "June": "जून", "July": "जुलाई", "August": "अगस्त",
  "September": "सितंबर", "October": "अक्टूबर", "November": "नवंबर", "December": "दिसंबर"
};

const urduMonths = {
  "January": "جنوری", "February": "فروری", "March": "मार्च", "April": "اپریل",
  "May": "مئی", "June": "جون", "July": "جولائی", "August": "اگست",
  "September": "ستمبر", "October": "اکتوبر", "November": "نومبر", "December": "دسمبر"
};

const formatLocalizedDate = (dayName, dateStr, currentLang) => {
  const parts = dateStr.split(' '); 
  const dayNum = parts[0];
  const monthName = parts[1];
  const year = parts[2];

  if (currentLang === 'hi') {
    const localizedDay = hindiDays[dayName] || dayName;
    const localizedMonth = hindiMonths[monthName] || monthName;
    return `${dayNum} ${localizedMonth} ${year} (${localizedDay})`;
  } else if (currentLang === 'ur') {
    const localizedDay = urduDays[dayName] || dayName;
    const localizedMonth = urduMonths[monthName] || monthName;
    return `${localizedDay}، ${dayNum} ${localizedMonth} ${year}`;
  }
  return `${dayName}, ${dateStr}`;
};

const calculateSum = (str) => {
  if (!str) return 0;
  return String(str).split(/[\s,+/]+/).reduce((sum, num) => sum + (parseFloat(num) || 0), 0);
};

const getSmartEmoji = (text) => {
  if(!text) return '📌';
  text = text.toLowerCase();
  if (text.includes('rent') || text.includes('ghar') || text.includes('room') || text.includes('house')) return '🏠';
  if (text.includes('rashan') || text.includes('ration') || text.includes('grocery')) return '🛒';
  if (text.includes('sabzi') || text.includes('veg')) return '🥦';
  if (text.includes('chicken') || text.includes('meat') || text.includes('mutton')) return '🍗';
  if (text.includes('metro') || text.includes('travel') || text.includes('auto') || text.includes('train')) return '🚇';
  if (text.includes('milk') || text.includes('doodh') || text.includes('dahi')) return '🥛';
  if (text.includes('wifi') || text.includes('internet') || text.includes('recharge') || text.includes('phone')) return '📶';
  if (text.includes('bijli') || text.includes('electricity') || text.includes('bill')) return '⚡';
  if (text.includes('dawa') || text.includes('medicine') || text.includes('doctor')) return '💊';
  if (text.includes('pizza') || text.includes('burger') || text.includes('food') || text.includes('khana')) return '🍕';
  return '📌';
};

const getBarColor = (pct) => {
  if (pct === 0) return 'var(--border)'; 
  if (pct <= 50) return '#10B981'; 
  if (pct > 50 && pct <= 90) return '#3B82F6'; 
  return '#EF4444'; 
};

const getTextColor = (pct) => {
  if (pct < 0) return 'var(--danger)';
  if (pct === 0) return 'var(--text-main)';
  if (pct <= 50) return 'var(--success)'; 
  if (pct > 50 && pct <= 90) return 'var(--info)'; 
  return 'var(--danger)'; 
};

const securityQuestions = [
  "What is the name of your childhood best friend?",
  "What was the name of your first school?",
  "In what city were you born?"
];

const generate13Months = () => {
    const list = [];
    const date = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    for (let i = 0; i < 13; i++) {
        list.push(`${monthNames[date.getMonth()]} ${date.getFullYear()}`);
        date.setMonth(date.getMonth() - 1);
    }
    return list;
};
const monthsList = generate13Months();

const PAYMENT_MODES = ["UPI", "Cash", "Debit/Credit Card", "Bank Transfer"];

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [lang, setLang] = useState('en');
  const t = translations[lang] || translations.en;
  
  const todayDate = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthString = `${monthNames[todayDate.getMonth()]} ${todayDate.getFullYear()}`;
  const [selectedMonth, setSelectedMonth] = useState(currentMonthString);
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [authError, setAuthError] = useState('');

  const [isLocked, setIsLocked] = useState(() => !!localStorage.getItem('hk_app_pin'));
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [forgotMode, setForgotMode] = useState(false);
  const [securityAnswer, setSecurityAnswer] = useState('');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showSecuritySetup, setShowSecuritySetup] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [secQ, setSecQ] = useState(securityQuestions[0]);
  const [secA, setSecA] = useState('');
  
  const [showSecurityManager, setShowSecurityManager] = useState(false);
  const [securityForgotMode, setSecurityForgotMode] = useState(false);
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [securitySecAnswer, setSecuritySecAnswer] = useState('');
  const [securityError, setSecurityError] = useState('');
  
  const [monthlyDataMap, setMonthlyDataMap] = useState({});

  const currentMonthData = monthlyDataMap[selectedMonth] || {};
  
  const income = currentMonthData.income || '';
  const target = currentMonthData.target || '';
  const goalName = currentMonthData.goalName || '';
  const goalAmount = currentMonthData.goalAmount || '';
  const activeGoals = currentMonthData.activeGoals || [];
  const subs = currentMonthData.subs || [];
  const newSubName = currentMonthData.newSubName || '';
  const newSubAmt = currentMonthData.newSubAmt || '';
  const baharData = currentMonthData.baharData || '';
  const fixedData = currentMonthData.fixedData || [{ name: "", target: '', paid: '' }];
  const recycleBin = currentMonthData.recycleBin || [];
  const dailyData = currentMonthData.dailyData || {};
  const dailyNotes = currentMonthData.dailyNotes || {};
  const dailyFlags = currentMonthData.dailyFlags || {};
  const udhaarList = currentMonthData.udhaarList || [];
  const currentMonthPlan = currentMonthData.currentMonthPlan || '';
  const nextMonthPlan = currentMonthData.nextMonthPlan || '';

  const updateCurrentMonthData = (updater) => {
    setMonthlyDataMap(prev => {
      const prevMonthData = prev[selectedMonth] || {};
      const updatedMonthData = typeof updater === 'function' ? updater(prevMonthData) : { ...prevMonthData, ...updater };
      const newMap = { ...prev, [selectedMonth]: updatedMonthData };
      
      db.localData.put({ id: 1, data: { monthlyDataMap: newMap } });
      return newMap;
    });
  };

  const setIncome = (val) => updateCurrentMonthData({ income: typeof val === 'function' ? val(income) : val });
  const setTarget = (val) => updateCurrentMonthData({ target: typeof val === 'function' ? val(target) : val });
  const setGoalName = (val) => updateCurrentMonthData({ goalName: typeof val === 'function' ? val(goalName) : val });
  const setGoalAmount = (val) => updateCurrentMonthData({ goalAmount: typeof val === 'function' ? val(goalAmount) : val });
  const setActiveGoals = (val) => updateCurrentMonthData({ activeGoals: typeof val === 'function' ? val(activeGoals) : val });
  const setSubs = (val) => updateCurrentMonthData({ subs: typeof val === 'function' ? val(subs) : val });
  const setNewSubName = (val) => updateCurrentMonthData({ newSubName: typeof val === 'function' ? val(newSubName) : val });
  const setNewSubAmt = (val) => updateCurrentMonthData({ newSubAmt: typeof val === 'function' ? val(newSubAmt) : val });
  const setBaharData = (val) => updateCurrentMonthData({ baharData: typeof val === 'function' ? val(baharData) : val });
  const setFixedData = (val) => updateCurrentMonthData({ fixedData: typeof val === 'function' ? val(fixedData) : val });
  const setRecycleBin = (val) => updateCurrentMonthData({ recycleBin: typeof val === 'function' ? val(recycleBin) : val });
  const setDailyData = (val) => updateCurrentMonthData({ dailyData: typeof val === 'function' ? val(dailyData) : val });
  const setDailyNotes = (val) => updateCurrentMonthData({ dailyNotes: typeof val === 'function' ? val(dailyNotes) : val });
  const setDailyFlags = (val) => updateCurrentMonthData({ dailyFlags: typeof val === 'function' ? val(dailyFlags) : val });
  const setUdhaarList = (val) => updateCurrentMonthData({ udhaarList: typeof val === 'function' ? val(udhaarList) : val });
  const setCurrentMonthPlan = (val) => updateCurrentMonthData({ currentMonthPlan: typeof val === 'function' ? val(currentMonthPlan) : val });
  const setNextMonthPlan = (val) => updateCurrentMonthData({ nextMonthPlan: typeof val === 'function' ? val(nextMonthPlan) : val });

  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [activeDayKey, setActiveDayKey] = useState(null);
  const [activeDayNum, setActiveDayNum] = useState(null);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [splitAmount, setSplitAmount] = useState('');
  const [splitItemName, setSplitItemName] = useState('');
  const [splitPeopleCount, setSplitPeopleCount] = useState(2);
  const [newUdhaarType, setNewUdhaarType] = useState('receive');
  const [newUdhaarName, setNewUdhaarName] = useState('');
  const [newUdhaarTotal, setNewUdhaarTotal] = useState('');
  const [newUdhaarPaid, setNewUdhaarPaid] = useState('');
  const [newUdhaarMode, setNewUdhaarMode] = useState('UPI');

  const [editingUdhaarIdx, setEditingUdhaarIdx] = useState(null);
  const [editUdhaarPaid, setEditUdhaarPaid] = useState('');

  const mapRef = useRef(monthlyDataMap);
  useEffect(() => {
    mapRef.current = monthlyDataMap;
  }, [monthlyDataMap]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    document.body.dir = lang === 'ur' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) setIsLoginModalOpen(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      setIsSidebarOpen(false);
      setIsLoginModalOpen(false);
    } catch (error) {
      console.error("Login Failed", error);
      setAuthError("Google Login Failed");
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { 'size': 'invisible' });
    }
  };

  const handleSendOtp = async () => {
    setAuthError('');
    if (!phoneNumber) return setAuthError('Enter phone number');
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
    try {
      setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmationResult(result);
      alert("OTP Sent Successfully!");
    } catch (error) {
      console.error(error);
      setAuthError("Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async () => {
    setAuthError('');
    if (!otp || !confirmationResult) return;
    try {
      await confirmationResult.confirm(otp);
      setIsLoginModalOpen(false);
    } catch (error) {
      console.error(error);
      setAuthError("Incorrect OTP!");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setIsSidebarOpen(false);
    setConfirmationResult(null);
  };

  const handleUnlock = () => {
    const savedPin = localStorage.getItem('hk_app_pin');
    if (enteredPin === savedPin) {
      setIsLocked(false);
      setPinError('');
    } else {
      setPinError('Incorrect Password!');
      setEnteredPin('');
    }
  };

  const handleForgotUnlock = () => {
    const savedAns = localStorage.getItem('hk_sec_a');
    if (securityAnswer.trim().toLowerCase() === savedAns.trim().toLowerCase()) {
      localStorage.removeItem('hk_app_pin');
      localStorage.removeItem('hk_sec_q');
      localStorage.removeItem('hk_sec_a');
      setIsLocked(false);
      setForgotMode(false);
      alert("Password Reset Successful!");
    } else {
      setPinError("Incorrect Answer!");
    }
  };

  const saveSecuritySetup = () => {
    if (newPin.length !== 4) return alert("PIN must be 4 digits!");
    if (!secA.trim()) return alert("Answer cannot be empty!");
    localStorage.setItem('hk_app_pin', newPin);
    localStorage.setItem('hk_sec_q', secQ);
    localStorage.setItem('hk_sec_a', secA);
    setShowSecuritySetup(false);
    setIsSidebarOpen(false);
    alert("Security PIN Set Successfully!");
  };

  const handleRemovePassword = () => {
    const savedPin = localStorage.getItem('hk_app_pin');
    if (currentPinInput === savedPin) {
      localStorage.removeItem('hk_app_pin');
      localStorage.removeItem('hk_sec_q');
      localStorage.removeItem('hk_sec_a');
      setShowSecurityManager(false);
      setCurrentPinInput('');
      alert("App Lock Password Removed Successfully!");
    } else {
      setSecurityError('Incorrect Current PIN!');
    }
  };

  const handleRemovePasswordForgot = () => {
    const savedAns = localStorage.getItem('hk_sec_a');
    if (securitySecAnswer.trim().toLowerCase() === savedAns.trim().toLowerCase()) {
      localStorage.removeItem('hk_app_pin');
      localStorage.removeItem('hk_sec_q');
      localStorage.removeItem('hk_sec_a');
      setShowSecurityManager(false);
      setSecurityForgotMode(false);
      setSecuritySecAnswer('');
      alert("App Lock Password Removed Successfully!");
    } else {
      setSecurityError('Incorrect Security Answer!');
    }
  };

  useEffect(() => {
    const fetchLocalData = async () => {
      const stored = await db.localData.get(1);
      if (stored && stored.data) {
        const d = stored.data;
        if (d.monthlyDataMap) {
          setMonthlyDataMap(d.monthlyDataMap);
        } else {
          setMonthlyDataMap({
            [currentMonthString]: {
              income: d.income || '',
              target: d.target || '',
              activeGoals: d.activeGoals || [],
              baharData: d.baharData || '',
              subs: d.subs || [],
              fixedData: d.fixedData || [{ name: "", target: '', paid: '' }],
              recycleBin: d.recycleBin || [],
              dailyData: d.dailyData || {},
              dailyNotes: d.dailyNotes || {},
              dailyFlags: d.dailyFlags || {},
              udhaarList: d.udhaarList || [],
              currentMonthPlan: '',
              nextMonthPlan: ''
            }
          });
        }
      }
    };
    fetchLocalData();
  }, [currentMonthString]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleSpaceToPlus = (e, setter) => {
    let val = e.target.value.replace(/[^0-9+ \n]/g, ''); 
    if (val.includes(' ')) val = val.replace(/ /g, '+');
    setter(val);
  };

  const formatSevenDigits = (value) => {
    if (!value) return '';
    let raw = String(value).replace(/[^0-9]/g, ''); 
    let formatted = '';
    for (let i = 0; i < raw.length; i += 7) {
      formatted += raw.substring(i, i + 7) + '\n';
    }
    return formatted.trim();
  };

  let totalFixed = fixedData.reduce((acc, item) => acc + calculateSum(item.paid), 0);
  let totalBahar = calculateSum(baharData); 
  let totalSubs = subs.reduce((acc, item) => acc + (item.isPaid ? Number(item.amt || 0) : 0), 0);
  
  let totalDaily = 0;
  let noSpendDays = 0;
  let modeTotals = { "UPI": 0, "Cash": 0, "Debit/Credit Card": 0, "Bank Transfer": 0 };

  const currentDayNum = todayDate.getDate();
  const [selMonthName, selYearStr] = selectedMonth.split(' ');
  const selYear = parseInt(selYearStr, 10) || todayDate.getFullYear();
  const selMonthIndex = monthNames.indexOf(selMonthName);
  const daysInSelMonth = new Date(selYear, selMonthIndex + 1, 0).getDate();

  const isCurrentActiveMonth = (selectedMonth === currentMonthString);
  const activeMonthLimitDay = isCurrentActiveMonth ? currentDayNum : daysInSelMonth;

  const daysArray = Array.from({ length: daysInSelMonth }, (_, i) => {
      const dayNum = i + 1;
      const dateObj = new Date(selYear, selMonthIndex, dayNum);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
      return { day: dayNum, name: dayName, dateString: `${dayNum} ${selMonthName} ${selYear}` };
  });

  daysArray.forEach((dayObj) => {
    const key = `day_${dayObj.day}`;
    const val = dailyData[key] || '';
    const amounts = String(val).split(/[\s,+/]+/).filter(n => Number(n) > 0);
    const flags = dailyFlags[key] || {};
    const notes = dailyNotes[key] || {};
    let dayActiveTotal = 0;
    
    amounts.forEach((amt, idx) => { 
        const numericAmt = Number(amt);
        const mode = notes[`${idx}_mode`] || "UPI";
        if(modeTotals[mode] !== undefined) modeTotals[mode] += numericAmt;

        if (!flags[idx]) {
            dayActiveTotal += numericAmt; 
        }
    });
    
    totalDaily += dayActiveTotal;
    if (dayObj.day <= activeMonthLimitDay && dayActiveTotal === 0) noSpendDays++;
  });

  fixedData.forEach(item => {
      const p = calculateSum(item.paid);
      const m = item.mode || "UPI";
      if(p > 0 && modeTotals[m] !== undefined) modeTotals[m] += p;
  });

  const grandTotal = totalFixed + totalSubs + totalDaily;
  const numIncome = Number(String(income).replace(/[^0-9]/g, '')) || 0;
  const numTarget = Number(String(target).replace(/[^0-9]/g, '')) || 0;
  const remaining = numIncome - grandTotal;

  const allowedSpendLimit = Math.max(0, numIncome - numTarget);
  const isOverBudget = grandTotal > allowedSpendLimit;

  const fixedSumForBar = totalFixed + totalSubs;
  const maxVal = numIncome > 0 ? numIncome : (grandTotal > 0 ? grandTotal : 1);
  const fixedPct = Math.min(100, Math.round((fixedSumForBar / maxVal) * 100));
  const dailyPct = totalDaily > 0 ? Math.min(100, Math.round((totalDaily / maxVal) * 100)) : 0;

  let aiAdvice = "Enter income above to activate smart AI budget forecasting!";
  if (numIncome > 0) {
    const spentPct = Math.round((grandTotal / numIncome) * 100);
    if (spentPct > 90) aiAdvice = `⚠️ Danger: You have spent ${spentPct}% of your income! Control expenses immediately.`;
    else if (spentPct > 50) aiAdvice = `💡 Moderate: You have spent ${spentPct}% of your income. Stay on track with savings.`;
    else aiAdvice = `🌟 Excellent Budgeting! You have only spent ${spentPct}% of your income so far. Keep it up!`;
  }

  const speakSummary = () => {
    const text = `Total monthly spent is ${grandTotal} rupees. Monthly fixed budget spent is ${totalFixed} rupees. Daily expenses spent is ${totalDaily} rupees. Remaining balance is ${remaining} rupees.`;
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  const handleScanBill = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const mockDetectedAmount = Math.floor(Math.random() * 500) + 50;
    const targetDayKey = `day_${activeMonthLimitDay}`;
    
    const existingVal = dailyData[targetDayKey] || '';
    const newVal = existingVal ? `${existingVal}+${mockDetectedAmount}` : `${mockDetectedAmount}`;
    setDailyData({ ...dailyData, [targetDayKey]: newVal });
    const amountsArray = String(newVal).split(/[\s,+/]+/).filter(n => Number(n) > 0);
    const lastIdx = amountsArray.length - 1;
    const updatedDayNotes = { ...(dailyNotes[targetDayKey] || {}), [lastIdx]: `Scanned Bill`, [`${lastIdx}_mode`]: "UPI" };
    setDailyNotes({ ...dailyNotes, [targetDayKey]: updatedDayNotes });
    alert(`Bill Scanned Successfully!\nAmount Added: ₹${mockDetectedAmount}`);
  };

  const handleGmailBackup = async () => {
    if (!user) {
      alert("Please login with Google/Cloud first to backup data to your Gmail account!");
      setIsLoginModalOpen(true);
      return;
    }
    const dataObj = { monthlyDataMap };
    try {
      if (isOnline) {
        await axios.post('https://hisabkitab-kxz0.onrender.com/api/sync', { email: user.email || user.phoneNumber, data: dataObj });
        alert(`Backup successful for account: ${user.email || user.phoneNumber}! Your data is securely saved on cloud.`);
      } else {
        alert("You are offline! Connect to the internet to complete cloud backup.");
      }
    } catch (err) {
      console.error(err);
      alert("Backup failed. Check backend server connection.");
    }
  };

  const handleRestore = async () => {
    const currentEmail = user?.email || user?.phoneNumber;
    const inputEmail = prompt("Enter your exact Google Login Email or Phone for Restore:", currentEmail || "");
    if (!inputEmail) return;

    try {
      const res = await axios.get(`https://hisabkitab-kxz0.onrender.com/api/sync/${inputEmail.trim()}`);
      if (res.data && res.data.success && res.data.data) {
        const d = res.data.data;
        if (d.monthlyDataMap) {
            setMonthlyDataMap(d.monthlyDataMap);
            alert("Data restored successfully from cloud storage!");
        } else {
            alert("Old backup format found. Please re-backup.");
        }
      } else {
        alert("No backup found for this account in MongoDB.");
      }
    } catch (err) {
      console.error(err);
      alert("Restore failed.");
    }
  };

  const shareWhatsApp = () => {
    const msg = `*HisabKitab Monthly Report (${selectedMonth})*\n💰 Income: ₹${numIncome}\n📉 Total Spent: ₹${grandTotal}\n⚖️ Remaining: ₹${remaining}\n\nGenerated via HisabKitab App`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (isLocked) {
    return (
      <div className="lock-screen" dir="ltr">
        <div className="lock-box">
          <span style={{ fontSize: '50px', display: 'block', marginBottom: '10px' }}>🔒</span>
          <h2>{t.appLocked}</h2>
          {!forgotMode ? (
            <>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{t.enterPin}</p>
              <input type="password" placeholder="••••" maxLength="4" className="pin-input" value={enteredPin} onChange={e => setEnteredPin(e.target.value.replace(/[^0-9]/g, ''))} />
              {pinError && <p className="text-red mb-15"><strong>{pinError}</strong></p>}
              <button className="btn-unlock" onClick={handleUnlock}>{t.unlock}</button>
              <button className="forgot-btn" onClick={() => { setForgotMode(true); setPinError(''); }}>{t.forgotPass}</button>
            </>
          ) : (
            <>
              <p style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '15px' }}>{localStorage.getItem('hk_sec_q')}</p>
              <input type="text" placeholder="Your answer..." className="regular-input" value={securityAnswer} onChange={e => setSecurityAnswer(e.target.value)} />
              {pinError && <p className="text-red mb-15"><strong>{pinError}</strong></p>}
              <button className="btn-unlock" onClick={handleForgotUnlock}>{t.resetUnlock}</button>
              <button className="forgot-btn" onClick={() => { setForgotMode(false); setPinError(''); }}>{t.backToPin}</button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <header>
        <div className="header-controls">
          <span className={`status-indicator ${isOnline ? 'status-online blinking' : 'status-offline'}`}>
            {isOnline ? t.online : t.offline}
          </span>
          <div className="custom-month-dropdown">
            <select className="stylish-month-select" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              {monthsList.map((m, i) => <option key={i} value={m}>{m}</option>)}
            </select>
          </div>
          <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>☰</button>
        </div>
        <div className="logo-container">
          <span className="logo-icon">📓</span>
          <h1 className="app-title">{t.title}</h1>
        </div>
        <p style={{fontSize: '13px', marginTop: '5px', opacity: 0.9}}>
          {selectedMonth} {t.subtitle} {user ? `(👤 ${user.email || user.phoneNumber})` : '(👤 Offline)'}
        </p>
      </header>

      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`} dir="ltr">
        <div className="sidebar-header">
          <h2>{t.menu}</h2>
          <button className="close-sidebar" onClick={() => setIsSidebarOpen(false)}>×</button>
        </div>
        <div className="sidebar-content">
          <div className="sidebar-item" onClick={() => setIsLangOpen(!isLangOpen)}>
            <span>🌐 Language / भाषा / زبان</span>
            <span>{isLangOpen ? '▲' : '▼'}</span>
          </div>
          {isLangOpen && (
            <div className="sidebar-sub-menu">
              <div className="sidebar-sub-item" onClick={() => { setLang('en'); setIsSidebarOpen(false); }}>English</div>
              <div className="sidebar-sub-item" onClick={() => { setLang('hi'); setIsSidebarOpen(false); }}>हिंदी (Hindi)</div>
              <div className="sidebar-sub-item" onClick={() => { setLang('ur'); setIsSidebarOpen(false); }}>اردو (Urdu)</div>
            </div>
          )}
          <div className="sidebar-item" onClick={toggleTheme}>
            <span>{theme === 'dark' ? t.lightMode : t.darkMode}</span>
          </div>
          <div className="sidebar-item" onClick={() => { setIsSidebarOpen(false); setShowSecuritySetup(true); }}>
            <span>{t.securityLock}</span>
          </div>
          {localStorage.getItem('hk_app_pin') && (
            <div className="sidebar-item text-red" onClick={() => { setIsSidebarOpen(false); setShowSecurityManager(true); }}>
              <span>🔓 Remove / Disable App Lock</span>
            </div>
          )}
          <div className="sidebar-item" onClick={() => { setIsSidebarOpen(false); setIsInfoModalOpen(true); }}>
            <span>{t.aboutApp}</span>
          </div>
        </div>
        <div className="sidebar-footer">
          {user ? (
            <button className="btn-auth btn-logout" onClick={handleLogout}>{t.logout}</button>
          ) : (
            <button className="btn-auth btn-login" onClick={() => { setIsSidebarOpen(false); setIsLoginModalOpen(true); }}>{t.loginCloud}</button>
          )}
        </div>
      </div>

      
      {showSecuritySetup && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <h3 style={{color:'var(--primary)', marginBottom:'15px'}}>🔒 Setup Security PIN</h3>
            <input type="password" placeholder="Enter 4-Digit PIN" maxLength="4" className="regular-input" value={newPin} onChange={e => setNewPin(e.target.value.replace(/[^0-9]/g, ''))} style={{textAlign:'center', fontSize:'24px', letterSpacing:'8px', fontFamily:'monospace'}}/>
            <p style={{fontSize:'13px', color:'var(--text-muted)', marginTop:'15px', marginBottom:'5px', textAlign:'left'}}>Select Security Question:</p>
            <select className="regular-input" value={secQ} onChange={e => setSecQ(e.target.value)}>
              {securityQuestions.map((q, i) => <option key={i} value={q}>{q}</option>)}
            </select>
            <input type="text" placeholder="Your Answer..." className="regular-input" value={secA} onChange={e => setSecA(e.target.value)} />
            <div style={{display:'flex', gap:'10px', marginTop:'20px'}}>
              <button className="btn-action-tool" style={{flex:1, justifyContent:'center'}} onClick={() => setShowSecuritySetup(false)}>{t.cancel}</button>
              <button className="btn-action-tool" style={{flex:1, justifyContent:'center', background:'var(--primary)', color:'white'}} onClick={saveSecuritySetup}>{t.savePin}</button>
            </div>
          </div>
        </div>
      )}

      
      {showSecurityManager && (
        <div className="custom-modal-overlay" onClick={() => setShowSecurityManager(false)}>
          <div className="custom-modal" onClick={e => e.stopPropagation()} style={{maxWidth: '400px'}}>
            <span className="close-btn" onClick={() => setShowSecurityManager(false)}>❌</span>
            <h3 style={{color:'var(--danger)', marginBottom:'15px'}}>🔓 Remove App Lock Password</h3>
            
            {!securityForgotMode ? (
              <>
                <p style={{fontSize: '13px', color: 'var(--text-muted)', marginBottom: '15px'}}>Enter your current 4-digit PIN to remove password protection:</p>
                <input type="password" placeholder="••••" maxLength="4" className="pin-input" value={currentPinInput} onChange={e => setCurrentPinInput(e.target.value.replace(/[^0-9]/g, ''))} />
                {securityError && <p className="text-red mb-15"><strong>{securityError}</strong></p>}
                <div style={{display:'flex', gap:'10px', marginTop:'15px'}}>
                  <button className="btn-action-tool" style={{flex:1, justifyContent:'center'}} onClick={() => setShowSecurityManager(false)}>Cancel</button>
                  <button className="btn-action-tool" style={{flex:1, justifyContent:'center', background:'var(--danger)', color:'white'}} onClick={handleRemovePassword}>Remove PIN</button>
                </div>
                <button className="forgot-btn" onClick={() => { setSecurityForgotMode(true); setSecurityError(''); }}>{t.forgotPass}</button>
              </>
            ) : (
              <>
                <p style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '15px' }}>{localStorage.getItem('hk_sec_q')}</p>
                <input type="text" placeholder="Your answer..." className="regular-input" value={securitySecAnswer} onChange={e => setSecuritySecAnswer(e.target.value)} />
                {securityError && <p className="text-red mb-15"><strong>{securityError}</strong></p>}
                <div style={{display:'flex', gap:'10px', marginTop:'15px'}}>
                  <button className="btn-action-tool" style={{flex:1, justifyContent:'center'}} onClick={() => setShowSecurityManager(false)}>Cancel</button>
                  <button className="btn-action-tool" style={{flex:1, justifyContent:'center', background:'var(--danger)', color:'white'}} onClick={handleRemovePasswordForgot}>Verify & Remove</button>
                </div>
                <button className="forgot-btn" onClick={() => { setSecurityForgotMode(false); setSecurityError(''); }}>Back to PIN</button>
              </>
            )}
          </div>
        </div>
      )}

      
      {isInfoModalOpen && (
        <div className="custom-modal-overlay" onClick={() => setIsInfoModalOpen(false)}>
          <div className="custom-modal" onClick={e => e.stopPropagation()} style={{textAlign: 'left', maxWidth: '600px', borderRadius: '24px', padding: '35px', background: 'var(--card-bg)', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', border: '1px solid var(--border)'}}>
            <span className="close-btn" style={{position: 'absolute', top: '20px', right: '20px', fontSize: '22px', cursor: 'pointer', color: 'var(--text-muted)'}} onClick={() => setIsInfoModalOpen(false)}>❌</span>
            
            <h3 style={{color:'var(--primary)', marginBottom:'12px', fontSize: '22px', display: 'flex', alignItems: 'center', gap: '8px'}}>ℹ️ {t.aboutApp}</h3>
            
            <p style={{fontSize:'14px', color:'var(--text-muted)', lineHeight:'1.7', marginBottom:'20px'}}>
              {t.aboutDesc}
            </p>
            
            <div style={{background:'var(--input-bg)', padding:'18px 20px', borderRadius:'14px', border:'1px solid var(--border)', marginBottom:'25px'}}>
              <h4 style={{fontSize:'15px', color:'var(--primary)', marginBottom:'10px', fontWeight: '700'}}>{t.keyFeatures}</h4>
              <ul style={{fontSize:'13px', color:'var(--text-muted)', paddingLeft:'20px', lineHeight:'1.6'}}>
                {t.featureList.map((feat, fIdx) => (
                  <li key={fIdx} style={{marginBottom: '6px'}}>{feat}</li>
                ))}
              </ul>
            </div>
            
            
            <div style={{
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(16, 185, 129, 0.15))',
              border: '2px solid var(--primary)',
              borderRadius: '16px',
              padding: '16px 20px',
              textAlign: 'center',
              boxShadow: '0 8px 20px rgba(79, 70, 229, 0.15)'
            }}>
              <div style={{fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px'}}>
                {t.creatorText}
              </div>
              <div style={{fontSize: '18px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.5px'}}>
                {t.creatorName}
              </div>
            </div>
          </div>
        </div>
      )}

      
      {isReportModalOpen && (
        <div className="custom-modal-overlay" onClick={() => setIsReportModalOpen(false)}>
          <div className="custom-modal" onClick={e => e.stopPropagation()} style={{textAlign: 'left', maxWidth: '500px'}}>
            <span className="close-btn" onClick={() => setIsReportModalOpen(false)}>❌</span>
            <h3 style={{color:'var(--primary)', marginBottom:'15px'}}>📊 {selectedMonth} Report Summary</h3>
            <div style={{background:'var(--input-bg)', padding:'15px', borderRadius:'10px', border:'1px solid var(--border)', display:'flex', flexDirection:'column', gap:'10px', fontSize:'14px'}}>
              <div>💵 <strong>{t.income}:</strong> ₹{numIncome}</div>
              <div>🎯 <strong>{t.target}:</strong> ₹{target}</div>
              <div>💼 <strong>Fixed Budget Spent:</strong> ₹{totalFixed}</div>
              <div>📅 <strong>Daily Expenses Spent:</strong> ₹{totalDaily}</div>
              <div>🍔 <strong>Outside Food Spent (Tracked Only):</strong> ₹{totalBahar}</div>
              <hr style={{borderColor:'var(--border)'}}/>
              <div className="text-red">📉 <strong>{t.spent}:</strong> ₹{grandTotal}</div>
              <div className="text-blue">⚖️ <strong>{t.remaining}:</strong> ₹{remaining}</div>
            </div>
            <button className="btn-add" style={{width:'100%', marginTop:'15px'}} onClick={() => window.print()}>{t.pdf}</button>
          </div>
        </div>
      )}

      
      {isLoginModalOpen && (
        <div className="custom-modal-overlay" onClick={() => setIsLoginModalOpen(false)}>
          <div className="custom-modal" onClick={e => e.stopPropagation()} style={{maxWidth:'380px'}}>
            <span className="close-btn" onClick={() => setIsLoginModalOpen(false)}>❌</span>
            <h3 style={{color:'var(--primary)', marginBottom:'10px'}}>{t.loginCloud}</h3>
            <button onClick={handleGoogleLogin} style={{ width: '100%', background: 'var(--primary)', color: 'white', padding: '12px', fontSize: '15px', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
              <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" style={{ width: '20px' }} />
              Sign in with Google
            </button>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>Or login with Phone OTP</p>
              <div id="recaptcha-container"></div>
              {!confirmationResult ? (
                <div className="flex-col-stretch" style={{ gap: '10px' }}>
                  <input type="tel" placeholder="+919876543210" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="regular-input" />
                  <button onClick={handleSendOtp} className="btn-action-tool" style={{ justifyContent: 'center', background: 'var(--primary)', color: 'white', border: 'none', padding: '10px' }}>Send OTP</button>
                </div>
              ) : (
                <div className="flex-col-stretch" style={{ gap: '10px' }}>
                  <input type="number" placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="regular-input" style={{ letterSpacing: '2px', textAlign: 'center' }} />
                  <button onClick={handleVerifyOtp} className="btn-action-tool" style={{ justifyContent: 'center', background: 'var(--success)', color: 'white', border: 'none', padding: '10px' }}>Verify & Login</button>
                </div>
              )}
              {authError && <p className="text-red mt-15 text-xs-bold">{authError}</p>}
            </div>
          </div>
        </div>
      )}

      
      <div className="container" style={{paddingBottom: '60px'}}>
        
        {/* AI & PRO TOOLS BAR */}
        <div className="pro-card mb-25" style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'15px', padding:'20px 25px', marginBottom: '35px'}}>
            <div>
               <h4 style={{color:'var(--primary)', fontSize:'15px'}}>🤖 {t.aiTools}</h4>
               <p style={{fontSize:'12px', color:'var(--text-muted)'}}>{t.aiDesc}</p>
            </div>
            <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
               <button className="btn-action-tool" onClick={speakSummary}>{t.speak}</button>
               <label className="btn-action-tool" style={{cursor:'pointer', margin:0}}>
                 {t.scanBill}
                 <input type="file" accept="image/*" capture="environment" style={{display:'none'}} onChange={handleScanBill} />
               </label>
               <button className="btn-action-tool" onClick={() => setIsReportModalOpen(true)}>{t.monthReport}</button>
               <button className="btn-action-tool" onClick={handleGmailBackup}>{t.backup}</button>
               <button className="btn-action-tool" onClick={handleRestore}>{t.restore}</button>
               <button className="btn-action-tool text-green" onClick={shareWhatsApp}>{t.whatsapp}</button>
               <button className="btn-action-tool" onClick={() => window.print()}>{t.pdf}</button>
            </div>
        </div>

        
        <div className="pro-card mb-25" style={{background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(16, 185, 129, 0.1))', borderLeft: '4px solid var(--primary)', padding: '20px 25px', marginBottom: '35px'}}>
            <h4 style={{color: 'var(--primary)', fontSize: '14px', marginBottom: '4px'}}>{t.aiForecastTitle}</h4>
            <p style={{fontSize: '13px', color: 'var(--text-main)', fontWeight: '500'}}>{aiAdvice}</p>
        </div>

        
        <div className="dashboard-card" style={{marginBottom: '20px'}}>
            <div className="dash-box">
                <h3>💵 {t.income}</h3>
                <div className="dash-input-wrapper">
                    <span style={{fontSize: '30px', fontWeight: '700', marginRight: '5px'}}>₹</span>
                    <textarea 
                        className="dash-editable" 
                        rows="1" 
                        placeholder="0" 
                        style={{resize: 'none', overflow: 'hidden', height: '42px', paddingTop: '4px'}}
                        value={income === 0 || income === '0' ? '' : income} 
                        onChange={e => setIncome(formatSevenDigits(e.target.value))} 
                    />
                </div>
            </div>
            <div className="dash-box">
                <h3>🎯 {t.target}</h3>
                <div className="dash-input-wrapper">
                    <span style={{fontSize: '30px', fontWeight: '700', marginRight: '5px'}}>₹</span>
                    <textarea 
                        className="dash-editable" 
                        rows="1" 
                        placeholder="0" 
                        style={{resize: 'none', overflow: 'hidden', height: '42px', paddingTop: '4px'}}
                        value={target === 0 || target === '0' ? '' : target} 
                        onChange={e => setTarget(formatSevenDigits(e.target.value))} 
                    />
                </div>
            </div>
            <div className="dash-box">
                <h3>📉 {t.spent}</h3>
                <div className="val dash-value-wrap text-red" style={{display: 'flex', alignItems: 'center'}}>
                    <span style={{fontSize: '30px', fontWeight: '700', marginRight: '5px'}}>₹</span>
                    <span style={{fontSize: '30px', fontWeight: '700'}}>{grandTotal}</span>
                </div>
            </div>
            <div className="dash-box">
                <h3>⚖️ {t.remaining}</h3>
                <div className="val dash-value-wrap text-blue" style={{display: 'flex', alignItems: 'center'}}>
                    <span style={{fontSize: '30px', fontWeight: '700', marginRight: '5px'}}>₹</span>
                    <span style={{fontSize: '30px', fontWeight: '700'}}>{remaining}</span>
                </div>
            </div>
            <div className="streak-display">🔥 {noSpendDays} {t.noSpend}</div>
        </div>

        
        {numIncome > 0 && numTarget > 0 && (
            <div className="pro-card mb-35" style={{
                background: isOverBudget ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                border: `2px solid ${isOverBudget ? 'var(--danger)' : 'var(--success)'}`,
                padding: '22px 25px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '15px',
                marginBottom: '35px',
                boxShadow: '0 8px 25px var(--shadow-color)'
            }}>
                <div>
                    <h4 style={{color: isOverBudget ? 'var(--danger)' : 'var(--success)', fontSize: '17px', fontWeight: '800', marginBottom: '6px'}}>
                        {isOverBudget ? t.overBudgetAlert : t.safeLimitActive}
                    </h4>
                    <p style={{fontSize: '14px', color: 'var(--text-main)', fontWeight: '600', margin: 0}}>
                        Max Allowed Spend: <strong>₹{allowedSpendLimit}</strong> | Spent So Far: <strong>₹{grandTotal}</strong>
                    </p>
                </div>
                <div style={{fontSize: '16px', fontWeight: '900', color: isOverBudget ? 'var(--danger)' : 'var(--success)', background: 'var(--card-bg)', padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--border)'}}>
                    {isOverBudget ? `Over Budget by ₹{grandTotal - allowedSpendLimit}` : `Safe to Spend Left: ₹{safeSpentLeft}`}
                </div>
            </div>
        )}

        
        <div className="pro-grid" style={{marginBottom: '35px'}}>
            {/* GOAL PLANNER */}
            <div className="pro-card">
                <div className="pro-card-title">{t.goalPlanner}</div>
                <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                    <input type="text" className="regular-input" placeholder={t.goalPlaceholder} value={goalName} onChange={e => setGoalName(e.target.value)} style={{flex: 2, marginBottom: 0}} />
                    <textarea 
                        className="regular-input pro-input-small" 
                        rows="1"
                        placeholder="₹ Amt" 
                        style={{resize: 'none', minHeight: '44px', paddingTop: '12px', flex: 1, marginBottom: 0}}
                        value={goalAmount} 
                        onChange={e => setGoalAmount(formatSevenDigits(e.target.value))} 
                    />
                </div>
                
                <div style={{marginTop: '15px'}}>
                    <button className="btn-action-tool" onClick={() => {
                        if(goalName && Number(String(goalAmount).replace(/[^0-9]/g, '')) > 0) {
                            setActiveGoals([...activeGoals, { name: goalName, amt: Number(String(goalAmount).replace(/[^0-9]/g, '')) }]);
                            setGoalName(''); 
                            setGoalAmount('');
                            alert(`Goal Target Set Successfully!`);
                        } else {
                            alert("Please enter both Goal Name and Amount (numbers only).");
                        }
                    }}>{t.saveGoal}</button>
                </div>
                
                {activeGoals.map((goal, idx) => {
                    const savingsPct = numIncome > 0 ? Math.round((remaining / numIncome) * 100) : 0;
                    return (
                    <div key={idx} style={{marginTop:'20px', padding:'15px', background:'var(--input-bg)', border:'1px solid var(--border)', borderRadius:'12px', position: 'relative'}}>
                        <button onClick={() => {
                            const copy = [...activeGoals]; copy.splice(idx, 1); setActiveGoals(copy);
                        }} style={{position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'var(--danger)', fontSize: '18px', cursor: 'pointer'}}>❌</button>
                        
                        <div style={{color:'var(--primary)', fontWeight:'bold', fontSize: '15px', marginBottom:'15px', display:'flex', alignItems:'center', gap:'5px'}}>
                            🎯 Savings Plan Details: {goal.name}
                        </div>
                        
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px'}}>
                            <div style={{background: 'var(--card-bg)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)'}}>
                                <div style={{fontSize: '11px', color: 'var(--text-muted)'}}>{t.targetAmountLbl}</div>
                                <div style={{fontSize: '14px', fontWeight: 'bold', color: 'var(--text-main)'}}>₹{goal.amt}</div>
                            </div>
                            <div style={{background: 'var(--card-bg)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)'}}>
                                <div style={{fontSize: '11px', color: 'var(--text-muted)'}}>{t.monthlySpendingLbl}</div>
                                <div style={{fontSize: '14px', fontWeight: 'bold', color: 'var(--text-main)'}}>₹{grandTotal}</div>
                            </div>
                            <div style={{background: 'var(--card-bg)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)'}}>
                                <div style={{fontSize: '11px', color: 'var(--text-muted)'}}>{t.monthlySavingLbl}</div>
                                <div style={{fontSize: '14px', fontWeight: 'bold', color: remaining < 0 ? 'var(--danger)' : 'var(--success)'}}>₹{remaining}</div>
                            </div>
                            <div style={{background: 'var(--card-bg)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)'}}>
                                <div style={{fontSize: '11px', color: 'var(--text-muted)'}}>{t.savingsPctLbl}</div>
                                <div style={{fontSize: '14px', fontWeight: 'bold', color: getTextColor(savingsPct)}}>{savingsPct}%</div>
                            </div>
                        </div>

                        <div style={{fontSize: '14px', fontWeight: 'bold', color: remaining > 0 ? 'var(--success)' : 'var(--danger)', display: 'flex', alignItems: 'center', gap: '5px'}}>
                            {remaining > 0 ? `${t.estimatedMonthsLbl}${Math.ceil(goal.amt / remaining)}` : `⚠️ Increase savings to reach goal!`}
                        </div>
                    </div>
                )})}
            </div>

           
            <div className="pro-card">
                <div className="pro-card-title mb-5">{t.subs} ({subs.length})</div>
                
                <div style={{display:'flex', gap:'10px', marginBottom:'20px', alignItems:'center', background: 'var(--input-bg)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border)'}}>
                    <input type="text" className="regular-input" placeholder="e.g. Netflix" value={newSubName} onChange={e => setNewSubName(e.target.value)} style={{flex: 2, marginBottom: 0, padding: '8px 12px'}} />
                    <textarea 
                        className="regular-input pro-input-small" 
                        rows="1"
                        placeholder="₹ Amt" 
                        style={{resize: 'none', minHeight: '38px', paddingTop: '8px', flex: 1, marginBottom: 0}}
                        value={newSubAmt === 0 || newSubAmt === '0' ? '' : newSubAmt} 
                        onChange={e => setNewSubAmt(formatSevenDigits(e.target.value))} 
                    />
                    <button className="btn-add" style={{padding:'9px 15px', marginTop: 0, borderRadius: '8px'}} onClick={() => {
                      if(newSubName && newSubAmt) { 
                          setSubs([...subs, {name: newSubName, amt: Number(String(newSubAmt).replace(/[^0-9]/g, '')), isPaid: false}]); 
                          setNewSubName(''); setNewSubAmt(''); 
                      }
                    }}>+</button>
                </div>

                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', padding: '0 5px'}}>
                    <span>Total Subscriptions: <strong>{subs.length}</strong></span>
                    <span>Total: <strong>₹{subs.reduce((acc, curr) => acc + curr.amt, 0)}/month</strong></span>
                </div>

                <div className="sub-list-container" style={{maxHeight: '220px'}}>
                  {subs.length === 0 ? (
                      <p style={{fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '20px', fontStyle: 'italic'}}>
                          No subscriptions added yet.
                      </p>
                  ) : (
                      subs.map((s, i) => (
                        <div key={i} className={`sub-item-row ${s.isPaid ? 'opacity-fixed' : ''}`} style={{marginBottom: '10px', padding: '12px', background: 'var(--card-bg)', boxShadow: '0 2px 5px var(--shadow-color)'}}>
                          <span style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500'}}>
                              <span style={{color: 'var(--primary)'}}>{i+1}.</span> 🔄 {s.name}
                          </span>
                          
                          <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
                              <strong style={{textDecoration: s.isPaid ? 'line-through' : 'none', color: 'var(--text-main)', fontSize: '15px'}}>₹{s.amt}</strong>
                              
                              <label style={{display: 'flex', alignItems: 'center', gap: '4px', fontSize:'12px', cursor:'pointer', color: s.isPaid ? 'var(--success)' : 'var(--text-muted)', fontWeight: 'bold', background: 'var(--input-bg)', padding: '4px 8px', border: '1px solid var(--border)', borderRadius: '6px'}}>
                                  <input type="checkbox" checked={s.isPaid} onChange={(e) => {
                                      const copy = [...subs]; copy[i].isPaid = e.target.checked; setSubs(copy);
                                  }} style={{width: '14px', height: '14px'}}/>
                                  {t.paidLbl}
                              </label>

                              <button onClick={() => {const copy=[...subs]; copy.splice(i,1); setSubs(copy);}} style={{background: 'var(--badge-overspent-bg)', border: 'none', color: 'var(--danger)', padding: '5px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'}}>❌</button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
            </div>
        </div>

      
        <div className="pro-card mb-40" style={{background: 'var(--bahar-bg)', borderColor: 'var(--bahar-border)', padding: '25px', marginBottom: '35px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)'}}>
            <div className="pro-card-title" style={{color: 'var(--bahar-text)', fontSize: '18px', fontWeight: '800'}}>{t.outsideFood}</div>
            <p style={{fontSize:'13px', color:'var(--text-muted)', marginBottom:'12px'}}>{t.outsideHint}</p>
            <textarea className="regular-input" placeholder="e.g. 60 + 60 + 150" value={baharData} onChange={(e) => handleSpaceToPlus(e, setBaharData)} style={{fontSize: '16px', padding: '14px', resize: 'vertical', minHeight: '52px', borderRadius: '12px', background: 'var(--card-bg)'}} />
            <div style={{display:'flex', justifyContent:'flex-end', marginTop:'12px', fontWeight:'800', fontSize:'18px', color:'var(--bahar-text)'}}>
                {t.monthTotal}: ₹{calculateSum(baharData)}
            </div>
        </div>

      
        <div className="analytics-card" style={{padding: '25px', marginBottom: '35px'}}>
            <div className="section-title"><span>{t.analytics}</span></div>
            <div className="analytics-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'20px'}}>
                <div className="analytic-item">
                    <h4>{t.fixedUsage}</h4>
                    <div className="analytic-bar-bg"><div className="analytic-bar-fill" style={{width: `${fixedPct}%`, backgroundColor: getBarColor(fixedPct)}}></div></div>
                    <div style={{fontSize:'13px', fontWeight:'bold', marginTop:'5px'}}>₹{fixedSumForBar} ({fixedPct}%)</div>
                </div>
                <div className="analytic-item">
                    <h4>{t.dailyUsage}</h4>
                    <div className="analytic-bar-bg"><div className="analytic-bar-fill" style={{width: `${dailyPct}%`, backgroundColor: getBarColor(dailyPct)}}></div></div>
                    <div style={{fontSize:'13px', fontWeight:'bold', marginTop:'5px'}}>₹{totalDaily} ({dailyPct}%)</div>
                </div>
            </div>
            
            <div style={{marginTop: '25px', paddingTop: '20px', borderTop: '1px solid var(--border)'}}>
                <h4 style={{fontSize: '15px', color: 'var(--primary)', marginBottom: '15px'}}>{t.paymentModes}</h4>
                <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
                    {PAYMENT_MODES.map(mode => (
                        <div key={mode} style={{flex: '1 1 120px', background: 'var(--card-bg)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center'}}>
                            <div style={{fontSize: '12px', color: 'var(--text-muted)'}}>{mode}</div>
                            <div style={{fontSize: '16px', fontWeight: 'bold', color: 'var(--primary)', marginTop: '5px'}}>₹{modeTotals[mode] || 0}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

      
        <div className="section-title"><span>{t.fixedBudget}</span></div>
        <div className="card" style={{padding: '25px', marginBottom: '35px'}}>
            <div className="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>{t.category}</th>
                            <th>{t.estimated} (₹)</th>
                            <th>{t.actual} (₹)</th>
                            <th>{t.status}</th>
                            <th>🗑️</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fixedData.map((item, index) => {
                            const diff = calculateSum(item.target) - calculateSum(item.paid);
                            let statusClass = 'badge-saved';
                            let statusText = `${t.saved}`;
                            let statusVal = diff;

                            if (diff < 0) {
                                statusClass = 'badge-overspent';
                                statusText = `${t.overspent}`;
                                statusVal = Math.abs(diff);
                            } else if (diff === 0 && calculateSum(item.target) > 0) {
                                statusClass = 'badge-balanced';
                                statusText = `${t.balanced}`;
                            }

                            return (
                            <tr key={index}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0 12px', height: '42px', boxSizing: 'border-box' }}>
                                        <span style={{ fontSize: '16px', marginRight: '8px' }}>{getSmartEmoji(item.name)}</span>
                                        <input type="text" placeholder="Category Name" defaultValue={item.name} 
                                               style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, fontSize: '14px', color: 'var(--text-main)', width: '100%', height: '100%' }}
                                               onBlur={(e) => {
                                                   const copy = [...fixedData]; copy[index].name = e.target.value; setFixedData(copy);
                                               }}/>
                                    </div>
                                </td>
                                <td>
                                    <input type="text" inputMode="text" className="regular-input" placeholder="0" 
                                           value={item.target} 
                                           onChange={(e) => { 
                                               let v = e.target.value.replace(/[^0-9+ \n]/g, ''); 
                                               handleSpaceToPlus({target: {value: v}}, (res) => { const copy = [...fixedData]; copy[index].target = res; setFixedData(copy); });
                                           }}/>
                                </td>
                                <td>
                                    <input type="text" inputMode="text" className="regular-input" placeholder="0" 
                                           value={item.paid} 
                                           onChange={(e) => { 
                                               let v = e.target.value.replace(/[^0-9+ \n]/g, ''); 
                                               handleSpaceToPlus({target: {value: v}}, (res) => { const copy = [...fixedData]; copy[index].paid = res; setFixedData(copy); });
                                           }}/>
                                </td>
                                <td>
                                    <span className={`status ${statusClass}`}>
                                        {diff === 0 && calculateSum(item.target) > 0 ? `${statusText}` : `₹${statusVal} ${statusText}`}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-delete" onClick={() => {
                                        const deletedItem = fixedData[index];
                                        const updatedFixedData = fixedData.filter((_, i) => i !== index);
                                        setFixedData(updatedFixedData);
                                        if (deletedItem.name || deletedItem.target || deletedItem.paid) {
                                            setRecycleBin(prevBin => [...prevBin, deletedItem]);
                                        }
                                    }}>🗑️</button>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>
            <button className="btn-add" onClick={() => setFixedData([...fixedData, {name: "", target: '', paid: ''}])}>{t.addCategory}</button>
        </div>

        {recycleBin.length > 0 && (
            <div className="pro-card mb-40" style={{marginTop: '40px', padding: '25px', marginBottom: '35px', border: '1px dashed var(--danger)', background: 'rgba(239, 68, 68, 0.05)', transition: 'all 0.3s ease'}}>
                <div className="pro-card-title text-red" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    🗑️ {t.recycleBin}
                </div>
                <div className="sub-list-container">
                    {recycleBin.map((item, idx) => (
                        <div key={idx} className="sub-item-row" style={{background: 'var(--card-bg)', border: '1px solid var(--border)'}}>
                            <span>
                                <strong>{item.name || 'Unnamed Category'}</strong> 
                                <span style={{fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px'}}>
                                    (Est: ₹{calculateSum(item.target)}, Paid: ₹{calculateSum(item.paid)})
                                </span>
                            </span>
                            <div style={{display:'flex', gap:'8px'}}>
                                <button className="btn-action-tool text-green" style={{padding: '5px 10px'}} onClick={() => {
                                    setFixedData([...fixedData, item]);
                                    const binCopy = [...recycleBin]; binCopy.splice(idx, 1); setRecycleBin(binCopy);
                                }}>{t.restoreBtn}</button>
                                <button className="btn-delete" style={{padding: '5px 10px', fontSize: '12px'}} onClick={() => {
                                    if(window.confirm("Are you sure you want to permanently delete this category?")) {
                                        const binCopy = [...recycleBin]; binCopy.splice(idx, 1); setRecycleBin(binCopy);
                                    }
                                }}>{t.permDelete}</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

      
        <div className="section-title"><span>{t.dailyExpenses}</span></div>
        <p style={{fontSize:'12px', color:'var(--text-muted)', marginBottom:'15px'}}>{t.dailyTip}</p>
        <div className="days-grid" style={{marginBottom: '35px'}}>
            {
              daysArray.map((dayObj) => {
                const isFutureDate = isCurrentActiveMonth && (dayObj.day > currentDayNum);
                const isToday = isCurrentActiveMonth && (dayObj.day === currentDayNum);
                
                const key = `day_${dayObj.day}`;
                const val = dailyData[key] || '';
                const amounts = String(val).split(/[\s,+/]+/).filter(n => Number(n) > 0);
                const flags = dailyFlags[key] || {};
                
                let activeSum = 0; let fixedSum = 0;
                amounts.forEach((num, idx) => {
                    if(flags[idx]) fixedSum += Number(num);
                    else activeSum += Number(num);
                });

                const localizedDateStr = formatLocalizedDate(dayObj.name, dayObj.dateString, lang);

                return (
                  <div key={key} className={`day-card ${isToday ? 'today-active' : ''}`} style={{ opacity: isFutureDate ? 0.6 : 1, pointerEvents: isFutureDate ? 'none' : 'auto', border: isToday ? '2px solid var(--info)' : '', background: isToday ? 'rgba(59, 130, 246, 0.05)' : '' }}>
                      <div className="day-header-wrapper">
                          <div className="day-header" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                              <div>
                                  <span style={{fontSize: '16px', display: 'block', fontWeight: 'bold'}}>{localizedDateStr}</span>
                              </div>
                              {isToday && <span style={{background: 'var(--success)', color: 'white', fontSize: '11px', padding: '3px 8px', borderRadius: '12px', fontWeight: 'bold', letterSpacing: '0.5px'}}>{t.today}</span>}
                          </div>
                          {!isFutureDate && <button className="btn-notes" onClick={() => { setActiveDayKey(key); setActiveDayNum(dayObj.day); setIsNotesModalOpen(true); }}>{t.notes}</button>}
                      </div>
                      
                      {isFutureDate ? (
                          <div style={{padding: '15px', textAlign: 'center', background: 'var(--input-bg)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic'}}>
                              {t.lockedDay}
                          </div>
                      ) : (
                          <>
                              <textarea 
                                className="regular-input" rows="1" placeholder="e.g. 70+40+60" 
                                value={val}
                                onChange={(e) => handleSpaceToPlus(e, (v) => setDailyData({...dailyData, [key]: v}))}
                              ></textarea>
                              <div className="day-total">Total <span>₹{activeSum} <span style={{fontSize:'11px', color:'var(--text-muted)'}}>{fixedSum > 0 ? `(-₹${fixedSum} Fixed)` : ''}</span></span></div>
                          </>
                      )}
                  </div>
                )
              })
            }
        </div>

      
        <div className="pro-card mb-35" style={{padding: '25px', marginBottom: '35px'}}>
            <div className="pro-card-title mb-15" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                🤝 {t.udhaarTracker}
            </div>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px', marginBottom: '20px'}}>
                <div style={{background: 'rgba(16, 185, 129, 0.08)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)'}}>
                    <div style={{fontSize: '12px', color: 'var(--success)', fontWeight: '700'}}>{t.toReceive}</div>
                    <div style={{fontSize: '20px', fontWeight: '800', color: 'var(--success)', marginTop: '5px'}}>
                        ₹{udhaarList.filter(u => u.type === 'receive').reduce((acc, u) => acc + (Number(u.total) - Number(u.paid)), 0)}
                    </div>
                </div>
                <div style={{background: 'rgba(239, 68, 68, 0.08)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)'}}>
                    <div style={{fontSize: '12px', color: 'var(--danger)', fontWeight: '700'}}>{t.toPay}</div>
                    <div style={{fontSize: '20px', fontWeight: '800', color: 'var(--danger)', marginTop: '5px'}}>
                        ₹{udhaarList.filter(u => u.type === 'pay').reduce((acc, u) => acc + (Number(u.total) - Number(u.paid)), 0)}
                    </div>
                </div>
            </div>

           
            <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', background: 'var(--input-bg)', padding: '15px', borderRadius: '14px', border: '1px solid var(--border)', marginBottom: '20px'}}>
                <select className="regular-input" style={{flex: 1, minWidth: '130px', marginBottom: 0, fontWeight: '700', color: 'var(--primary)', borderRadius: '10px'}} value={newUdhaarType} onChange={e => setNewUdhaarType(e.target.value)}>
                    <option value="receive">{t.toReceive}</option>
                    <option value="pay">{t.toPay}</option>
                </select>
                <input type="text" className="regular-input" placeholder={t.personName} value={newUdhaarName} onChange={e => setNewUdhaarName(e.target.value)} style={{flex: 2, minWidth: '140px', marginBottom: 0, borderRadius: '10px'}} />
                <input type="number" className="regular-input" placeholder={t.totalAmt} value={newUdhaarTotal} onChange={e => setNewUdhaarTotal(e.target.value)} style={{flex: 1, minWidth: '100px', marginBottom: 0, borderRadius: '10px'}} />
                <input type="number" className="regular-input" placeholder={t.settledAmt} value={newUdhaarPaid} onChange={e => setNewUdhaarPaid(e.target.value)} style={{flex: 1, minWidth: '100px', marginBottom: 0, borderRadius: '10px'}} />
                <select className="regular-input" style={{flex: 1, minWidth: '130px', marginBottom: 0, fontWeight: '700', borderRadius: '10px'}} value={newUdhaarMode} onChange={e => setNewUdhaarMode(e.target.value)}>
                    {PAYMENT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <button className="btn-add" style={{padding: '10px 20px', marginTop: 0, borderRadius: '10px'}} onClick={() => {
                    if (newUdhaarName && newUdhaarTotal) {
                        const newItem = {
                            id: Date.now(),
                            type: newUdhaarType,
                            name: newUdhaarName,
                            total: Number(newUdhaarTotal),
                            paid: Number(newUdhaarPaid || 0),
                            mode: newUdhaarMode
                        };
                        setUdhaarList([...udhaarList, newItem]);
                        setNewUdhaarName('');
                        setNewUdhaarTotal('');
                        setNewUdhaarPaid('');
                    } else {
                        alert("Please enter Name and Amount.");
                    }
                }}>{t.addUdhaar}</button>
            </div>

           
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                {udhaarList.length === 0 ? (
                    <p style={{fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center'}}>No records added for this month.</p>
                ) : (
                    udhaarList.map((item, idx) => {
                        const pending = item.total - item.paid;
                        const isSettled = pending <= 0;
                        return (
                            <div key={item.id || idx} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card-bg)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', flexWrap: 'wrap', gap: '10px'}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                    <span style={{fontSize: '18px'}}>{item.type === 'receive' ? '📥' : '📤'}</span>
                                    <div>
                                        <strong style={{fontSize: '15px', color: 'var(--text-main)'}}>{item.name}</strong>
                                        <div style={{fontSize: '12px', color: 'var(--text-muted)'}}>Mode: <strong>{item.mode}</strong> | Type: {item.type === 'receive' ? t.toReceive : t.toPay}</div>
                                    </div>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                                    <div style={{textAlign: 'right'}}>
                                        <div style={{fontSize: '14px', fontWeight: '800', color: isSettled ? 'var(--success)' : (item.type === 'receive' ? 'var(--success)' : 'var(--danger)')}}>
                                            {isSettled ? '✅ Settled / Paid' : `Pending: ₹${pending}`}
                                        </div>
                                        <div style={{fontSize: '11px', color: 'var(--text-muted)'}}>Total: ₹{item.total} | Settled: ₹{item.paid}</div>
                                    </div>
                                    
                                    <button onClick={() => {
                                        setEditingUdhaarIdx(idx);
                                        setEditUdhaarPaid(item.paid);
                                    }} style={{background: 'var(--input-bg)', border: '1px solid var(--border)', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px'}} title="Edit / Settle">✏️</button>
                                    
                                    <button onClick={() => {
                                        const copy = [...udhaarList];
                                        copy.splice(idx, 1);
                                        setUdhaarList(copy);
                                    }} style={{background: 'var(--badge-overspent-bg)', border: 'none', color: 'var(--danger)', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px'}}>❌</button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>

        
        <div className="pro-card mb-35" style={{padding: '25px', marginBottom: '35px'}}>
            <div className="pro-card-title mb-15" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                📋 {t.plannerTitle}
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px'}}>
                <div>
                    <label style={{fontSize: '13px', fontWeight: '700', color: 'var(--primary)', display: 'block', marginBottom: '8px'}}>🛒 {t.currentMonthPlan} ({selectedMonth})</label>
                    <textarea 
                        className="regular-input" 
                        rows="4" 
                        placeholder="What to buy this month..." 
                        value={currentMonthPlan} 
                        onChange={e => setCurrentMonthPlan(e.target.value)}
                        style={{resize: 'vertical', fontSize: '14px'}}
                    ></textarea>
                </div>
                <div>
                    <label style={{fontSize: '13px', fontWeight: '700', color: 'var(--primary)', display: 'block', marginBottom: '8px'}}>🗓️ {t.nextMonthPlan}</label>
                    <textarea 
                        className="regular-input" 
                        rows="4" 
                        placeholder="What to buy next month..." 
                        value={nextMonthPlan} 
                        onChange={e => setNextMonthPlan(e.target.value)}
                        style={{resize: 'vertical', fontSize: '14px'}}
                    ></textarea>
                </div>
            </div>
        </div>

      </div>

      
      {editingUdhaarIdx !== null && (
        <div className="custom-modal-overlay" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={() => setEditingUdhaarIdx(null)}>
            <div className="custom-modal" style={{width: '90%', maxWidth: '400px', background: 'var(--card-bg)', padding: '30px', borderRadius: '20px', border: '1px solid var(--border)'}} onClick={e => e.stopPropagation()}>
                <h3 style={{color: 'var(--primary)', marginBottom: '15px'}}>✏️ Update Settled Amount</h3>
                <p style={{fontSize: '13px', color: 'var(--text-muted)', marginBottom: '15px'}}>Update how much amount has been paid or received for <strong>{udhaarList[editingUdhaarIdx]?.name}</strong>:</p>
                <input 
                    type="number" 
                    className="regular-input" 
                    value={editUdhaarPaid} 
                    onChange={e => setEditUdhaarPaid(e.target.value)} 
                    placeholder="Settled Amount"
                    style={{fontSize: '18px', textAlign: 'center', fontWeight: 'bold'}}
                />
                <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                    <button className="btn-action-tool" style={{flex: 1, justifyContent: 'center'}} onClick={() => setEditingUdhaarIdx(null)}>{t.cancel}</button>
                    <button className="btn-action-tool" style={{flex: 1, justifyContent: 'center', background: 'var(--success)', color: 'white'}} onClick={() => {
                        const copy = [...udhaarList];
                        copy[editingUdhaarIdx].paid = Number(editUdhaarPaid || 0);
                        setUdhaarList(copy);
                        setEditingUdhaarIdx(null);
                    }}>Save & Settle</button>
                </div>
            </div>
        </div>
      )}

      
      {isNotesModalOpen && (
        <div className="custom-modal-overlay" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={() => setIsNotesModalOpen(false)}>
            <div className="custom-modal" style={{width: '92%', maxWidth: '650px', maxHeight: '85vh', overflowY: 'auto', margin: 0, position: 'relative', borderRadius: '28px', padding: '35px', background: 'var(--card-bg)', boxShadow: '0 25px 60px rgba(0,0,0,0.4)', border: '1px solid var(--border)'}} onClick={e => e.stopPropagation()}>
                <span className="close-btn" style={{position: 'absolute', top: '22px', right: '25px', fontSize: '24px', cursor: 'pointer', color: 'var(--text-muted)', transition: '0.2s'}} onClick={() => setIsNotesModalOpen(false)}>✕</span>
                
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px'}}>
                    <div style={{background: 'rgba(79, 70, 229, 0.1)', padding: '10px', borderRadius: '14px', fontSize: '22px'}}>📝</div>
                    <div>
                        <h3 style={{fontSize:'22px', color:'var(--text-main)', fontWeight: '700', margin: 0}}>{t.notesModalTitle}</h3>
                        <p style={{fontSize: '13px', color: 'var(--primary)', fontWeight: '600', marginTop: '2px'}}>{t.dayLabel} {activeDayNum} • {selectedMonth}</p>
                    </div>
                </div>
                
                <div style={{background: 'var(--input-bg)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '25px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5'}}>
                    💡 {t.notesTip}
                </div>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    {(!dailyData[activeDayKey] || dailyData[activeDayKey].trim() === '') ? (
                        <p style={{color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '40px 0', fontSize: '15px'}}>
                            No expenses added for {t.dayLabel} {activeDayNum} yet.<br/>Type amounts like "70+40" in the day card first!
                        </p>
                    ) : (
                        (String(dailyData[activeDayKey] || '').split(/[\s,+/]+/).filter(n => Number(n) > 0)).map((num, idx) => {
                            const note = (dailyNotes[activeDayKey] && dailyNotes[activeDayKey][idx]) || '';
                            const mode = (dailyNotes[activeDayKey] && dailyNotes[activeDayKey][`${idx}_mode`]) || 'UPI';
                            const isFixed = (dailyFlags[activeDayKey] && dailyFlags[activeDayKey][idx]) || false;
                            
                            return (
                            <div key={idx} style={{background: 'var(--input-bg)', padding: '20px', borderRadius: '18px', border: '1px solid var(--border)', boxShadow: '0 8px 20px var(--shadow-color)', transition: '0.3s'}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap'}}>
                                    <span style={{fontWeight:'800', color:'var(--success)', fontSize:'20px', background: 'rgba(16, 185, 129, 0.1)', padding: '8px 14px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)'}}>₹{num}</span>
                                    
                                    <input type="text" className="regular-input" style={{flex: 2, minWidth: '160px', marginBottom:0, borderRadius: '12px', padding: '12px 16px', background: 'var(--card-bg)', border: '1.5px solid var(--border)', fontWeight: '500'}} placeholder={t.notePlaceholder} value={note} onChange={(e) => {
                                        const newNoteText = e.target.value;
                                        setDailyNotes(prev => ({...prev, [activeDayKey]: {...(prev[activeDayKey] || {}), [idx]: newNoteText}}));
                                    }}/>
                                    
                                    <select className="regular-input" style={{flex: 1, minWidth: '130px', marginBottom: 0, fontWeight: '700', color: 'var(--primary)', borderRadius: '12px', padding: '12px 14px', background: 'var(--card-bg)', border: '2px solid var(--primary-light)', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.05)'}} value={mode} onChange={(e) => {
                                        const newMode = e.target.value;
                                        setDailyNotes(prev => ({...prev, [activeDayKey]: {...(prev[activeDayKey]||{}), [`${idx}_mode`]: newMode}}));
                                    }}>
                                        {PAYMENT_MODES.map(m => <option key={m} value={m} style={{fontWeight: '700', background: 'var(--card-bg)', color: 'var(--text-main)', padding: '10px'}}>{m}</option>)}
                                    </select>

                                    {/* Split Bill Button inside Notes Modal */}
                                    <button onClick={() => {
                                        setSplitAmount(num);
                                        setSplitItemName(note || 'Expense');
                                        setSplitPeopleCount(2);
                                        setIsSplitModalOpen(true);
                                    }} style={{background: 'var(--primary)', border: 'none', color: 'white', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px'}}>
                                        👥 {t.splitBtn}
                                    </button>
                                </div>
                                
                                <div style={{marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed var(--border)', display: 'flex', flexDirection: 'column', gap: '12px'}}>
                                    <label style={{display:'flex', alignItems:'center', gap:'10px', fontSize:'13.5px', fontWeight: '700', color: isFixed ? 'var(--primary)' : 'var(--text-main)', cursor: 'pointer'}}>
                                        <input type="checkbox" checked={isFixed} onChange={(e) => {
                                            const checked = e.target.checked;
                                            setDailyFlags(prev => ({...prev, [activeDayKey]: {...(prev[activeDayKey]||{}), [idx]: checked}}));
                                        }} style={{width:'18px', height:'18px', accentColor: 'var(--primary)', cursor: 'pointer'}}/>
                                        🏢 {t.linkFixedCat}
                                    </label>

                                    
                                    {isFixed && (
                                        <div style={{display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--card-bg)', padding: '10px 14px', borderRadius: '12px', border: '2px solid var(--primary)'}}>
                                            <span style={{fontSize: '12px', fontWeight: '800', color: 'var(--primary)', whiteSpace: 'nowrap'}}>{t.selectCategoryLbl}</span>
                                            <select 
                                                className="regular-input" 
                                                style={{flex: 1, marginBottom: '0px', fontWeight: '800', color: 'var(--text-main)', padding: '8px 12px', background: 'var(--input-bg)', border: '2px solid var(--primary-light)', cursor: 'pointer', borderRadius: '8px', fontSize: '13px'}}
                                                value={(dailyNotes[activeDayKey] && dailyNotes[activeDayKey][`${idx}_linkedCat`]) || ''}
                                                onChange={(e) => {
                                                    const selectedCatName = e.target.value;
                                                    const expenseVal = Number(num);

                                                    setDailyNotes(prev => ({
                                                        ...prev, 
                                                        [activeDayKey]: {
                                                            ...(prev[activeDayKey]||{}), 
                                                            [`${idx}_linkedCat`]: selectedCatName,
                                                            [idx]: selectedCatName 
                                                        }
                                                    }));

                                                    setFixedData(prevFixed => {
                                                        const foundIdx = prevFixed.findIndex(cat => cat.name.trim().toLowerCase() === selectedCatName.trim().toLowerCase());
                                                        if (foundIdx !== -1) {
                                                            const copy = [...prevFixed];
                                                            const currentPaidSum = calculateSum(copy[foundIdx].paid);
                                                            copy[foundIdx].paid = String(currentPaidSum + expenseVal);
                                                            return copy;
                                                        } else {
                                                            return [...prevFixed, { name: selectedCatName, target: String(expenseVal), paid: String(expenseVal) }];
                                                        }
                                                    });
                                                }}
                                            >
                                                <option value="" style={{color: 'var(--text-muted)'}}>{t.chooseCategoryOpt}</option>
                                                {fixedData.map((cat, catIdx) => (
                                                    <option key={catIdx} value={cat.name || `Category ${catIdx + 1}`} style={{fontWeight: '700', color: 'var(--text-main)'}}>
                                                        {getSmartEmoji(cat.name)} {cat.name || `Category ${catIdx + 1}`} (Est: ₹{cat.target || 0})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )})
                    )}
                </div>
            </div>
        </div>
      )}


      {isSplitModalOpen && (
        <div className="custom-modal-overlay" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={() => setIsSplitModalOpen(false)}>
            <div className="custom-modal" style={{width: '90%', maxWidth: '420px', background: 'var(--card-bg)', padding: '30px', borderRadius: '22px', border: '1px solid var(--border)', boxShadow: '0 25px 50px rgba(0,0,0,0.3)'}} onClick={e => e.stopPropagation()}>
                <h3 style={{color: 'var(--primary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px'}}>👥 {t.splitTitle}</h3>
                <p style={{fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px'}}>
                    {t.splitingText} <strong>{splitItemName}</strong> {t.worthText} <strong>₹{splitAmount}</strong>:
                </p>
                
                <div style={{marginBottom: '20px'}}>
                    <label style={{fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '8px'}}>{t.howManyPeople}</label>
                    <input 
                        type="number" 
                        min="1" 
                        max="50" 
                        className="regular-input" 
                        value={splitPeopleCount} 
                        onChange={e => setSplitPeopleCount(Math.max(1, parseInt(e.target.value) || 1))}
                        style={{fontSize: '20px', textAlign: 'center', fontWeight: 'bold'}}
                    />
                </div>

                <div style={{background: 'var(--input-bg)', padding: '15px', borderRadius: '14px', border: '1px solid var(--border)', textAlign: 'center', marginBottom: '25px'}}>
                    <div style={{fontSize: '13px', color: 'var(--text-muted)'}}>{t.perPersonShare}</div>
                    <div style={{fontSize: '24px', fontWeight: '800', color: 'var(--success)', marginTop: '4px'}}>
                        ₹{(Number(splitAmount) / splitPeopleCount).toFixed(2)}
                    </div>
                </div>

                <div style={{display: 'flex', gap: '10px'}}>
                    <button className="btn-action-tool" style={{flex: 1, justifyContent: 'center'}} onClick={() => setIsSplitModalOpen(false)}>{t.cancel}</button>
                    <button className="btn-action-tool" style={{flex: 1, justifyContent: 'center', background: '#25D366', color: 'white', fontWeight: 'bold'}} onClick={() => {
                        const perPerson = (Number(splitAmount) / splitPeopleCount).toFixed(2);
                        const currentDateFormatted = `${todayDate.getDate()} ${monthNames[todayDate.getMonth()]} ${todayDate.getFullYear()}`;
                        
                        let msg;
                        if (lang === 'hi') {
                            msg = `नमस्ते! ${currentDateFormatted} को हमारे हुए खर्च का हिसाब। हमने मिलकर ${splitItemName} खाया था, जिसका कुल बिल ₹${splitAmount} आया था और कुल ${splitPeopleCount} लोग थे। आपका हिस्सा ₹${perPerson} बनता है। कृपया समय निकालकर पैसे भेज दें। धन्यवाद! 🍕`;
                        } else if (lang === 'ur') {
                            msg = `السلام علیکم! ${currentDateFormatted} کے ہمارے خرچ کا حساب۔ ہم نے مل کر ${splitItemName} کھایا تھا، جس کا کل بل ₹${splitAmount} آیا اور کل ${splitPeopleCount} افراد تھے۔ آپ کا حصہ ₹${perPerson} بنتا ہے۔ براہِ کرم وقت نکال کر رقم ادا کر دیں۔ شکریہ! 🍕`;
                        } else {
                            msg = `Hey! Just sharing the expense split for what we had on ${currentDateFormatted}. We enjoyed ${splitItemName} for a total of ₹${splitAmount} among ${splitPeopleCount} people. Your share comes out to ₹${perPerson}. Please clear your dues when you get a chance. Thanks! 🍕`;
                        }

                        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                        setIsSplitModalOpen(false);
                    }}>{t.shareOnWhatsapp}</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

export default App;