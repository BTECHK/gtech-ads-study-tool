'use client';

import { useStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const phases = [1, 2, 3, 4, 5, 6, 7, 8];
const priorities = [
  { value: 'all', label: 'All', color: '' },
  { value: 'must_know_cold', label: 'Critical', color: 'bg-red-500' },
  { value: 'know_well', label: 'Important', color: 'bg-amber-500' },
  { value: 'conceptual_awareness', label: 'Awareness', color: 'bg-blue-500' },
] as const;

export function Header() {
  const { priorityFilter, setPriorityFilter, searchQuery, setSearchQuery } = useStore();

  const scrollToPhase = (phaseNum: number) => {
    // Find the phase node element and scroll to it using React Flow's fitView
    const phaseId = `phase-${phaseNum}`;
    const element = document.querySelector(`[data-id="${phaseId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 gap-4 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-gray-900">Google Ads Lifecycle</h1>
        <div className="flex gap-1">
          {phases.map((num) => (
            <Button
              key={num}
              variant="outline"
              size="sm"
              className="w-8 h-8 p-0 rounded-full text-xs font-medium hover:bg-blue-50 hover:border-blue-300"
              onClick={() => scrollToPhase(num)}
            >
              {num}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
          {priorities.map((p) => (
            <button
              key={p.value}
              onClick={() => setPriorityFilter(p.value as typeof priorityFilter)}
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                priorityFilter === p.value
                  ? p.color
                    ? `${p.color} text-white`
                    : 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-64"
          />
        </div>
      </div>
    </header>
  );
}
