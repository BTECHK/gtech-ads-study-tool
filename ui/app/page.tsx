import { FlowCanvas } from '@/components/FlowCanvas';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="h-16 bg-white border-b flex items-center px-6">
        <h1 className="text-xl font-semibold">Google Ads Lifecycle Study Tool</h1>
      </header>
      <FlowCanvas />
    </main>
  );
}
