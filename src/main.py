import os
from dotenv import load_dotenv

# .env dosyasındaki gizli bilgileri sisteme yükler
load_dotenv()

# Şifreyi okuyup değişkene atar
api_key = os.getenv("OPENAI_API_KEY") 

if api_key:
    print("🚀 Harika! Çalışma ortamı hazır, kütüphaneler yüklendi ve .env dosyası başarıyla okundu.")
    print(f"Okunan Anahtar: {api_key}")
else:
    print("❌ Hata: .env dosyası bulunamadı veya okunamadı.")