export default function Footer() {
  return (
    <footer>
      <div className="foot-grid">
        <div>
          <div className="foot-logo">FIDÈLE</div>
          <p style={{ fontSize: '13px', lineHeight: 1.6, maxWidth: '260px', opacity: 0.8 }}>
            Peças com atitude, embaladas com carinho. Seja leal a você mesma.
          </p>
          <div className="newsletter">
            <input placeholder="seu@email.com" />
            <button>Entrar</button>
          </div>
        </div>
        <div>
          <h4>Loja</h4>
          <ul><li><a href="#">Tanks</a></li><li><a href="#">Camisetas</a></li><li><a href="#">Bags</a></li><li><a href="#">Lançamentos</a></li></ul>
        </div>
        <div>
          <h4>Ajuda</h4>
          <ul><li><a href="#">Trocas e devoluções</a></li><li><a href="#">Prazo de entrega</a></li><li><a href="#">Guia de tamanhos</a></li><li><a href="#">Fale conosco</a></li></ul>
        </div>
        <div>
          <h4>Pagamento</h4>
          <div className="pay-icons"><span>PIX</span><span>VISA</span><span>MASTER</span><span>ELO</span><span>3x sem juros</span></div>
          <h4 style={{ marginTop: '18px' }}>Segue a Fidèle</h4>
          <div className="pay-icons"><span>@fideleoficial</span></div>
        </div>
      </div>
      <div className="bottom-bar">© 2026 FIDÈLE — todos os direitos reservados</div>
    </footer>
  );
}