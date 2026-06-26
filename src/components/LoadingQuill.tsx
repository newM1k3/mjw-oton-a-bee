import { Feather } from 'lucide-react';

export function LoadingQuill() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="animate-pulse">
        <Feather className="w-12 h-12 text-amber-600" strokeWidth={1.5} />
      </div>
      <p
        className="text-stone-500 italic text-lg"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        The township stirs&hellip;
      </p>
    </div>
  );
}
