/**
 * LEGACY FILE — base44 SDK references have been removed.
 * All auth logic lives in src/context/AuthContext.jsx.
 * This file re-exports from the canonical context so any
 * stale imports from '@/lib/AuthContext' continue to work.
 */
export { AuthProvider, useAuth } from '@/context/AuthContext';
