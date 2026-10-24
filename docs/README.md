# Bible On Air - 法務條款發布目錄 (GitHub Pages Source Root)

此目錄 (`docs/`) 為 **Bible On Air (新竹北門聖教會・每日靈修)** 公開法務網頁的唯一真實來源 (Single Source of Truth) 與 GitHub Pages 部署發布根目錄。

> [!NOTE]
> 早期在主專案中的 `publicWeb/` 資料夾已全數廢止並移除，未來所有條款修訂、樣式調整或常見問題維護，請一律直接在此目錄下進行。

## 目錄內容清單

* `index.html`：官方公開入口導覽頁 (Marketing URL)
* `privacy.html`：隱私權政策 (Privacy Policy)
* `terms.html`：服務條款與授權合約 (Terms of Use / EULA)
* `faq.html`：常見問題與使用支援 (FAQ & Data Deletion Guide)
* `style.css`：專用典雅閱讀調性樣式表（支援系統/淺色/深色模式）
* `script.js`：雙語切換、主題切換與無障礙腳本

## 常用指令

請在專案根目錄 (`/Users/aecho/WorkZone/tunaDevGitHub/2610_html_beimen_bible_on_air_legal`) 下執行：

* `just serve`：預覽靜態網站（自動刷新 HTML 內之快取時間戳記版本號並啟動本地伺服器）
* `just stamp`：批次刷新所有 HTML 的快取戳記
