## Heyyyy, this is Ratnam

[See the published page](https://skillpath-courses.framer.website)

[read the main CourseGrid component](./CourseGrid.tsx).

### How I approached it

I fetch the course and country data separately using GET. This means a failed country request never takes down valid course data. Courses have clear loading, error, empty, and working states. If country detection fails after three attempts, prices fall back to the currency chosen in Framer and the INR/USD switch becomes available.

Once the main flow was reliable, I added search, price sorting, skeleton loaders, retry, refundable badges, four Framer controls, and a responsive three, two, and one column layout.

The hardest part was keeping the two unreliable requests independent without
making the UI confusing.

### What I would improve

With two more days, I would use the browser language and region settings as a fallback when the country API fails. I'd also add more Framer controls to make the component even more customizable for designers.

I am still not fully happy that the cards are not clickable because the API does not provide a course URL. A false refundable value is also shown by leaving out the badge, which could be clearer.

### How I used AI

I used AI at different stages and reviewed the final choices myself.

- **Claude Web, Opus 5 Max:** Research and early planning. [View the research chat](https://claude.ai/share/a1975351-ba24-42f7-92da-fe6e49e6985c)
- **Claude Code, Opus 5 in Ultracode mode:** Building and refactoring. [Download the coding session](./ai_chats/opus5_coding_session-export-1786597783397.zip)
- **Claude Fable 5 in Ultracode mode:** Final review. [Download the review session](./ai_chats/fable_review_session-export-1786598320261.zip)

