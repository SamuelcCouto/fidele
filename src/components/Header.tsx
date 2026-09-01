"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "./CartDrawer";
import MobileMenu from "./MobileMenu";

// 1. Importamos os produtos para podermos vasculhar em tempo real!
import { productsData, Product } from "@/data/products";

export default function Header() {
  const logoRef = useRef<HTMLImageElement>(null);
  const router = useRouter();
  
  const [isLight, setIsLight] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState(""); 
  
  // 2. Memórias da nossa Busca Instantânea
  const [liveResults, setLiveResults] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const { cartCount, isCartOpen, setIsCartOpen } = useCart(); 

  useEffect(() => {
    let angle = 0;
    let animationFrameId: number;
    const animateLogo = () => {
      angle += 0.03;
      const y = Math.sin(angle) * 3; 
      const rot = Math.cos(angle) * 2; 
      if (logoRef.current) {
        logoRef.current.style.transform = `translateY(${y}px) rotate(${rot}deg)`;
      }
      animationFrameId = requestAnimationFrame(animateLogo);
    };
    animateLogo();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const toggleTheme = () => {
    const body = document.body;
    body.classList.toggle('light-theme');
    setIsLight(body.classList.contains('light-theme')); 
  };

  // 3. O motor super rápido de filtragem
  const handleInputChange = (text: string) => {
    setSearchQuery(text);
    
    if (text.trim().length > 0) {
      const query = text.toLowerCase();
      const allProducts = Object.values(productsData);
      
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.some(d => d.toLowerCase().includes(query))
      );
      
      setLiveResults(filtered);
      setShowDropdown(true);
    } else {
      setLiveResults([]);
      setShowDropdown(false);
    }
  };

  // Se apertar o ENTER, vai pra página de pesquisa completa
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      router.push(`/busca?q=${encodeURIComponent(searchQuery)}`);
      closeAllSearch();
    }
  };

  // Se clicar em um resultado rápido, vai direto pra roupa!
  const handleResultClick = (productId: string) => {
    router.push(`/${productId}`);
    closeAllSearch();
  };

  const closeAllSearch = () => {
    setShowDropdown(false);
    setShowMobileSearch(false);
    setSearchQuery("");
  };

  return (
    <>
      <header>
        <div className="nav-row">
          
          <div className="burger" onClick={() => setIsMenuOpen(true)}>
            <svg className="icon-svg" viewBox="0 0 24 24">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </div>

          <div className="brand">
            <div className="brand-name">
              <a href="/">
                <img src="/img/Fidele-logocabecalho.png" alt="FIDÈLE" ref={logoRef} style={{ maxHeight: '40px' }} />
              </a>
            </div>
          </div>

          {/* ========================================= */}
          {/* BARRA DE PESQUISA DESKTOP */}
          {/* ========================================= */}
          <form className="search-container" onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Olá, o que você procura?" 
              value={searchQuery}
              onChange={(e) => handleInputChange(e.target.value)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Esconde se clicar fora (com atraso pro clique funcionar)
              onFocus={() => { if(searchQuery.length > 0) setShowDropdown(true); }}
            />
            <button type="submit" className="search-btn-inside">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            {/* O POPUP INSTANTÂNEO DESKTOP */}
            <div className={`search-dropdown ${showDropdown && !showMobileSearch ? "visible" : ""}`}>
              {liveResults.length > 0 ? (
                liveResults.map(item => (
                  <div key={item.id} className="search-dropdown-item" onClick={() => handleResultClick(item.id)}>
                    <img src={`/img/${item.imagePrefix}1.jpg`} alt={item.name} className="search-item-img" />
                    <div className="search-item-info">
                      <span className="search-item-title">{item.name}</span>
                      <span className="search-item-price">{item.price}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="search-dropdown-empty">Nenhum produto encontrado.</div>
              )}
            </div>
          </form>

          <div className="nav-icons">
            <div style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={toggleTheme} title="Trocar Tema">
              {isLight ? '🌙' : '☀️'}
            </div>

            <div className="mobile-search-icon" onClick={() => setShowMobileSearch(!showMobileSearch)}>
              <svg className="icon-svg" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>

            <div onClick={() => alert("Login / Cashback em breve!")} title="Minha Conta">
              <svg className="icon-svg" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>

            <div className="cart-wrapper" onClick={() => setIsCartOpen(true)}>
              <svg className="icon-svg" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* BARRA DE PESQUISA MOBILE */}
        {/* ========================================= */}
        {showMobileSearch && (
          <form style={{ marginTop: '15px', display: 'flex', gap: '10px', position: 'relative' }} onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              className="search-input" 
              style={{ flex: 1 }}
              placeholder="Buscar produtos..." 
              value={searchQuery}
              onChange={(e) => handleInputChange(e.target.value)}
              autoFocus
            />
            <button type="submit" className="buy-btn-large" style={{ padding: '0 20px', width: 'auto' }}>
              Ir
            </button>

            {/* O POPUP INSTANTÂNEO MOBILE */}
            <div className={`search-dropdown ${showDropdown ? "visible" : ""}`} style={{ top: 'calc(100% + 5px)' }}>
              {liveResults.length > 0 ? (
                liveResults.map(item => (
                  <div key={item.id} className="search-dropdown-item" onClick={() => handleResultClick(item.id)}>
                    <img src={`/img/${item.imagePrefix}1.jpg`} alt={item.name} className="search-item-img" />
                    <div className="search-item-info">
                      <span className="search-item-title">{item.name}</span>
                      <span className="search-item-price">{item.price}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="search-dropdown-empty">Nenhum produto encontrado.</div>
              )}
            </div>
          </form>
        )}
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}