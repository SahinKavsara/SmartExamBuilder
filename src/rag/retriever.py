"""
SmartExamBuilder – RAG Retriever

Mevcut FAISS vektör veritabanından ders kazanımlarına ilişkin
bağlam parçalarını çeker.
"""

import os
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# Proje kök dizini (bu dosya src/rag/retriever.py içinde)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FAISS_INDEX_PATH = os.path.join(BASE_DIR, "faiss_index")

_embeddings = None   # Modeli bir kez yükleyip önbellekte tut
_vectorstore = None  # Veritabanını bir kez yükleyip önbellekte tut


def _get_vectorstore():
    """FAISS vektör veritabanını döndürür (lazy loading)."""
    global _embeddings, _vectorstore
    if _vectorstore is None:
        print("   📦 Embedding modeli yükleniyor (all-MiniLM-L6-v2)...")
        _embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        _vectorstore = FAISS.load_local(
            FAISS_INDEX_PATH,
            _embeddings,
            allow_dangerous_deserialization=True
        )
    return _vectorstore


def retrieve_context(query: str, k: int = 3) -> str:
    """
    Verilen sorguya en yakın k belge parçasını döndürür.

    Args:
        query: Bağlam aranacak metin (kazanım metni gibi)
        k:     Döndürülecek belge sayısı

    Returns:
        Birleştirilmiş bağlam metni
    """
    vectorstore = _get_vectorstore()
    retriever = vectorstore.as_retriever(search_kwargs={"k": k})
    docs = retriever.invoke(query)
    return "\n\n".join(doc.page_content for doc in docs)
