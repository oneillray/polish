export interface MockEmailParty {
  name: string;
  email: string;
  role: "customer" | "agent";
}

export interface MockEmail {
  id: string;
  from: MockEmailParty;
  to: MockEmailParty;
  subject: string;
  timestamp: string; // ISO 8601
  body: string;
}

export interface ThreadState {
  emails: MockEmail[];
  expandedIds: Set<string>;
  additionalEmailIndex: number;
}

