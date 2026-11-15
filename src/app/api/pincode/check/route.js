import { NextResponse } from 'next/server';
import { lookupPincode } from '@/lib/pincode';

export async function GET(request) {
  const pin = new URL(request.url).searchParams.get('pincode')?.trim() || '';
  if (!/^[1-9][0-9]{5}$/.test(pin)) return NextResponse.json({ valid: false, error: 'Please enter a valid Indian pincode.' }, { status: 400 });
  let location = null;
  try { location = await lookupPincode(pin); } catch { /* location lookup is optional */ }
  return NextResponse.json({ valid: true, serviceable: null, pincode: pin, city: location?.city || null, state: location?.state || null, message: 'Pincode accepted. Delivery is arranged manually after your order.' });
}
