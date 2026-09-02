import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Recebido no servidor, pronto para pagar:", body.items);

    // Finge que o Mercado Pago está processando (espera 2 segundos)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Devolve o link do Google só para fingir que é a tela do Mercado Pago
    return NextResponse.json({ init_point: "https://www.google.com" });

  } catch (error) {
    return NextResponse.json({ error: "Falha" }, { status: 500 });
  }
}