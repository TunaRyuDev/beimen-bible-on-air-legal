# Bible On Air - 公開法務條款網頁 (Public Web)

本目錄包含 **Bible On Air** 行動應用程式上架與審核所需的法務與公開說明頁面，專為 **Apple App Store** 與 **Google Play Console** 審查規範所設計。

---

## 📄 頁面清單與對應審核欄位

網頁原始碼皆存放於 `docs/` 目錄下，便於直接透過 **GitHub Pages (Deploy from `/docs`)** 發布，確保根目錄之自動化腳本（如 `Justfile`）不會對外公開：

| 檔案路徑 | 頁面功能 | 建議對應 App 審查欄位 |
| :--- | :--- | :--- |
| `docs/index.html` | 官方入口導覽頁 | 應用程式行銷網址 (Marketing URL) / 官方網站 |
| `docs/privacy.html` | 隱私權政策 (Privacy Policy) | **隱私權政策網址 (Privacy Policy URL)** |
| `docs/terms.html` | 服務條款與授權合約 (Terms of Use / EULA) | **使用條款網址 (Terms of Use / EULA URL)** |
| `docs/faq.html` | 常見問題與使用支援 (FAQ &amp; Support) | **常見問題 / Google Play 資料安全「帳號刪除網址」/ Apple 5.1.1(v)** |

---

## 🌐 GitHub Pages 發布設定

本專案採用 GitHub Pages 內建支援之 `/docs` 資料夾託管機制：

1. 進入 GitHub Repository 的 **Settings** > **Pages**。
2. 在 **Build and deployment** 下的 **Source** 選擇 **Deploy from a branch**。
3. Branch 選擇 `main`，資料夾下拉選單選擇 **/docs**。
4. 點擊 **Save**，GitHub 即會自動部署 `docs/` 內的靜態網頁。

---

## 🌟 設計特色

1. **中英雙語即時切換**：
   - 預設呈現繁體中文（符合台灣在地會友需求）。
   - 點選右上角 `EN / English` 開關可即時切換全篇英文對照，亦支援透過網址參數直接指定語系（如 `privacy.html?lang=en`），方便 Apple / Google 跨國審查團隊直接檢閱。
2. **三態外觀模式下拉選單 (System / Light / Dark Theme)**：
   - 頂部導航列按鈕**顯示當前使用中之模式**（如 `💻 系統 ▾`、`☀️ 淺色 ▾`、`🌙 深色 ▾`）。
   - 點擊按鈕彈出互動下拉選單（Dropdown Menu），供使用者直接點選：
     - `💻 跟隨系統` (System Default)：依據使用者作業系統偏好自適應（預設模式）。
     - `☀️ 淺色模式` (Light Mode)：強制鎖定典雅羊皮紙暖白日間閱讀外觀。
     - `🌙 深色模式` (Dark Mode)：強制鎖定沉靜夜林黑晨昏外觀。
   - 選單中會以打勾符號（`✓`）標示當前生效之模式，支援點擊外部或按下 `Escape` 鍵自動收合。
   - 設定持久化儲存於 `localStorage`（鍵名：`boa_preferred_theme`），重新造訪或跨頁跳轉無縫維持選擇，且具備防閃爍腳本（No FOUC）。
3. **完全符合雙平台隱私要求**：
   - 明列資料收集範圍（Google/Apple 登入、靈修心得、打卡、FCM 推播、Crashlytics 錯誤診斷）。
   - 明列資料未收集範圍（無 GPS 位置、無通訊錄、無相機/麥克風、無廣告追蹤 IDFA/AAID）。
   - 包含聖經經文合理引用聲明與未成年人保護條款（COPPA & 台灣個資法）。
   - 明列帳號刪除方式（App 內即刻一鍵清除 + 電子郵件專人申請管道）。
4. **視覺調性契合 App**：
   - 採用教會與 App 專屬之典雅羊皮紙暖白（Parchment）與墨綠/橄欖綠（Olive Green）配色。
   - 支援深色模式（Dark Mode）與行動端響應式排版。
5. **純靜態無外部依賴**：
   - 無需 npm build 打包流程，可直接託管於 GitHub Pages (`/docs`) 或任何靜態託管空間。

---

## 🚀 本地預覽

在專案根目錄下執行：

```bash
# 使用 Justfile（推薦：自動更新 docs/ 靜態資源快取版本號並啟動伺服器）
just serve
# 或
just web-serve

# 亦可直接使用 Python 內建伺服器預覽 docs/
python3 -m http.server 8088 --directory docs
```

執行後在瀏覽器開啟 `http://localhost:8088` 即可檢視所有頁面。若有修改 CSS 或 JS，可執行 `just stamp` 批次刷新 `docs/` 下所有 HTML 中的引用版號。

---

## 🏛️ 法人資訊與聯絡窗口

- **法人全名**：財團法人台灣省新竹縣基督教北門聖教會 (Northgate Holiness Christian Church)
- **教會官網**：[https://w3.nghcc.org.tw/](https://w3.nghcc.org.tw/)
- **支援信箱**：[support@tuna-ryu.cc](mailto:support@tuna-ryu.cc)
- **應用程式 Bundle ID / Package Name**：`app.tuna.ryu.nghcc.bibleonair`

