import { Toaster } from "@/components/ui/sonner";
import { Clock, Phone, ShieldCheck, Smartphone } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ActiveCallScreen } from "./components/ActiveCallScreen";
import { Header } from "./components/Header";
import { IncomingCallScreen } from "./components/IncomingCallScreen";
import { PhoneFrame } from "./components/PhoneFrame";
import { SetupScreen } from "./components/SetupScreen";
import {
  useAddContact,
  useDeleteContact,
  useGetContacts,
} from "./hooks/useQueries";
import type { Contact } from "./hooks/useQueries";
import { useRingtone } from "./hooks/useRingtone";

type AppState = "setup" | "countdown" | "incoming" | "active";

const FEATURES = [
  {
    icon: Clock,
    title: "Timed Escape",
    description:
      "Schedule a fake incoming call from 5 seconds to hours away. Perfect for meetings, dates, or awkward dinners.",
  },
  {
    icon: Smartphone,
    title: "Realistic Interface",
    description:
      "Full-screen incoming call UI with ringtone, vibration, and a live call timer that looks just like the real thing.",
  },
  {
    icon: ShieldCheck,
    title: "Custom Contacts",
    description:
      "Use preset contacts like 'Mom' or 'Boss', or save your own custom contacts to the cloud for repeat use.",
  },
];

export default function App() {
  const [appState, setAppState] = useState<AppState>("setup");
  const [pendingContact, setPendingContact] = useState<Contact | null>(null);
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ringtone = useRingtone();

  const { data: customContacts = [] } = useGetContacts();
  const addContact = useAddContact();
  const deleteContact = useDeleteContact();

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      ringtone.stop();
    };
  }, [ringtone]);

  const handleSchedule = (contact: Contact, delay: number) => {
    setPendingContact(contact);
    setCountdown(delay);
    setAppState("countdown");
    toast.success(`Call from ${contact.name} in ${delay}s`);

    let remaining = delay;
    countdownRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        if (countdownRef.current) clearInterval(countdownRef.current);
        setAppState("incoming");
        ringtone.start();
      }
    }, 1000);
  };

  const handleAccept = () => {
    ringtone.stop();
    setAppState("active");
  };

  const handleDecline = () => {
    ringtone.stop();
    setAppState("setup");
    setPendingContact(null);
  };

  const handleEndCall = () => {
    setAppState("setup");
    setPendingContact(null);
  };

  const handleCancelCountdown = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setAppState("setup");
    setPendingContact(null);
    toast.info("Scheduled call cancelled");
  };

  const handleAddContact = (contact: Contact) => {
    addContact.mutate(contact, {
      onSuccess: () => toast.success(`${contact.name} saved`),
      onError: () => toast.error("Failed to save contact"),
    });
  };

  const handleDeleteContact = (name: string) => {
    deleteContact.mutate(name, {
      onSuccess: () => toast.success("Contact removed"),
      onError: () => toast.error("Failed to remove contact"),
    });
  };

  return (
    <div className="fc-page-bg min-h-screen flex flex-col">
      <Toaster position="top-center" />

      {/* Overlays */}
      <AnimatePresence>
        {appState === "incoming" && pendingContact && (
          <IncomingCallScreen
            key="incoming"
            contact={pendingContact}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        )}
        {appState === "active" && pendingContact && (
          <ActiveCallScreen
            key="active"
            contact={pendingContact}
            onEndCall={handleEndCall}
          />
        )}
      </AnimatePresence>

      <Header />

      <main className="flex-1">
        {/* Hero section */}
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
                style={{
                  background: "oklch(0.55 0.200 262 / 0.12)",
                  border: "1px solid oklch(0.55 0.200 262 / 0.3)",
                  color: "oklch(0.75 0.15 262)",
                }}
              >
                <Phone className="w-3 h-3" />
                Always have an escape plan
              </div>
              <h1
                className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6 fc-glow-text"
                style={{ color: "oklch(0.96 0.008 220)" }}
              >
                Schedule Calls,
                <br />
                <span style={{ color: "oklch(0.68 0.18 262)" }}>
                  Escape Moments.
                </span>
              </h1>
              <p
                className="text-lg leading-relaxed mb-8"
                style={{ color: "oklch(0.73 0.025 220)" }}
              >
                Fake an incoming phone call at any moment. Set the caller, pick
                the delay, and walk out of any situation with a smile.
              </p>
              <button
                type="button"
                className="fc-btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-base shadow-glow"
                data-ocid="hero.primary_button"
              >
                <Smartphone className="w-5 h-5" />
                Download the App
              </button>
            </motion.div>

            {/* Right: phone mockup with live setup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex justify-center"
            >
              <PhoneFrame className="fc-phone-shadow">
                {appState === "countdown" ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-6">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black mb-4"
                      style={{
                        background: "oklch(0.55 0.200 262 / 0.15)",
                        color: "oklch(0.68 0.18 262)",
                        border: "2px solid oklch(0.55 0.200 262 / 0.3)",
                      }}
                    >
                      {countdown}
                    </div>
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{ color: "oklch(0.96 0.008 220)" }}
                    >
                      Call incoming in...
                    </p>
                    <p
                      className="text-xs mb-6"
                      style={{ color: "oklch(0.58 0.022 220)" }}
                    >
                      from {pendingContact?.name}
                    </p>
                    <button
                      type="button"
                      onClick={handleCancelCountdown}
                      className="px-4 py-2 rounded-xl text-xs font-semibold"
                      style={{
                        background: "oklch(0.20 0.030 232)",
                        border: "1px solid oklch(0.30 0.035 232)",
                        color: "oklch(0.73 0.025 220)",
                      }}
                      data-ocid="setup.cancel.button"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col">
                    {/* Phone header */}
                    <div
                      className="px-4 pt-2 pb-3 flex items-center gap-2"
                      style={{
                        borderBottom: "1px solid oklch(0.20 0.025 232)",
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center"
                        style={{ background: "oklch(0.55 0.200 262)" }}
                      >
                        <Phone className="w-3 h-3 text-white" />
                      </div>
                      <span
                        className="text-sm font-bold"
                        style={{ color: "oklch(0.96 0.008 220)" }}
                      >
                        Create New Call
                      </span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <SetupScreen
                        customContacts={customContacts}
                        onSchedule={handleSchedule}
                        onAddContact={handleAddContact}
                        onDeleteContact={handleDeleteContact}
                        isAddingContact={addContact.isPending}
                      />
                    </div>
                  </div>
                )}
              </PhoneFrame>
            </motion.div>
          </div>
        </section>

        {/* Showcase section */}
        <section className="max-w-6xl mx-auto px-6 pb-24" id="features">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl font-bold"
              style={{ color: "oklch(0.96 0.008 220)" }}
            >
              See the Realistic Interface
            </h2>
            <p
              className="mt-3 text-base"
              style={{ color: "oklch(0.73 0.025 220)" }}
            >
              Looks and feels like a real incoming call on any device.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            {[
              {
                src: "/assets/generated/phone-mockup-setup.dim_320x640-transparent.png",
                caption: "Home Screen",
              },
              {
                src: "/assets/generated/phone-mockup-incoming.dim_320x640-transparent.png",
                caption: "Incoming Call",
              },
              {
                src: "/assets/generated/phone-mockup-active.dim_320x640-transparent.png",
                caption: "Active Call",
              },
            ].map(({ src, caption }, i) => (
              <motion.div
                key={caption}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex flex-col items-center"
                data-ocid={`showcase.item.${i + 1}`}
              >
                <img src={src} alt={caption} className="w-48 fc-phone-shadow" />
                <p
                  className="mt-4 text-sm font-semibold"
                  style={{ color: "oklch(0.73 0.025 220)" }}
                >
                  {caption}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features section */}
        <section className="max-w-6xl mx-auto px-6 pb-24" id="app">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-10"
            style={{ color: "oklch(0.96 0.008 220)" }}
          >
            App Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="fc-card p-6 rounded-2xl"
                data-ocid={`features.item.${i + 1}`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: "oklch(0.55 0.200 262 / 0.12)",
                    border: "1px solid oklch(0.55 0.200 262 / 0.2)",
                  }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: "oklch(0.68 0.18 262)" }}
                  />
                </div>
                <h3
                  className="text-base font-bold mb-2"
                  style={{ color: "oklch(0.96 0.008 220)" }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "oklch(0.73 0.025 220)" }}
                >
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="fc-header-bg mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "oklch(0.55 0.200 262)" }}
                >
                  <Phone className="w-3.5 h-3.5 text-white" />
                </div>
                <span
                  className="font-bold"
                  style={{ color: "oklch(0.96 0.008 220)" }}
                >
                  FakeCall
                </span>
              </div>
              <p
                className="text-sm max-w-xs"
                style={{ color: "oklch(0.58 0.022 220)" }}
              >
                Your go-to escape plan for any awkward situation.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-3 gap-8 text-sm">
              {[
                {
                  col: "Product",
                  links: ["Features", "How it Works", "Pricing"],
                },
                { col: "Company", links: ["About", "Blog", "Careers"] },
                { col: "Legal", links: ["Privacy", "Terms", "Cookies"] },
              ].map(({ col, links }) => (
                <div key={col}>
                  <p
                    className="font-semibold mb-3"
                    style={{ color: "oklch(0.96 0.008 220)" }}
                  >
                    {col}
                  </p>
                  {links.map((l) => (
                    <a
                      key={l}
                      href="#features"
                      className="block mb-2"
                      style={{ color: "oklch(0.58 0.022 220)" }}
                    >
                      {l}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div
            className="pt-6"
            style={{ borderTop: "1px solid oklch(0.23 0.035 232)" }}
          >
            <p
              className="text-xs text-center"
              style={{ color: "oklch(0.45 0.018 220)" }}
            >
              &copy; {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-80"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
