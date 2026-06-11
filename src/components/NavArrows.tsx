import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavArrowsProps {
  onBack?: () => void;
  onForward?: () => void;
  backLabel?: string;
  forwardLabel?: string;
}

/**
 * Page navigation arrows — vertically centered on the left/right edges so they
 * stay clear of the cluttered top/bottom and read the same way on every screen
 * and every app: left = go back, right = go forward.
 */
export const NavArrows = ({ onBack, onForward, backLabel = "BACK", forwardLabel = "NEXT" }: NavArrowsProps) => {
  const pill = {
    background: 'hsl(0 0% 5% / 0.7)',
    backdropFilter: 'blur(8px)',
    border: '1px solid hsl(45 60% 40% / 0.3)',
  } as const;
  const gold = { color: 'hsl(45 80% 55%)' } as const;

  return (
    <>
      {/* BACK — left edge, vertically centered */}
      {onBack && (
        <button
          onClick={onBack}
          className="group fixed left-4 top-1/2 -translate-y-1/2 z-50 flex items-center gap-1.5 px-3 py-3 rounded-full transition-all duration-300 hover:opacity-100 opacity-60"
          style={pill}
          title={backLabel}
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" style={gold} />
          <span className="font-terminal text-[10px] tracking-[0.2em] uppercase pr-1" style={gold}>
            {backLabel}
          </span>
        </button>
      )}

      {/* FORWARD — right edge, vertically centered */}
      {onForward && (
        <button
          onClick={onForward}
          className="group fixed right-4 top-1/2 -translate-y-1/2 z-50 flex items-center gap-1.5 px-3 py-3 rounded-full transition-all duration-300 hover:opacity-100 opacity-60"
          style={pill}
          title={forwardLabel}
        >
          <span className="font-terminal text-[10px] tracking-[0.2em] uppercase pl-1" style={gold}>
            {forwardLabel}
          </span>
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" style={gold} />
        </button>
      )}
    </>
  );
};
