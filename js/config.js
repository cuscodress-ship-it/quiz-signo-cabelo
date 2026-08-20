/**
 * Configuração central da experiência.
 * Troque apenas os valores abaixo quando tiver os dados reais
 * (cupom, link do produto e foto do produto) — nenhum outro
 * arquivo precisa ser alterado.
 */
const APP_CONFIG = {
  // Código do cupom aplicado automaticamente.
  COUPON_CODE: "SIGNOCAPILAR",

  // URL da página do produto Piave All In One (loja Shopify).
  // O cupom é aplicado via rota nativa do Shopify: /discount/CODIGO?redirect=/caminho-do-produto
  PRODUCT_URL: "https://www.piavecosmetics.com.br/products/piave-cosmetics-all-in-one-leave-in",

  // Caminho da imagem do produto. Troque pelo arquivo real (ex: "assets/produto-piave.jpg")
  // quando estiver disponível.
  PRODUCT_IMAGE: "assets/product-leave-in.png",

  // Nome exibido do produto recomendado.
  PRODUCT_NAME: "Piave All In One",

  // Percentual de desconto exibido na tela final.
  DISCOUNT_PERCENT: 20,

  // Preços exibidos (de/por). Mantidos como texto para não ter que lidar com formatação de moeda.
  PRICE_ORIGINAL: "119,00",
  PRICE_FINAL: "95,20",

  // Minutos do cronômetro de urgência na tela final (reinicia a cada visita à tela).
  COUNTDOWN_MINUTES: 10,
};

function buildProductCheckoutUrl() {
  try {
    const productUrl = new URL(APP_CONFIG.PRODUCT_URL);
    const redirectPath = productUrl.pathname + productUrl.search;
    const discountUrl = new URL(`/discount/${encodeURIComponent(APP_CONFIG.COUPON_CODE)}`, productUrl.origin);
    discountUrl.searchParams.set("redirect", redirectPath);
    return discountUrl.toString();
  } catch (e) {
    // Caso PRODUCT_URL ainda seja um placeholder inválido, evita quebrar o app.
    return APP_CONFIG.PRODUCT_URL;
  }
}
