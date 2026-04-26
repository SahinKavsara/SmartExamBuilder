/**
 * SmartExamBuilder – RAG Service (Basit Metin Tabanlı)
 *
 * mufredat.txt dosyasını okuyup kazanım indeksine göre ilgili bölümü döndürür.
 * Dosya küçük olduğu için FAISS yerine basit metin eşleştirmesi kullanılır.
 */

const fs = require("fs");
const path = require("path");

const MUFREDAT_PATH = path.join(__dirname, "..", "..", "data", "mufredat.txt");

let _mufredatContent = null;
let _sections = null;

/**
 * Müfredat dosyasını yükler ve bölümlere ayırır (lazy loading).
 */
function _loadMufredat() {
  if (_mufredatContent !== null) return;

  _mufredatContent = fs.readFileSync(MUFREDAT_PATH, "utf-8");

  // Dosyayı "---" ayırıcılarına göre bölümlere ayır
  const rawSections = _mufredatContent.split("---").map((s) => s.trim()).filter(Boolean);

  _sections = rawSections.map((section) => {
    // Her bölümdeki kazanım numaralarını bul
    const outcomeIds = [];
    const matches = section.matchAll(/^(\d+)\./gm);
    for (const m of matches) {
      outcomeIds.push(parseInt(m[1]));
    }
    return { content: section, outcomeIds };
  });
}

/**
 * Kazanım indeksine göre ilgili müfredat bağlamını döndürür.
 *
 * @param {number} outcomeId - Kazanım numarası (1-14)
 * @returns {string}         - İlgili müfredat bölümü
 */
function retrieveContext(outcomeId) {
  _loadMufredat();

  // Kazanıma ait bölümü bul
  for (const section of _sections) {
    if (section.outcomeIds.includes(outcomeId)) {
      return section.content;
    }
  }

  // Eşleşme yoksa tüm müfredatı döndür
  return _mufredatContent;
}

module.exports = { retrieveContext };
