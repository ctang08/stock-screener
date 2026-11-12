# Origin

Christopher Tang’s FOPL Sprint 2 stock dashboard, originally built with the HeroUI Next.js template. The portfolio edition keeps ticker lookup, historical pricing, company metrics and the random-forest experiment while removing unused template pages and dependencies. The original template license is retained in LICENSE.

The original prototype trained on previous-close → current-close pairs, but predicted from the penultimate close and plotted the result one month later. This edition predicts from the latest close, labels the result as a one-step experiment, and provides deterministic synthetic data for a key-free demo. No out-of-sample performance claim is made.
