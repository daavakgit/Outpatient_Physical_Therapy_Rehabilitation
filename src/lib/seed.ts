import { connectToDatabase } from './db';

export async function seedDatabaseIfEmpty() {
  await connectToDatabase();
  // No auto-seeding enabled. Database remains completely clean.
}
