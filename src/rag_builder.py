import os
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

def build_vector_db():
    print("1. Doküman okunuyor...")
    loader = TextLoader("data/mufredat.txt", encoding="utf-8")
    docs = loader.load()

    print("2. Metin parçalara (chunk) bölünüyor...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    splits = text_splitter.split_documents(docs)

    print("3. Vektör (Embedding) modeli yükleniyor...")
    # Güncel langchain-huggingface paketini kullanarak uyarıları gideriyoruz
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    print("4. Veritabanı oluşturuluyor ve kaydediliyor (FAISS ile)...")
    # Chroma yerine FAISS kullanıyoruz ve faiss_index klasörüne kaydediyoruz
    vectorstore = FAISS.from_documents(documents=splits, embedding=embeddings)
    vectorstore.save_local("faiss_index")
    
    print(f"İşlem başarılı! {len(splits)} adet metin parçası FAISS veritabanına kaydedildi.")

if __name__ == "__main__":
    build_vector_db()