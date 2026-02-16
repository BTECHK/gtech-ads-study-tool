import { FlowCanvas } from '@/components/FlowCanvas';
import { Header } from '@/components/Header';
import { DetailPanel } from '@/components/panels/DetailPanel';
import { KeyProcessWorkflow } from '@/components/KeyProcessWorkflow';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <FlowCanvas />
      <DetailPanel />
      <KeyProcessWorkflow />
    </main>
  );
}
