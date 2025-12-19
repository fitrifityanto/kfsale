import React from "react";

const Footer = () => {
  const adminPhone = process.env.NEXT_PUBLIC_ADMIN_PHONE || "6281234567890";

  return (
    <footer className="bg-street-black text-white py-16 border-t border-neutral-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="max-w-md">
            <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-4">
              kickflip<span className="text-street-red">socks</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Old-school socks clearance. Grab your style before it’s gone..
            </p>
          </div>

          <div className="flex gap-8 text-sm font-bold uppercase tracking-widest text-gray-400">
            <a
              href="https://instagram.com/kickflipsocks"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Instagram
            </a>
            <a
              href={`https://wa.me/${adminPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Whatsapp
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800 text-center md:text-left">
          <p className="text-xs text-neutral-600 font-mono uppercase">
            &copy; {new Date().getFullYear()} Cuci Gudang kickflipsocks. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
