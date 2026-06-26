import { useEffect, useRef, useState } from 'react';
import { Resources } from '../types/game';

interface ResourceBarsProps {
  resources: Resources;
  previousResources?: Resources;
}

interface BarConfig {
  key: keyof Resources;
  label: string;
  barColor: string;
  trackColor: string;
}

const BAR_CONFIGS: BarConfig[] = [
  { key: 'funds',      label: 'Funds',      barColor: 'bg-amber-500',  trackColor: 'bg-amber-100' },
  { key: 'reputation', label: 'Reputation', barColor: 'bg-teal-500',   trackColor: 'bg-teal-100'  },
  { key: 'harvest',    label: 'Harvest',    barColor: 'bg-green-500',  trackColor: 'bg-green-100' },
  { key: 'health',     label: 'Health',     barColor: 'bg-rose-500',   trackColor: 'bg-rose-100'  },
];

export function ResourceBars({ resources, previousResources }: ResourceBarsProps) {
  const [animated, setAnimated] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      const id = requestAnimationFrame(() => setAnimated(true));
      return () => cancelAnimationFrame(id);
    }
  }, []);

  return (
    <div className="space-y-3">
      {BAR_CONFIGS.map(({ key, label, barColor, trackColor }) => {
        const value = resources[key];
        const prev = previousResources?.[key];
        const delta = prev !== undefined ? value - prev : null;

        return (
          <div key={key} className="flex items-center gap-3">
            <span className="w-24 text-xs font-semibold uppercase tracking-wide text-stone-500 shrink-0">
              {label}
            </span>
            <div className={`flex-1 resource-bar h-2.5 rounded-full ${trackColor} overflow-hidden`}>
              <div
                className={`h-full rounded-full ${barColor} transition-[width] duration-[600ms] ease-out`}
                style={{ width: animated ? `${value}%` : '0%' }}
              />
            </div>
            <div className="flex items-center gap-1.5 w-20 justify-end shrink-0">
              <span className="text-sm font-medium text-stone-700 tabular-nums">{value}</span>
              {delta !== null && delta !== 0 && (
                <span
                  className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                    delta > 0
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {delta > 0 ? `▲ +${delta}` : `▼ ${delta}`}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
