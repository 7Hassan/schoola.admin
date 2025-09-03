repository_name: schoola
description: an onsite school for kids to learn coding, this repo servers the website and dashboard for the school.

schoola/
├── apps/
│   ├── dashboard/                # Next.js frontend app
│   │   ├── public/
│   │   ├── src/
│   │   ├── next.config.js
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── dashserver/             # Backend server (Node/Express)
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── eslint-config/      # Shared ESLint rules
│   │   ├── index.js
│   │   └── package.json
│   │
│   ├── tsconfig/           # Shared TS configs
│   │   ├── base.json
│   │   ├── nextjs.json
│   │   ├── node.json
│   │   └── package.json
│   │
│   └── ui/                  # Shared UI components (React)
│       ├── src/
│       ├── package.json
│       ├── tsconfig.json
│       └── index.ts
│
├── docs/                   # Project documentation
│   ├── architecture.md
│   ├── setup.md
│   └── contributing.md
│
├── .eslintrc.js            # Root ESLint config (extends packages/eslint-config)
├── package.json            # Root workspace config
├── turbo.json              # Turborepo pipeline config (if using Turborepo)
├── pnpm-workspace.yaml     # or yarn/npm workspace file
├── tsconfig.base.json      # Root TS config (referenced by all apps/packages)
└── README.md
