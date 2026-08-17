import { useEffect, useRef, useState, type RefObject } from "react";
import type { SkillCard, SkillSlot, TokenStyle } from "../types";
import {
  parseRichText,
  TOKEN_COLORS,
  TOKEN_LABELS,
  tokensToEditorText,
} from "../lib/richText";
import { SLOT_IDS } from "../types";

type EditorProps = {
  cards: SkillCard[];
  activeSlot: SkillSlot;
  onSelect: (slot: SkillSlot) => void;
  onUpdate: (slot: SkillSlot, patch: Partial<SkillCard>) => void;
  onApplyStyle: (slot: SkillSlot, start: number, end: number, style: TokenStyle) => void;
};

const styleOptions: TokenStyle[] = ["damage", "state", "healing", "number", "link", "plain"];

function StyleToolbar({
  textareaRef,
  onApply,
}: {
  textareaRef: RefObject<HTMLTextAreaElement>;
  onApply: (style: TokenStyle, start: number, end: number) => void;
}) {
  const apply = (style: TokenStyle) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    onApply(style, textarea.selectionStart, textarea.selectionEnd);
    textarea.focus();
  };

  return (
    <div className="style-toolbar" aria-label="富文本工具栏">
      <span className="toolbar-label">标注</span>
      {styleOptions.map((style) => (
        <button
          key={style}
          type="button"
          className={`style-tool style-tool-${style}`}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => apply(style)}
          title={`将选中文字标记为${TOKEN_LABELS[style]}`}
        >
          <i style={{ backgroundColor: TOKEN_COLORS[style] }} />
          {TOKEN_LABELS[style]}
        </button>
      ))}
    </div>
  );
}

function CardTabs({ cards, activeSlot, onSelect }: Pick<EditorProps, "cards" | "activeSlot" | "onSelect">) {
  return (
    <div className="card-tabs" role="tablist" aria-label="六张技能卡">
      {cards.map((card, index) => (
        <button
          key={card.slot}
          type="button"
          role="tab"
          aria-selected={card.slot === activeSlot}
          className={`card-tab${card.slot === activeSlot ? " is-active" : ""}`}
          onClick={() => onSelect(card.slot)}
        >
          <span className="card-tab-index">0{index + 1}</span>
          <span>{card.title || "未命名"}</span>
        </button>
      ))}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string | number | undefined;
  onChange: (value: string) => void;
  type?: "text" | "number";
  placeholder?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function FooterEditor({
  card,
  onChange,
}: {
  card: SkillCard;
  onChange: (rows: NonNullable<SkillCard["footerRows"]>) => void;
}) {
  const rows = card.footerRows ?? [];
  return (
    <div className="footer-editor">
      <div className="section-heading-row">
        <div>
          <span className="eyebrow">FOOTER</span>
          <h3>底部参数</h3>
        </div>
        <button
          type="button"
          className="text-button"
          onClick={() => onChange([...rows, { label: "参数", value: "0" }])}
        >
          + 添加一行
        </button>
      </div>
      {rows.length ? (
        <div className="footer-row-editor-list">
          {rows.map((row, index) => (
            <div className="footer-row-editor" key={`${index}-${row.label}`}>
              <input
                aria-label={`第 ${index + 1} 行标签`}
                value={row.label}
                onChange={(event) => {
                  const next = rows.map((item, rowIndex) =>
                    rowIndex === index ? { ...item, label: event.target.value } : item,
                  );
                  onChange(next);
                }}
              />
              <input
                aria-label={`第 ${index + 1} 行数值`}
                value={row.value}
                onChange={(event) => {
                  const next = rows.map((item, rowIndex) =>
                    rowIndex === index ? { ...item, value: event.target.value } : item,
                  );
                  onChange(next);
                }}
              />
              <button
                type="button"
                className="icon-button danger"
                aria-label={`删除第 ${index + 1} 行`}
                onClick={() => onChange(rows.filter((_, rowIndex) => rowIndex !== index))}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-note">该卡片没有底部参数行。</p>
      )}
    </div>
  );
}

export function EditorPanel({ cards, activeSlot, onSelect, onUpdate, onApplyStyle }: EditorProps) {
  const card = cards.find((item) => item.slot === activeSlot) ?? cards[0];
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [bodyDraft, setBodyDraft] = useState(tokensToEditorText(card.body));

  useEffect(() => {
    setBodyDraft(tokensToEditorText(card.body));
  }, [card.slot, card.body]);

  return (
    <aside className="editor-panel">
      <div className="editor-panel-topline">
        <div>
          <span className="eyebrow">CARD EDITOR</span>
          <h2>技能卡编辑器</h2>
        </div>
        <span className="draft-status"><i />本地草稿</span>
      </div>

      <CardTabs cards={cards} activeSlot={activeSlot} onSelect={onSelect} />

      <div className="editor-scroll">
        <section className="editor-section">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">HEADER</span>
              <h3>卡片头部</h3>
            </div>
            <span className="slot-badge">{SLOT_IDS.indexOf(card.slot) + 1} / 6</span>
          </div>
          <div className="field-grid">
            <Field
              label="技能名称"
              value={card.title}
              placeholder="例如：疾风击"
              onChange={(value) => onUpdate(card.slot, { title: value })}
            />
            <Field
              label="右上角类型"
              value={card.typeLabel}
              placeholder="例如：战技"
              onChange={(value) => onUpdate(card.slot, { typeLabel: value })}
            />
            <Field
              label="等级"
              value={card.rank}
              type="number"
              onChange={(value) =>
                onUpdate(card.slot, { rank: value ? Number(value) : undefined })
              }
            />
            <Field
              label="副标题"
              value={card.subtitle}
              placeholder="可选，例如：节点"
              onChange={(value) => onUpdate(card.slot, { subtitle: value || undefined })}
            />
          </div>
          {card.subtitle && (
            <label className="field compact-field">
              <span>节点标记数量</span>
              <input
                type="number"
                min={0}
                max={4}
                value={card.nodeMarks ?? 0}
                onChange={(event) =>
                  onUpdate(card.slot, { nodeMarks: Math.max(0, Number(event.target.value)) })
                }
              />
            </label>
          )}
        </section>

        <section className="editor-section body-section">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">RICH TEXT</span>
              <h3>正文内容</h3>
            </div>
          <span className="hint-chip">支持 API 富文本标签</span>
          </div>
          <StyleToolbar
            textareaRef={textareaRef}
            onApply={(style, start, end) => onApplyStyle(card.slot, start, end, style)}
          />
          <textarea
            ref={textareaRef}
            className="body-input"
            value={bodyDraft}
            onChange={(event) => {
              setBodyDraft(event.target.value);
              onUpdate(card.slot, {
                body: parseRichText(event.target.value),
              });
            }}
            spellCheck={false}
            aria-label="技能正文"
          />
          <p className="editor-help">可直接粘贴 &lt;@ba.pulse&gt;电磁伤害&lt;/&gt; 或 &lt;image=&quot;...&quot; /&gt; 标签；普通中文关键词也会自动着色并显示对应图标。</p>
        </section>

        <section className="editor-section">
          <FooterEditor
            card={card}
            onChange={(footerRows) => onUpdate(card.slot, { footerRows })}
          />
        </section>
      </div>
    </aside>
  );
}
