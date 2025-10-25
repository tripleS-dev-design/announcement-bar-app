import { json } from "@remix-run/node";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const loader = async ({ request }) => {
  console.log("🧹 ADMIN: Clearing old sessions");
  
  try {
    // Delete old or invalid sessions
    const result = await prisma.session.deleteMany({
      where: {
        OR: [
          { expires: { lt: new Date() } }, // Expired sessions
          { shop: { not: "selya11904.myshopify.com" } }, // Wrong shop
          { accessToken: null }, // Sessions without access token
        ]
      }
    });
    
    console.log(`🧹 ADMIN: Deleted ${result.count} old sessions`);
    
    // Count remaining sessions
    const remaining = await prisma.session.count();
    
    return json({
      deletedSessions: result.count,
      remainingSessions: remaining,
      message: "Sessions cleaned successfully"
    });
    
  } catch (error) {
    console.error("❌ ADMIN: Error clearing sessions:", error);
    return json({
      error: error.message,
      message: "Failed to clear sessions"
    }, { status: 500 });
  }
};


