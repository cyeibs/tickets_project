# LupApp

A React TypeScript application built with Rsbuild, following the Feature-Sliced Design (FSD) architecture.

## Project Structure

The project follows the Feature-Sliced Design architecture:

```
src/
  ├── app/         # Application setup: routing, providers, global styles
  ├── pages/       # Application pages
  ├── widgets/     # Complex UI blocks for pages
  ├── features/    # User interactions, business logic
  ├── entities/    # Business entities
  ├── shared/      # Reusable functionality, UI components, API
      ├── ui/      # Reusable UI components
      ├── api/     # API interaction utilities
      ├── config/  # Configuration files
      ├── lib/     # Utility functions
      └── styles/  # Global styles, variables, mixins
```

## Available Pages

1. Splash screen
2. Login page
3. Registration page
4. Main page
5. Tickets page
6. Event ticket page
7. Events page
8. Profile page
9. Subscriptions page
10. Search page
11. Purchase ticket page
12. Organizer page
13. Reviews page
14. Payment waiting page
15. Profile edit page
16. Support page
17. Filters page
18. Create organizer profile page
19. About organization page
20. Legal documents page
21. My events page
22. Event participants page
23. Stories page
24. Create story page
25. Edit story page
26. Create event page

## UI Components

### Shared UI Components

1. IconButton
2. TextField
3. Loader
4. TabGroup
5. Tab
6. Tabs
7. SearchInput
8. Avatar
9. StoriesLine
10. Header
11. BigChips
12. Link
13. Pills
14. TitleCard
15. ProfileCard
16. StepperHorizontal
17. EventCard
18. EventStoryCard
19. EventSwiperCard

### Modals

1. Delete story modal
2. Event created modal
3. Event cancel modal
4. Login modal
5. Ticket purchase modal
6. Account delete modal
7. Event rating modal
8. Organizer profile create modal
9. Organizer rights granted modal
10. Stories modal
11. Toast notifications

## Typography

- Title (SF PRO)

  - T32 XXL - Bold - 32/102
  - T24(XL) - Semibold - 24/auto
  - T18(L) - Bold - 18/102
  - T16(M) - Semibold - 16/auto
  - T14(S) - Semibold - 14/16
  - T12(XS) - Semibold - 12/auto

- Regular (SF Pro)
  - R24 - Regular - 24/18
  - R18 - Regular - 18/18
  - R16 - Regular - 16/18
  - R14 - Regular - 14/16
  - R12 - Regular - 12/15
  - R8 - Regular - 8/12

## Development

### Prerequisites

- Node.js (v16 or higher)
- Yarn

### Installation

```bash
yarn install
```

### Development Server

```bash
yarn dev
```

### Build for Production

```bash
yarn build
```

## Technologies

- React
- TypeScript
- Rsbuild
- SCSS Modules
- Biome (linting and formatting)
