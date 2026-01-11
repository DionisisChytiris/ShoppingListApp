import { z } from 'zod';
import { ItemCategory, CATEGORIES } from './categories';

/**
 * Validation schemas for form inputs
 */

// List title validation
export const listTitleSchema = z.object({
  title: z
    .string()
    .min(1, 'List name is required')
    .max(50, 'List name must be 50 characters or less')
    .trim(),
});

export type ListTitleInput = z.infer<typeof listTitleSchema>;

// Item validation schema (input form - accepts strings)
export const itemInputSchema = z.object({
  name: z
    .string()
    .min(1, 'Item name is required')
    .max(100, 'Item name must be 100 characters or less')
    .trim(),
  category: z.enum(CATEGORIES as [ItemCategory, ...ItemCategory[]], {
    message: 'Category is required',
  }),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .trim()
    .optional()
    .or(z.literal('')),
  price: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0;
      },
      { message: 'Price must be a valid positive number' }
    ),
  photoUri: z.string().nullable().optional(),
  quantity: z
    .union([z.string(), z.number()])
    .optional()
    .refine(
      (val) => {
        if (val === undefined || val === null || val === '') return true;
        const num = typeof val === 'string' ? parseInt(val, 10) : val;
        return !isNaN(num) && num >= 1 && Number.isInteger(num);
      },
      { message: 'Quantity must be a positive integer' }
    )
    .transform((val) => {
      if (val === undefined || val === null || val === '') return 1;
      const num = typeof val === 'string' ? parseInt(val, 10) : val;
      return isNaN(num) || num < 1 ? 1 : num;
    }),
  checked: z.boolean().optional().default(false),
});

// Item schema for output (transformed to match Item type)
export const itemSchema = itemInputSchema.transform((data) => ({
  ...data,
  price: data.price && data.price.trim() !== '' 
    ? (() => {
        const num = parseFloat(data.price);
        return isNaN(num) ? undefined : num;
      })()
    : undefined,
  description: data.description && data.description.trim() !== '' 
    ? data.description.trim() 
    : undefined,
}));

export type ItemInput = z.input<typeof itemInputSchema>;
export type ItemOutput = z.infer<typeof itemSchema>;

// Helper function to validate and get errors
export function validateForm<T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors: Record<string, string> = {};
  result.error.issues.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  
  return { success: false, errors };
}

// Helper to get first error message for a field
export function getFieldError(
  errors: Record<string, string> | undefined,
  fieldName: string
): string | undefined {
  return errors?.[fieldName];
}

