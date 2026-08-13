# Skillpath Submission

- **Published page:** [View the Framer site](https://skillpath-courses.framer.website)
- **Main component:** [CourseGrid.tsx](./CourseGrid.tsx)

## Implementation

The course grid fetches both APIs independently using GET and handles loading,
error, empty, and working states. It formats INR and USD correctly, falls back
to INR when country detection fails, supports responsive 3/2/1 columns and two
Framer controls, and includes search, price sorting, skeleton loaders, retry,
and refundable badges.

## Short note

If I had two more days, I would use the browser language and region settings as
a backup when the country code API fails.

The main challenge was handling the course and country APIs separately because
either one can fail. Course failures now show a retry screen. Country failures
do not block the course grid.

I am not fully happy that the cards are not clickable because the API does not
provide a course URL. A false refundable value is also shown by leaving out the
badge, which could be clearer.

## AI tools

- **Claude Web, Opus 5 Max:** Used for research. [View the research chat](https://claude.ai/share/a1975351-ba24-42f7-92da-fe6e49e6985c)
- **Claude Code, Opus 5 in Ultracode mode:** Used for coding. [Download the coding session](./ai_chats/opus5_coding_session-export-1786597783397.zip)
- **Claude Fable 5 in Ultracode mode:** Used for the final review. [Download the review session](./ai_chats/fable_review_session-export-1786598320261.zip)

