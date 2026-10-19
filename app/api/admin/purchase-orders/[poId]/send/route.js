import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { sendPurchaseOrder } from '@/lib/api/adminPurchaseOrders';

export const POST = withAdminSession(async ({ token, params }) => NextResponse.json(await sendPurchaseOrder(token, params.poId)));
