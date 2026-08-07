import { useAuth } from '../contexts/AuthProvider';
import type { SyncStatus } from '../types/progress';

type Props = {
  syncStatus: SyncStatus;
};

export function UserMenu({ syncStatus }: Props) {
  const { user, isGuest, clearGuest, signOut } = useAuth();

  if (isGuest || !user) {
    return (
      <button type="button" className="user-signin" onClick={clearGuest}>
        Sign in
      </button>
    );
  }

  const email = user.email ?? 'Account';
  const short = email.includes('@') ? email.split('@')[0] : email;

  return (
    <div className="user-menu">
      <span
        className={`sync-badge sync-badge--${syncStatus}`}
        title={syncLabel(syncStatus)}
      >
        {syncIcon(syncStatus)}
      </span>
      <span className="user-email" title={email}>
        {short}
      </span>
      <button type="button" className="user-signout" onClick={() => signOut()} aria-label="Sign out">
        Out
      </button>
    </div>
  );
}

function syncIcon(status: SyncStatus): string {
  switch (status) {
    case 'syncing':
      return '↻';
    case 'synced':
      return '☁';
    case 'error':
      return '!';
    case 'offline':
      return '○';
    default:
      return '☁';
  }
}

function syncLabel(status: SyncStatus): string {
  switch (status) {
    case 'syncing':
      return 'Syncing…';
    case 'synced':
      return 'Synced to cloud';
    case 'error':
      return 'Sync failed';
    case 'offline':
      return 'Offline — saved locally';
    default:
      return 'Cloud sync';
  }
}
