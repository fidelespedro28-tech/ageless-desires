// Links de checkout do Kirvano para os planos Premium
export const CHECKOUT_LINKS = {
  plano1: {
    price: "R$19,90",
    url: "https://pay.kirvano.com/3bff3429-b203-4182-9126-c9be4763f539?aff=ae79b36e-c1b8-4aa7-abc7-4861d0e44b84",
    name: "Básico",
  },
  plano2: {
    price: "R$37,90",
    url: "https://pay.kirvano.com/5227fc01-b73b-4238-9551-fc9e99b7ecb7?aff=ae79b36e-c1b8-4aa7-abc7-4861d0e44b84",
    name: "Premium",
  },
  plano3: {
    price: "R$47,90",
    url: "https://pay.kirvano.com/73f4f90e-2211-4ece-ae88-49448d383718?aff=ae79b36e-c1b8-4aa7-abc7-4861d0e44b84",
    name: "Ultra VIP",
  },
  plano4: {
    price: "R$97,00",
    url: "https://pay.kirvano.com/f8d0f1b9-08de-4058-a7fd-9e090ef0f4e0?aff=ae79b36e-c1b8-4aa7-abc7-4861d0e44b84",
    name: "Diamante",
  },
} as const;

export type PlanKey = keyof typeof CHECKOUT_LINKS;

// Helper para abrir checkout
export const openCheckout = (planKey: PlanKey): void => {
  const plan = CHECKOUT_LINKS[planKey];
  window.open(plan.url, "_blank");
};

// Array ordenado dos planos para renderização
export const PLANS_ARRAY: Array<{
  id: PlanKey;
  price: string;
  url: string;
  name: string;
  popular?: boolean;
}> = [
  { id: "plano1", ...CHECKOUT_LINKS.plano1, popular: false },
  { id: "plano2", ...CHECKOUT_LINKS.plano2, popular: true },
  { id: "plano3", ...CHECKOUT_LINKS.plano3, popular: false },
  { id: "plano4", ...CHECKOUT_LINKS.plano4, popular: false },
];
