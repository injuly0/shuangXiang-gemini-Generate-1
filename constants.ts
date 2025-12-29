export const MOOD_KEYWORDS = [
  "Anxious", "Irritable", "Empty", "Excited", "Numb", "Creative", 
  "Tearful", "Restless", "Focused", "Overwhelmed", "Confident"
];

export const SLEEP_ISSUES = [
  "Insomnia", "Early Wake", "Oversleeping", "Day/Night Reversal", "Nightmares"
];

export const EVENTS = [
  "Conflict", "High Stress", "Late Night", "Alcohol/Substances", 
  "Social Overload", "Travel", "Missed Meds"
];

export const WARNING_SIGNS = [
  "Spending Spree", "Hypersexuality", "No Appetite", "Racing Thoughts", 
  "Social Withdrawal", "Talking Fast", "Paranoia"
];

export const DEFAULT_SAFETY_PLAN = {
  contacts: [
    { name: "Therapist", phone: "", relation: "Professional" },
    { name: "Emergency", phone: "988", relation: "Hotline" } // 988 is US standard, localization needed
  ],
  reminders: [
    "This feeling is temporary.",
    "You have survived 100% of your bad days so far.",
    "Breathe. Just breathe."
  ]
};
