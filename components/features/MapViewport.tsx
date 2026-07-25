"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

/**
 * Cadre zoomable/déplaçable pour une carte de niveau. La carte (largeur fixe
 * MAP_W) est ajustée à la largeur du cadre (vue d'ensemble), puis on peut
 * zoomer (molette, pincement, double-clic, boutons +/−) et se déplacer pour
 * accéder à chaque leçon. Les nœuds restent cliquables (un clic sans glissement
 * n'est pas interprété comme un déplacement).
 */

const MAP_W = 1800;

export function MapViewport({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setW(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fit = w > 0 ? w / MAP_W : 0;

  return (
    <div className="map-vp" ref={ref}>
      {fit > 0 && (
        <TransformWrapper
          initialScale={fit}
          minScale={fit}
          maxScale={fit * 4.5}
          centerOnInit
          centerZoomedOut
          limitToBounds
          wheel={{ step: 0.14 }}
          pinch={{ step: 4 }}
          doubleClick={{ mode: "zoomIn", step: 0.9 }}
          panning={{ velocityDisabled: true }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <div className="map-zoom-ctl">
                <button type="button" className="mz-btn" onClick={() => zoomIn()} aria-label="Zoomer" title="Zoomer">+</button>
                <button type="button" className="mz-btn" onClick={() => zoomOut()} aria-label="Dézoomer" title="Dézoomer">−</button>
                <button type="button" className="mz-btn" onClick={() => resetTransform()} aria-label="Vue d'ensemble" title="Vue d'ensemble">⤢</button>
              </div>
              <TransformComponent wrapperClass="map-tc-wrap" contentClass="map-tc-content">
                {children}
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      )}
    </div>
  );
}
