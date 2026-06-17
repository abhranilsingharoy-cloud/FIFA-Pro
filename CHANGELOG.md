# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Complete ESPN Live API Integration for 48 teams.
- Dashboard with real-time match statuses, top performers, and tournament progression.
- `Standings.tsx` with dynamic group standings and form trackers.
- Premium dark-mode aesthetics with CSS glassmorphism and Framer Motion transitions.
- Interactive geographic `Map.tsx` plotting all 16 World Cup host stadiums.
- Reusable `CustomSelect` styling globally for sleek OS-native dropdowns.
- Continuous Integration workflow (`ci.yml`) for automated build testing.
- Standard React hooks and utility folders (`src/hooks`, `src/utils`).

### Changed
- Refactored `api.ts` to merge static database fallbacks with real-time payload objects.
- Normalized data arrays to accurately map 104 matches across the expanded format.
- Styled native Windows `<select>` options globally to resolve visual artifacts in dark mode.
