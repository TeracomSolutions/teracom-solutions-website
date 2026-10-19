import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { createPurchaseOrder } from '@/lib/api/adminPurchaseOrders';

export const POST = withAdminSession(async ({ token, params }) => NextResponse.json(await createPurchaseOrder(token, params.poId)));