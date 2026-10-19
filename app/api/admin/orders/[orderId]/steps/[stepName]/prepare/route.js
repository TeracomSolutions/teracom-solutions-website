import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { prepareOrderStep } from '@/lib/api/adminOrders';

export const POST = withAdminSession(async ({ token, params }) => NextResponse.json(await prepareOrderStep(token, params.orderId, params.stepName)));
