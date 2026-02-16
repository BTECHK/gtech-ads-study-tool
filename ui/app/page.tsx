import { FlowCanvas } from '@/components/FlowCanvas';
import { Header } from '@/components/Header';
import { DetailPanel } from '@/components/panels/DetailPanel';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <FlowCanvas />
      <DetailPanel />
    </main>
  );
}
