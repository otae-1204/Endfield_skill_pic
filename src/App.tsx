import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EditorPanel } from "./components/Editor";
import { SkillCardView } from "./components/SkillCard";
import { DEFAULT_PACK, SLOT_LABELS } from "./data/defaultPack";
import { exportElementAsPng, filenameForCard } from "./lib/exportPng";
import {
  applyManualStyle,
  parseRichText,
  tokensToText,
} from "./lib/richText";
import {
  cardBodyText,
  downloadBlob,
  downloadText,
  loadPack,
  normalizePack,
  packToJson,
  readTextFile,
  savePack,
  validatePack,
} from "./lib/storage";
import type { EditableCardPatch, SkillCard, SkillPack, SkillSlot, TokenStyle } from "./types";
import "./styles.css";

type Notice = {
  tone: "success" | "error" | "info";
  message: string;
};

function clonePack(pack: SkillPack): SkillPack {
  return structuredClone(pack);
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function useDraftPersistence(pack: SkillPack, onSaved: (date: Date) => void) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        savePack(pack);
        onSaved(new Date());
      } catch {
        // The editor remains usable if localStorage is unavailable (for example in
        // a locked-down browser profile). The export and JSON flows still work.
      }
    }, 180);

    return () => window.clearTimeout(timer);
  }, [onSaved, pack]);
}

export default function App() {
  const [pack, setPack] = useState<SkillPack>(() => loadPack());
  const [activeSlot, setActiveSlot] = useState<SkillSlot>("normalAttack");
  const [notice, setNotice] = useState<Notice>({
    tone: "info",
    message: "编辑内容会自动保存在本机",
  });
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [exporting, setExporting] = useState<SkillSlot | "all" | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const exportRefs = useRef<Partial<Record<SkillSlot, HTMLDivElement | null>>>({});

  const cards = pack.cards;
  const activeCard = cards.find((card) => card.slot === activeSlot) ?? cards[0];

  const setExportRef = useCallback(
    (slot: SkillSlot) => (element: HTMLDivElement | null) => {
      exportRefs.current[slot] = element;
    },
    [],
  );

  const updateCard = useCallback((slot: SkillSlot, patch: EditableCardPatch) => {
    setPack((current) => ({
      ...current,
      cards: current.cards.map((card) =>
        card.slot === slot ? { ...card, ...patch } : card,
      ) as SkillPack["cards"],
    }));
  }, []);

  const updateBodyStyle = useCallback(
    (slot: SkillSlot, start: number, end: number, style: TokenStyle) => {
      setPack((current) => ({
        ...current,
        cards: current.cards.map((card) =>
          card.slot === slot
            ? { ...card, body: applyManualStyle(card.body, start, end, style) }
            : card,
        ) as SkillPack["cards"],
      }));
    },
    [],
  );

  const handleSaved = useCallback((date: Date) => {
    setLastSavedAt(date);
  }, []);

  useDraftPersistence(pack, handleSaved);

  useEffect(() => {
    if (lastSavedAt) {
      setNotice({ tone: "success", message: `已保存至本机 · ${formatTime(lastSavedAt)}` });
    }
  }, [lastSavedAt]);

  const previewMeta = useMemo(
    () => ({
      count: cards.length,
      bodyLength: cards.reduce((total, card) => total + cardBodyText(card).length, 0),
    }),
    [cards],
  );

  const handleExportCard = useCallback(
    async (card: SkillCard) => {
      const element = exportRefs.current[card.slot];
      if (!element) {
        setNotice({ tone: "error", message: "找不到当前卡片的渲染节点，请刷新后重试" });
        return;
      }

      setExporting(card.slot);
      setNotice({ tone: "info", message: `正在生成 ${card.title || "未命名卡片"}…` });
      try {
        const blob = await exportElementAsPng(element, pack.render.scale);
        downloadBlob(blob, filenameForCard(cards.indexOf(card), card.title, pack.render.scale));
        setNotice({
          tone: "success",
          message: `${card.title || "未命名卡片"} 已导出 · ${pack.render.baseWidth * pack.render.scale}px`,
        });
      } catch (error) {
        const detail = error instanceof Error ? error.message : "未知错误";
        setNotice({ tone: "error", message: `导出失败：${detail}` });
      } finally {
        setExporting(null);
      }
    },
    [cards, pack.render.baseWidth, pack.render.scale],
  );

  const handleExportAll = useCallback(async () => {
    setExporting("all");
    setNotice({ tone: "info", message: "正在逐张生成六张 PNG…" });
    try {
      for (const [index, card] of cards.entries()) {
        const element = exportRefs.current[card.slot];
        if (!element) throw new Error(`第 ${index + 1} 张卡片渲染节点不存在`);
        const blob = await exportElementAsPng(element, pack.render.scale);
        downloadBlob(blob, filenameForCard(index, card.title, pack.render.scale));
      }
      setNotice({ tone: "success", message: "六张卡片已全部导出" });
    } catch (error) {
      const detail = error instanceof Error ? error.message : "未知错误";
      setNotice({ tone: "error", message: `导出失败，当前数据已保留：${detail}` });
    } finally {
      setExporting(null);
    }
  }, [cards, pack.render.scale]);

  const handleImport = useCallback(async (file: File) => {
    try {
      const text = await readTextFile(file);
      const parsed: unknown = JSON.parse(text);
      const issues = validatePack(parsed);
      if (issues.length) {
        setNotice({ tone: "error", message: `导入失败：${issues[0]}` });
        return;
      }
      setPack(normalizePack(parsed));
      setActiveSlot("normalAttack");
      setNotice({ tone: "success", message: "SkillPack v1 已导入" });
    } catch (error) {
      const detail = error instanceof Error ? error.message : "文件不是有效 JSON";
      setNotice({ tone: "error", message: `导入失败：${detail}` });
    } finally {
      if (importInputRef.current) importInputRef.current.value = "";
    }
  }, []);

  const handleReset = useCallback(() => {
    const confirmed = window.confirm("恢复六张示例卡片？当前草稿会被覆盖。");
    if (!confirmed) return;
    setPack(clonePack(DEFAULT_PACK));
    setActiveSlot("normalAttack");
    setNotice({ tone: "success", message: "已恢复示例卡片" });
  }, []);

  const setScale = (scale: 1 | 2) => {
    setPack((current) => ({ ...current, render: { ...current.render, scale } }));
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div>
            <div className="brand-kicker">ENDFIELD / UI LAB</div>
            <h1>六卡技能展示生成器</h1>
          </div>
        </div>

        <div className="topbar-actions">
          <span className="connection-state"><i />离线可用</span>
          <button className="ghost-button" type="button" onClick={handleReset}>
            恢复示例
          </button>
          <button className="ghost-button" type="button" onClick={() => importInputRef.current?.click()}>
            导入 JSON
          </button>
          <button
            className="solid-button"
            type="button"
            onClick={() => downloadText(packToJson(pack), "skill-pack-v1.json", "application/json")}
          >
            导出 JSON
          </button>
          <input
            ref={importInputRef}
            className="visually-hidden"
            type="file"
            accept="application/json,.json"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleImport(file);
            }}
          />
        </div>
      </header>

      <main className="app-main">
        <EditorPanel
          cards={cards}
          activeSlot={activeSlot}
          onSelect={setActiveSlot}
          onUpdate={updateCard}
          onApplyStyle={updateBodyStyle}
        />

        <section className="preview-panel" aria-label="技能卡预览">
          <div className="preview-heading">
            <div>
              <span className="eyebrow">LIVE PREVIEW / 01—06</span>
              <h2>展示画面</h2>
              <p>同一套卡片 DOM 同时用于实时预览与 PNG 导出。</p>
            </div>
            <div className="preview-controls">
              <div className="scale-switch" aria-label="导出倍率">
                <span>输出</span>
                {[1, 2].map((scale) => (
                  <button
                    key={scale}
                    type="button"
                    className={pack.render.scale === scale ? "is-active" : ""}
                    onClick={() => setScale(scale as 1 | 2)}
                  >
                    {scale}×
                  </button>
                ))}
              </div>
              <button
                className="export-button"
                type="button"
                disabled={exporting !== null}
                onClick={() => void handleExportAll()}
              >
                {exporting === "all" ? "生成中…" : "导出六张 PNG"}
                <span>↗</span>
              </button>
            </div>
          </div>

          <div className="preview-meta-row">
            <span><i className="meta-dot" />{previewMeta.count} cards ready</span>
            <span>{previewMeta.bodyLength} 字符 · 自动增高</span>
            <span>透明圆角 · {pack.render.baseWidth * pack.render.scale}px 输出</span>
          </div>

          <div className="preview-grid">
            {cards.map((card, index) => (
              <div
                className={`preview-card-shell${card.slot === activeSlot ? " is-active" : ""}`}
                key={card.slot}
              >
                <div className="preview-card-index">0{index + 1} / {SLOT_LABELS[card.slot]}</div>
                <SkillCardView
                  card={card}
                  selected={card.slot === activeSlot}
                  onSelect={() => setActiveSlot(card.slot)}
                />
                <button
                  type="button"
                  className="card-export-link"
                  disabled={exporting !== null}
                  onClick={() => void handleExportCard(card)}
                >
                  {exporting === card.slot ? "生成中…" : "导出此卡"} <span>↗</span>
                </button>
              </div>
            ))}
          </div>

          <div className="export-stage" aria-hidden="true">
            {cards.map((card) => (
              <div className="export-stage-card" key={card.slot} ref={setExportRef(card.slot)}>
                <SkillCardView card={card} />
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="font-attribution">
        本应用使用 HarmonyOS Sans 字体 · Copyright © 2021 Huawei Device Co., Ltd.
      </footer>

      <div className={`notice notice-${notice.tone}`} role="status">
        <span className="notice-led" />
        {notice.message}
        {lastSavedAt ? <small>{formatTime(lastSavedAt)}</small> : null}
      </div>

      <nav className="mobile-action-bar" aria-label="移动端导出操作">
        <button type="button" onClick={() => void handleExportCard(activeCard)} disabled={exporting !== null}>
          <span>↓</span>导出当前卡
        </button>
        <button type="button" onClick={() => void handleExportAll()} disabled={exporting !== null}>
          <span>⇩</span>导出六张
        </button>
      </nav>
    </div>
  );
}
