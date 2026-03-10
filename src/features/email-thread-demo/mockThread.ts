import type { MockEmail } from "./emailThread.types";

export const MOCK_THREAD: MockEmail[] = [
  {
    id: "email-1",
    from: {
      name: "James Whitfield",
      email: "j.whitfield@email.com",
      role: "customer",
    },
    to: {
      name: "Support Team",
      email: "support@firstnationalbank.com",
      role: "agent",
    },
    subject: "Re: International Wire Transfer — Reference #IWT-88423",
    timestamp: "2026-03-06T09:14:00Z",
    body: `Hi,

I'm writing because I attempted to send an international wire transfer of $4,200 to my supplier in Germany on Monday and the funds still haven't arrived. The reference number I was given is IWT-88423.

My account was debited immediately, but my supplier is saying they've received nothing. This is holding up a shipment that was supposed to go out yesterday.

Could you please look into this urgently? I've been a customer for 11 years and this is the first time I've had an issue like this.

Thanks,
James Whitfield`,
  },
  {
    id: "email-2",
    from: {
      name: "Sarah Chen",
      email: "s.chen@firstnationalbank.com",
      role: "agent",
    },
    to: {
      name: "James Whitfield",
      email: "j.whitfield@email.com",
      role: "customer",
    },
    subject: "Re: International Wire Transfer — Reference #IWT-88423",
    timestamp: "2026-03-06T11:32:00Z",
    body: `Dear Mr. Whitfield,

Thank you for contacting First National Bank. I'm sorry to hear about the delay with your wire transfer — I completely understand how disruptive this must be.

I've located your transaction (Reference: IWT-88423) and can see that it was submitted successfully on Monday morning. The transfer is currently in a compliance review queue, which can occasionally occur for first-time international transfers above $2,000.

I've flagged this as urgent with our compliance team and requested an expedited review. You should receive an update within 4 business hours.

In the meantime, could you confirm the IBAN and BIC/SWIFT code of the recipient account? I'd like to verify the details are correct on our end to avoid any delays once compliance clears it.

Apologies again for the inconvenience.

Best regards,
Sarah Chen
Customer Support — First National Bank`,
  },
  {
    id: "email-3",
    from: {
      name: "James Whitfield",
      email: "j.whitfield@email.com",
      role: "customer",
    },
    to: {
      name: "Support Team",
      email: "support@firstnationalbank.com",
      role: "agent",
    },
    subject: "Re: International Wire Transfer — Reference #IWT-88423",
    timestamp: "2026-03-06T13:47:00Z",
    body: `Hi Sarah,

Thanks for the quick reply. Here are the recipient details:

  Recipient:  Müller Logistik GmbH
  IBAN:       DE89 3704 0044 0532 0130 00
  BIC/SWIFT:  COBADEFFXXX

I double-checked these against the invoice and they're correct.

I have to be honest — 4 more business hours is going to be a real problem. My supplier is threatening to cancel the order entirely if payment doesn't clear by end of day today. Is there any way to escalate this further or process a manual release?

Also, is there any chance this causes the transfer to fail rather than just be delayed? I need to know if I should be making other arrangements.

James`,
  },
  {
    id: "email-4",
    from: {
      name: "Sarah Chen",
      email: "s.chen@firstnationalbank.com",
      role: "agent",
    },
    to: {
      name: "James Whitfield",
      email: "j.whitfield@email.com",
      role: "customer",
    },
    subject: "Re: International Wire Transfer — Reference #IWT-88423",
    timestamp: "2026-03-06T15:20:00Z",
    body: `Dear Mr. Whitfield,

Thank you for confirming those details — the IBAN and BIC are correct and match what we have on file.

I've escalated your case to a senior compliance officer and have requested a same-day manual review. I want to be transparent: I cannot guarantee release before end of business today, but we are treating this as a priority.

To answer your question directly — in the rare event compliance does not clear the transfer, the funds will be returned to your account in full, typically within 1–2 business days. You would not lose the money.

I recommend keeping your supplier informed that escalation is underway. If it would help, I can provide a formal bank letter confirming the transfer is in compliance review, which you could share with them as proof of payment intent. Just let me know.

We will send you a status update by 5:00 PM today regardless of outcome.

I'm sorry for the stress this has caused.

Best regards,
Sarah Chen
Customer Support — First National Bank`,
  },
];

export const ADDITIONAL_EMAILS: MockEmail[] = [
  {
    id: "email-5",
    from: {
      name: "James Whitfield",
      email: "j.whitfield@email.com",
      role: "customer",
    },
    to: {
      name: "Support Team",
      email: "support@firstnationalbank.com",
      role: "agent",
    },
    subject: "Re: International Wire Transfer — Reference #IWT-88423",
    timestamp: "2026-03-06T16:05:00Z",
    body: `Sarah,

The bank letter would be very helpful — yes please. 

My supplier has agreed to hold the order until 10am tomorrow morning on the condition that I can show them something official from the bank today.

Please send it as soon as you can.

James`,
  },
  {
    id: "email-6",
    from: {
      name: "Sarah Chen",
      email: "s.chen@firstnationalbank.com",
      role: "agent",
    },
    to: {
      name: "James Whitfield",
      email: "j.whitfield@email.com",
      role: "customer",
    },
    subject: "Re: International Wire Transfer — Reference #IWT-88423",
    timestamp: "2026-03-06T16:45:00Z",
    body: `Dear Mr. Whitfield,

Good news — I have two updates.

First, I've attached a formal bank letter confirming that transfer IWT-88423 is currently under compliance review and that the funds are committed. You can share this with your supplier immediately.

Second, our compliance team has completed the expedited review and has approved the transfer for release. The wire has now been submitted to the SWIFT network. Based on normal processing times, your supplier should receive the funds within 1–3 business hours.

I'm very glad we were able to get this resolved today. Is there anything else I can help you with?

Best regards,
Sarah Chen
Customer Support — First National Bank`,
  },
  {
    id: "email-7",
    from: {
      name: "James Whitfield",
      email: "j.whitfield@email.com",
      role: "customer",
    },
    to: {
      name: "Support Team",
      email: "support@firstnationalbank.com",
      role: "agent",
    },
    subject: "Re: International Wire Transfer — Reference #IWT-88423",
    timestamp: "2026-03-07T09:12:00Z",
    body: `Sarah,

My supplier confirmed receipt of the funds this morning. The shipment is back on track.

I want to say thank you — genuinely. The situation was very stressful and you handled it professionally and quickly once it was escalated. I appreciate the transparency throughout.

One thing I'd ask is whether there's anything I can do in future to avoid the compliance hold for international transfers. Is there a pre-approval process or a way to whitelist recipients?

Thanks again,
James`,
  },
  {
    id: "email-8",
    from: {
      name: "Sarah Chen",
      email: "s.chen@firstnationalbank.com",
      role: "agent",
    },
    to: {
      name: "James Whitfield",
      email: "j.whitfield@email.com",
      role: "customer",
    },
    subject: "Re: International Wire Transfer — Reference #IWT-88423",
    timestamp: "2026-03-07T10:30:00Z",
    body: `Dear Mr. Whitfield,

Wonderful news — so glad to hear the shipment is back on track!

Thank you for the kind words. It means a lot.

Regarding your question about future international transfers — yes, there is a process that can help. You can register international payees through our Trusted Recipient Programme, available in online banking under Payments > Manage Payees. Once a recipient is registered and verified (usually 1 business day), future transfers to them above the threshold are not subject to the same compliance queue.

Given your 11-year history with us, I'd also suggest speaking with your relationship manager about upgrading your account tier, which increases the threshold before compliance review kicks in.

Thank you again for your patience and loyalty, Mr. Whitfield. Please don't hesitate to reach out if you need anything.

Best regards,
Sarah Chen
Customer Support — First National Bank`,
  },
];

export const SCENARIO_FRAUD: MockEmail[] = [
  {
    id: "f-email-1",
    from: { name: "Marcus Bellamy", email: "marcus.bellamy@outlook.com", role: "customer" },
    to: { name: "Support Team", email: "support@firstnationalbank.com", role: "agent" },
    subject: "Suspicious transactions on my account — please help",
    timestamp: "2026-03-08T07:30:00Z",
    body: `Hi,

I woke up this morning to three transaction notifications I definitely didn't make:

  1. £349.99 — "ELECTRONIX STORE BUDAPEST" — 07:02 AM
  2. £89.00  — "STREAMVAULT PRO ANNUAL"    — 07:08 AM
  3. £212.50 — "ELECTRONIX STORE BUDAPEST" — 07:11 AM

I'm in Manchester. I have not made any purchases in Budapest and I've never heard of StreamVault Pro. My card is physically in my wallet in front of me.

Total: £651.49 taken from my account in 9 minutes.

I need these reversed and my card cancelled immediately. My card ending in 4471.

Very concerned,
Marcus Bellamy`,
  },
  {
    id: "f-email-2",
    from: { name: "Aisha Okonkwo", email: "a.okonkwo@firstnationalbank.com", role: "agent" },
    to: { name: "Marcus Bellamy", email: "marcus.bellamy@outlook.com", role: "customer" },
    subject: "Re: Suspicious transactions on my account — please help",
    timestamp: "2026-03-08T08:05:00Z",
    body: `Dear Mr. Bellamy,

Thank you for contacting us so quickly — acting fast is exactly the right thing to do in this situation.

I've taken the following immediate actions on your account:

1. Card ending 4471 has been blocked. No further transactions can be processed on it.
2. All three transactions you listed have been flagged as disputed and raised with our fraud investigations team.
3. A provisional credit of £651.49 has been applied to your account while the investigation is underway.

You are not liable for these charges. Our fraud team will investigate and the provisional credit will be made permanent once the investigation concludes, typically within 5–10 business days.

I'd like to ask a few security questions to understand how this may have happened. In the last 48 hours, have you:
- Used your card on any unfamiliar websites or apps?
- Received any unexpected texts or emails asking you to verify your card details?
- Used your card at an ATM you don't normally use?

Your answers will help our fraud team trace the source.

A new card will be dispatched to your registered address and should arrive within 3–5 business days. You can manage your account digitally in the meantime.

Please don't hesitate to call our fraud line directly if you'd like to speak to someone: 0800 XXX XXXX.

Regards,
Aisha Okonkwo
Fraud & Security Team — First National Bank`,
  },
  {
    id: "f-email-3",
    from: { name: "Marcus Bellamy", email: "marcus.bellamy@outlook.com", role: "customer" },
    to: { name: "Support Team", email: "support@firstnationalbank.com", role: "agent" },
    subject: "Re: Suspicious transactions on my account — please help",
    timestamp: "2026-03-08T09:15:00Z",
    body: `Aisha,

Thanks for the fast response. Good to know the card is blocked.

To answer your questions:

- Websites: I did buy something from a cycling gear website called "VeloDeals" last Thursday. I'd never used them before but they had a good price on a helmet. Paid by card.
- Texts/emails: I did get a text on Thursday evening saying my delivery was held and I needed to re-enter my card details to release it. I thought it was from the cycling site so I filled in my details. Looking at it now it might have been a scam.
- ATMs: Only my usual one at Tesco.

The text link went to something like "delivery-reschedule-uk.com" — I'm guessing that's the problem?

Marcus`,
  },
  {
    id: "f-email-4",
    from: { name: "Aisha Okonkwo", email: "a.okonkwo@firstnationalbank.com", role: "agent" },
    to: { name: "Marcus Bellamy", email: "marcus.bellamy@outlook.com", role: "customer" },
    subject: "Re: Suspicious transactions on my account — please help",
    timestamp: "2026-03-08T10:40:00Z",
    body: `Dear Mr. Bellamy,

Thank you for sharing that — it's very helpful and, I have to say, very common. What you've described is a classic smishing (SMS phishing) attack. The text message and fake delivery page were designed specifically to harvest card details. You did nothing wrong — these scams are sophisticated and catch many people out.

This information has been passed to our fraud team and will support the investigation and the permanent refund of your £651.49.

A few things I'd recommend doing now:
1. Report the text to the UK's National Cyber Security Centre by forwarding it to 7726 (spells SPAM on a keypad)
2. Change your online banking password and enable two-factor authentication if you haven't already
3. Be cautious of any follow-up contact — scammers sometimes attempt a second approach after a successful attack

Your new card will arrive within 3–5 business days. In the meantime, you can add it to Apple Pay or Google Pay virtually if you need to make payments.

Is there anything else I can help you with?

Regards,
Aisha Okonkwo
Fraud & Security Team — First National Bank`,
  },
];

export const SCENARIO_FRAUD_ADDITIONAL: MockEmail[] = [
  {
    id: "f-email-5",
    from: { name: "Marcus Bellamy", email: "marcus.bellamy@outlook.com", role: "customer" },
    to: { name: "Support Team", email: "support@firstnationalbank.com", role: "agent" },
    subject: "Re: Suspicious transactions on my account — please help",
    timestamp: "2026-03-09T11:00:00Z",
    body: `Aisha,

I've reported the text to 7726 and changed my banking password. I've also turned on 2FA.

I'm still waiting for my new card. I've got a direct debit for my gym going out on the 10th — will it go through while my card is blocked? I don't want another missed payment issue.

Marcus`,
  },
  {
    id: "f-email-6",
    from: { name: "Aisha Okonkwo", email: "a.okonkwo@firstnationalbank.com", role: "agent" },
    to: { name: "Marcus Bellamy", email: "marcus.bellamy@outlook.com", role: "customer" },
    subject: "Re: Suspicious transactions on my account — please help",
    timestamp: "2026-03-09T12:20:00Z",
    body: `Dear Mr. Bellamy,

Well done for taking those steps quickly — that's exactly right.

Good question about your direct debit. Card blocks only prevent card-present and card-not-present transactions — they do not affect direct debits, which pull from your account directly rather than via the card. Your gym direct debit on the 10th will process as normal.

Your new card has been dispatched and is expected to arrive tomorrow (10th March). Once it arrives, activate it via the app and your card payments will resume.

Regards,
Aisha Okonkwo
Fraud & Security Team — First National Bank`,
  },
  {
    id: "f-email-7",
    from: { name: "Marcus Bellamy", email: "marcus.bellamy@outlook.com", role: "customer" },
    to: { name: "Support Team", email: "support@firstnationalbank.com", role: "agent" },
    subject: "Re: Suspicious transactions on my account — please help",
    timestamp: "2026-03-11T14:00:00Z",
    body: `Aisha,

Card arrived and is activated. Direct debit went through fine.

Any update on when the £651.49 becomes permanent? It's showing as provisional credit still.

Marcus`,
  },
  {
    id: "f-email-8",
    from: { name: "Aisha Okonkwo", email: "a.okonkwo@firstnationalbank.com", role: "agent" },
    to: { name: "Marcus Bellamy", email: "marcus.bellamy@outlook.com", role: "customer" },
    subject: "Re: Suspicious transactions on my account — please help",
    timestamp: "2026-03-11T15:45:00Z",
    body: `Dear Mr. Bellamy,

Great to hear the card is set up and everything is running normally.

I've just checked your case and I can see our fraud team completed their investigation this morning. The £651.49 provisional credit has been confirmed and will be made permanent on your account by end of business today. You should see it update from "provisional" to a normal credit within the next few hours.

Your case is now closed on our end. You'll receive a formal closure letter by post within 7 days.

Thank you for your patience throughout this, Mr. Bellamy. I'm sorry it happened, but glad we could resolve it fully.

Regards,
Aisha Okonkwo
Fraud & Security Team — First National Bank`,
  },
];

export type ScenarioId = "wire" | "fraud";

export const SCENARIOS: {
  id: ScenarioId;
  label: string;
  initial: MockEmail[];
  additional: MockEmail[];
}[] = [
  { id: "wire", label: "Wire transfer", initial: MOCK_THREAD, additional: ADDITIONAL_EMAILS },
  { id: "fraud", label: "Fraud / card", initial: SCENARIO_FRAUD, additional: SCENARIO_FRAUD_ADDITIONAL },
];

