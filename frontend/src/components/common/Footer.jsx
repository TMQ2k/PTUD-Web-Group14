import React from "react";

const footerLinks = {
  about: {
    title: "Về AuctionHub",
    desc: "Nền tảng đấu giá trực tuyến uy tín, minh bạch và an toàn.",
  },
  support: {
    title: "Hỗ trợ",
    items: [
      { label: "Hướng dẫn đấu giá", href: "/huong-dan" },
      { label: "Câu hỏi thường gặp", href: "/faq" },
      { label: "Chính sách bảo mật", href: "/privacy" },
    ],
  },
  contact: {
    title: "Liên hệ",
    items: [
      {
        label: "Email: support@auctionhub.vn",
        href: "mailto:support@auctionhub.vn",
      },
      { label: "Hotline: 1900 xxxx", href: "tel:1900xxxx" },
    ],
  },
};

const SocialIcon = ({ children }) => (
  <a
    href="#"
    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/70 hover:bg-slate-700 transition-colors"
    aria-label="Theo dõi chúng tôi"
  >
    {children}
  </a>
);

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-white">
              {footerLinks.about.title}
            </h3>
            <p className="mt-3 leading-7 text-slate-400">
              {footerLinks.about.desc}
            </p>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-white">
              {footerLinks.support.title}
            </h3>
            <ul className="mt-3 space-y-3">
              {footerLinks.support.items.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white">
              {footerLinks.contact.title}
            </h3>
            <ul className="mt-3 space-y-3">
              {footerLinks.contact.items.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold text-white">
              Theo dõi chúng tôi
            </h3>
            <div className="mt-6 flex items-center gap-4">
              <SocialIcon>
                {/* Facebook */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5 text-slate-300"
                >
                  <path d="M13 10h2.5l.5-3H13V6.25c0-.86.28-1.5 1.68-1.5H16V2.14C15.42 2.05 14.53 2 13.5 2 11.43 2 10 3.24 10 5.53V7H7.5v3H10v9h3v-9z" />
                </svg>
              </SocialIcon>
              <SocialIcon>
                {/* Twitter/X */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5 text-slate-300"
                >
                  <path d="M17.53 2H20l-6.9 7.89L21.5 22h-5.6l-4.37-5.6L5.5 22H3l7.43-8.49L2.8 2h5.67l3.95 5.23L17.53 2z" />
                </svg>
              </SocialIcon>
              <SocialIcon>
                {/* Instagram */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5 text-slate-300"
                >
                  <path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0-5C7.03 2 2 7.03 2 12s5.03 10 10 10 10-5.03 10-10S16.97 2 12 2zm6 4a1 1 0 110 2 1 1 0 010-2z" />
                </svg>
              </SocialIcon>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-sm text-slate-400">
          © 2025 AuctionHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
