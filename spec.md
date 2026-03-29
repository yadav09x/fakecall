# FakeCall

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- Fake incoming call app with a realistic phone call UI
- Customizable caller: name, phone number, avatar (initials-based)
- Timer to schedule incoming call (5s, 10s, 30s, 1min, 2min, or custom)
- Incoming call screen: full-screen overlay with caller info, ringtone audio, Accept / Decline buttons
- Active call screen: caller info, animated call timer, Hang Up button
- Preset contacts to choose from (or create a custom one)
- Saved custom contacts stored in backend

### Modify
- None

### Remove
- None

## Implementation Plan
1. Backend: store custom contacts (name, number) per anonymous user session
2. Frontend: 
   - Home screen: pick/create a contact, set delay timer, press "Schedule Call" button
   - Incoming call overlay: full-screen, vibration + ringtone, accept/decline
   - Active call screen: live call timer, mute/speaker (cosmetic), hang up
   - Preset contacts: 5 built-in contacts with realistic names/numbers
