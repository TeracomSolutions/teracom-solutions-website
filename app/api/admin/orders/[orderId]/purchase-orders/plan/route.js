import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { planPurchaseOrders } from '@/lib/api/adminPurchaseOrders';

export const POST = withAdminSession(async ({ token, params }) => NextResponse.json(await planPurchaseOrders(token, params.orderId)));