export type Locale = "en" | "ko";

export const translations = {
  en: {
    linksSubtitle: "Links",
    contact: "Contact",
    footerAgree:
      "By submitting, you agree your email may be used to respond to your inquiry.",
    toastSuccess: "Sent successfully",
    toastError: "Something went wrong. Please try again.",
    // Contact modal
    modalTitle: "Contact",
    modalSubtitle: "Leave your message and I'll get back to you.",
    fieldName: "Name",
    fieldEmail: "Email",
    fieldMessage: "Message",
    placeholderName: "Your name",
    placeholderEmail: "your@email.com",
    placeholderMessage: "Your message",
    cancel: "Cancel",
    send: "Send",
    sending: "Sending…",
    errorName: "Name must be 2–30 characters and not only spaces.",
    errorEmail: "Please enter a valid email address.",
    errorMessage: "Message must be 5–1000 characters.",
    errorTooMany: "Too many requests. Please try again later.",
    errorGeneric: "Something went wrong. Please try again.",
    close: "Close",
    // Link button labels
    labelResearch: "Jaehkim's Research",
    labelOpenKakao: "Open KakaoTalk",
    labelYouTube: "YouTube",
    labelX: "X",
    labelLinkedIn: "LinkedIn",
    comingSoon: "Coming soon",
    // Theme
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
    // Not found
    notFoundMessage: "This profile was not found.",
    goToHome: "Go to home",
  },
  ko: {
    linksSubtitle: "링크",
    contact: "문의하기",
    footerAgree: "제출하시면 문의 응답을 위해 이메일이 사용될 수 있음에 동의하는 것입니다.",
    toastSuccess: "전송되었습니다.",
    toastError: "오류가 발생했습니다. 다시 시도해 주세요.",
    modalTitle: "문의하기",
    modalSubtitle: "메시지를 남겨주시면 연락드리겠습니다.",
    fieldName: "이름",
    fieldEmail: "이메일",
    fieldMessage: "메시지",
    placeholderName: "이름을 입력하세요",
    placeholderEmail: "example@email.com",
    placeholderMessage: "메시지를 입력하세요",
    cancel: "취소",
    send: "전송",
    sending: "전송 중…",
    errorName: "이름은 2~30자이며 공백만으로 할 수 없습니다.",
    errorEmail: "올바른 이메일 주소를 입력해 주세요.",
    errorMessage: "메시지는 5~1000자여야 합니다.",
    errorTooMany: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
    errorGeneric: "오류가 발생했습니다. 다시 시도해 주세요.",
    close: "닫기",
    labelResearch: "재킴의 리서치",
    labelOpenKakao: "오픈 카카오톡",
    labelYouTube: "유튜브",
    labelX: "X",
    labelLinkedIn: "링크드인",
    comingSoon: "준비 중",
    switchToLight: "라이트 모드로 전환",
    switchToDark: "다크 모드로 전환",
    notFoundMessage: "해당 프로필을 찾을 수 없습니다.",
    goToHome: "홈으로 가기",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["en"];

export function getT(locale: Locale) {
  return (key: TranslationKey) => translations[locale][key];
}
