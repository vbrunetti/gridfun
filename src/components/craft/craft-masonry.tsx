"use client";

import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";

/** Must match `.craft-masonry { gap }` and `grid-auto-rows` in globals.css */
const MASONRY_ROW_UNIT_PX = 6;

const COLUMN_BREAKPOINTS = [
  { minWidth: 1024, columns: 4 },
  { minWidth: 640, columns: 3 },
  { minWidth: 0, columns: 2 },
] as const;

type MasonryPlacement = {
  gridColumn: string;
  gridRowStart: number;
  gridRowEnd: string;
};

function useMasonryColumnCount() {
  const [columns, setColumns] = useState(2);

  useEffect(() => {
    const mqs = COLUMN_BREAKPOINTS.map(({ minWidth, columns: cols }) => ({
      mq: window.matchMedia(`(min-width: ${minWidth}px)`),
      cols,
    }));

    const sync = () => {
      for (const { mq, cols } of mqs) {
        if (mq.matches) {
          setColumns(cols);
          return;
        }
      }
    };

    sync();
    for (const { mq } of mqs) {
      mq.addEventListener("change", sync);
    }
    return () => {
      for (const { mq } of mqs) {
        mq.removeEventListener("change", sync);
      }
    };
  }, []);

  return columns;
}

/** Stories 01, 02, 03… left to right, wrapping rows; per-column row tracking. */
function computePlacements(
  entries: { id: string; span: number }[],
  columnCount: number,
): MasonryPlacement[] {
  const track = Array.from({ length: columnCount }, () => 1);

  return entries.map((entry, index) => {
    const col = index % columnCount;
    const rowStart = track[col];
    const span = entry.span;
    track[col] = rowStart + span;

    return {
      gridColumn: String(col + 1),
      gridRowStart: rowStart,
      gridRowEnd: `span ${span}`,
    };
  });
}

function MasonryItem({
  children,
  itemKey,
  placement,
  onSpan,
}: {
  children: ReactNode;
  itemKey: string;
  placement: MasonryPlacement;
  onSpan: (key: string, span: number) => void;
}) {
  const observerRef = useRef<ResizeObserver | null>(null);

  const measureRef = useCallback(
    (node: HTMLDivElement | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;

      if (!node) return;

      const applySpan = () => {
        const grid = node.parentElement;
        const styles = grid ? getComputedStyle(grid) : null;
        const gap = styles
          ? Number.parseFloat(styles.rowGap || "0") || 0
          : 0;
        const height = node.getBoundingClientRect().height;
        const span = Math.ceil(
          (height + gap) / (MASONRY_ROW_UNIT_PX + gap),
        );
        onSpan(itemKey, Math.max(1, span));
      };

      applySpan();
      const observer = new ResizeObserver(applySpan);
      observer.observe(node);
      observerRef.current = observer;
    },
    [itemKey, onSpan],
  );

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div
      ref={measureRef}
      className="craft-masonry-item"
      data-masonry-key={itemKey}
      style={{
        gridColumn: placement.gridColumn,
        gridRowStart: placement.gridRowStart,
        gridRowEnd: placement.gridRowEnd,
      }}
    >
      {children}
    </div>
  );
}

type CraftMasonryProps = {
  children: ReactNode;
};

/**
 * Masonry via CSS Grid — tiles in DOM order, left to right, row wrap.
 */
export function CraftMasonry({ children }: CraftMasonryProps) {
  const columnCount = useMasonryColumnCount();
  const [spans, setSpans] = useState<Record<string, number>>({});

  const items = Children.toArray(children).filter(isValidElement) as ReactElement[];

  const entries = useMemo(
    () =>
      items.map((child, index) => ({
        id: String(child.key ?? `masonry-${index}`),
        span: spans[String(child.key ?? `masonry-${index}`)] ?? 1,
      })),
    [items, spans],
  );

  const placements = useMemo(
    () => computePlacements(entries, columnCount),
    [entries, columnCount],
  );

  const handleSpan = useCallback((key: string, span: number) => {
    setSpans((prev) => (prev[key] === span ? prev : { ...prev, [key]: span }));
  }, []);

  return (
    <div
      className="craft-masonry"
      style={{ "--craft-cols": columnCount } as CSSProperties}
      aria-live="polite"
    >
      {items.map((child, index) => {
        const id = String(child.key ?? `masonry-${index}`);
        return (
          <MasonryItem
            key={id}
            itemKey={id}
            placement={placements[index]}
            onSpan={handleSpan}
          >
            {child}
          </MasonryItem>
        );
      })}
    </div>
  );
}
