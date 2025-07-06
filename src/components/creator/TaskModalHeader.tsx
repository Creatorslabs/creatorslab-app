import { ITask } from "@/types/Task";
import { X } from "lucide-react";
import Image from "next/image";
import { SimpleIcon } from "../Common/SimpleIcon";

interface Props {
  task: ITask;
  onClose: () => void;
}

export default function TaskModalHeader({ task, onClose }: Props) {
  const { image, title, platform, type, rewardPoints, status } = task;
  return (
    <div className="relative h-52 sm:h-64 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 overflow-hidden">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover opacity-80"
        quality={75}
        loader={({ src, width, quality }) =>
          `${src}?w=${width}&q=${quality || 75}`
        }
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <SimpleIcon platform={platform} />
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-white/80 text-sm capitalize">
              {platform} • {type.join(", ")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="px-3 py-1 rounded-full border text-sm text-white bg-yellow-500/20 border-yellow-400/40">
            {status}
          </span>
          <span className="bg-primary px-3 py-1 rounded-full text-white text-sm">
            {rewardPoints} $CLS
          </span>
        </div>
      </div>
    </div>
  );
}
