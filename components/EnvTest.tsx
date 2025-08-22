'use client'

export default function EnvTest() {
  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3 className="font-bold mb-2">Environment Variables Test:</h3>
      <div className="text-sm space-y-1">
        <div>NEXT_PUBLIC_LINKEDIN_CLIENT_ID: <span className="font-mono bg-white px-2 rounded">{process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || 'NOT FOUND'}</span></div>
        <div>LINKEDIN_CLIENT_SECRET: <span className="font-mono bg-white px-2 rounded">{process.env.LINKEDIN_CLIENT_SECRET ? 'FOUND (hidden)' : 'NOT FOUND'}</span></div>
        <div>NEXT_PUBLIC_LINKEDIN_REDIRECT_URI: <span className="font-mono bg-white px-2 rounded">{process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI || 'NOT FOUND'}</span></div>
        <div className="border-t pt-2 mt-2">
          <div>NEXT_PUBLIC_X_CLIENT_ID: <span className="font-mono bg-white px-2 rounded">{process.env.NEXT_PUBLIC_X_CLIENT_ID || 'NOT FOUND'}</span></div>
          <div>X_CLIENT_SECRET: <span className="font-mono bg-white px-2 rounded">{process.env.X_CLIENT_SECRET ? 'FOUND (hidden)' : 'NOT FOUND'}</span></div>
          <div>NEXT_PUBLIC_X_REDIRECT_URI: <span className="font-mono bg-white px-2 rounded">{process.env.NEXT_PUBLIC_X_REDIRECT_URI || 'NOT FOUND'}</span></div>
        </div>
      </div>
    </div>
  )
}
