'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

function MetaPixelTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq && META_PIXEL_ID) {
      window.fbq('track', 'PageView');
    }
  }, [pathname, searchParams]);

  if (!META_PIXEL_ID) return null;

  return (
    <Script
      id="meta-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `,
      }}
    />
  );
}

export function MetaPixel() {
  return (
    <Suspense fallback={null}>
      <MetaPixelTracking />
    </Suspense>
  );
}

export function fbqTrackLead(data?: Record<string, any>, eventId?: string) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', data, eventId ? { eventID: eventId } : undefined);
  }
}

export function fbqTrackInitiateCheckout(value: number = 199, eventId?: string) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq(
      'track',
      'InitiateCheckout',
      {
        value,
        currency: 'INR',
        content_name: 'Online School Management Workshop',
      },
      eventId ? { eventID: eventId } : undefined
    );
  }
}

export function fbqTrackPurchase(
  value: number = 199,
  orderId?: string,
  eventId?: string
) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq(
      'track',
      'Purchase',
      {
        value,
        currency: 'INR',
        content_name: 'Online School Management Workshop',
        content_type: 'product',
        order_id: orderId,
      },
      eventId ? { eventID: eventId } : undefined
    );
  }
}
