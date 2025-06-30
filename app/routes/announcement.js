import { json } from '@remix-run/node';
import { prisma } from '../utils/db.server';

export async function loader() {
  const settings = await prisma.announcementSettings.findFirst();

  return json(settings || {});
}
