/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = "src/app/support/page.tsx";
let code = fs.readFileSync(path, "utf8");
code = code.replace(
  /placeholder=\{\}/g,
  'placeholder={t("title_placeholder")}',
); // Need to map them properly!
