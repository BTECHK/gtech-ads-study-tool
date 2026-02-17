# Google Ads Lifecycle Study Tool

An interactive visual learning tool for understanding the complete Google Ads ecosystem. Explore the full Google Ads lifecycle through an intuitive node-based interface.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-PolyForm%20NC-green)

## Features

- **Visual Lifecycle Navigation** - See all 8 phases of Google Ads as connected nodes
- **Expandable Hierarchy** - Drill down from phases to topics to sub-topics
- **Priority Filtering** - Focus on "Must Know Cold", "Know Well", or "Conceptual" topics
- **Search** - Quickly find specific concepts
- **Detailed Info Panels** - View definitions, key concepts, troubleshooting guides
- **Interactive Canvas** - Pan, zoom, and explore with React Flow

## Priority Legend

| Color | Priority | Description |
|-------|----------|-------------|
| Red | Must Know Cold | Critical topics - know these inside and out |
| Amber | Know Well | Important topics - solid understanding needed |
| Blue | Conceptual Awareness | Good to know - understand the concept |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/BTECHK/gtech-ads-study-tool.git
cd gtech-ads-study-tool/GTechStudyTool

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Usage

1. **Navigate** - Pan and zoom the canvas to explore the lifecycle
2. **Expand** - Click the chevron (▼) on any node to reveal sub-topics
3. **View Details** - Click the info button (ℹ) to open the sidebar with full details
4. **Filter** - Use the priority dropdown to focus on specific importance levels
5. **Search** - Type in the search box to find specific topics

## Tech Stack

- **Framework**: Next.js 16
- **UI**: React 18, Tailwind CSS, shadcn/ui
- **Visualization**: React Flow
- **State**: Zustand
- **Language**: TypeScript

## Project Structure

```
GTechStudyTool/
├── app/                    # Next.js app router
├── components/
│   ├── flow/              # Node components (PhaseNode, SubProcessNode)
│   ├── panels/            # Sidebar panel components
│   └── ui/                # shadcn/ui components
├── data/
│   └── lifecycle_data.json # Lifecycle content data
├── lib/
│   ├── store.ts           # Zustand state management
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

## Content Coverage

The tool covers the complete Google Ads lifecycle:

1. **Account Setup** - Hierarchy, billing, campaign types
2. **Targeting Setup** - Keywords, audiences, locations
3. **Ad Creation** - Ad formats, extensions, policies
4. **Bidding & Budget** - Strategies, optimization, pacing
5. **Tracking Setup** - Conversions, tags, attribution
6. **Performance Analysis** - Metrics, reporting, insights
7. **Optimization** - A/B testing, automation, scaling
8. **Troubleshooting** - Diagnostics, common issues, resolution

Each topic includes:
- Definition and context
- Practical relevance
- Key details
- Conceptual deep-dives
- Troubleshooting guide
- SQL connections (where applicable)

## License

This project is licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE).

**In short:**
- Free for personal study, research, and educational use
- Commercial use requires permission from the author

For commercial licensing inquiries, please contact the author.

## Author

**Kyle Atekwana** ([@BTECHK](https://github.com/BTECHK))

## Acknowledgments

- [React Flow](https://reactflow.dev/) for the visualization framework
- [shadcn/ui](https://ui.shadcn.com/) for the UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
