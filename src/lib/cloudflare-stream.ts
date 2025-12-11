import crypto from 'crypto'

// Helper to check credentials lazily
function checkCredentials() {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
    const apiToken = process.env.CLOUDFLARE_API_TOKEN

    if (!accountId || !apiToken) {
        throw new Error('Cloudflare Stream credentials not configured')
    }

    return { accountId, apiToken }
}

/**
 * Generate a signed URL for Cloudflare Stream video
 * This URL will expire after the specified time
 */
export function generateSignedUrl(
    videoId: string,
    expiresIn: number = 3600 // 1 hour default
): string {
    const { accountId } = checkCredentials()
    const customerCode = process.env.CLOUDFLARE_STREAM_CUSTOMER_CODE

    if (!customerCode) {
        // If no signing key, return basic URL (less secure)
        return `https://customer-${accountId}.cloudflarestream.com/${videoId}/manifest/video.m3u8`
    }

    const expiration = Math.floor(Date.now() / 1000) + expiresIn
    const toSign = `${videoId}.${expiration}`

    // Create signature using customer code as key
    const signature = crypto
        .createHmac('sha256', customerCode)
        .update(toSign)
        .digest('base64url')

    return `https://customer-${accountId}.cloudflarestream.com/${videoId}/manifest/video.m3u8?token=${signature}&expires=${expiration}`
}

/**
 * Get video details from Cloudflare Stream
 */
export async function getVideoDetails(videoId: string) {
    const { accountId, apiToken } = checkCredentials()
    const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream`

    const response = await fetch(`${baseUrl}/${videoId}`, {
        headers: {
            'Authorization': `Bearer ${apiToken}`,
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
    const { accountId, apiToken } = checkCredentials()
    const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream`

    const response = await fetch(baseUrl, {
        headers: {
            'Authorization': `Bearer ${apiToken}`,
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
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
    if (!accountId) throw new Error('CLOUDFLARE_ACCOUNT_ID not configured')
    return `https://customer-${accountId}.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg`
}

/**
 * Get embed URL for Cloudflare Stream Player
 */
export function getEmbedUrl(videoId: string): string {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
    if (!accountId) throw new Error('CLOUDFLARE_ACCOUNT_ID not configured')
    return `https://customer-${accountId}.cloudflarestream.com/${videoId}/iframe`
}
