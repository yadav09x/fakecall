import { Clock, Phone, Plus, Trash2, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Contact } from "../hooks/useQueries";

const PRESET_CONTACTS: Contact[] = [
  { name: "Mom", phoneNumber: "(555) 123-4567" },
  { name: "Boss", phoneNumber: "(555) 987-6543" },
  { name: "Doctor's Office", phoneNumber: "(555) 246-8100" },
  { name: "Alex", phoneNumber: "(555) 371-9200" },
  { name: "Sarah", phoneNumber: "(555) 458-3311" },
];

const DELAY_OPTIONS = [
  { label: "5s", value: 5 },
  { label: "10s", value: 10 },
  { label: "30s", value: 30 },
  { label: "1m", value: 60 },
  { label: "2m", value: 120 },
];

const AVATAR_COLORS = [
  "oklch(0.55 0.18 262)",
  "oklch(0.55 0.18 145)",
  "oklch(0.55 0.20 30)",
  "oklch(0.55 0.18 310)",
  "oklch(0.55 0.18 200)",
  "oklch(0.55 0.18 60)",
];

export function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface SetupScreenProps {
  customContacts: Contact[];
  onSchedule: (contact: Contact, delay: number) => void;
  onAddContact: (contact: Contact) => void;
  onDeleteContact: (name: string) => void;
  isAddingContact: boolean;
}

export function SetupScreen({
  customContacts,
  onSchedule,
  onAddContact,
  onDeleteContact,
  isAddingContact,
}: SetupScreenProps) {
  const [selectedContact, setSelectedContact] = useState<Contact>(
    PRESET_CONTACTS[0],
  );
  const [selectedDelay, setSelectedDelay] = useState(10);
  const [customDelay, setCustomDelay] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const allContacts = [...PRESET_CONTACTS, ...customContacts];
  const effectiveDelay = customDelay
    ? Number.parseInt(customDelay)
    : selectedDelay;

  const handleSchedule = () => {
    if (!selectedContact) {
      toast.error("Pick a contact first");
      return;
    }
    if (!effectiveDelay || effectiveDelay < 1) {
      toast.error("Set a valid delay");
      return;
    }
    onSchedule(selectedContact, effectiveDelay);
  };

  const handleAddContact = () => {
    if (!newName.trim() || !newPhone.trim()) {
      toast.error("Name and number required");
      return;
    }
    onAddContact({ name: newName.trim(), phoneNumber: newPhone.trim() });
    setNewName("");
    setNewPhone("");
    setShowAddForm(false);
  };

  return (
    <div
      className="h-full overflow-y-auto px-4 pb-4 space-y-4"
      style={{ color: "oklch(0.96 0.008 220)" }}
    >
      {/* Contact picker */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <User
            className="w-3 h-3"
            style={{ color: "oklch(0.55 0.200 262)" }}
          />
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "oklch(0.58 0.022 220)" }}
          >
            Caller
          </span>
        </div>
        <div className="space-y-1">
          {allContacts.map((c) => (
            <button
              type="button"
              key={c.name}
              onClick={() => setSelectedContact(c)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all text-left"
              style={{
                background:
                  selectedContact.name === c.name
                    ? "oklch(0.55 0.200 262 / 0.15)"
                    : "oklch(0.14 0.022 232)",
                border: `1px solid ${
                  selectedContact.name === c.name
                    ? "oklch(0.55 0.200 262 / 0.5)"
                    : "oklch(0.22 0.030 232)"
                }`,
              }}
              data-ocid="setup.contact.button"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white flex-shrink-0"
                style={{
                  background: getAvatarColor(c.name),
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                {getInitials(c.name)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold truncate">{c.name}</div>
                <div
                  className="text-xs truncate"
                  style={{ color: "oklch(0.58 0.022 220)" }}
                >
                  {c.phoneNumber}
                </div>
              </div>
              {!PRESET_CONTACTS.find((p) => p.name === c.name) && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteContact(c.name);
                  }}
                  className="ml-auto p-1 rounded opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
                  style={{ color: "oklch(0.55 0.220 25)" }}
                  data-ocid="setup.contact.delete_button"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </button>
          ))}
        </div>

        {/* Add contact toggle */}
        {!showAddForm ? (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="mt-1.5 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-medium transition-colors"
            style={{
              border: "1px dashed oklch(0.35 0.035 232)",
              color: "oklch(0.58 0.022 220)",
            }}
            data-ocid="setup.add_contact.button"
          >
            <Plus className="w-3 h-3" /> Add Contact
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-2.5 rounded-xl space-y-1.5"
            style={{
              background: "oklch(0.14 0.022 232)",
              border: "1px solid oklch(0.22 0.030 232)",
            }}
          >
            <input
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg outline-none"
              style={{
                background: "oklch(0.18 0.025 232)",
                border: "1px solid oklch(0.28 0.035 232)",
                color: "oklch(0.96 0.008 220)",
              }}
              data-ocid="setup.contact_name.input"
            />
            <input
              placeholder="Phone number"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg outline-none"
              style={{
                background: "oklch(0.18 0.025 232)",
                border: "1px solid oklch(0.28 0.035 232)",
                color: "oklch(0.96 0.008 220)",
              }}
              data-ocid="setup.contact_phone.input"
            />
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={handleAddContact}
                disabled={isAddingContact}
                className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors"
                style={{ background: "oklch(0.55 0.200 262)" }}
                data-ocid="setup.contact.save_button"
              >
                {isAddingContact ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{
                  background: "oklch(0.20 0.030 232)",
                  color: "oklch(0.73 0.025 220)",
                }}
                data-ocid="setup.contact.cancel_button"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Delay picker */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Clock
            className="w-3 h-3"
            style={{ color: "oklch(0.55 0.200 262)" }}
          />
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "oklch(0.58 0.022 220)" }}
          >
            Delay
          </span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {DELAY_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => {
                setSelectedDelay(opt.value);
                setCustomDelay("");
              }}
              className="flex-1 min-w-[calc(20%-6px)] py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background:
                  selectedDelay === opt.value && !customDelay
                    ? "oklch(0.55 0.200 262)"
                    : "oklch(0.18 0.025 232)",
                color:
                  selectedDelay === opt.value && !customDelay
                    ? "oklch(0.98 0.005 220)"
                    : "oklch(0.73 0.025 220)",
                border: `1px solid ${
                  selectedDelay === opt.value && !customDelay
                    ? "oklch(0.55 0.200 262)"
                    : "oklch(0.28 0.035 232)"
                }`,
              }}
              data-ocid="setup.delay.button"
            >
              {opt.label}
            </button>
          ))}
        </div>
        <input
          type="number"
          placeholder="Custom (seconds)"
          value={customDelay}
          onChange={(e) => {
            setCustomDelay(e.target.value);
            setSelectedDelay(0);
          }}
          className="mt-1.5 w-full text-xs px-2.5 py-1.5 rounded-lg outline-none"
          style={{
            background: "oklch(0.18 0.025 232)",
            border: `1px solid ${
              customDelay
                ? "oklch(0.55 0.200 262 / 0.5)"
                : "oklch(0.28 0.035 232)"
            }`,
            color: "oklch(0.96 0.008 220)",
          }}
          data-ocid="setup.custom_delay.input"
        />
      </div>

      {/* Schedule button */}
      <button
        type="button"
        onClick={handleSchedule}
        className="w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 text-white transition-all active:scale-95"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.58 0.200 262) 0%, oklch(0.50 0.195 262) 100%)",
          boxShadow: "0 4px 16px oklch(0.55 0.200 262 / 0.35)",
        }}
        data-ocid="setup.schedule_call.primary_button"
      >
        <Phone className="w-4 h-4" />
        Schedule Call
      </button>
    </div>
  );
}
