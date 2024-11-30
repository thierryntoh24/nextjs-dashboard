"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  //   const rawFormData = {
  //     customerId: formData.get('customerId'),
  //     amount: formData.get('amount'),
  //     status: formData.get('status'),
  //   };

  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  // Test it out:
  //   console.log(Object.fromEntries(formData.entries()));
  //   console.log({ customerId, amount, status });

  await sql`
INSERT INTO invoices (customer_id, amount, status, date)
VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
`
    .then(() => {
      revalidatePath("/dashboard/invoices");
      redirect("/dashboard/invoices");
    })
    .catch(() => ({
      message: "Database Error: Failed to Create Invoice.",
    }))
    .finally();
}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// ...

export async function updateInvoice(id: string, formData: FormData) {

  // throw new Error('Failed to Delete Invoice');

  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCents = amount * 100;

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `
    .then(() => {
      revalidatePath("/dashboard/invoices");
      redirect("/dashboard/invoices");
    })
    .catch(() => ({
      message: "Database Error: Failed to Update Invoice.",
    }))
    .finally();
}

export async function deleteInvoice(id: string) {
  // throw new Error('Failed to Delete Invoice');


  await sql`DELETE FROM invoices WHERE id = ${id}`
    .then(() => {
      revalidatePath("/dashboard/invoices");
      return { message: "Deleted Invoice." };
    })
    .catch(() => ({
      message: "Database Error: Failed to Delete Invoice.",
    }))
    .finally();
}
