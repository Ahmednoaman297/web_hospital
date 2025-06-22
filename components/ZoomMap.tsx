import React, { useRef, useState } from 'react';

interface ZoomableMapProps {
  src: string;              // path to your map image
  minZoom?: number;         // e.g. 0.5
  maxZoom?: number;         // e.g. 2
  initialZoom?: number;     // e.g. 1
  heightClass?: string;     // Tailwind height class, e.g. "h-96"
}

export const ZoomableMap: React.FC<ZoomableMapProps> = ({
  src,
  minZoom = 0.5,
  maxZoom = 2,
  initialZoom = 1,
  heightClass = 'h-80',
}) => {
  const [zoom, setZoom] = useState(initialZoom);

  return (
    <div className="space-y-2">
      {/* 1) Viewport */}
      <div
        className={`relative overflow-hidden w-full ${heightClass} rounded-lg border border-slate-600`}
      >
        {/* 2) Centered & scaled image */}
        <img
          src={src}
          alt="Map"
          draggable={false}
          className="absolute top-1/2 left-1/2 select-none"
          style={{
            transform: `translate(-50%, -50%) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        />
      </div>

      {/* 3) Zoom controls */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setZoom(z => Math.max(minZoom, z - 0.1))}
          disabled={zoom <= minZoom}
          className="px-2 py-1 bg-slate-700 rounded disabled:opacity-50"
        >
          – Zoom Out
        </button>
        <input
          type="range"
          min={minZoom}
          max={maxZoom}
          step={0.01}
          value={zoom}
          onChange={e => setZoom(Number(e.target.value))}
          className="flex-1"
        />
        <button
          onClick={() => setZoom(z => Math.min(maxZoom, z + 0.1))}
          disabled={zoom >= maxZoom}
          className="px-2 py-1 bg-slate-700 rounded disabled:opacity-50"
        >
          + Zoom In
        </button>
        <span className="text-slate-300">{Math.round(zoom * 100)}%</span>
      </div>
    </div>
  );
};
