<div align="center">
  <img src="https://via.placeholder.com/150/?text=Add+Logo+Here" width="200" alt="SmartExamBuilder Logo">
  
  # 🎓 SmartExamBuilder

  **LLM ve Multi-Agent tabanlı otomatik sınav ve rubrik üretici sistem**

  [![Python Version](https://img.shields.io/badge/python-3.8%2B-blue)](https://www.python.org/)
  [![Agentic AI](https://img.shields.io/badge/AI-Multi%20Agent-purple)]()
  [![Local LLM](https://img.shields.io/badge/LLM-LM%20Studio-orange)]()
  
</div>

<br/>

## 🌟 Proje Hakkında

**SmartExamBuilder**, yerel dil modellerini (Local LLM) kullanarak belirli kazanımlara uygun sorular ve değerlendirme rubrikleri üreten yenilikçi bir yapay zeka aracıdır. Sistem, birbirini denetleyen çoklu ajan (Multi-Agent) mimarisi sayesinde üretilen soruların kalitesini garanti eder ve öğrenci cevaplarını anında değerlendirerek kişiselleştirilmiş geri bildirimler sunar.

> 💡 **Not:** Bu projeye eklemek için harika bir görsel oluşturdum! Proje dizinindeki `smartexambuilder_logo` isimli resmi, üstteki `<img src="...">` alanına ekleyerek bu repoda kapak fotoğrafı yapabilirsiniz.

---

## ✨ Özellikler

- 🤖 **Çoklu Ajan (Multi-Agent) Mimarisi:** Writer, Critic ve Evaluator ajanlarının senkronize çalışması.
- 🎯 **Kalite Kontrolü (Critic):** Üretilen sorular, kalite kontrolünden geçemezse otomatik olarak yeniden yazılır.
- 📊 **Detaylı Geri Bildirim:** Öğrenci cevapları analiz edilerek esnek bir rubrik ile notlandırılır ve geliştirilmesi gereken yönler sunulur.
- 🧠 **Geniş Müfredat Desteği:** İşletim Sistemleri, Matematik ve Tarih alanlarında çeşitli kazanımlar için hazır altyapı.
- 🔒 **Yerel LLM (LM Studio):** API maliyeti olmadan tamamen yerel donanımda çalışma imkanı.

---

## 🏗️ Sistem Mimarisi

İşleyiş temel olarak 3 ana ajan etrafında döner:

1. ✍️ **Writer Agent:** Öğrencinin seviyesine ve seçilen kazanıma uygun bir soru ve beklenen cevap (rubrik) anahtarları üretir.
2. 🔍 **Critic Agent:** Üretilen soruyu inceleyerek kalite standartlarına uyup uymadığını denetler. Eğer soru zayıfsa veya kazanımla örtüşmüyorsa Writer'ı tekrar çalıştırır. (Reddedilme / Onaylanma mekanizması).
3. 📝 **Evaluator Agent:** Öğrencinin girdiği cevabı, sorunun asıl amacına ve beklenen cevaplara göre değerlendirir, 100 üzerinden puanlandırır ve güçlü/zayıf yönleri listeler.

---

## 🚀 Kurulum & Çalıştırma

### 1. Gereksinimleri Yükleyin
Proje, yerel modda Python ile çalışmaktadır. Ortam bağımlılıklarını kurmak için:

```bash
pip install -r requirements.txt
```

### 2. LM Studio Hazırlığı
Bu proje tamamen yerel dil modelleri ile çalışacak şekilde tasarlanmıştır.
- [LM Studio](https://lmstudio.ai)'yu indirin ve açın.
- Tercih ettiğiniz güce sahip bir modeli indirin (Örn: Llama 3 veya Mistral).
- LM Studio üzerinden **Local Server** (http://localhost:1234/v1) başlatın.

### 3. Uygulamayı Başlatın
Orkestratör devrede! Sadece aşağıdaki komutu çalıştırarak ana menüye erişin:

```bash
python main.py
```

### 4. Ekran Akışı
1. `Kazanım` seçimi yapın.
2. `Zorluk Seviyesi` (Kolay, Orta, Zor) belirleyin.
3. Arkanıza yaslanın ve ajanların soruyu üretmesini, denetlemesini ve onaylamasını izleyin.
4. Çıkan soruya dilediğiniz gibi cevap vererek kendinizi test edin!

---

## 📂 Proje Yapısı

```text
SmartExamBuilder/
├── main.py                     # Ana Orkestratör ve uçtan uca CLI arayüzü
├── requirements.txt            # Python bağımlılıkları
├── .env                        # Çevre değişkenleri (gerekirse)
├── data/                       # Veri klasörü (örn: mufredat.txt)
└── src/
    └── agents/
        ├── writer_agent.py     # Soru ve rubrik üretici
        ├── critic_agent.py     # Kalite kontrol 
        └── evaluator_agent.py  # Öğrenci cevabı değerlendirici
```

<div align="center">
  <i>Eğitim ve teknolojinin buluştuğu nokta 🚀</i>
</div>
