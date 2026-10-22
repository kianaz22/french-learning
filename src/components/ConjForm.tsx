import { splitForm } from '../lib/conjugation';

type Props = {
  form: string;
  stem?: string;
};

export function ConjForm({ form, stem }: Props) {
  const parts = splitForm(form, stem);
  if (!parts) return <span>{form}</span>;
  return (
    <span className="conj-form-parts">
      {parts.prefix}
      <span className="conj-stem">{parts.stem}</span>
      <span className="conj-ending">{parts.ending}</span>
    </span>
  );
}
