import { pgTable, text, uuid, timestamp, jsonb } from "drizzle-orm/pg-core";

export type Core = {
  applicant: { 
    firstName: string; 
    lastName: string; 
    dob: string; 
    phone: string; 
    email: string; 
    language?: string;
  };
  housing: {
    address1: string; 
    address2?: string; 
    city: string; 
    state: string; 
    zip: string;
    monthlyRent: number; 
    monthsBehind: number; 
    landlordName?: string; 
    landlordPhone?: string;
  };
  household: { 
    size: number; 
    members?: Array<{ 
      relation: string; 
      ageRange: string; 
      incomeBand: string;
    }>;
  };
  eligibility: { 
    hardship: boolean; 
    typedSignature: string; 
    signedAtISO: string;
  };
};

export type DynamicFormSpec = {
  title: string;
  version: string;
  rationale?: string;
  warnings?: string[];
  fields: Array<
    | {
        id: string; 
        type: "text"|"textarea"|"number"|"boolean"|"date"|"currency";
        label: string; 
        helpText?: string; 
        required?: boolean; 
        placeholder?: string;
        validations?: { 
          minLength?: number; 
          maxLength?: number; 
          min?: number; 
          max?: number; 
          pattern?: string;
        };
      }
    | {
        id: string; 
        type: "select"|"radio"|"checkbox-group";
        label: string; 
        required?: boolean; 
        options: { value: string; label: string }[]; 
        multiple?: boolean;
      }
  >;
};

export const applications = pgTable("applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: text("session_id").notNull(),
  status: text("status").notNull().default("draft"), // draft | submitted
  core: jsonb("core").$type<Core>().notNull(),
  prompt: text("prompt"),
  dynamicSpec: jsonb("dynamic_spec").$type<DynamicFormSpec | null>().default(null),
  dynamicAnswers: jsonb("dynamic_answers").$type<Record<string, unknown> | null>().default(null),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ApplicationRecord = typeof applications.$inferSelect;
export type NewApplicationRecord = typeof applications.$inferInsert;