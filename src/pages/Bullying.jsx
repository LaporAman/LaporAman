import { useState } from 'react'

const CATEGORIES = {
  verbal: {
    label: 'Verbal',
    title: 'Verbal bullying',
    desc: 'Menyerang seseorang lewat kata-kata bisa diucapkan langsung atau ditulis.',
    contoh: ['Dipanggil dengan julukan yang merendahkan', 'Diejek soal penampilan atau logat bicara', 'Diteriaki atau dihina di depan orang lain'],
    tanda: ['Mulai menghindari kelas atau kegiatan tertentu', 'Terlihat murung setelah bertemu orang tertentu'],
    lakukan: ['Catat kapan dan di mana kejadian terjadi', 'Bicarakan dengan orang dewasa yang dipercaya'],
    bantuan: ['Saat terjadi berulang atau membuatmu takut ke sekolah']
  },
  physical: {
    label: 'Fisik',
    title: 'Physical bullying',
    desc: 'Tindakan fisik yang menyakiti atau mengintimidasi.',
    contoh: ['Didorong, dipukul, atau dijegal', 'Barang pribadi dirampas atau dirusak'],
    tanda: ['Luka atau barang rusak tanpa penjelasan jelas'],
    lakukan: ['Jauhi situasi secepat mungkin, cari tempat ramai', 'Laporkan ke guru atau pihak sekolah sesegera mungkin'],
    bantuan: ['Segera kekerasan fisik tidak perlu ditunggu sampai parah']
  },
  social: {
    label: 'Sosial / Relasional',
    title: 'Social / relational bullying',
    desc: 'Merusak hubungan atau status sosial seseorang, sering kali diam-diam.',
    contoh: ['Sengaja dikucilkan dari kelompok', 'Disebarkan gosip atau rumor'],
    tanda: ['Tiba-tiba tidak diajak dalam aktivitas kelompok'],
    lakukan: ['Cari teman atau ruang lain yang mendukung', 'Bicarakan perasaanmu ke seseorang yang dipercaya'],
    bantuan: ['Saat mulai memengaruhi rasa percaya diri sehari-hari']
  },
  cyber: {
    label: 'Cyberbullying',
    title: 'Cyberbullying',
    desc: 'Bullying yang terjadi lewat pesan, media sosial, atau platform online lainnya.',
    contoh: ['Dikirimi pesan mengancam atau menghina', 'Foto/video disebarkan tanpa izin'],
    tanda: ['Menjadi cemas setiap kali membuka ponsel'],
    lakukan: ['Simpan bukti (tangkapan layar) sebelum diblokir/dihapus', 'Jangan membalas dengan cara yang sama'],
    bantuan: ['Saat ancaman terasa nyata atau berlangsung terus-menerus']
  }
}

function Block({ title, items }) {
  return (
    <div className="mb-5">
      <h4 className="font-bold text-[0.86rem] text-navy-900 dark:text-offwhite mb-2">{title}</h4>
      <ul className="list-disc pl-[18px] text-ink-soft space-y-1.5">
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  )
}

export default function Bullying() {
  const [tab, setTab] = useState('verbal')
  const c = CATEGORIES[tab]

  return (
    <div className="mx-auto max-w-6xl px-6 pt-14 pb-20">
      <div className="max-w-[60ch] mb-8">
        <p className="text-teal font-semibold mb-2.5">Kenali Bullying</p>
        <h2 className="font-display text-2xl md:text-3xl font-medium text-navy-950 dark:text-offwhite mb-3.5">
          Empat bentuk bullying yang perlu dikenali
        </h2>
        <p className="text-ink-soft">
          Pilih salah satu kategori untuk melihat contoh, tanda-tanda, dan langkah yang bisa
          diambil.
        </p>
      </div>

      <div className="flex gap-6 border-b border-line dark:border-white/10 mb-8 overflow-x-auto">
        {Object.entries(CATEGORIES).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`pb-3 pt-1 font-semibold whitespace-nowrap border-b-2 transition-colors ${
              tab === key
                ? 'text-navy-950 dark:text-offwhite border-navy-950 dark:border-offwhite'
                : 'text-ink-soft border-transparent'
            }`}
          >
            {val.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h3 className="text-xl font-medium mb-1.5">{c.title}</h3>
          <p className="text-ink-soft mb-5">{c.desc}</p>
          <Block title="Contoh situasi" items={c.contoh} />
        </div>
        <div>
          <Block title="Tanda-tanda" items={c.tanda} />
          <Block title="Yang bisa dilakukan" items={c.lakukan} />
          <Block title="Kapan mencari bantuan" items={c.bantuan} />
        </div>
      </div>
    </div>
  )
}
