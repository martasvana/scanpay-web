import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export async function GET(request: Request) {

  try {
    const { searchParams } = new URL(request.url)
 
    return new ImageResponse(
      (
        <div
          style={{
            backgroundImage: 'url(https://www.unrenewed.app/seo/og-image.png)',
            backgroundSize: '100% 100%',
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            fontFamily: 'Inter',
            padding: '40px 80px',
          }}
        >
        </div>
      ),
      {
        width: 1200,
        height: 630,       
      },
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}