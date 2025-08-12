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

// Flexible validation schema that accepts various field formats
export const DynamicSpecZ = z.object({
  id: z.string().optional(), // Allow "id" field as alternative to formId
  formId: z.string().optional(), // Optional formId field
  title: z.string(),
  version: z.string().optional().default("1.0"), // Make version optional with default
  rationale: z.string().optional(),
  warnings: z.array(z.string()).optional(),
  fields: z.array(z.object({
    id: z.string(),
    type: z.enum([
      "text", "textarea", "number", "boolean", "date", "currency",
      "select", "radio", "checkbox-group",
      "multiselect", // Adding multiselect support
      "single_select", // AI sometimes uses this
      "multi_select" // AI sometimes uses this
    ]),
    label: z.string(),
    helpText: z.string().optional(),
    required: z.boolean().optional(),
    placeholder: z.string().optional(),
    currency: z.string().optional(), // For currency fields
    currencyCode: z.string().optional(), // AI sometimes uses this
    prefix: z.string().optional(), // Alternative to currency for prefix display
    step: z.number().optional(), // Step value for number inputs
    min: z.number().optional(), // Direct min/max on field
    max: z.number().optional(),
    minSelected: z.number().optional(), // For multiselect
    options: z.array(z.object({
      value: z.string(),
      label: z.string()
    })).optional(),
    multiple: z.boolean().optional(),
    validations: z.object({
      minLength: z.number().optional(),
      maxLength: z.number().optional(),
      min: z.number().optional(),
      max: z.number().optional(),
      pattern: z.string().optional(),
    }).optional(),
    // Support both showIf and visibleWhen
    showIf: z.object({
      field: z.string(),
      equals: z.any().optional(),
      anyOf: z.array(z.string()).optional(),
      minSelected: z.number().optional(),
      anySelected: z.boolean().optional(), // AI sometimes uses this
    }).optional(),
    visibleWhen: z.object({
      field: z.string(),
      equals: z.any().optional(),
      anyOf: z.array(z.string()).optional(),
      minSelected: z.number().optional(),
      anySelected: z.boolean().optional(), // AI sometimes uses this
    }).optional(), // AI sometimes uses visibleWhen instead of showIf
  })),
});

export type DynamicFormSpec = z.infer<typeof DynamicSpecZ>;