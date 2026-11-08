import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { fetchAiActivity } from '@/lib/api/adminAiActivity';

// The AI activity overview for the console page. ?days= is 1, 7 or 30; ?area= and ?provider= narrow it.
export async function GET(request) {
  return withAdminSession(async ({ req, token, params }) => {
    const { searchParams } = new URL(request.url);
    
    let days = 1;
    const daysParam = searchParams.get('days');
    if (daysParam) {
      const parsedDays = parseInt(daysParam);
      if (parsedDays === 1 || parsedDays === 7 || parsedDays === 30) {
        days = parsedDays;
      }
    }
    
    const area = searchParams.get('area')?.substring(0, 40) || '';
    const provider = searchParams.get('provider')?.substring(0, 40) || '';
    
    return NextResponse.json(await fetchAiActivity(token, days, area, provider));
  });
}