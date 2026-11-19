import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="text-xl font-black tracking-tight">
            Centric<span className="text-flame">Labs</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-white/70">
            Software, IT consulting and gadgets — built and supplied from
            Lagos, Nigeria, for customers across Nigeria and beyond.
          </p>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-amber">
            Shop &amp; Services
          </p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>
              <Link className="hover:text-white" href="/shop">All products</Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/services">Software development</Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/services">IT consulting</Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/services">Web &amp; mobile apps</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-amber">
            Contact
          </p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>Lagos, Nigeria</li>
            <li>
              <a className="hover:text-white" href="mailto:uabeeb3@gmail.com">
                uabeeb3@gmail.com
              </a>
            </li>
            <li>Pay on delivery available in Lagos</li>
            <li>Online payments via Paystack — coming soon</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © 2026 CentricLabs · Usman Abeeb · Lagos, Nigeria
      </div>
    </footer>
  );
}
