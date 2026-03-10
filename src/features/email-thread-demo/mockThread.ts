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

