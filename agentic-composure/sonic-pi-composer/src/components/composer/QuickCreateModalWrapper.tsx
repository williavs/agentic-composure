'use client';

import { useQuickCreate } from "@/contexts/QuickCreateContext";
import { QuickCreateModal } from "@/components/composer/QuickCreateModal";

export function QuickCreateModalWrapper() {
  const { isOpen, closeModal } = useQuickCreate();
  return <QuickCreateModal open={isOpen} onOpenChange={closeModal} />;
} 