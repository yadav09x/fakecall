import { Phone, PhoneOff } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import type { Contact } from "../hooks/useQueries";
import { getAvatarColor, getInitials } from "./SetupScreen";

interface IncomingCallScreenProps {
  contact: Contact;
  onAccept: () => void;
  onDecline: () => void;
}

export function IncomingCallScreen({
  contact,
  onAccept,
  onDecline,
}: IncomingCallScreenProps) {
  const avatarColor = getAvatarColor(contact.name);
  const initials = getInitials(contact.name);

  useEffect(() => {
    if (navigator.vibrate) {
      const pattern = [500, 200, 500, 200, 500];
      const interval = setInterval(() => navigator.vibrate(pattern), 1400);
      return () => {
        clearInterval(interval);
        navigator.vibrate(0);
      };
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between py-20 px-8"
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, oklch(0.16 0.04 262) 0%, oklch(0.09 0.025 245) 60%, oklch(0.07 0.015 240) 100%)",
      }}
      data-ocid="incoming_call.modal"
    >
      {/* Top info */}
      <div className="text-center space-y-1">
        <p
          className="text-sm font-medium"
          style={{ color: "oklch(0.73 0.025 220)" }}
        >
          Incoming Call
        </p>
        <p className="text-xs" style={{ color: "oklch(0.58 0.022 220)" }}>
          FakeCall
        </p>
      </div>

      {/* Avatar with pulse rings */}
      <div className="relative flex items-center justify-center">
        {/* Pulse rings */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute rounded-full pulse-ring-el"
            style={{
              width: 120 + i * 48,
              height: 120 + i * 48,
              border: `2px solid ${avatarColor}`,
              opacity: 0.4,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
        {/* Avatar */}
        <motion.div
          className="fc-ring-anim relative z-10 rounded-full flex items-center justify-center shadow-2xl"
          style={{
            width: 120,
            height: 120,
            background: avatarColor,
            fontSize: 40,
            fontWeight: 800,
            color: "white",
          }}
        >
          {initials}
        </motion.div>
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

      {/* Action buttons */}
      <div className="flex items-center gap-16">
        {/* Decline */}
        <div className="flex flex-col items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onDecline}
            className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl"
            style={{ background: "oklch(0.50 0.220 25)" }}
            data-ocid="incoming_call.decline.button"
          >
            <PhoneOff className="w-8 h-8 text-white" />
          </motion.button>
          <span
            className="text-sm font-medium"
            style={{ color: "oklch(0.73 0.025 220)" }}
          >
            Decline
          </span>
        </div>

        {/* Accept */}
        <div className="flex flex-col items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onAccept}
            className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl"
            style={{ background: "oklch(0.55 0.18 145)" }}
            data-ocid="incoming_call.accept.button"
          >
            <Phone className="w-8 h-8 text-white" />
          </motion.button>
          <span
            className="text-sm font-medium"
            style={{ color: "oklch(0.73 0.025 220)" }}
          >
            Accept
          </span>
        </div>
      </div>
    </motion.div>
  );
}
