import Link from "next/link";
import { PLATFORM_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">B</span>
              </div>
              <span className="text-base font-bold tracking-tight text-gray-900">
                {PLATFORM_NAME}
              </span>
            </Link>
            <p className="mt-3 text-[13px] text-gray-400 leading-relaxed max-w-[200px]">
              Discounted beauty appointments from verified professionals near you.
            </p>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              For Clients
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/appointments" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">
                  Browse appointments
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">
                  How it works
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              For Professionals
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/auth/signup" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">
                  List your services
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">
                  Why {PLATFORM_NAME}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Company
            </h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/about" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-gray-400">
            &copy; {new Date().getFullYear()} {PLATFORM_NAME}. All rights reserved.
          </p>
          <p className="text-[12px] text-gray-300">
            Made in Los Angeles
          </p>
        </div>
      </div>
    </footer>
  );
}
