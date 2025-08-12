import { z } from "zod";

export const CoreZ = z.object({
  applicant: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dob: z.string().min(1, "Date of birth is required"),
    phone: z.string().min(7, "Phone number must be at least 7 digits"),
    email: z.string().email("Invalid email address"),
    language: z.string().optional(),
  }),
  housing: z.object({
    address1: z.string().min(1, "Address is required"),
    address2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().length(2, "State must be 2 characters"),
    zip: z.string().min(5, "ZIP code must be at least 5 digits"),
    monthlyRent: z.coerce.number().min(0, "Monthly rent must be 0 or greater"),
    monthsBehind: z.coerce.number().min(0, "Months behind must be 0 or greater"),
    landlordName: z.string().optional(),
    landlordPhone: z.string().optional(),
  }),
  household: z.object({
    size: z.coerce.number().min(1, "Household size must be at least 1"),
    members: z.array(z.object({
      relation: z.string(),
      ageRange: z.string(),
      incomeBand: z.string()
    })).optional()
  }),
  eligibility: z.object({
    hardship: z.boolean(),
    typedSignature: z.string().min(1, "Signature is required"),
    signedAtISO: z.string().min(1, "Sign date is required")
  }),
});

export type Core = z.infer<typeof CoreZ>;

export const DynamicSpecZ = z.object({
  title: z.string(),
  version: z.string(),
  rationale: z.string().optional(),
  warnings: z.array(z.string()).optional(),
  fields: z.array(z.union([
    z.object({
      id: z.string(),
      type: z.enum(["text", "textarea", "number", "boolean", "date", "currency"]),
      label: z.string(),
      helpText: z.string().optional(),
      required: z.boolean().optional(),
      placeholder: z.string().optional(),
      validations: z.object({
        minLength: z.number().optional(),
        maxLength: z.number().optional(),
        min: z.number().optional(),
        max: z.number().optional(),
        pattern: z.string().optional(),
      }).optional(),
    }),
    z.object({
      id: z.string(),
      type: z.enum(["select", "radio", "checkbox-group"]),
      label: z.string(),
      required: z.boolean().optional(),
      options: z.array(z.object({
        value: z.string(),
        label: z.string()
      })),
      multiple: z.boolean().optional(),
    }),
  ])),
});

export type DynamicFormSpec = z.infer<typeof DynamicSpecZ>;