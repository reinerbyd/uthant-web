"use client";

import { useEffect, useState } from "react";

/**
 * Lightweight locale + currency engine.
 * - Static / server-rendered text is tagged with `data-i18n="key"` and
 *   translated in the DOM by applyLocale() (run from LocaleRuntime).
 * - Prices are tagged with `data-myr="<number>"` (+ optional `data-compact`)
 *   and converted to the active currency.
 * - React islands (e.g. the calculator) use the useI18n() hook.
 *
 * Exchange rates are indicative — wire to a live FX feed for production.
 */

export type LocaleKey = "en" | "cn" | "tw" | "id" | "sg";
type DictLang = "en" | "cn" | "tw" | "id";

export type Locale = {
  key: LocaleKey;
  code: string; // shown in the switcher
  label: string;
  flag: string;
  lang: string; // <html lang>
  t: DictLang; // dictionary language
  cur: { code: string; symbol: string; rate: number; spaced: boolean };
};

export const LOCALES: Record<LocaleKey, Locale> = {
  en: { key: "en", code: "MY", label: "English · MYR", flag: "🇲🇾", lang: "en", t: "en", cur: { code: "MYR", symbol: "RM", rate: 1, spaced: true } },
  cn: { key: "cn", code: "CN", label: "简体中文 · CNY", flag: "🇨🇳", lang: "zh-CN", t: "cn", cur: { code: "CNY", symbol: "¥", rate: 1.55, spaced: false } },
  tw: { key: "tw", code: "TW", label: "繁體中文 · TWD", flag: "🇹🇼", lang: "zh-TW", t: "tw", cur: { code: "TWD", symbol: "NT$", rate: 6.95, spaced: true } },
  id: { key: "id", code: "ID", label: "Bahasa · IDR", flag: "🇮🇩", lang: "id", t: "id", cur: { code: "IDR", symbol: "Rp", rate: 3450, spaced: true } },
  sg: { key: "sg", code: "SG", label: "English · SGD", flag: "🇸🇬", lang: "en", t: "en", cur: { code: "SGD", symbol: "S$", rate: 0.3, spaced: true } },
};

export const LOCALE_LIST: Locale[] = [LOCALES.en, LOCALES.cn, LOCALES.tw, LOCALES.id, LOCALES.sg];

type Entry = Record<DictLang, string>;
export const DICT: Record<string, Entry> = {
  "nav.collection": { en: "Collection", cn: "系列", tw: "系列", id: "Koleksi" },
  "nav.quarter": { en: "The Quarter", cn: "使馆区", tw: "使館區", id: "Kawasan" },
  "nav.investment": { en: "Investment", cn: "投资", tw: "投資", id: "Investasi" },
  "nav.surrounds": { en: "Surrounds", cn: "周边", tw: "周邊", id: "Sekitar" },
  "nav.enquire": { en: "Enquire", cn: "咨询", tw: "諮詢", id: "Tanya" },

  "inv.theNumbers": { en: "The numbers", cn: "数据测算", tw: "數據試算", id: "Angka" },
  "inv.model": { en: "Model your position.", cn: "测算您的投资。", tw: "試算您的投資。", id: "Modelkan posisi Anda." },
  "inv.price": { en: "Purchase price", cn: "购买价格", tw: "購買價格", id: "Harga beli" },
  "inv.down": { en: "Down payment", cn: "首付", tw: "頭期款", id: "Uang muka" },
  "inv.rate": { en: "Interest rate", cn: "利率", tw: "利率", id: "Suku bunga" },
  "inv.tenure": { en: "Loan tenure", cn: "贷款年限", tw: "貸款年期", id: "Tenor pinjaman" },
  "inv.rent": { en: "Expected monthly rent", cn: "预期月租金", tw: "預期月租金", id: "Perkiraan sewa bulanan" },
  "inv.appr": { en: "Annual appreciation", cn: "年增值率", tw: "年增值率", id: "Apresiasi tahunan" },
  "inv.monthly": { en: "Monthly repayment", cn: "每月还款", tw: "每月還款", id: "Cicilan bulanan" },
  "inv.gross": { en: "Gross yield", cn: "毛收益率", tw: "毛收益率", id: "Hasil kotor" },
  "inv.net": { en: "Net yield", cn: "净收益率", tw: "淨收益率", id: "Hasil bersih" },
  "inv.value5": { en: "Value in 5 years", cn: "5年后价值", tw: "5年後價值", id: "Nilai dalam 5 tahun" },
  "inv.roe": { en: "5-yr return on equity", cn: "5年股本回报", tw: "5年股本回報", id: "ROE 5 tahun" },
  "inv.years": { en: "years", cn: "年", tw: "年", id: "tahun" },

  // ---- common ----
  "common.scroll": { en: "Scroll", cn: "向下滚动", tw: "向下滾動", id: "Gulir" },
  "common.viewCollection": { en: "View the collection", cn: "浏览臻选系列", tw: "瀏覽臻選系列", id: "Lihat koleksi" },
  "common.requestViewing": { en: "Request viewing", cn: "预约看房", tw: "預約看房", id: "Minta tinjauan" },
  "common.whatsapp": { en: "WhatsApp us", cn: "WhatsApp 联系", tw: "WhatsApp 聯繫", id: "Hubungi WhatsApp" },
  "common.exploreQuarter": { en: "Explore the Quarter", cn: "探索使馆区", tw: "探索使館區", id: "Jelajahi Kawasan" },

  // ---- home: story ----
  "story.address": { en: "The Address", cn: "这一地段", tw: "這一地段", id: "Alamat Ini" },
  "story.h1": { en: "Half a square mile", cn: "半平方英里", tw: "半平方英里", id: "Setengah mil persegi" },
  "story.h2": { en: "between the embassies,", cn: "坐落于使馆之间，", tw: "坐落於使館之間，", id: "di antara kedutaan," },
  "story.h3": { en: "the Royal Selangor", cn: "雪兰莪皇家高尔夫", tw: "雪蘭莪皇家高爾夫", id: "Royal Selangor" },
  "story.h4": { en: "and KLCC.", cn: "与吉隆坡城中城。", tw: "與吉隆坡城中城。", id: "dan KLCC." },
  "story.p1": { en: "U Thant is not a neighbourhood you stumble into. It is Kuala Lumpur's diplomatic enclave — a quiet, tree-lined quarter of freehold estates that rarely change hands, held by families and missions for generations.", cn: "优唐并非偶然路过的社区。这里是吉隆坡的外交使馆区——一处静谧、绿树成荫的永久地契庄园区，鲜少易手，世代为名门与使馆所持有。", tw: "優唐並非偶然路過的社區。這裡是吉隆坡的外交使館區——一處靜謐、綠樹成蔭的永久地契莊園區，鮮少易手，世代為名門與使館所持有。", id: "U Thant bukan kawasan yang Anda temui secara kebetulan. Inilah enklave diplomatik Kuala Lumpur — kawasan hak milik yang tenang dan rindang, jarang berpindah tangan, dimiliki keluarga dan kedutaan lintas generasi." },
  "story.p2": { en: "We work this half-square-mile and nothing else. Every residence in the collection is mandated, measured and understood — so the right home reaches the right hands, with the discretion the address deserves.", cn: "我们只专注于这半平方英里。系列中的每一处府邸皆经受托、丈量与深入了解——让合适的家觅得合适的主人，以这一地段应有的审慎成就交易。", tw: "我們只專注於這半平方英里。系列中的每一處府邸皆經受託、丈量與深入了解——讓合適的家覓得合適的主人，以這一地段應有的審慎成就交易。", id: "Kami hanya menggarap setengah mil persegi ini. Setiap kediaman dimandatkan, diukur, dan dipahami — agar rumah yang tepat sampai ke tangan yang tepat, dengan kebijaksanaan yang layak bagi alamat ini." },

  "curtain.caption": { en: "U Thant Residence — Living", cn: "优唐公馆 · 客厅", tw: "優唐公館 · 客廳", id: "U Thant Residence — Ruang Tamu" },

  // ---- home: stats ----
  "stats.eyebrow": { en: "By the numbers", cn: "数据一览", tw: "數據一覽", id: "Dalam angka" },
  "stats.transactions": { en: "Transactions closed", cn: "成交宗数", tw: "成交宗數", id: "Transaksi selesai" },
  "stats.freehold": { en: "Freehold share", cn: "永久地契占比", tw: "永久地契佔比", id: "Porsi hak milik" },
  "stats.developments": { en: "New developments", cn: "全新发展项目", tw: "全新發展項目", id: "Pengembangan baru" },
  "stats.priceBand": { en: "Price band", cn: "价格区间", tw: "價格區間", id: "Kisaran harga" },

  // ---- home: collection ----
  "collection.eyebrow": { en: "Buildings under mandate", cn: "受托楼盘", tw: "受託樓盤", id: "Properti dalam mandat" },
  "collection.title": { en: "The Collection", cn: "臻选系列", tw: "臻選系列", id: "Koleksi" },
  "collection.desc": { en: "Seven established residences — drag or scroll to move through the quarter, building by building.", cn: "七座成熟府邸——拖动或滚动，逐栋探索这一地段。", tw: "七座成熟府邸——拖動或滾動，逐棟探索這一地段。", id: "Tujuh kediaman mapan — seret atau gulir untuk menjelajah kawasan, satu per satu." },

  // ---- home: quarter ----
  "quarter.eyebrow": { en: "The Quarter", cn: "使馆区", tw: "使館區", id: "Kawasan" },
  "quarter.h1": { en: "Quiet, green,", cn: "静谧、葱郁，", tw: "靜謐、蔥鬱，", id: "Tenang, hijau," },
  "quarter.h2": { en: "and minutes", cn: "与一切", tw: "與一切", id: "dan hanya semenit" },
  "quarter.h3": { en: "from everything.", cn: "近在咫尺。", tw: "近在咫尺。", id: "dari segalanya." },
  "quarter.p": { en: "Royal Selangor Golf Club at the gate. KLCC and the city's finest dining a short drive away. The calm of an embassy district, with the capital always within reach.", cn: "雪兰莪皇家高尔夫俱乐部近在门前。吉隆坡城中城与城中顶级餐饮亦只需片刻车程。坐拥使馆区的宁静，又与都心始终相连。", tw: "雪蘭莪皇家高爾夫俱樂部近在門前。吉隆坡城中城與城中頂級餐飲亦只需片刻車程。坐擁使館區的寧靜，又與都心始終相連。", id: "Royal Selangor Golf Club di depan gerbang. KLCC dan santapan terbaik kota hanya beberapa menit berkendara. Ketenangan distrik kedutaan, dengan ibu kota selalu dalam jangkauan." },

  // ---- home: schools ----
  "schools.eyebrow": { en: "Within reach", cn: "触手可及", tw: "觸手可及", id: "Dalam jangkauan" },
  "schools.h": { en: "Five international schools, all on the doorstep.", cn: "五所国际学校，皆在门前。", tw: "五所國際學校，皆在門前。", id: "Lima sekolah internasional, semuanya di depan pintu." },
  "schools.tagInternational": { en: "International", cn: "国际学校", tw: "國際學校", id: "Internasional" },
  "schools.tagEarly": { en: "Early years", cn: "幼儿教育", tw: "幼兒教育", id: "Usia dini" },

  // ---- home: quote ----
  "quote.l1": { en: "“We specialise in", cn: "“我们只专注于", tw: "「我們只專注於", id: "“Kami hanya fokus pada" },
  "quote.l2": { en: "one neighbourhood —", cn: "同一个社区——", tw: "同一個社區——", id: "satu kawasan —" },
  "quote.l3": { en: "and know it better", cn: "并比任何人", tw: "並比任何人", id: "dan memahaminya" },
  "quote.l4": { en: "than anyone.”", cn: "都更懂它。”", tw: "都更懂它。」", id: "lebih dari siapa pun.”" },

  // ---- footer ----
  "footer.tagline": { en: "Freehold luxury homes in Kuala Lumpur's diplomatic Embassy Quarter. Quietly, since the beginning.", cn: "坐落于吉隆坡外交使馆区的永久地契豪宅。低调，始终如一。", tw: "坐落於吉隆坡外交使館區的永久地契豪宅。低調，始終如一。", id: "Kediaman mewah hak milik di Kawasan Kedutaan diplomatik Kuala Lumpur. Diam-diam, sejak awal." },
  "footer.contact": { en: "Contact", cn: "联系", tw: "聯繫", id: "Kontak" },
  "footer.visit": { en: "Visit", cn: "到访", tw: "到訪", id: "Kunjungi" },
  "footer.concept": { en: "Cinematic showcase — concept", cn: "影院级呈现 · 概念", tw: "影院級呈現 · 概念", id: "Etalase sinematik — konsep" },

  // ---- home: contact CTA ----
  "contact.eyebrow": { en: "Begin a conversation", cn: "开启对话", tw: "開啟對話", id: "Mulai percakapan" },
  "contact.h1": { en: "Arrange a private", cn: "预约一场私人", tw: "預約一場私人", id: "Atur kunjungan pribadi" },
  "contact.h2": { en: "viewing of U Thant.", cn: "优唐看房之旅。", tw: "優唐看房之旅。", id: "ke U Thant." },
  "contact.kEmail": { en: "Email", cn: "邮箱", tw: "郵箱", id: "Email" },
  "contact.kBrochure": { en: "Brochure", cn: "楼书", tw: "樓書", id: "Brosur" },
  "contact.download": { en: "Download the collection", cn: "下载完整楼书", tw: "下載完整樓書", id: "Unduh koleksi" },
  "contact.scheduleTitle": { en: "Schedule a viewing", cn: "预约看房", tw: "預約看房", id: "Jadwalkan kunjungan" },
  "contact.fName": { en: "Name", cn: "姓名", tw: "姓名", id: "Nama" },
  "contact.fPhone": { en: "Phone", cn: "电话", tw: "電話", id: "Telepon" },
  "contact.fDate": { en: "Preferred date", cn: "期望日期", tw: "期望日期", id: "Tanggal pilihan" },
  "contact.fInterest": { en: "Residence of interest", cn: "感兴趣的府邸", tw: "感興趣的府邸", id: "Kediaman yang diminati" },
  "contact.fMessage": { en: "Message", cn: "留言", tw: "留言", id: "Pesan" },
  "contact.notSure": { en: "Not sure yet", cn: "尚未确定", tw: "尚未確定", id: "Belum pasti" },
  "contact.submit": { en: "Request viewing", cn: "预约看房", tw: "預約看房", id: "Minta kunjungan" },
  "contact.sending": { en: "Sending…", cn: "提交中…", tw: "提交中…", id: "Mengirim…" },
  "contact.thanks": { en: "Thank you.", cn: "谢谢您。", tw: "謝謝您。", id: "Terima kasih." },
  "contact.thanksMsg": { en: "Your request has reached us — we'll be in touch very shortly to arrange your viewing.", cn: "我们已收到您的请求——稍后将尽快与您联系，安排看房事宜。", tw: "我們已收到您的請求——稍後將盡快與您聯繫，安排看房事宜。", id: "Permintaan Anda telah kami terima — kami akan segera menghubungi Anda untuk mengatur kunjungan." },
  "contact.again": { en: "Send another", cn: "再发一条", tw: "再發一條", id: "Kirim lagi" },

  // ---- sub-page: The Quarter ----
  "tq.heroH1": { en: "The Embassy", cn: "外交使馆", tw: "外交使館", id: "Kawasan" },
  "tq.heroH2": { en: "Quarter.", cn: "区。", tw: "區。", id: "Kedutaan." },
  "tq.heroSum": { en: "Half a square mile between the embassies, Royal Selangor Golf Club and KLCC — and nothing else like it in Kuala Lumpur.", cn: "半平方英里，坐落于使馆、雪兰莪皇家高尔夫俱乐部与吉隆坡城中城之间——在吉隆坡独一无二。", tw: "半平方英里，坐落於使館、雪蘭莪皇家高爾夫俱樂部與吉隆坡城中城之間——在吉隆坡獨一無二。", id: "Setengah mil persegi di antara kedutaan, Royal Selangor Golf Club, dan KLCC — tiada bandingnya di Kuala Lumpur." },
  "tq.oneNeighbourhood": { en: "One neighbourhood", cn: "同一个社区", tw: "同一個社區", id: "Satu kawasan" },
  "tq.sh1": { en: "A quiet, tree-lined", cn: "静谧、绿树成荫，", tw: "靜謐、綠樹成蔭，", id: "Kawasan hak milik" },
  "tq.sh2": { en: "quarter of freehold", cn: "永久地契庄园", tw: "永久地契莊園", id: "yang tenang, rindang," },
  "tq.sh3": { en: "estates that rarely", cn: "聚集之地，", tw: "聚集之地，", id: "yang jarang" },
  "tq.sh4": { en: "change hands.", cn: "鲜少易手。", tw: "鮮少易手。", id: "berpindah tangan." },
  "tq.location": { en: "The location", cn: "地理位置", tw: "地理位置", id: "Lokasi" },
  "tq.minutes": { en: "Minutes from everything.", cn: "与一切近在咫尺。", tw: "與一切近在咫尺。", id: "Semenit dari segalanya." },
  "tq.theCollection": { en: "The collection", cn: "臻选系列", tw: "臻選系列", id: "Koleksi" },
  "tq.findPlace": { en: "Find your place in U Thant.", cn: "在优唐，觅得归属。", tw: "在優唐，覓得歸屬。", id: "Temukan tempat Anda di U Thant." },

  // ---- sub-page: Investment ----
  "iv.theInvestment": { en: "The Investment", cn: "投资价值", tw: "投資價值", id: "Investasi" },
  "iv.heroH1": { en: "An address", cn: "保值传世", tw: "保值傳世", id: "Alamat yang" },
  "iv.heroH2": { en: "that holds.", cn: "的地段。", tw: "的地段。", id: "bertahan nilainya." },
  "iv.heroSum": { en: "95% freehold, scarce by nature and rarely on the market — the Embassy Quarter has held its value through every cycle. Model the numbers below.", cn: "95% 永久地契，天生稀缺，鲜少入市——使馆区历经周期始终保值。请于下方测算。", tw: "95% 永久地契，天生稀缺，鮮少入市——使館區歷經週期始終保值。請於下方試算。", id: "95% hak milik, langka secara alami dan jarang dijual — Kawasan Kedutaan mempertahankan nilainya di setiap siklus. Modelkan angkanya di bawah." },
  "iv.theCase": { en: "The case", cn: "投资逻辑", tw: "投資邏輯", id: "Argumennya" },
  "iv.scarcity1": { en: "Scarcity is the", cn: "稀缺，", tw: "稀缺，", id: "Kelangkaan adalah" },
  "iv.scarcity2": { en: "strategy.", cn: "即是策略。", tw: "即是策略。", id: "strateginya." },
  "iv.trackRecord": { en: "Track record", cn: "业绩记录", tw: "業績記錄", id: "Rekam jejak" },
  "iv.inWords": { en: "In their words", cn: "客户之声", tw: "客戶之聲", id: "Kata mereka" },
  "iv.speak": { en: "Speak with us", cn: "与我们洽谈", tw: "與我們洽談", id: "Bicara dengan kami" },
  "iv.privateConv": { en: "A private conversation, on your terms.", cn: "一场私密洽谈，全凭您的节奏。", tw: "一場私密洽談，全憑您的節奏。", id: "Percakapan pribadi, sesuai keinginan Anda." },
  "tq.sp1": { en: "U Thant is Kuala Lumpur's diplomatic enclave — held by families and missions for generations, and specialised in by people who work this half-square-mile and nothing else.", cn: "优唐是吉隆坡的外交使馆区——世代为名门与使馆所持有，由只专注于这半平方英里的人深耕。", tw: "優唐是吉隆坡的外交使館區——世代為名門與使館所持有，由只專注於這半平方英里的人深耕。", id: "U Thant adalah enklave diplomatik Kuala Lumpur — dimiliki keluarga dan kedutaan lintas generasi, digarap oleh mereka yang hanya fokus pada setengah mil persegi ini." },
  "tq.sp2": { en: "Every residence under mandate is measured and understood, so the right home reaches the right hands with the discretion the address deserves.", cn: "每一处受托府邸皆经丈量与深入了解，让合适的家以这一地段应有的审慎觅得合适的主人。", tw: "每一處受託府邸皆經丈量與深入了解，讓合適的家以這一地段應有的審慎覓得合適的主人。", id: "Setiap kediaman dalam mandat diukur dan dipahami, agar rumah yang tepat sampai ke tangan yang tepat dengan kebijaksanaan yang layak." },
  "tq.report": { en: "Read by 2,000+ subscribers — our quarterly U Thant market report tracks every transaction in the quarter.", cn: "逾 2,000 名订阅者阅读——我们的优唐季度市场报告追踪这一地段的每一宗成交。", tw: "逾 2,000 名訂閱者閱讀——我們的優唐季度市場報告追蹤這一地段的每一宗成交。", id: "Dibaca 2.000+ pelanggan — laporan pasar triwulanan U Thant kami melacak setiap transaksi di kawasan ini." },
  "iv.caseP1": { en: "Half a square mile, freehold, and finite. New supply in the quarter is measured in single digits, while demand from families, diplomats and funds is structural and enduring.", cn: "半平方英里，永久地契，且有限。这一地段的新增供应以个位数计，而来自名门、外交人士与基金的需求则结构性而持久。", tw: "半平方英里，永久地契，且有限。這一地段的新增供應以個位數計，而來自名門、外交人士與基金的需求則結構性而持久。", id: "Setengah mil persegi, hak milik, dan terbatas. Pasokan baru di kawasan ini hanya satuan, sementara permintaan dari keluarga, diplomat, dan dana bersifat struktural dan abadi." },
  "iv.caseP2": { en: "The result is an address that behaves less like a property market and more like a collector's asset — illiquid by design, and resilient because of it.", cn: "由此造就的地段，与其说是房地产市场，不如说更像收藏级资产——天生稀有，亦因稀有而坚韧。", tw: "由此造就的地段，與其說是房地產市場，不如說更像收藏級資產——天生稀有，亦因稀有而堅韌。", id: "Hasilnya adalah alamat yang berperilaku kurang seperti pasar properti dan lebih seperti aset kolektor — tidak likuid secara desain, dan tangguh karenanya." },
  "iv.report": { en: "Our quarterly market report — read by 2,000+ subscribers — tracks every transaction in the quarter, so your decisions are grounded in real evidence, not asking prices.", cn: "我们的季度市场报告——逾 2,000 名订阅者阅读——追踪这一地段的每一宗成交，让您的决策有据可依，而非凭挂牌价。", tw: "我們的季度市場報告——逾 2,000 名訂閱者閱讀——追蹤這一地段的每一宗成交，讓您的決策有據可依，而非憑掛牌價。", id: "Laporan pasar triwulanan kami — dibaca 2.000+ pelanggan — melacak setiap transaksi, agar keputusan Anda berdasar bukti nyata, bukan harga penawaran." },

  // ---- residence detail (fixed labels) ----
  "res.theResidence": { en: "The residence", cn: "府邸", tw: "府邸", id: "Kediaman" },
  "res.galleryHint": { en: "Drag to explore — click any frame to enlarge.", cn: "拖动浏览——点击任一画面可放大。", tw: "拖動瀏覽——點擊任一畫面可放大。", id: "Seret untuk menjelajah — klik bingkai mana pun untuk memperbesar." },
  "res.theLayout": { en: "The layout", cn: "户型布局", tw: "戶型佈局", id: "Tata letak" },
  "res.explore": { en: "Explore the residence.", cn: "探索这处府邸。", tw: "探索這處府邸。", id: "Jelajahi kediaman." },
  "res.homeH1": { en: "A home in the", cn: "安家于", tw: "安家於", id: "Rumah di" },
  "res.homeH2": { en: "Embassy Quarter.", cn: "外交使馆区。", tw: "外交使館區。", id: "Kawasan Kedutaan." },
  "res.next": { en: "Next residence", cn: "下一处府邸", tw: "下一處府邸", id: "Kediaman berikutnya" },
  "res.enquire": { en: "Enquire", cn: "咨询", tw: "諮詢", id: "Tanya" },
};

const KEY = "ut_locale";

export function getLocale(): LocaleKey {
  if (typeof window === "undefined") return "en";
  const v = localStorage.getItem(KEY) || document.cookie.match(/(?:^|; )ut_locale=([^;]+)/)?.[1];
  return v && v in LOCALES ? (v as LocaleKey) : "en";
}

/** Whether the visitor has an explicit saved locale (vs. defaulting). */
export function hasSavedLocale(): boolean {
  if (typeof window === "undefined") return true;
  return !!(localStorage.getItem(KEY) || document.cookie.match(/(?:^|; )ut_locale=/));
}

/** Map an ISO-3166 country code to a supported locale. */
export function countryToLocale(cc: string): LocaleKey {
  switch ((cc || "").toUpperCase()) {
    case "CN":
      return "cn";
    case "TW":
    case "HK":
    case "MO":
      return "tw";
    case "ID":
      return "id";
    case "SG":
      return "sg";
    default:
      return "en"; // Malaysia + everywhere else
  }
}

export function setLocale(loc: LocaleKey) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, loc);
  document.cookie = `ut_locale=${loc}; path=/; max-age=${60 * 60 * 24 * 365}`;
  applyLocale(loc);
  window.dispatchEvent(new Event("localechange"));
}

export function money(myr: number, loc: LocaleKey = getLocale(), opts: { compact?: boolean } = {}) {
  const c = LOCALES[loc].cur;
  const v = myr * c.rate;
  const sym = c.symbol + (c.spaced ? " " : "");
  if (opts.compact) {
    if (v >= 1e9) return sym + (v / 1e9).toLocaleString(undefined, { maximumFractionDigits: 1 }) + "B";
    if (v >= 1e6) return sym + (v / 1e6).toLocaleString(undefined, { maximumFractionDigits: 1 }) + "M";
    if (v >= 1e3) return sym + (v / 1e3).toLocaleString(undefined, { maximumFractionDigits: 0 }) + "K";
  }
  return sym + Math.round(v).toLocaleString();
}

export function translate(key: string, loc: LocaleKey = getLocale()) {
  const e = DICT[key];
  if (!e) return key;
  return e[LOCALES[loc].t] ?? e.en;
}

// remembers each element's original (English) HTML so we can restore it
const ORIG = new WeakMap<Element, string>();

// per-language overrides for admin-editable content (from /api/i18n-content)
type ContentMap = Partial<Record<DictLang, Record<string, string>>>;
let CONTENT: ContentMap = {};
export function setContentI18n(map: ContentMap) {
  CONTENT = map || {};
  applyLocale();
}

/** Apply the active locale to the DOM (static text + prices + editable content). */
export function applyLocale(loc: LocaleKey = getLocale()) {
  if (typeof document === "undefined") return;
  const lang = LOCALES[loc].t;
  document.documentElement.lang = LOCALES[loc].lang;

  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    if (!ORIG.has(el)) ORIG.set(el, el.innerHTML);
    if (lang === "en") {
      el.innerHTML = ORIG.get(el)!; // restore original markup for English
    } else {
      el.textContent = translate(el.dataset.i18n!, loc);
    }
  });

  // admin-editable content overrides (falls back to English original when absent)
  document.querySelectorAll<HTMLElement>("[data-i18n-content]").forEach((el) => {
    if (!ORIG.has(el)) ORIG.set(el, el.innerHTML);
    const key = el.dataset.i18nContent!;
    const val = lang !== "en" ? CONTENT[lang]?.[key] : undefined;
    if (val && val.trim()) el.textContent = val;
    else el.innerHTML = ORIG.get(el)!;
  });
  document.querySelectorAll<HTMLElement>("[data-myr]").forEach((el) => {
    const myr = parseFloat(el.dataset.myr || "0");
    el.textContent = money(myr, loc, { compact: el.hasAttribute("data-compact") });
  });
  document.querySelectorAll<HTMLElement>("[data-myr-range]").forEach((el) => {
    const [a, b] = (el.dataset.myrRange || "0,0").split(",").map(Number);
    el.textContent = money(a, loc, { compact: true }) + "–" + money(b, loc, { compact: true });
  });
}

/** Hook for React islands — re-renders on locale change. */
export function useI18n() {
  const [loc, setLoc] = useState<LocaleKey>("en");
  useEffect(() => {
    setLoc(getLocale());
    const h = () => setLoc(getLocale());
    window.addEventListener("localechange", h);
    return () => window.removeEventListener("localechange", h);
  }, []);
  return {
    loc,
    locale: LOCALES[loc],
    t: (k: string) => translate(k, loc),
    money: (myr: number, opts?: { compact?: boolean }) => money(myr, loc, opts),
  };
}
