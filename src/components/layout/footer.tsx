import { instagramUrl, siteConfig, whatsappUrlWithText } from "@/config/site";
import s from "./footer.module.css";

/**
 * Toda linha daqui leva a algum lugar de verdade. Antes eram `href="#"`:
 * o cliente clicava, nada acontecia, e passava a duvidar do resto da loja.
 *
 * Como não existe página de ajuda, o destino honesto é o WhatsApp — com a
 * pergunta já escrita, para a Elivânia saber do que se trata antes de ler.
 *
 * "Guia de tamanhos" saiu: não existe tabela de medidas para mostrar, e
 * inventar uma seria pior que não ter. Volta quando ela mandar as medidas.
 */
const helpLinks = [
  {
    label: "Trocas e devoluções",
    message: "Olá! Queria saber sobre trocas e devoluções.",
  },
  {
    label: "Prazo de entrega",
    message: "Olá! Queria saber o prazo de entrega.",
  },
  {
    label: "Fale conosco",
    message: "Olá! Vim pelo site da FIDÈLE.",
  },
];

const paymentMethods = ["PIX", "VISA", "MASTER", "ELO", "3x sem juros"];

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.grid}>
        <div>
          <div className={s.logo}>{siteConfig.name}</div>
          <p className={s.tagline}>
            Peças com atitude, embaladas com carinho. Seja leal a você mesma.
          </p>
        </div>

        <div>
          <h4>Ajuda</h4>
          <ul>
            {helpLinks.map(({ label, message }) => (
              <li key={label}>
                <a
                  href={whatsappUrlWithText(message)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Pagamento</h4>
          <div className={s.payIcons}>
            {paymentMethods.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <h4 className={s.spaced}>Segue a Fidèle</h4>
          <div className={s.payIcons}>
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
              @{siteConfig.instagram}
            </a>
          </div>
        </div>
      </div>

      <div className={s.bottom}>
        © {new Date().getFullYear()} {siteConfig.name} — todos os direitos
        reservados
      </div>
    </footer>
  );
}
