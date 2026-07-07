import { motion } from "framer-motion";

interface SectionPlaceholderProps {
  title: string;
  description: string;
}

export function SectionPlaceholder({ title, description }: SectionPlaceholderProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass soft-card rounded-3xl p-8"
    >
      <h1 className="gradient-text text-3xl font-semibold">{title}</h1>
      <p className="mt-3 max-w-3xl text-slate-600">{description}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-2xl bg-white/70 p-4">
            <div className="mb-3 h-3 w-24 rounded bg-slate-200" />
            <div className="h-2 w-full rounded bg-slate-100" />
            <div className="mt-2 h-2 w-2/3 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </motion.section>
  );
}
