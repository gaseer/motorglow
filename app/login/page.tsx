"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ChevronDown, ArrowRight } from "lucide-react";

const COUNTRY_CODES = [
  { code: "+91", flag: "🇮🇳", country: "India" },
  { code: "+1", flag: "🇺🇸", country: "USA" },
  { code: "+44", flag: "🇬🇧", country: "UK" },
  { code: "+971", flag: "🇦🇪", country: "UAE" },
  { code: "+65", flag: "🇸🇬", country: "Singapore" },
];

type Step = "phone" | "otp" | "success";

function MotorGlowLogo() {
  return (
    <div className="flex items-center gap-2 justify-center mb-8">
      <div className="w-8 h-8 rounded-full bg-[#C8F135]" />
      <span className="font-bold text-2xl text-[#0D0D0D]">MotorGlow</span>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const setupRecaptcha = () => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }
    return recaptchaVerifierRef.current;
  };

  const handleSendOTP = async () => {
    setError("");
    const fullPhone = `${countryCode}${phone.replace(/\D/g, "")}`;
    if (phone.length < 7) {
      setError("Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    try {
      const verifier = setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, fullPhone, verifier);
      setConfirmationResult(result);
      setStep("otp");
      setResendCountdown(60);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send OTP";
      if (msg.includes("TOO_LONG") || msg.includes("INVALID_PHONE_NUMBER")) {
        setError("Invalid phone number. Please check and try again.");
      } else if (msg.includes("TOO_MANY_ATTEMPTS")) {
        setError("Too many attempts. Please try again later.");
      } else {
        setError(msg);
      }
      recaptchaVerifierRef.current = null;
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOTPPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpInputRefs.current[5]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }
    if (!confirmationResult) return;

    setLoading(true);
    setError("");
    try {
      const credential = await confirmationResult.confirm(code);
      const idToken = await credential.user.getIdToken();

      // Sync user to Supabase
      await fetch("/api/auth/sync-user", {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
      });

      setStep("success");
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Verification failed";
      if (msg.includes("INVALID_VERIFICATION_CODE")) {
        setError("Incorrect OTP. Please try again.");
      } else if (msg.includes("SESSION_EXPIRED")) {
        setError("OTP expired. Please resend.");
      } else {
        setError("Verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setConfirmationResult(null);
    recaptchaVerifierRef.current = null;
    setStep("phone");
  };

  const fadeVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4 py-12">
      <div id="recaptcha-container" ref={recaptchaContainerRef} />

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-8">
        <MotorGlowLogo />

        <AnimatePresence mode="wait">
          {step === "phone" && (
            <motion.div
              key="phone"
              variants={fadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <h1 className="text-2xl font-bold text-[#0D0D0D] mb-1">Welcome back</h1>
              <p className="text-sm text-[#6B6B6B] mb-6">
                Enter your number to get started.
              </p>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium text-[#0D0D0D] block mb-1.5">
                    Phone number
                  </label>
                  <div className="flex gap-2">
                    <div className="relative">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="appearance-none pl-3 pr-8 py-3 rounded-[8px] border border-[#E5E5E5] bg-white text-sm text-[#0D0D0D] focus:outline-none focus:border-[#C8F135] cursor-pointer"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6B6B6B] pointer-events-none"
                      />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                      placeholder="98765 43210"
                      className="flex-1 px-4 py-3 rounded-[8px] border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#C8F135] focus:ring-2 focus:ring-[#C8F135]/20"
                      autoFocus
                    />
                  </div>
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}

                <Button
                  variant="accent"
                  className="w-full"
                  onClick={handleSendOTP}
                  loading={loading}
                >
                  Send OTP <ArrowRight size={16} />
                </Button>
              </div>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div
              key="otp"
              variants={fadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <h1 className="text-2xl font-bold text-[#0D0D0D] mb-1">Enter OTP</h1>
              <p className="text-sm text-[#6B6B6B] mb-6">
                We sent a 6-digit code to{" "}
                <strong>
                  {countryCode} {phone}
                </strong>
              </p>

              <div className="flex gap-2 mb-4" onPaste={handleOTPPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpInputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(i, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(i, e)}
                    className="w-full aspect-square text-center text-lg font-bold border border-[#E5E5E5] rounded-[8px] focus:outline-none focus:border-[#C8F135] focus:ring-2 focus:ring-[#C8F135]/20"
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

              <p className="text-xs text-[#6B6B6B] mb-4">
                {resendCountdown > 0 ? (
                  <>Resend in 0:{String(resendCountdown).padStart(2, "0")}</>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-[#0D0D0D] font-medium underline cursor-pointer"
                  >
                    Resend OTP
                  </button>
                )}
              </p>

              <Button
                variant="accent"
                className="w-full"
                onClick={handleVerifyOTP}
                loading={loading}
              >
                Verify <ArrowRight size={16} />
              </Button>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              variants={fadeVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-full bg-[#C8F135] flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h1 className="text-xl font-bold text-[#0D0D0D] mb-1">Verified!</h1>
              <p className="text-sm text-[#6B6B6B]">Redirecting to your dashboard…</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
