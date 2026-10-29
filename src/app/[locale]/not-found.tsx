import { getDictionary } from "@/lib/i18n/dictionaries";
import { NotFoundView } from "@/components/errors/NotFoundView";

const copy = (locale: "de" | "en") => {
  const dict = getDictionary(locale);
  return { ...dict.notFound, all: dict.collection.all };
};

export default function NotFound() {
  return <NotFoundView copy={{ de: copy("de"), en: copy("en") }} />;
}
