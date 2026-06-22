"use client";

import { motion } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";

export function StatCard({ title = "Metric", value = "—", hint = "" }: { title?: string; value?: string; hint?: string }) {
	return (
		<Tooltip.Provider delayDuration={60}>
			<Tooltip.Root>
				<Tooltip.Trigger asChild>
					<motion.div whileHover={{ translateY: -6 }} className="card glass hover-elevate cursor-default neon-accent">
						<div className="text-sm text-muted-foreground">{title}</div>
						<div className="mt-2 text-2xl font-semibold">{value}</div>
						<div className="mt-3 h-1 w-16 rounded-full" style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.9), rgba(168,85,247,0.9))' }} />
					</motion.div>
				</Tooltip.Trigger>
				{hint && <Tooltip.Content className="rounded-md border border-border bg-card p-2 text-xs">{hint}</Tooltip.Content>}
			</Tooltip.Root>
		</Tooltip.Provider>
	);
}