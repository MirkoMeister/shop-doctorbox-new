// Writes the deployment ID for this build (read by next.config.ts in the build and when the server starts).
// One value per build, so a tab opened before a deploy reloads on its next navigation instead of
// showing "This page couldn't load" (Next.js version skew protection).
import { writeFileSync } from "node:fs";

const id = (process.env.SOURCE_VERSION || process.env.NEXT_DEPLOYMENT_ID || Date.now().toString(36)).slice(0, 12);
writeFileSync(new URL("../.deployment-id", import.meta.url), id);
console.log(`deployment id: ${id}`);
