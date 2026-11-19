import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-display text-xl font-extrabold tracking-tight">
            CentricLabs
          </p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-white/70">
            Software, IT consulting and gadgets — built and supplied from
            Lagos, Nigeria, for customers across Nigeria and beyond.
          </p>
          <p className="mt-4 text-xs text-white/50">Lagos · Nigeria</p>
        </div>
        <div>
          <p className="font-display text-base font-bold">Shop and services</p>
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
              <Link className="hover:text-white" href="/services">Web and mobile apps</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-display text-base font-bold">Contact</p>
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
