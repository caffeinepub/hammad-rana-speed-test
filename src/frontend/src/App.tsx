import { useCallback, useEffect, useRef, useState } from "react";

type Difficulty = "easy" | "normal" | "hard";
type Language = "urdu" | "english";

const URDU_PASSAGES: Record<Difficulty, string> = {
  easy: "یہ ایک آسان جملہ ہے جو آپ ٹائپ کر سکتے ہیں۔",
  normal: "یہ نارمل ٹیکسٹ ہے جسے ٹائپ کرنے کے لئے تھوڑا دھیان دینا پڑے گا۔",
  hard: "یہ ہارڈ ٹیکسٹ ہے جس میں لمبی sentences اور punctuation کے ساتھ ٹائپنگ کی مہارت چیک کی جائے گی۔",
};

const ENGLISH_PASSAGES: Record<Difficulty, string> = {
  easy: "The quick brown fox jumps over the lazy dog.",
  normal:
    "Typing speed is a valuable skill that improves with consistent daily practice and focus.",
  hard: "Efficient keyboard technique, combined with regular practice sessions, significantly enhances both typing speed and accuracy over time.",
};

const URDU_DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "ایزی",
  normal: "نورمل",
  hard: "ہارڈ",
};

const ENGLISH_DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  normal: "Normal",
  hard: "Hard",
};

export default function App() {
  const [language, setLanguage] = useState<Language>("urdu");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [inputText, setInputText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isUrdu = language === "urdu";
  const passages = isUrdu ? URDU_PASSAGES : ENGLISH_PASSAGES;
  const difficultyLabels = isUrdu
    ? URDU_DIFFICULTY_LABELS
    : ENGLISH_DIFFICULTY_LABELS;
  const passage = passages[difficulty];

  const wpm =
    elapsed === 0
      ? 0
      : Math.round(
          (inputText.trim().split(/\s+/).filter(Boolean).length / elapsed) * 60,
        );

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetState = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setIsFinished(false);
    setElapsed(0);
    setInputText("");
  }, [clearTimer]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [isRunning, clearTimer]);

  useEffect(() => {
    if (isRunning && inputText.trim() === passage.trim()) {
      setIsRunning(false);
      setIsFinished(true);
    }
  }, [inputText, isRunning, passage]);

  const handleStart = () => {
    setIsRunning(true);
    setIsFinished(false);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleReset = () => resetState();

  const handleDifficultyChange = (d: Difficulty) => {
    setDifficulty(d);
    resetState();
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    resetState();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1
            className={`text-4xl font-bold text-foreground ${
              isUrdu ? "urdu-text" : "english-text"
            }`}
            style={{
              fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
              lineHeight: isUrdu ? 2 : 1.3,
            }}
          >
            {isUrdu
              ? "حماد رانا رائٹنگ اسپیڈ ٹیسٹنگ"
              : "Hammad Rana Writing Speed Testing"}
          </h1>
        </div>
      </header>

      {/* Language Tabs */}
      <div className="flex justify-center gap-2 mb-5 px-4">
        {(["urdu", "english"] as Language[]).map((lang) => (
          <button
            type="button"
            key={lang}
            data-ocid={`language.${lang}.tab`}
            onClick={() => handleLanguageChange(lang)}
            className={`px-7 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
              language === lang
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:border-primary/50"
            }`}
            style={{
              fontFamily:
                lang === "urdu" ? "'Noto Nastaliq Urdu', serif" : "inherit",
            }}
          >
            {lang === "urdu" ? "اردو" : "English"}
          </button>
        ))}
      </div>

      {/* Difficulty Selector */}
      <div
        className="flex justify-center gap-3 mb-8 px-4"
        dir={isUrdu ? "rtl" : "ltr"}
      >
        {(["easy", "normal", "hard"] as Difficulty[]).map((d) => (
          <button
            type="button"
            key={d}
            data-ocid={`difficulty.${d}.toggle`}
            onClick={() => handleDifficultyChange(d)}
            className={`px-6 py-2 rounded-full text-base font-medium transition-all duration-200 border ${
              difficulty === d
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:border-primary/50"
            } ${isUrdu ? "urdu-text" : "english-text"}`}
          >
            {difficultyLabels[d]}
          </button>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 px-4 pb-12">
        <div className="max-w-5xl mx-auto">
          <div
            className="flex flex-col lg:flex-row gap-5"
            dir={isUrdu ? "rtl" : "ltr"}
          >
            {/* Left: passage + textarea */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Passage display */}
              <div
                className="bg-card rounded-xl border border-border shadow-xs p-6"
                data-ocid="passage.panel"
              >
                <p
                  className={
                    isUrdu
                      ? "urdu-text text-foreground"
                      : "english-text text-foreground"
                  }
                  style={{ fontSize: "1rem", lineHeight: isUrdu ? 2.2 : 1.7 }}
                >
                  {passage}
                </p>
              </div>

              {/* Typing area */}
              <div className="bg-card rounded-xl border border-border shadow-xs p-4">
                <textarea
                  ref={textareaRef}
                  data-ocid="typing.textarea"
                  dir={isUrdu ? "rtl" : "ltr"}
                  disabled={!isRunning}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    isUrdu ? "یہاں ٹائپ کریں..." : "Start typing here..."
                  }
                  className={`w-full resize-none rounded-lg p-4 text-base text-foreground placeholder:text-muted-foreground outline-none transition-all ${
                    isUrdu ? "urdu-text" : "english-text"
                  }`}
                  style={{
                    height: "200px",
                    border: isRunning
                      ? "2px solid oklch(var(--primary))"
                      : "2px solid oklch(var(--border))",
                    background: "oklch(var(--card))",
                    cursor: isRunning ? "text" : "not-allowed",
                    opacity: isRunning ? 1 : 0.7,
                    fontSize: "1rem",
                    lineHeight: isUrdu ? 2.2 : 1.7,
                  }}
                />
              </div>

              {/* Completion message */}
              {isFinished && (
                <div
                  data-ocid="test.success_state"
                  className="bg-accent border border-primary/30 rounded-xl p-5 text-center"
                >
                  <p
                    className={`font-semibold text-primary ${
                      isUrdu ? "urdu-text" : "english-text"
                    }`}
                    style={{ fontSize: "1.1rem", lineHeight: isUrdu ? 2 : 1.6 }}
                  >
                    {isUrdu
                      ? "🎉 شاباش! آپ نے ٹیسٹ مکمل کر لیا!"
                      : "🎉 Well done! Test completed!"}
                  </p>
                  <p
                    className={`text-muted-foreground mt-1 ${
                      isUrdu ? "urdu-text" : "english-text"
                    }`}
                    style={{ fontSize: "0.9rem", lineHeight: isUrdu ? 2 : 1.6 }}
                  >
                    {isUrdu
                      ? `وقت: ${elapsed} سیکنڈ | رفتار: ${wpm} WPM`
                      : `Time: ${elapsed} sec | Speed: ${wpm} WPM`}
                  </p>
                </div>
              )}
            </div>

            {/* Right: stats + buttons */}
            <div className="lg:w-72 flex flex-col gap-4">
              <div className="bg-card rounded-xl border border-border shadow-xs p-6 flex flex-col gap-5">
                <h2
                  className={`font-semibold text-center border-b border-border pb-3 text-foreground ${
                    isUrdu ? "urdu-text" : "english-text"
                  }`}
                  style={{ fontSize: "1.1rem", lineHeight: isUrdu ? 2 : 1.5 }}
                >
                  {isUrdu ? "نتائج" : "Results"}
                </h2>

                {/* Timer */}
                <div
                  className="flex items-center justify-between"
                  dir={isUrdu ? "rtl" : "ltr"}
                >
                  <span
                    className={`text-muted-foreground ${
                      isUrdu ? "urdu-text" : "english-text text-sm"
                    }`}
                    style={{ lineHeight: isUrdu ? 2 : 1.5 }}
                  >
                    {isUrdu ? "وقت (سیکنڈ)" : "Time (sec)"}
                  </span>
                  <span
                    data-ocid="stats.timer"
                    className="text-2xl font-bold text-foreground font-mono"
                  >
                    {elapsed}
                  </span>
                </div>

                {/* WPM */}
                <div
                  className="flex items-center justify-between"
                  dir={isUrdu ? "rtl" : "ltr"}
                >
                  <span
                    className={`text-muted-foreground ${
                      isUrdu ? "urdu-text" : "english-text text-sm"
                    }`}
                    style={{ lineHeight: isUrdu ? 2 : 1.5 }}
                  >
                    {isUrdu ? "الفاظ فی منٹ" : "Words per Minute"}
                  </span>
                  <span
                    data-ocid="stats.wpm"
                    className="text-2xl font-bold text-primary font-mono"
                  >
                    {wpm}
                  </span>
                </div>

                {/* Status */}
                <div
                  className="flex items-center justify-between"
                  dir={isUrdu ? "rtl" : "ltr"}
                >
                  <span
                    className={`text-muted-foreground ${
                      isUrdu ? "urdu-text" : "english-text text-sm"
                    }`}
                    style={{ lineHeight: isUrdu ? 2 : 1.5 }}
                  >
                    {isUrdu ? "حالت" : "Status"}
                  </span>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      isFinished
                        ? "bg-accent text-primary"
                        : isRunning
                          ? "bg-accent text-primary"
                          : "bg-secondary text-muted-foreground"
                    } ${isUrdu ? "urdu-text" : "english-text"}`}
                    style={{ lineHeight: isUrdu ? 2 : 1.5 }}
                  >
                    {isUrdu
                      ? isFinished
                        ? "مکمل"
                        : isRunning
                          ? "جاری"
                          : "بند"
                      : isFinished
                        ? "Finished"
                        : isRunning
                          ? "Running"
                          : "Idle"}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  data-ocid="test.start_button"
                  onClick={handleStart}
                  disabled={isRunning || isFinished}
                  className={`w-full py-3 px-6 rounded-lg text-primary-foreground font-semibold transition-all duration-200 ${
                    isUrdu ? "urdu-text" : "english-text"
                  }`}
                  style={{
                    background:
                      isRunning || isFinished
                        ? "oklch(0.75 0.08 245)"
                        : "oklch(var(--primary))",
                    cursor: isRunning || isFinished ? "not-allowed" : "pointer",
                    fontSize: "1rem",
                    lineHeight: isUrdu ? 2 : 1.5,
                  }}
                >
                  {isUrdu ? "شروع کریں" : "Start"}
                </button>

                <button
                  type="button"
                  data-ocid="test.reset_button"
                  onClick={handleReset}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 hover:brightness-95 ${
                    isUrdu ? "urdu-text" : "english-text"
                  }`}
                  style={{
                    background: "oklch(var(--secondary))",
                    color: "oklch(0.35 0.015 265)",
                    fontSize: "1rem",
                    lineHeight: isUrdu ? 2 : 1.5,
                    cursor: "pointer",
                  }}
                >
                  {isUrdu ? "دوبارہ شروع" : "Reset"}
                </button>
              </div>

              {/* Difficulty info */}
              <div
                className="bg-card rounded-xl border border-border shadow-xs p-4"
                dir={isUrdu ? "rtl" : "ltr"}
              >
                <p
                  className={`text-muted-foreground text-center ${
                    isUrdu ? "urdu-text" : "english-text text-sm"
                  }`}
                  style={{ lineHeight: isUrdu ? 2 : 1.5 }}
                >
                  {isUrdu ? "موجودہ درجہ:" : "Current Level:"}
                </p>
                <p
                  className={`text-primary font-semibold text-center ${
                    isUrdu ? "urdu-text" : "english-text"
                  }`}
                  style={{ fontSize: "1rem", lineHeight: isUrdu ? 2 : 1.5 }}
                >
                  {difficultyLabels[difficulty]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="py-4 text-center text-muted-foreground"
        style={{ fontSize: "0.8rem" }}
      >
        <p>
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
