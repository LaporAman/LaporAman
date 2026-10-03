import { useState } from 'react'
import { Link } from 'react-router-dom'

const QUESTIONS = [
  { q: 'Menurutmu apa yang terjadi?', opts: ['Dihina', 'Diancam', 'Dikucilkan', 'Disakiti secara fisik', 'Diganggu secara online', 'Tidak yakin'] },
  { q: 'Seberapa sering ini terjadi?', opts: ['Baru sekali', 'Beberapa kali', 'Sering / hampir setiap hari', 'Tidak yakin'] },
  { q: 'Apakah kamu merasa aman saat ini?', opts: ['Ya, cukup aman', 'Tidak terlalu aman', 'Tidak aman sama sekali'] }
]

export default function CheckSituation() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const done = step >= QUESTIONS.length

  function choose(opt) {
    const next = [...answers, opt]
    setAnswers(next)
    setStep(step + 1)
  }

  const notSafe = answers[2]?.includes('Tidak aman sama sekali')
  const advice = notSafe
    ? 'Keselamatanmu adalah prioritas. Segera cari orang dewasa terdekat yang bisa membantu, dan buat laporan sekarang agar sekolah bisa segera menindaklanjuti.'
    : 'Cari waktu untuk bicara dengan orang dewasa yang kamu percaya — guru BK, wali kelas, atau orang tua — dan pertimbangkan untuk membuat laporan agar situasinya bisa ditindaklanjuti.'

  return (
    <div className="mx-auto max-w-6xl px-6 pt-14 pb-20">
      <div className="max-w-[60ch] mb-8">
        <p className="text-teal font-semibold mb-2.5">Check Your Situation</p>
        <h2 className="font-display text-2xl md:text-3xl font-medium mb-3.5">
          Bantu kami memahami apa yang kamu alami
        </h2>
        <p className="text-ink-soft">
          Beberapa pertanyaan singkat bukan diagnosis, hanya untuk mengarahkanmu ke informasi
          dan langkah yang tepat.
        </p>
      </div>

      <div className="bg-navy-950 text-offwhite rounded-2xl p-8 md:p-11 max-w-[760px]">
        {!done ? (
          <>
            <div className="h-1 bg-white/15 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-teal transition-all duration-300"
                style={{ width: `${((step + 0.5) / QUESTIONS.length) * 100}%` }}
              />
            </div>
            <small className="text-[#9fb0c9] font-semibold tracking-wide">
              PERTANYAAN {step + 1} DARI {QUESTIONS.length}
            </small>
            <h3 className="text-2xl font-medium my-3.5">{QUESTIONS[step].q}</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {QUESTIONS[step].opts.map((opt) => (
                <button
                  key={opt}
                  onClick={() => choose(opt)}
                  className="text-left rounded-[10px] border border-white/15 bg-white/5 px-4 py-3.5 font-medium hover:border-teal transition-colors"
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-teal-soft rounded-[14px] p-8 text-navy-800">
            <h4 className="text-xl font-medium mb-2.5 text-navy-950">Terima kasih sudah menjawab</h4>
            <p className="mb-4.5">
              Berdasarkan jawabanmu, ini bukan untuk menentukan siapa yang salah tapi untuk
              membantumu tahu langkah berikutnya. {advice}
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link to="/report" className="btn btn-primary">
                Buat Laporan
              </Link>
              <Link to="/bullying" className="btn btn-ghost">
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
