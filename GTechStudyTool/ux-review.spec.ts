import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';

const SCREENSHOT_DIR = './ux-review-screenshots';

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

interface UXIssue {
  category: string;
  severity: 'critical' | 'major' | 'minor';
  description: string;
  screenshot?: string;
}

const issues: UXIssue[] = [];

function logIssue(issue: UXIssue) {
  issues.push(issue);
  console.log(`[${issue.severity.toUpperCase()}] ${issue.category}: ${issue.description}`);
}

test.describe('UX Review - GTech Study Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    // Wait for React Flow to render
    await page.waitForSelector('.react-flow__viewport', { timeout: 10000 });
    await page.waitForTimeout(1000); // Extra time for animations
  });

  test('1. Initial Page Load and Layout', async ({ page }) => {
    // Screenshot initial state
    await page.screenshot({ path: `${SCREENSHOT_DIR}/01-initial-load.png`, fullPage: true });

    // Check if all phase nodes are visible
    const phaseNodes = await page.locator('[data-id^="phase-"]').count();
    console.log(`Found ${phaseNodes} phase nodes`);

    if (phaseNodes === 0) {
      logIssue({
        category: 'Initial Load',
        severity: 'critical',
        description: 'No phase nodes visible on initial load',
        screenshot: '01-initial-load.png'
      });
    }

    // Check header/toolbar visibility
    const toolbar = await page.locator('header, [class*="toolbar"], .flex.items-center.gap').first();
    await page.screenshot({ path: `${SCREENSHOT_DIR}/01b-toolbar.png` });
  });

  test('2. Canvas Dragging/Panning', async ({ page }) => {
    // Get the canvas/viewport element
    const canvas = page.locator('.react-flow__pane');
    const viewport = page.locator('.react-flow__viewport');

    // Get initial transform
    const initialTransform = await viewport.getAttribute('style');
    console.log('Initial transform:', initialTransform);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/02a-before-drag.png` });

    // Try dragging the canvas (not on a node)
    const canvasBounds = await canvas.boundingBox();
    if (canvasBounds) {
      // Click and drag on empty area
      const startX = canvasBounds.x + canvasBounds.width / 2;
      const startY = canvasBounds.y + 50; // Top area, likely empty

      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(startX - 200, startY - 100, { steps: 10 });
      await page.mouse.up();

      await page.waitForTimeout(500);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/02b-after-drag.png` });

      const newTransform = await viewport.getAttribute('style');
      console.log('After drag transform:', newTransform);

      if (initialTransform === newTransform) {
        logIssue({
          category: 'Canvas Interaction',
          severity: 'major',
          description: 'Canvas panning may not be working - transform unchanged after drag',
          screenshot: '02b-after-drag.png'
        });
      }
    }

    // Test dragging in different areas
    const areas = [
      { name: 'top-left', x: 100, y: 100 },
      { name: 'center', x: canvasBounds!.width / 2, y: canvasBounds!.height / 2 },
      { name: 'bottom-right', x: canvasBounds!.width - 100, y: canvasBounds!.height - 100 },
    ];

    for (const area of areas) {
      await page.mouse.move(canvasBounds!.x + area.x, canvasBounds!.y + area.y);
      await page.mouse.down();
      await page.mouse.move(canvasBounds!.x + area.x + 50, canvasBounds!.y + area.y + 50, { steps: 5 });
      await page.mouse.up();
      await page.waitForTimeout(200);
    }

    await page.screenshot({ path: `${SCREENSHOT_DIR}/02c-after-multi-drag.png` });
  });

  test('3. Single Click on Nodes', async ({ page }) => {
    // Find first phase node
    const firstNode = page.locator('.react-flow__node').first();
    await firstNode.waitFor({ state: 'visible' });

    await page.screenshot({ path: `${SCREENSHOT_DIR}/03a-before-click.png` });

    // Single click
    await firstNode.click();
    await page.waitForTimeout(500);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/03b-after-single-click.png` });

    // Check if sidebar opened
    const sidebar = page.locator('[data-slot="sheet-content"], [role="dialog"]');
    const sidebarVisible = await sidebar.isVisible().catch(() => false);
    console.log('Sidebar visible after single click:', sidebarVisible);

    if (!sidebarVisible) {
      logIssue({
        category: 'Node Interaction',
        severity: 'major',
        description: 'Sidebar does not open on single click - user may not know how to view details',
        screenshot: '03b-after-single-click.png'
      });
    }
  });

  test('4. Double Click on Nodes', async ({ page }) => {
    // Find a phase node
    const nodes = page.locator('.react-flow__node');
    const nodeCount = await nodes.count();
    console.log(`Testing double-click on ${nodeCount} nodes`);

    for (let i = 0; i < Math.min(3, nodeCount); i++) {
      const node = nodes.nth(i);
      await node.waitFor({ state: 'visible' });

      // Double click
      await node.dblclick();
      await page.waitForTimeout(800);

      await page.screenshot({ path: `${SCREENSHOT_DIR}/04-dblclick-node-${i}.png` });

      // Check for sidebar
      const sidebar = page.locator('[data-slot="sheet-content"], [role="dialog"]');
      const sidebarVisible = await sidebar.isVisible().catch(() => false);

      if (!sidebarVisible) {
        logIssue({
          category: 'Double Click',
          severity: 'major',
          description: `Double-click on node ${i} did not open sidebar panel`,
          screenshot: `04-dblclick-node-${i}.png`
        });
      }

      // Close sidebar if open
      if (sidebarVisible) {
        const closeBtn = page.locator('[data-slot="sheet-content"] button:has(svg), button[aria-label*="close"], button:has(.lucide-x)').first();
        if (await closeBtn.isVisible().catch(() => false)) {
          await closeBtn.click();
          await page.waitForTimeout(300);
        }
      }
    }
  });

  test('5. Expand/Collapse Nodes', async ({ page }) => {
    // Look for expand buttons on nodes
    const expandButtons = page.locator('.react-flow__node button, .react-flow__node [class*="expand"]');
    const expandCount = await expandButtons.count();
    console.log(`Found ${expandCount} potential expand buttons`);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/05a-before-expand.png` });

    // Try clicking the first node's expand area
    const firstNode = page.locator('.react-flow__node').first();
    const nodeBounds = await firstNode.boundingBox();

    if (nodeBounds) {
      // Click on right side of node (usually where expand button is)
      await page.mouse.click(nodeBounds.x + nodeBounds.width - 20, nodeBounds.y + nodeBounds.height / 2);
      await page.waitForTimeout(1000);

      await page.screenshot({ path: `${SCREENSHOT_DIR}/05b-after-expand-attempt.png` });

      // Count nodes again to see if children appeared
      const nodesAfter = await page.locator('.react-flow__node').count();
      console.log(`Nodes after expand attempt: ${nodesAfter}`);
    }
  });

  test('6. Sidebar Panel Functionality', async ({ page }) => {
    // Click on a node to open sidebar
    const firstNode = page.locator('.react-flow__node').first();
    await firstNode.click();
    await page.waitForTimeout(500);

    // Try to find and click Node Detail button
    const nodeDetailBtn = page.locator('button:has-text("Node Detail"), button:has-text("Detail")').first();
    if (await nodeDetailBtn.isVisible().catch(() => false)) {
      await nodeDetailBtn.click();
      await page.waitForTimeout(300);
    }

    await page.screenshot({ path: `${SCREENSHOT_DIR}/06a-sidebar-open.png` });

    // Check sidebar content
    const sidebar = page.locator('[data-slot="sheet-content"], [role="dialog"]');
    if (await sidebar.isVisible().catch(() => false)) {
      // Check for tabs
      const tabs = await sidebar.locator('[role="tablist"] button, [data-slot="tabs-trigger"]').count();
      console.log(`Sidebar has ${tabs} tabs`);

      // Check for content overflow
      const content = sidebar.locator('[data-slot="scroll-area"], .overflow-auto').first();
      if (await content.isVisible().catch(() => false)) {
        const contentBounds = await content.boundingBox();
        const scrollHeight = await content.evaluate(el => el.scrollHeight);
        const clientHeight = await content.evaluate(el => el.clientHeight);

        console.log(`Content scrollHeight: ${scrollHeight}, clientHeight: ${clientHeight}`);

        if (scrollHeight > clientHeight) {
          // Test scrolling
          await content.evaluate(el => el.scrollTop = 100);
          await page.waitForTimeout(200);
          await page.screenshot({ path: `${SCREENSHOT_DIR}/06b-sidebar-scrolled.png` });
        }
      }

      // Click through tabs
      const tabButtons = sidebar.locator('[role="tab"], button[data-state]');
      const tabCount = await tabButtons.count();

      for (let i = 0; i < tabCount; i++) {
        await tabButtons.nth(i).click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: `${SCREENSHOT_DIR}/06c-tab-${i}.png` });
      }
    }
  });

  test('7. Node Selection Visual Feedback', async ({ page }) => {
    const nodes = page.locator('.react-flow__node');
    const firstNode = nodes.first();

    // Get initial styles
    const initialBorder = await firstNode.evaluate(el => getComputedStyle(el).border);
    const initialBoxShadow = await firstNode.evaluate(el => getComputedStyle(el).boxShadow);

    // Click to select
    await firstNode.click();
    await page.waitForTimeout(300);

    // Get selected styles
    const selectedBorder = await firstNode.evaluate(el => getComputedStyle(el).border);
    const selectedBoxShadow = await firstNode.evaluate(el => getComputedStyle(el).boxShadow);

    console.log('Initial border:', initialBorder);
    console.log('Selected border:', selectedBorder);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/07-selection-visual.png` });

    if (initialBorder === selectedBorder && initialBoxShadow === selectedBoxShadow) {
      logIssue({
        category: 'Visual Feedback',
        severity: 'minor',
        description: 'No visible selection state change on node click - user may not know which node is selected',
        screenshot: '07-selection-visual.png'
      });
    }
  });

  test('8. Zoom Controls', async ({ page }) => {
    // Find zoom controls
    const controls = page.locator('.react-flow__controls');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/08a-controls.png` });

    if (await controls.isVisible().catch(() => false)) {
      // Test zoom in
      const zoomIn = controls.locator('button').first();
      await zoomIn.click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/08b-zoomed-in.png` });

      // Test zoom out
      const zoomOut = controls.locator('button').nth(1);
      await zoomOut.click();
      await zoomOut.click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/08c-zoomed-out.png` });

      // Test fit view
      const fitView = controls.locator('button').nth(2);
      if (await fitView.isVisible().catch(() => false)) {
        await fitView.click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: `${SCREENSHOT_DIR}/08d-fit-view.png` });
      }
    }
  });

  test('9. Expanded Node Layout', async ({ page }) => {
    // Expand first phase
    const firstNode = page.locator('.react-flow__node').first();
    const nodeBounds = await firstNode.boundingBox();

    if (nodeBounds) {
      // Look for expand button or clickable area
      const expandBtn = firstNode.locator('button, [class*="chevron"], svg').last();
      if (await expandBtn.isVisible().catch(() => false)) {
        await expandBtn.click();
      } else {
        // Click right side of node
        await page.mouse.click(nodeBounds.x + nodeBounds.width - 15, nodeBounds.y + nodeBounds.height / 2);
      }

      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/09a-first-expanded.png` });

      // Check for overlapping nodes
      const allNodes = await page.locator('.react-flow__node').all();
      const nodeBoundsArray: Array<{ id: string, bounds: any }> = [];

      for (const node of allNodes) {
        const bounds = await node.boundingBox();
        const id = await node.getAttribute('data-id') || 'unknown';
        if (bounds) {
          nodeBoundsArray.push({ id, bounds });
        }
      }

      // Check for overlaps
      for (let i = 0; i < nodeBoundsArray.length; i++) {
        for (let j = i + 1; j < nodeBoundsArray.length; j++) {
          const a = nodeBoundsArray[i].bounds;
          const b = nodeBoundsArray[j].bounds;

          const overlap = !(a.x + a.width < b.x ||
                          b.x + b.width < a.x ||
                          a.y + a.height < b.y ||
                          b.y + b.height < a.y);

          if (overlap) {
            logIssue({
              category: 'Layout',
              severity: 'major',
              description: `Nodes ${nodeBoundsArray[i].id} and ${nodeBoundsArray[j].id} are overlapping`,
              screenshot: '09a-first-expanded.png'
            });
          }
        }
      }
    }
  });

  test('10. Responsive Behavior', async ({ page }) => {
    // Test at different viewport sizes
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 1366, height: 768, name: 'laptop' },
      { width: 1024, height: 768, name: 'tablet-landscape' },
      { width: 768, height: 1024, name: 'tablet-portrait' },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/10-responsive-${vp.name}.png` });

      // Check if key elements are still visible
      const toolbar = await page.locator('header, nav, .toolbar').first().isVisible().catch(() => false);
      const canvas = await page.locator('.react-flow__viewport').isVisible().catch(() => false);

      if (!canvas) {
        logIssue({
          category: 'Responsive',
          severity: 'major',
          description: `Canvas not visible at ${vp.name} (${vp.width}x${vp.height})`,
          screenshot: `10-responsive-${vp.name}.png`
        });
      }
    }
  });

  test.afterAll(async () => {
    // Generate report
    console.log('\n========== UX REVIEW SUMMARY ==========\n');
    console.log(`Total issues found: ${issues.length}\n`);

    const critical = issues.filter(i => i.severity === 'critical');
    const major = issues.filter(i => i.severity === 'major');
    const minor = issues.filter(i => i.severity === 'minor');

    console.log(`Critical: ${critical.length}`);
    console.log(`Major: ${major.length}`);
    console.log(`Minor: ${minor.length}`);

    console.log('\n--- Issues by Category ---\n');

    const byCategory = issues.reduce((acc, issue) => {
      acc[issue.category] = acc[issue.category] || [];
      acc[issue.category].push(issue);
      return acc;
    }, {} as Record<string, UXIssue[]>);

    for (const [category, categoryIssues] of Object.entries(byCategory)) {
      console.log(`\n${category}:`);
      categoryIssues.forEach(issue => {
        console.log(`  [${issue.severity}] ${issue.description}`);
        if (issue.screenshot) {
          console.log(`    Screenshot: ${issue.screenshot}`);
        }
      });
    }

    // Save report to file
    const report = {
      timestamp: new Date().toISOString(),
      totalIssues: issues.length,
      summary: { critical: critical.length, major: major.length, minor: minor.length },
      issues
    };

    fs.writeFileSync(`${SCREENSHOT_DIR}/ux-report.json`, JSON.stringify(report, null, 2));
    console.log(`\nFull report saved to: ${SCREENSHOT_DIR}/ux-report.json`);
    console.log(`Screenshots saved to: ${SCREENSHOT_DIR}/`);
  });
});
