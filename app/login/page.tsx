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
import { ChevronDown, ArrowRight, ShieldCheck } from "lucide-react";
import { ParticleField } from "@/components/ui/ParticleField";

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
    <div className="flex items-center justify-center gap-3 mb-10">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-[#C8F135] blur-md opacity-30 rounded-full animate-pulse" />
        <div className="w-10 h-10 rounded-full bg-[#C8F135] relative z-10" />
      </div>
      <span className="font-extrabold text-3xl text-white tracking-tight">MotorGlow</span>
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
    if (phone.replace(/\D/g, "").length < 7) {
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
        setError("Invalid phone number. Please check format.");
      } else if (msg.includes("TOO_MANY_ATTEMPTS") || msg.includes("quota")) {
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

      await fetch("/api/auth/sync-user", {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` },
      });

      setStep("success");
      setTimeout(() => router.replace("/dashboard"), 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Verification failed";
      if (msg.includes("INVALID_VERIFICATION_CODE") || msg.includes("invalid-verification-code")) {
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

  const popVariants = {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -10 },
  };

  return (
    <div className="min-h-[100svh] bg-[#0D0D0D] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <ParticleField intensity={40} color="#C8F135" />
      <div id="recaptcha-container" ref={recaptchaContainerRef} className="absolute z-[-1]" />

      <div className="absolute inset-0 z-0 bg-radial-gradient from-transparent to-[#0D0D0D] opacity-60" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-sm relative z-10"
      >
        <MotorGlowLogo />

        <div className="bg-[#1A1A1A]/60 backdrop-blur-xl rounded-[24px] shadow-2xl border border-white/10 p-8 w-full overflow-hidden relative text-white">
          <AnimatePresence mode="wait">
            {step === "phone" && (
              <motion.div
                key="phone"
                variants={popVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="mb-8">
                  <h1 className="text-[24px] font-bold text-white mb-2 tracking-tight">Welcome back</h1>
                  <p className="text-[14px] text-[#A0A0A0] font-medium leading-relaxed">
                    Enter your phone number to sign in or create a new account.
                  </p>
                </div>

                <div className="flex flex-col gap-5">
                  <div>
                    <label className="text-[13px] font-semibold text-[#888888] block mb-2 uppercase tracking-wide">
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                      <div className="relative">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="appearance-none pl-4 pr-9 py-4 rounded-[14px] border border-white/10 bg-black/40 text-white text-[15px] focus:outline-none focus:border-[#C8F135] focus:ring-1 focus:ring-[#C8F135] cursor-pointer transition-colors h-[56px]"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c.code} value={c.code} className="text-black">
                              {c.flag} {c.code}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none"
                        />
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                        placeholder="Mobile Number"
                        className="flex-1 px-4 py-4 rounded-[14px] border border-white/10 bg-black/40 text-white text-[16px] font-medium tracking-wide placeholder:text-[#555] focus:outline-none focus:border-[#C8F135] focus:ring-1 focus:ring-[#C8F135] transition-colors h-[56px] w-full"
                        autoFocus
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-[13px] text-red-400 font-medium bg-red-500/10 p-3 rounded-[10px]">
                      {error}
                    </motion.p>
                  )}

                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full mt-2"
                    onClick={handleSendOTP}
                    loading={loading}
                    pulse
                    icon={<ArrowRight size={18} />}
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div
                key="otp"
                variants={popVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="mb-8">
                  <button onClick={handleResend} className="text-[13px] font-medium text-[#C8F135] mb-4 hover:underline">← Back</button>
                  <h1 className="text-[24px] font-bold text-white mb-2 tracking-tight">Enter Code</h1>
                  <p className="text-[14px] text-[#A0A0A0] font-medium">
                    Sent to <span className="text-white">{countryCode} {phone}</span>
                  </p>
                </div>

                <div className="flex gap-2 justify-between mb-8" onPaste={handleOTPPaste}>
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
                      autoFocus={i === 0}
                      className="w-[45px] h-[56px] text-center text-xl font-bold bg-black/40 border border-white/10 rounded-[12px] text-white focus:outline-none focus:border-[#C8F135] focus:ring-1 focus:ring-[#C8F135] transition-colors select-all"
                    />
                  ))}
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-[13px] text-red-400 font-medium bg-red-500/10 p-3 rounded-[10px] mb-4">
                    {error}
                  </motion.p>
                )}

                <Button
                  variant="accent"
                  size="lg"
                  className="w-full mb-6 font-bold"
                  onClick={handleVerifyOTP}
                  loading={loading}
                >
                  Verify Code
                </Button>

                <p className="text-center text-[13px] text-[#888888] font-medium">
                  {resendCountdown > 0 ? (
                    <>Resend code in <span className="text-white">0:{String(resendCountdown).padStart(2, "0")}</span></>
                  ) : (
                    <button onClick={handleResend} className="text-white hover:text-[#C8F135] transition-colors">
                      Didn&apos;t receive a code? Resend
                    </button>
                  )}
                </p>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                variants={popVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="text-center py-6 flex flex-col items-center"
              >
                <div className="w-[64px] h-[64px] rounded-full bg-[#C8F135] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(200,241,53,0.4)]">
                  <ShieldCheck size={32} className="text-[#0D0D0D]" strokeWidth={2.5} />
                </div>
                <h1 className="text-[22px] font-bold text-white mb-2">Verification Complete</h1>
                <p className="text-[14px] text-[#A0A0A0]">Securely logging you in...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
