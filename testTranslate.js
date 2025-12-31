import { translateText } from "./utils/translator.js";

(async () => {
  const result = await translateText("Hello world");
  console.log(result); // should print Arabic translation
})();
