import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-16 md:pt-20">
        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-14 items-center">
          <div>
            <p className="text-teal font-semibold mb-3">LaporAman</p>
            <h1 className="font-display text-[2.4rem] md:text-[3.6rem] leading-[1.08] font-medium text-navy-950 dark:text-offwhite mb-5">
              Sekolah seharusnya menjadi tempat yang aman untuk semua.
            </h1>
            <p className="text-lg text-ink-soft max-w-[46ch] mb-7">
              Kenali bullying, cari bantuan, dan sampaikan apa yang terjadi dengan cara yang lebih
              aman untuk dirimu atau untuk temanmu.
            </p>
            <div className="flex gap-3.5 flex-wrap">
              <Link to="/report" className="btn btn-primary px-6 py-3">
                Laporkan Kejadian
              </Link>
              <Link to="/bullying" className="btn btn-ghost px-6 py-3">
                Pelajari Tentang Bullying
              </Link>
            </div>
          </div>

          <div className="relative aspect-square rounded-full overflow-hidden bg-[radial-gradient(circle_at_32%_28%,#1b2740,#0d1526_70%)] flex items-center justify-center">
            <HeroIllustration />
          </div>
        </div>
      </section>

      <section className="bg-navy-950 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="font-display text-xl text-offwhite leading-relaxed">
            "Bullying jarang berhenti karena diabaikan. Langkah kecil untuk bicara atau untuk
            melapor sering kali yang paling berarti."
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-[60ch] mb-10">
          <p className="text-teal font-semibold mb-2.5">Kenapa LaporAman</p>
          <h2 className="font-display text-2xl md:text-3xl font-medium text-navy-950 dark:text-offwhite">
            Tiga hal yang paling sering dibutuhkan siswa
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            ['Memahami situasi', 'Tidak semua konflik adalah bullying, dan tidak semua bullying terlihat jelas. Kenali tandanya lebih dulu.'],
            ['Melapor dengan aman', 'Laporan bisa anonim, dan hanya bisa diakses pihak yang berwenang menanganinya.'],
            ['Tidak sendirian', 'Ruang komunitas untuk membaca cerita orang lain dan tahu bahwa ada yang mengalami hal serupa.']
          ].map(([title, desc]) => (
            <div key={title}>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-ink-soft">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function HeroIllustration() {
  return (
    <svg
      className="w-[72%] drop-shadow-[0_18px_28px_rgba(0,0,0,0.35)] motion-safe:animate-float"
      viewBox="0 0 320 420"
      role="img"
      aria-label="Ilustrasi siswa mengangkat tangan, siap bercerita dengan aman"
    >
      <ellipse cx="160" cy="392" rx="72" ry="14" fill="#0d1526" opacity="0.3" />
      <rect x="132" y="284" width="26" height="86" rx="13" fill="#1b2740" />
      <rect x="162" y="284" width="26" height="86" rx="13" fill="#1b2740" />
      <rect x="124" y="360" width="42" height="20" rx="9" fill="#272b34" />
      <rect x="154" y="360" width="42" height="20" rx="9" fill="#272b34" />
      <path d="M136 184 L129 278" stroke="#0d1526" strokeWidth="10" strokeLinecap="round" opacity="0.85" />
      <rect x="122" y="182" width="76" height="110" rx="22" fill="#f6f4ee" />
      <polygon points="155,190 165,190 161,230 159,238 157,230" fill="#4f8b83" />
      <path d="M128 196 Q100 212 96 260" fill="none" stroke="#f6f4ee" strokeWidth="24" strokeLinecap="round" />
      <circle cx="96" cy="262" r="12" fill="#dba97d" />
      <path d="M192 196 Q222 188 222 140" fill="none" stroke="#f6f4ee" strokeWidth="24" strokeLinecap="round" />
      <circle cx="222" cy="138" r="12" fill="#dba97d" />
      <g transform="translate(226,82)">
        <rect width="58" height="38" rx="14" fill="#4f8b83" />
        <path d="M14 38 L8 52 L26 38 Z" fill="#4f8b83" />
        <circle cx="16" cy="19" r="3.4" fill="#f6f4ee" />
        <circle cx="29" cy="19" r="3.4" fill="#f6f4ee" />
        <circle cx="42" cy="19" r="3.4" fill="#f6f4ee" />
      </g>
      <rect x="149" y="158" width="22" height="28" rx="9" fill="#dba97d" />
      <circle cx="160" cy="126" r="40" fill="#3a2c22" />
      <circle cx="160" cy="132" r="36" fill="#dba97d" />
    </svg>
  )
}
