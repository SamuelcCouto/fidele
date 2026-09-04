import { siteConfig } from "@/config/site";
import s from "./footer.module.css";

const helpLinks = [
  "Trocas e devoluções",
  "Prazo de entrega",
  "Guia de tamanhos",
  "Fale conosco",
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
          <div className={s.newsletter}>
            <input
              type="email"
              placeholder="seu@email.com"
              aria-label="Seu e-mail"
            />
            <button type="button">Entrar</button>
          </div>
        </div>

        <div>
          <h4>Ajuda</h4>
          <ul>
            {helpLinks.map((label) => (
              <li key={label}>
                <a href="#">{label}</a>
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
            <span>@{siteConfig.instagram}</span>
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
