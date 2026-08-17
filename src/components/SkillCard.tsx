import { forwardRef, type MouseEvent } from "react";
import type { SkillCard as SkillCardData, RichToken } from "../types";
import { tokenClass } from "../lib/richText";

type SkillCardProps = {
  card: SkillCardData;
  selected?: boolean;
  onSelect?: () => void;
};

const MASTERY_UNIT_POINTS = [
  [
    "mastery-left",
    "156.01,449.99 243.22,325.05 377.80,324.95 424.37,450.01 377.85,575.03 243.17,574.96",
  ],
  [
    "mastery-bottom",
    "597.00,704.61 445.15,691.59 377.85,575.03 462.80,472.17 594.35,450.03 661.65,566.59",
  ],
  [
    "mastery-right",
    "596.99,195.39 661.63,333.36 594.35,450.03 462.83,427.81 377.80,324.95 445.18,208.45",
  ],
] as const;

function SkillMastery({ rank }: { rank: number }) {
  const mastery = rank >= 12 ? 3 : rank >= 10 ? rank - 9 : 0;
  const label = mastery ? `M${mastery}` : `Lv${rank}`;
  return (
    <span className={`skill-mastery mastery-${mastery}`} aria-label={label}>
      <svg viewBox="130 170 560 560" aria-hidden="true">
        {MASTERY_UNIT_POINTS.map(([className, points]) => (
          <polygon key={className} className={`mastery-unit ${className}`} points={points} />
        ))}
      </svg>
    </span>
  );
}

function RichTokenView({ token, piece, pieceIndex }: { token: RichToken; piece: string; pieceIndex: number }) {
  const colorStyle = token.color ? { color: token.color } : undefined;
  const textStyle = {
    ...colorStyle,
    textDecorationLine: token.underline ? ("underline" as const) : undefined,
    fontWeight: token.bold ? 650 : undefined,
  };
  return (
    <span className={tokenClass(token.style)} style={textStyle} data-manual={token.manual ? "true" : undefined}>
      {pieceIndex === 0 && token.iconSrc ? (
        <img
          className="rich-token-icon"
          src={token.iconSrc}
          alt=""
          aria-hidden="true"
          style={{ transform: `scale(${token.iconScale ?? 1})` }}
        />
      ) : null}
      {piece}
    </span>
  );
}

function RichBody({ tokens }: { tokens: RichToken[] }) {
  return (
    <div className="skill-card-body">
      {tokens.map((token, tokenIndex) => {
        const pieces = token.text.split("\n");
        if (!token.text && token.iconSrc) {
          return (
            <span className="rich-token-icon-only" key={`${tokenIndex}-icon`}>
              <img
                className="rich-token-icon"
                src={token.iconSrc}
                alt=""
                aria-hidden="true"
                style={{ transform: `scale(${token.iconScale ?? 1})` }}
              />
            </span>
          );
        }
        return pieces.map((piece, pieceIndex) => (
          <span key={`${tokenIndex}-${pieceIndex}`}>
            {piece && (
              <RichTokenView token={token} piece={piece} pieceIndex={pieceIndex} />
            )}
            {pieceIndex < pieces.length - 1 && <br />}
          </span>
        ));
      })}
    </div>
  );
}

export const SkillCardView = forwardRef<HTMLDivElement, SkillCardProps>(
  function SkillCardView({ card, selected = false, onSelect }, ref) {
    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      onSelect?.();
    };

    return (
      <div
        ref={ref}
        className={`skill-card${selected ? " is-selected" : ""}`}
        data-testid={`skill-card-${card.slot}`}
        data-slot={card.slot}
        onClick={handleClick}
        role={onSelect ? "button" : undefined}
        tabIndex={onSelect ? 0 : undefined}
        onKeyDown={(event) => {
          if (onSelect && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            onSelect();
          }
        }}
      >
        <div className="card-signal" aria-hidden="true">
          <img className="signal-ring" src="/assets/charinfo/deco_circle_yellow02.png" alt="" />
          <img className="signal-decoration" src="/assets/charinfo/deco_icon02.png" alt="" />
        </div>

        <div className="skill-card-header">
          <div className="skill-card-title-block">
            <div className="skill-card-title">{card.title || "未命名技能"}</div>
            {card.rank !== undefined && (
              <div className="skill-card-rank-line">
                <span className="rank-decoration-layer" aria-hidden="true">
                  <img
                    className="rank-decoration-shadow"
                    src="/assets/charinfo/deco_skillline_08.png"
                    alt=""
                  />
                  <img
                    className="rank-decoration-image"
                    src="/assets/charinfo/deco_skillline_08.png"
                    alt=""
                  />
                  <span className="rank-decoration-cracks" aria-hidden="true">
                    <i className="rank-crack rank-crack-1" />
                    <i className="rank-crack rank-crack-2" />
                    <i className="rank-crack rank-crack-3" />
                    <i className="rank-crack rank-crack-4" />
                  </span>
                </span>
                <span className="rank-decoration-ring" aria-hidden="true" />
                <SkillMastery rank={card.rank} />
                <span className="skill-card-rank">RANK {card.rank}</span>
              </div>
            )}
          </div>
          <div className="skill-card-kind">{card.typeLabel || "技能"}</div>
          <div className="skill-card-chevron" aria-hidden="true">
            <span />
            <span />
          </div>
        </div>

        <div className="skill-card-divider" />

        {card.subtitle && (
          <div className="skill-card-subtitle">
            <span>{card.subtitle}</span>
            {card.nodeMarks ? (
              <span className="node-marks" aria-label={`${card.nodeMarks} 个节点标记`}>
                {Array.from({ length: card.nodeMarks }).map((_, index) => (
                  <i key={index} />
                ))}
              </span>
            ) : null}
          </div>
        )}

        <RichBody tokens={card.body} />

        {card.footerRows?.length ? (
          <div className="skill-card-footer">
            {card.footerRows.map((row, index) => (
              <div className="skill-card-footer-row" key={`${row.label}-${index}`}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  },
);
