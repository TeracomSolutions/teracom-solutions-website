import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { approveOrderStep } from '@/lib/api/adminOrders';

// approves and runs ONE step; nothing is sent to Zoho unless staff press Approve
export const POST = withAdminSession(async ({ token, params }) => NextResponse.json(await approveOrderStep(token, params.orderId, params.stepName)));