import React from 'react';
import { Lock } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export function OwnerReadOnlyBadge() {
  return (
    <Alert className="mb-4 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
      <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertDescription className="text-blue-800 dark:text-blue-300">
        <strong>Owner View:</strong> This is a read-only dashboard. All data entry and updates are managed by the Manager.
      </AlertDescription>
    </Alert>
  );
}
