import React, { useEffect, useRef } from "react";
import SignaturePad from "signature_pad";

interface Props {
  onCheck: (isValid: boolean) => void;
}

const KanjiWritingPad: React.FC<Props> = ({ onCheck }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    padRef.current = new SignaturePad(canvasRef.current, {
      minWidth: 2,
      maxWidth: 4,
      penColor: "black"
    });

    return () => {
      padRef.current?.off();
    };
  }, []);

  const clear = () => {
    padRef.current?.clear();
  };

const check = () => {
  if (!padRef.current || padRef.current.isEmpty()) {
    onCheck(false);
    return;
  }

  const data = padRef.current.toData();

  let totalPoints = 0;
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  data.forEach(stroke => {
    totalPoints += stroke.points.length;

    stroke.points.forEach(p => {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    });
  });

  const width = maxX - minX;
  const height = maxY - minY;
  const area = width * height;

  // ---- HEURISTIC RULES ----
  const enoughInk = totalPoints >= 40;        // effort
  const enoughSize = width >= 100 && height >= 100; // uses canvas
  const notLine = area >= 8000;               // not a straight line

  const isValid = enoughInk && enoughSize && notLine;

  onCheck(isValid);
};

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        width={280}
        height={280}
        className="border rounded-xl bg-white mx-auto"
      />

      <div className="flex gap-3 justify-center">
        <button
          onClick={clear}
          className="px-4 py-2 bg-gray-100 rounded-lg"
        >
          Clear
        </button>

        <button
          onClick={check}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg"
        >
          Check
        </button>
      </div>
    </div>
  );
};

export default KanjiWritingPad;
