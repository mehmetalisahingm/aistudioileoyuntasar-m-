import React from 'react';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const ParentsModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl p-8 relative max-h-full overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-2">Ebeveyn ve Eğitimci Raporu</h2>

        <div className="space-y-8 text-slate-700">
          <section>
            <h3 className="text-xl font-bold text-blue-600 mb-2">1. Proje Özeti</h3>
            <p>Bu proje, 5-6 yaş grubu (okuma-yazma bilmeyen) çocuklar için tasarlanmış, web tabanlı etkileşimli bir eğitsel oyundur. Dikkat geliştirme, şekil/renk eşleştirme ve sıralı düşünme becerilerini hedefler.</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-blue-600 mb-2">2. Pedagojik Yaklaşım</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Sessiz Arayüz:</strong> Okuma gerektirmez, tüm yönergeler seslidir (TTS).</li>
              <li><strong>Hata Dostu:</strong> Yanlış yapıldığında ceza yok, sadece tekrar deneme şansı var.</li>
              <li><strong>Bilişsel Hedefler:</strong> Görsel algı (şekil bulma), İşitsel algı (yönerge takip), Algoritmik düşünme (sıralı şifre çözme).</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-blue-600 mb-2">3. Teknik Rapor</h3>
            <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
              <p>Teknolojiler:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>React 18 + TypeScript (Tip güvenliği ve modern state yönetimi)</li>
                <li>Tailwind CSS (Responsive ve performanslı stil)</li>
                <li>Web Speech API (Dinamik Türkçe seslendirme)</li>
                <li>Lucide React (Hafif ve ölçeklenebilir ikonlar)</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-blue-600 mb-2">4. Sosyal Medya İçerikleri</h3>
            
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900">LinkedIn Paylaşım Örneği:</h4>
              <p className="italic text-gray-600 border-l-4 border-gray-300 pl-4 py-2">
                "🚀 Çocuklar için teknoloji ve eğitimi birleştirdik! <br/>
                5-6 yaş grubu için geliştirdiğim 'Küçük Kâşifler' projesi yayında. React ve Web Speech API kullanarak, okuma bilmeyen minikler için tamamen sesli ve etkileşimli bir deneyim tasarladım. Bu projede Google AI Studio'nun sağladığı yapılandırılmış içerik akışını koda döktük. #React #EdTech #Frontend #GameDev"
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-900">GitHub README Özeti:</h4>
              <p className="italic text-gray-600 border-l-4 border-gray-300 pl-4 py-2">
                ## Küçük Kâşifler: Eğitsel Web Oyunu<br/>
                Okul öncesi dönem için geliştirilmiş açık kaynaklı mini oyun.<br/>
                **Kurulum:** `npm install` ardından `npm start`<br/>
                **Lisans:** MIT License
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};