'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

// The discreet way into the staff admin: double-click the dinosaur in the
// footer and you land on /admin/login. It used to be the copyright text;
// Robert asked for the dino (2026-09-25).
//
// A convenience, not a security control -- the real gate is the staff
// login behind it -- so this stays deliberately simple: no visual hint,
// no keyboard equivalent, just an onDoubleClick handler on the mascot.
// A tiny client component wrapping just the image, so Footer.js can stay
// a plain server component.
export default function AdminEntryPoint() {
  const router = useRouter();

  return (
    <div className="footer-mascot" aria-hidden="true" onDoubleClick={() => router.push('/admin/login')}>
      <Image
        src="/assets/teracom-mascot-footer.webp"
        alt=""
        width={640}
        height={675}
        sizes="(max-width: 640px) 170px, 250px"
      />
    </div>
  );
}
