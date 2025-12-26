export type Libro = {
    id: string
    titulo: string
    descripcion?: string | null
    archivo_url: string
    thumbnail_url?: string | null
    product_id?: string | null
}

type Props = {
    libros: Libro[]
    products: any[]
    purchases: any[]
}

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

export default function Libros({ libros, products, purchases }: Props) {
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})

    const handlePurchase = async (priceId: string, libroId: string) => {
        setLoadingMap(prev => ({ ...prev, [libroId]: true }))
        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId: priceId,
                }),
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.error || 'Error al crear la sesión')
            window.location.href = data.url
        } catch (err: any) {
            alert(err.message)
            setLoadingMap(prev => ({ ...prev, [libroId]: false }))
        }
    }

    return (
        <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm">
            <div className="flex flex-col gap-2 mb-6">
                <p className="text-3xl md:text-5xl font-serif text-gray-900">
                    Libros Recomendados
                </p>
                <p className="text-gray-500">
                    Descarga los libros en PDF. Iremos sumando más títulos pronto.
                </p>
            </div>

            {libros.length === 0 && (
                <div className="text-center text-gray-500 border border-gray-100 rounded-lg py-10">
                    No hay libros disponibles por ahora. Vuelve pronto.
                </div>
            )}

            <div className="overflow-hidden border border-gray-100 rounded-lg">
                <div className="hidden md:block">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Portada
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Título
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Descripción
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acción
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {libros.map((libro) => {
                                const linkedProduct = products.find(p => p.id === libro.product_id)
                                const isPurchased = linkedProduct
                                    ? purchases.some(p => p.stripe_price_id === linkedProduct.stripe_price_id)
                                    : true // If no product linked, assume free/available?? Or default to false? 
                                // Actually, if no product_id is set, it might return true to be safe (old behavior) or check if it is free.
                                // For now, let's assume if no product_id, it is free/downloadable as before.

                                // Override: if it has a product_id, check purchase. If not, it's free.
                                const canDownload = libro.product_id ? isPurchased : true

                                // DEBUG: Log if mismatch found
                                if (linkedProduct && !isPurchased) {
                                    console.log(`[Libro Debug] ${libro.titulo} - Product Price ID: ${linkedProduct.stripe_price_id}`)
                                    console.log('User Purchases:', purchases.map(p => p.stripe_price_id))
                                }

                                return (
                                    <tr key={libro.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {libro.thumbnail_url ? (
                                                <img
                                                    src={libro.thumbnail_url}
                                                    alt={libro.titulo}
                                                    className="h-16 w-12 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="h-16 w-12 bg-gray-100 rounded" />
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm font-semibold text-gray-900">
                                                {libro.titulo}
                                            </p>
                                            {linkedProduct && !canDownload && (
                                                <p className="text-xs text-indigo-600 font-medium mt-1">
                                                    ${linkedProduct.price}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600">
                                                {libro.descripcion || 'Sin descripción'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {canDownload ? (
                                                <a
                                                    href={libro.archivo_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-600 hover:text-indigo-800 font-semibold"
                                                    download
                                                >
                                                    Descargar
                                                </a>
                                            ) : (
                                                <button
                                                    onClick={() => linkedProduct && handlePurchase(linkedProduct.stripe_price_id, libro.id)}
                                                    disabled={loadingMap[libro.id]}
                                                    className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-semibold text-xs tracking-wide transition-colors disabled:opacity-50"
                                                >
                                                    {loadingMap[libro.id] ? 'Procesando...' : 'Comprar'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="md:hidden space-y-4">
                    {libros.map((libro) => {
                        const linkedProduct = products.find(p => p.id === libro.product_id)
                        const isPurchased = linkedProduct
                            ? purchases.some(p => p.stripe_price_id === linkedProduct.stripe_price_id)
                            : true
                        const canDownload = libro.product_id ? isPurchased : true

                        return (
                            <div key={libro.id} className="flex gap-4 p-4 border-b last:border-none">
                                {libro.thumbnail_url ? (
                                    <img
                                        src={libro.thumbnail_url}
                                        alt={libro.titulo}
                                        className="h-20 w-16 object-cover rounded"
                                    />
                                ) : (
                                    <div className="h-20 w-16 bg-gray-100 rounded" />
                                )}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <p className="text-base font-semibold text-gray-900">
                                            {libro.titulo}
                                        </p>
                                        {linkedProduct && !canDownload && (
                                            <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded font-medium">
                                                ${linkedProduct.price}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">
                                        {libro.descripcion || 'Sin descripción'}
                                    </p>

                                    {canDownload ? (
                                        <a
                                            href={libro.archivo_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
                                            download
                                        >
                                            Descargar PDF
                                        </a>
                                    ) : (
                                        <button
                                            onClick={() => linkedProduct && handlePurchase(linkedProduct.stripe_price_id, libro.id)}
                                            disabled={loadingMap[libro.id]}
                                            className="w-full text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
                                        >
                                            {loadingMap[libro.id] ? 'Comprando...' : 'Comprar ahora'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
