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
        Connexion
      </button>
    );
  }

  const email = user.email ?? 'Compte';
  const short = email.includes('@') ? email.split('@')[0] : email;

  return (
    <div className="user-menu">
      <span
        className={`sync-badge sync-badge--${syncStatus}`}
        title={syncLabel(syncStatus)}
        aria-label={syncLabel(syncStatus)}
        aria-live="polite"
      >
        {syncStatus === 'syncing' ? (
          <span className="sync-spinner sync-spinner--sm" aria-hidden="true" />
        ) : (
          syncIcon(syncStatus)
        )}
      </span>
      <span className="user-email" title={email}>
        {short}
      </span>
      <button type="button" className="user-signout" onClick={() => signOut()} aria-label="Se déconnecter">
        Sortir
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
      return 'Synchronisation…';
    case 'synced':
      return 'Synchronisé';
    case 'error':
      return 'Échec de la sync';
    case 'offline':
      return 'Hors ligne — enregistré ici';
    default:
      return 'Sync cloud';
  }
}
