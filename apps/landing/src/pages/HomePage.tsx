import { useTranslation } from "react-i18next";

const features = [
  { name: "Form Builder", kind: "Package", status: "Ready" },
  { name: "Data Table Builder", kind: "Package", status: "Ready" },
  { name: "Landing", kind: "App", status: "Ready" },
];

export default function HomePage() {
  const { t } = useTranslation();

  return <div className="min-h-screen bg-background"></div>;
}
