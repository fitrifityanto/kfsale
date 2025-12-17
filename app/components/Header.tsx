import React from "react";
import { ShoppingCart } from "lucide-react";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  cartCount,
  onCartClick,
  onHomeClick,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-street-black text-white border-b border-neutral-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={onHomeClick}
        >
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">
              kickflip<span className="text-street-red">socks</span>
            </h1>
            <p className="text-[10px] text-gray-500 font-mono tracking-[0.2em] uppercase">
              Turn Every Step into Style
            </p>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center">
          <button
            onClick={onCartClick}
            className="relative p-2 hover:bg-white hover:text-black transition-colors duration-200 group"
            aria-label="Keranjang Belanja"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-street-red border border-street-black">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
