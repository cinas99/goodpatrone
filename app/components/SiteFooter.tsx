import Link from 'next/link';

const toolLinks = [
  { href: '/bmi',       label: 'BMI Calculator' },
  { href: '/days',      label: 'Days Between'   },
  { href: '/stopwatch', label: 'Stopwatch'       },
  { href: '/countdown', label: 'Countdown'       },
];

const companyLinks = [
  { href: '/blog',           label: 'Blog'            },
  { href: '/about',          label: 'About'           },
  { href: '/privacy-policy', label: 'Privacy Policy'  },
  { href: '/contact',        label: 'Contact'         },
];

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 px-8 py-6">
      <div className="max-w-3xl mx-auto grid grid-cols-3 gap-10">

        <div>
          <p className="text-base font-semibold text-zinc-200 mb-3">Good Patrone</p>
          <p className="text-sm text-zinc-500 leading-relaxed mb-3">Free online tools. No sign-up needed.</p>
          <p className="text-sm text-zinc-600">© 2026</p>
        </div>

        <div>
          <p className="text-xs font-medium text-zinc-600 uppercase tracking-widest mb-3">Tools</p>
          <div className="flex flex-col gap-2">
            {toolLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-zinc-600 uppercase tracking-widest mb-3">Company</p>
          <div className="flex flex-col gap-2">
            {companyLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
