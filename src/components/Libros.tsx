export type Libro = {
    id: string
    titulo: string
    descripcion?: string | null
    archivo_url: string
    thumbnail_url?: string | null
}

type Props = {
    libros: Libro[]
}

export default function Libros({ libros }: Props) {
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
                            {libros.map((libro) => (
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
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-600">
                                            {libro.descripcion || 'Sin descripción'}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <a
                                            href={libro.archivo_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 hover:text-indigo-800 font-semibold"
                                            download
                                        >
                                            Descargar
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="md:hidden space-y-4">
                    {libros.map((libro) => (
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
                                <p className="text-base font-semibold text-gray-900">
                                    {libro.titulo}
                                </p>
                                <p className="text-sm text-gray-600 mb-3">
                                    {libro.descripcion || 'Sin descripción'}
                                </p>
                                <a
                                    href={libro.archivo_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
                                    download
                                >
                                    Descargar PDF
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
