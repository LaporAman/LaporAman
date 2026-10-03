const SKILLS = ['React', 'Tailwind CSS', 'Three.js', 'UX Design']

export default function About() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-14 pb-20">
      <div className="max-w-[60ch] mb-8">
        <p className="text-teal font-semibold mb-2.5">About the Creator</p>
        <h2 className="font-display text-2xl md:text-3xl font-medium">Cerita di balik LaporAman</h2>
      </div>

      <div className="grid md:grid-cols-[0.8fr_1.2fr] gap-13 items-start">
        <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-navy-800 to-navy-950 relative overflow-hidden flex items-center justify-center">
          <img src="/nizam.jpg" />
        </div>
        <div>
          <h3 className="text-2xl font-medium mb-1.5">Nizam Makbullah Shihab</h3>
          <p className="text-ink-soft mb-5">
            Saya Nizam, seorang pelajar yang tertarik pada teknologi, desain, dan pengembangan
            website. LaporAman dibuat sebagai project yang menggabungkan teknologi dengan isu yang
            dekat dengan kehidupan pelajar.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {SKILLS.map((s) => (
              <span key={s} className="bg-teal-soft text-navy-800 px-3.5 py-1.5 rounded-full text-sm font-semibold">
                {s}
              </span>
            ))}
          </div>
          <p className="text-ink-soft">
            LaporAman lahir dari keresahan nyata yang kami rasakan langsung di lingkungan sekolah saat ini. Kasus perundungan yang terus terjadi di sekitar kami bukan lagi sekadar berita di media, melainkan sebuah realitas pahit yang dihadapi teman teman setiap harinya. Kami sadar bahwa sistem pengaduan konvensional sering kali membuat korban atau saksi merasa takut, ragu, bahkan terancam. Dari sanalah muncul dorongan kuat untuk bergerak dan berbuat sesuatu bukan karena tuntutan nilai atau paksaan dari pihak mana pun, melainkan murni atas dasar kepedulian untuk menciptakan perubahan.
Kami membangun produk digital ini dengan satu tujuan utama: menjadi ruang aman yang benar benar berpihak pada siswa. LaporAman didesain sebagai platform yang dekat, mudah diakses, dan menjamin kerahasiaan penuh, sehingga siap pun yang melihat atau mengalami bullying tidak perlu lagi merasa sendirian atau takut untuk bersuara. Lewat platform ini, kami ingin merangkul seluruh warga sekolah, memberikan pemahaman yang mendalam tentang dampak buruk perundungan, sekaligus membekali para siswa dengan langkah langkah konkret untuk menghadapi situasi tersebut dengan selamat. Ini adalah langkah nyata kami untuk memutus rantai ketakutan, membangun rasa saling peduli, dan memastikan sekolah kembali menjadi tempat yang ramah, inklusif, serta bebas dari intimidasi.
          </p>
        </div>
      </div>
    </div>
  )
}
