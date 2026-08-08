import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This repo has ONE rulebook: /AGENTS.md at the workspace root, with CLAUDE.md
  // symlinked to it (see AGENTS.md → Workspace map). Next 16 otherwise generates
  // its own site/AGENTS.md + site/CLAUDE.md on every dev run, which would compete
  // with it and drift.
  agentRules: false,
};

export default nextConfig;
