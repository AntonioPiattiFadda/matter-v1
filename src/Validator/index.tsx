import { z } from 'zod';

export const SaveCompanyInfoschema = z.object({
  adress: z.string().min(1),
  businessEmail: z.string().email(),
  city: z.string().min(1),
  companyName: z.string().min(1),
  country: z.string().min(1),
  state: z.string().min(1),
  taxId: z.number().min(1),
  zip: z.number().min(1),
});

export const SaveNewInvoiceInfoSchema = z.object({
  id: z.string(),
  serialNumber: z.string(),
  date: z.date(),
  dueDate: z.date(),
  toCompanyName: z.string().min(1),
  toCompanyEmail: z.string().email(),
  toCompanyAddress: z.string(),
  toCompanyTaxId: z.string(),
  items: z
    .array(
      z.object({
        description: z.string().min(1),
        price: z.number().min(1),
        quantity: z.number().min(1),
      })
    )
    .min(1),
  tax: z.number(),
  shipping: z.number(),
  total: z.number(),
  notes: z.string(),
  terms: z.string(),
  metamaskAddress: z.string().optional(),
  stripeId: z.string().optional(),
});

// eslint-disable-next-line react-refresh/only-export-components
export const loginWithEmailSchema = z.object({
  email: z.string().email(),
});
