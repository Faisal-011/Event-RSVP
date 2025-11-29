
"use server";

import { z } from "zod";
import { supabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const RsvpSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(100, { message: "Name must not exceed 100 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  special_requests: z
    .string()
    .max(500, { message: "Requests must not exceed 500 characters." })
    .optional()
    .nullable(),
});

type CreateRsvpState = {
  success: boolean;
  error?: string;
};

export async function createRsvp(
  values: z.infer<typeof RsvpSchema>
): Promise<CreateRsvpState> {
  const validatedFields = RsvpSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid data provided. Please check the form and try again.",
    };
  }

  const { name, email, special_requests } = validatedFields.data;

  // Check if an RSVP with this email already exists
  const { data: existingRsvp, error: selectError } = await supabase
    .from("rsvps")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (selectError) {
    console.error("Error checking for existing RSVP:", selectError);
    return {
      success: false,
      error: "A database error occurred. Please try again later.",
    };
  }
  
  if (existingRsvp) {
     return {
      success: false,
      error: "An RSVP with this email address already exists. Please use the 'Find My RSVP' tab to view it.",
    };
  }

  // Insert new RSVP
  const { error: insertError } = await supabase.from("rsvps").insert({
    name,
    email,
    special_requests,
  });

  if (insertError) {
    console.error("Error inserting RSVP:", insertError);
    return {
      success: false,
      error: "Failed to submit your RSVP. Please try again.",
    };
  }

  revalidatePath("/");

  return { success: true };
}

export async function findRsvpByEmail(email: string) {
  if (!email || typeof email !== "string") {
    return null;
  }

  const { data, error } = await supabase
    .from("rsvps")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    // If error is 'PGRST116', it means no rows were found, which is not a server error.
    if (error.code !== 'PGRST116') {
      console.error("Error finding RSVP:", error);
    }
    return null;
  }

  return data;
}
