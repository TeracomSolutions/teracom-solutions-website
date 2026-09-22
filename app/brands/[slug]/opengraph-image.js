import { ImageResponse } from 'next/og';
import { findBrand } from '@/lib/brands';

export const alt = 'Teracom Solutions -- electronic security, AI and technology';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage(props) {
  const params = await props.params;
  const brand = findBrand(params.slug);
  
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#050505',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        {/* Red top bar */}
        <div
          style={{
            display: 'flex',
            height: '12px',
            backgroundColor: '#ff1717',
            width: '100%',
          }}
        />
        
        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: '80px',
              marginBottom: '20px',
            }}
          >
            {brand ? brand.name : 'TERACOM SOLUTIONS'}
          </h1>
          
          {brand && (
            <p
              style={{
                color: 'rgba(255,255,255,.7)',
                fontSize: '30px',
                maxWidth: '1000px',
                marginBottom: '40px',
              }}
            >
              {brand.tagline}
            </p>
          )}
          
          <p
            style={{
              color: 'rgba(255,255,255,.45)',
              fontSize: '26px',
            }}
          >
            Teracom Solutions  ·  teracomsolutions.com.au
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}