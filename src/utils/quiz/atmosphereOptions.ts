
import { QuizOption } from "./types";
import { CasualIcon, ElegantIcon, TrendyIcon, UniqueIcon, QuietIcon } from "@/utils/atmosphere-icons";

export const atmosphereOptions: QuizOption[] = [
  {
    id: "atmosphere-0",
    text: "Anything - No Preference",
    value: "anything",
    icon: null
  },
  {
    id: "atmosphere-1",
    text: "Casual",
    value: "casual",
    icon: CasualIcon
  },
  {
    id: "atmosphere-2",
    text: "Trendy",
    value: "trendy",
    icon: TrendyIcon
  },
  {
    id: "atmosphere-3",
    text: "Elegant",
    value: "elegant",
    icon: ElegantIcon
  },
  {
    id: "atmosphere-4",
    text: "Unique",
    value: "unique",
    icon: UniqueIcon
  },
  {
    id: "atmosphere-5",
    text: "Quiet",
    value: "quiet",
    icon: QuietIcon
  }
];
