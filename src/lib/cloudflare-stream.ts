import crypto from 'crypto'

// Cloudflare Stream configuration
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!
const CLOUDFLARE_STREAM_CUSTOMER_CODE = process.env.CLOUDFLARE_STREAM_CUSTOMER_CODE!

if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
    throw new Error('Cloudflare Stream credentials not configured')
}

const STREAM_API_BASE = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream`

/**
 * Generate a signed URL for Cloudflare Stream video
 * This URL will expire after the specified time
 */
export function generateSignedUrl(
    videoId: string,
    expiresIn: number = 3600 // 1 hour default
): string {
    if (!CLOUDFLARE_STREAM_CUSTOMER_CODE) {
        // If no signing key, return basic URL (less secure)
        return `https://customer-${CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${videoId}/manifest/video.m3u8`
    }

    const expiration = Math.floor(Date.now() / 1000) + expiresIn
    const toSign = `${videoId}.${expiration}`

    // Create signature using customer code as key
    const signature = crypto
        .createHmac('sha256', CLOUDFLARE_STREAM_CUSTOMER_CODE)
        .update(toSign)
        .digest('base64url')

    return `https://customer-${CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${videoId}/manifest/video.m3u8?token=${signature}&expires=${expiration}`
}

/**
 * Get video details from Cloudflare Stream
 */
export async function getVideoDetails(videoId: string) {
    const response = await fetch(`${STREAM_API_BASE}/${videoId}`, {
        headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        },
    })

    if (!response.ok) {
        throw new Error(`Failed to get video details: ${response.statusText}`)
    }

    const data = await response.json()
    return data.result
}

/**
 * List all videos from Cloudflare Stream
 */
export async function listVideos() {
    const response = await fetch(STREAM_API_BASE, {
        headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        },
    })

    if (!response.ok) {
        throw new Error(`Failed to list videos: ${response.statusText}`)
    }

    const data = await response.json()
    return data.result
}

/**
 * Get thumbnail URL for a video
 */
export function getThumbnailUrl(videoId: string): string {
    return `https://customer-${CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg`
}

/**
 * Get embed URL for Cloudflare Stream Player
 */
export function getEmbedUrl(videoId: string): string {
    return `https://customer-${CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${videoId}/iframe`
}
