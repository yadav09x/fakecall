import { Grid3x3, Mic, PhoneOff, Volume2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Contact } from "../hooks/useQueries";
import { getAvatarColor, getInitials } from "./SetupScreen";

interface ActiveCallScreenProps {
  contact: Contact;
  onEndCall: () => void;
}

export function ActiveCallScreen({
  contact,
  onEndCall,
}: ActiveCallScreenProps) {
  const [elapsed, setElapsed] = useState(0);
  const [ended, setEnded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const avatarColor = getAvatarColor(contact.name);
  const initials = getInitials(contact.name);

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed((p) => p + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const handleEnd = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setEnded(true);
    setTimeout(onEndCall, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between py-20 px-8"
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, oklch(0.15 0.035 262) 0%, oklch(0.09 0.020 245) 60%, oklch(0.07 0.015 240) 100%)",
      }}
      data-ocid="active_call.modal"
    >
      {/* Status */}
      <div className="text-center">
        {ended ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-semibold"
            style={{ color: "oklch(0.55 0.220 25)" }}
          >
            Call Ended
          </motion.p>
        ) : (
          <p
            className="text-sm font-semibold"
            style={{ color: "oklch(0.65 0.18 145)" }}
          >
            Connected
          </p>
        )}
        <p
          className="text-xs mt-1 tabular-nums"
          style={{ color: "oklch(0.58 0.022 220)" }}
        >
          {formatTime(elapsed)}
        </p>
      </div>

      {/* Avatar */}
      <div
        className="rounded-full flex items-center justify-center shadow-2xl"
        style={{
          width: 120,
          height: 120,
          background: avatarColor,
          fontSize: 40,
          fontWeight: 800,
          color: "white",
          boxShadow: `0 0 60px ${avatarColor}44`,
        }}
      >
        {initials}
      </div>

      {/* Caller info */}
      <div className="text-center">
        <h2
          className="text-3xl font-bold mb-1"
          style={{ color: "oklch(0.96 0.008 220)" }}
        >
          {contact.name}
        </h2>
        <p className="text-base" style={{ color: "oklch(0.73 0.025 220)" }}>
          {contact.phoneNumber}
        </p>
      </div>

      {/* Cosmetic controls */}
      <div className="flex items-center gap-8">
        {[
          { icon: Mic, label: "Mute" },
          { icon: Volume2, label: "Speaker" },
          { icon: Grid3x3, label: "Keypad" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <button
              type="button"
              className="w-14 h-14 rounded-full flex items-center justify-center transition-colors"
              style={{
                background: "oklch(0.20 0.030 232)",
                border: "1px solid oklch(0.30 0.035 232)",
              }}
              data-ocid="active_call.control.button"
            >
              <Icon
                className="w-6 h-6"
                style={{ color: "oklch(0.73 0.025 220)" }}
              />
            </button>
            <span
              className="text-xs"
              style={{ color: "oklch(0.58 0.022 220)" }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* End call */}
      <div className="flex flex-col items-center gap-3">
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={handleEnd}
          disabled={ended}
          className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl disabled:opacity-50"
          style={{ background: "oklch(0.50 0.220 25)" }}
          data-ocid="active_call.end_call.button"
        >
          <PhoneOff className="w-8 h-8 text-white" />
        </motion.button>
        <span
          className="text-sm font-medium"
          style={{ color: "oklch(0.73 0.025 220)" }}
        >
          End Call
        </span>
      </div>
    </motion.div>
  );
}
