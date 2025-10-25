import { json } from "@remix-run/node";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const loader = async ({ request }) => {
  console.log("🔍 DEBUG: Checking sessions in database");
  
  try {
    const sessions = await prisma.session.findMany({
      orderBy: { id: 'desc' },
      take: 5
    });
    
    console.log(`🔍 DEBUG: Found ${sessions.length} sessions`);
    
    const sessionInfo = sessions.map(session => ({
      id: session.id,
      shop: session.shop,
      state: session.state,
      isOnline: session.isOnline,
      expires: session.expires,
      hasAccessToken: !!session.accessToken,
      created: session.id.includes('_') ? 'Recent' : 'Old format'
    }));
    
    return json({
      totalSessions: sessions.length,
      sessions: sessionInfo,
      message: "Debug info for session troubleshooting"
    });
    
  } catch (error) {
    console.error("❌ DEBUG: Error checking sessions:", error);
    return json({
      error: error.message,
      message: "Failed to check sessions"
    }, { status: 500 });
  }
};


