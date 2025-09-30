// /middleware.ts - VERSIÓN SIMPLIFICADA
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  // Por ahora, middleware vacío hasta que arreglemos el login
  // Una vez que el login funcione, puedes agregar la lógica de protección
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login", "/auth/signup"],
};
