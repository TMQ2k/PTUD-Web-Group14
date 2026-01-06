import React from "react";

/**
 * AccountSidebar (Dynamic)
 * - Vite + React (JSX) + TailwindCSS
 * - Danh mục truyền từ props `items` để bạn tuỳ biến tab tuỳ ý
 * - Các mục yêu cầu role seller: thêm `requiresSeller: true`
 * - Hỗ trợ chấm đỏ theo `badges` (object: key -> boolean)
 *
 * Props
 * - role: "buyer" | "seller"
 * - items?: Array<{ key: string; label: string; requiresSeller?: boolean }>
 * - current: string
 * - onSelect: (key: string) => void
 * - badges?: Record<string, boolean>
 * - className?: string
 */

const DEFAULT_ITEMS = [
  { key: "account", label: "Tài khoản" },
  { key: "addresses", label: "Địa chỉ" },
  { key: "upgrade", label: "Nâng cấp" },
  { key: "joinedAuctions", label: "Sản phẩm đã tham gia đấu giá" },
  { key: "wonAuctions", label: "Sản phẩm đã thắng đấu giá" },
  {
    key: "sellerActive",
    label: "Sản phẩm đã đăng & còn hạn",
    requiresSeller: true,
  },
  {
    key: "sellerWon",
    label: "Sản phẩm đã có người thắng đấu giá",
    requiresSeller: true,
  },
  {
    key: "uploadProduct",
    label: "Đăng sản phẩm mới",
    requiresSeller: true,
  },
];

export default function AccountSidebar({
  role = "bidder",
  items = DEFAULT_ITEMS,
  current = "account",
  onSelect = () => {},
  badges = {},
  className = "",
}) {
  const isSeller = role === "seller";

  const visibleItems = React.useMemo(() => {
    return (items || []).filter((it) => !it.requiresSeller || isSeller);
  }, [items, isSeller]);

  return (
    <aside
      className={`w-full max-w-xs ${className}`}
      aria-label="Account navigation"
    >
      <nav className="space-y-2 select-none">
        {visibleItems.map((item) => {
          const active = current === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              className={[
                "group w-full text-left flex items-center justify-between gap-3",
                "px-3 py-2",
                "border-l-2",
                active
                  ? "border-blue-600 text-black font-medium"
                  : "border-transparent text-gray-800 hover:text-black",
              ].join(" ")}
            >
              <span className="flex-1 leading-6">{item.label}</span>
              
              {badges[item.key] && (
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full bg-red-500"
                  aria-label="new"
                />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

/**
 * Cách dùng mẫu
 * -------------
 * // App.jsx
 * import AccountSidebar from "./AccountSidebar";
 *
 * export default function App() {
 *   const [tab, setTab] = React.useState("account");
 *   const role = "seller"; // hoặc "buyer"
 *
 *   const myItems = [
 *     { key: "account", label: "Tài khoản" },
 *     { key: "addresses", label: "Địa chỉ" },
 *     { key: "upgrade", label: "Nâng cấp" },
 *     { key: "sellerActive", label: "SP đăng & còn hạn", requiresSeller: true },
 *     { key: "sellerWon", label: "SP đã có người thắng", requiresSeller: true },
 *     // Bạn có thể thêm / bớt tuỳ ý
 *     // { key: "security", label: "Bảo mật" },
 *   ];
 *
 *   return (
 *     <div className="min-h-screen bg-white p-6">
 *       <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
 *         <AccountSidebar
 *           role={role}
 *           items={myItems}
 *           current={tab}
 *           onSelect={setTab}
 *           badges={{ account: true, sellerWon: true }}
 *         />
 *
 *         <main className="rounded-xl border p-6">
 *           <h1 className="text-xl font-semibold mb-2">{tab}</h1>
 *           <p>Nội dung tab: {tab}</p>
 *         </main>
 *       </div>
 *     </div>
 *   );
 * }
 */
