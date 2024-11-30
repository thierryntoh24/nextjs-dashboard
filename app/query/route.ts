import { db, sql } from "@vercel/postgres";

const client = await db.connect();

async function listInvoices() {
	// const data = await client.sql`
  //   SELECT invoices.amount, customers.name
  //   FROM invoices
  //   JOIN customers ON invoices.customer_id = customers.id
  //   WHERE invoices.amount = 666;
  // `;

  const data = await sql`SELECT * FROM revenue`;
  // const data = await client.sql`SELECT * FROM revenue`;

	return data.rows;
}

export async function GET() {

  try {
  	return Response.json(await listInvoices());
  } catch (error) {
    console.error(error)
  	return Response.json({ error }, { status: 500 });
  }
}
