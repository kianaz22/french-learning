import { useState } from 'react';
import type { ConjugationExercise, GrammarPoint, LessonSituation, UnitContent } from '../data/types';
import { flashcardCategories } from '../data/types';
import { groupVerbs, verbGroupLabel } from '../lib/conjugation';
import { ConjForm } from './ConjForm';

type Tab = 'overview' | 'grammar' | 'vocab' | 'verbs' | 'phrases' | 'dialogue';

const allTabs: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Vue d\'ensemble' },
  { id: 'grammar', label: 'Grammaire' },
  { id: 'vocab', label: 'Vocabulaire' },
  { id: 'verbs', label: 'Verbes' },
  { id: 'phrases', label: 'Phrases clés' },
  { id: 'dialogue', label: 'Dialogue' },
];

type Props = {
  unit: UnitContent;
  initialSituationId?: string;
  onStartPractice?: () => void;
  onAdoptAndPractice?: () => void;
  practiceLabel?: string;
};

type LessonItem =
  | { kind: 'grammar'; id: string }
  | { kind: 'vocab'; category: string }
  | { kind: 'verb'; id: string }
  | { kind: 'situation'; id: string };

const exploreSections: { id: Tab; label: string; desc: string; icon: string; count: (u: UnitContent) => number }[] = [
  { id: 'grammar', label: 'Grammaire', desc: 'Explications, règles & pièges', icon: '✦', count: (u) => u.lesson.grammar.length },
  { id: 'vocab', label: 'Vocabulaire', desc: 'Par thème', icon: '📚', count: (u) => u.flashcards.length },
  { id: 'verbs', label: 'Verbes', desc: 'Tableaux de conjugaison', icon: '↻', count: (u) => u.conjugationExercises.length },
  { id: 'phrases', label: 'Phrases clés', desc: 'Expressions utiles', icon: '💬', count: (u) => u.lesson.keyPhrases.length },
];

export function Lesson({
  unit,
  initialSituationId,
  onStartPractice,
  onAdoptAndPractice,
  practiceLabel,
}: Props) {
  const [tab, setTab] = useState<Tab>('overview');
  const [item, setItem] = useState<LessonItem | null>(
    initialSituationId ? { kind: 'situation', id: initialSituationId } : null,
  );
  const { meta, lesson, flashcards, conjugationExercises } = unit;
  const categories = flashcardCategories(unit);
  const featuredPhrase = lesson.keyPhrases[0];
  const cultureNotes = lesson.cultureNotes?.length
    ? lesson.cultureNotes
    : lesson.cultureNote
      ? [{ title: 'Culture', text: lesson.cultureNote }]
      : [];
  const tabs = lesson.dialogue ? allTabs : allTabs.filter((t) => t.id !== 'dialogue');

  const vocabByCategory = categories.map((cat) => ({
    category: cat,
    items: flashcards.filter((c) => c.category === cat),
  }));

  const selectedGrammar =
    item?.kind === 'grammar' ? lesson.grammar.find((g) => g.id === item.id) : undefined;
  const selectedVerb =
    item?.kind === 'verb' ? conjugationExercises.find((v) => v.id === item.id) : undefined;
  const selectedVocab =
    item?.kind === 'vocab' ? vocabByCategory.find((g) => g.category === item.category) : undefined;
  const selectedSituation =
    item?.kind === 'situation' ? lesson.situations?.find((s) => s.id === item.id) : undefined;

  const openTab = (next: Tab) => {
    setItem(null);
    setTab(next);
  };

  const openGrammar = (id: string) => {
    setTab('grammar');
    setItem({ kind: 'grammar', id });
  };

  const openVerb = (id: string) => {
    setTab('verbs');
    setItem({ kind: 'verb', id });
  };

  const openVocab = (category: string) => {
    setTab('vocab');
    setItem({ kind: 'vocab', category });
  };

  return (
    <div className="lesson">
      <div className="lesson-tabs" role="tablist" aria-label="Sections de la leçon">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`lesson-tab ${tab === t.id ? 'lesson-tab--active' : ''}`}
            onClick={() => openTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="lesson-body">
        {tab === 'overview' && selectedSituation && (
          <SituationMemo
            situation={selectedSituation}
            unit={unit}
            onBack={() => setItem(null)}
            onOpenGrammar={openGrammar}
            onOpenVerb={openVerb}
          />
        )}

        {tab === 'overview' && !selectedSituation && (
          <section className="lesson-overview">
            <header className="lo-hero">
              <div className="lo-hero-orbs" aria-hidden="true">
                <span className="lo-orb lo-orb--1" />
                <span className="lo-orb lo-orb--2" />
              </div>
              <div className="lo-hero-top">
                <span className="lo-badge">A1 · Unité {meta.number}</span>
                <span className="lo-level">Leçon</span>
              </div>
              <h2 className="lo-title">{meta.title}</h2>
              <p className="lo-desc">{lesson.memo ?? lesson.overview}</p>
              <div className="lo-hero-stats">
                <span className="lo-hero-stat">
                  <strong>{lesson.grammar.length}</strong> grammaire
                </span>
                <span className="lo-hero-stat-div" aria-hidden="true" />
                <span className="lo-hero-stat">
                  <strong>{flashcards.length}</strong> mots
                </span>
                <span className="lo-hero-stat-div" aria-hidden="true" />
                <span className="lo-hero-stat">
                  <strong>{conjugationExercises.length}</strong> verbes
                </span>
              </div>
            </header>

            {lesson.situations && lesson.situations.length > 0 && (
              <div className="lo-situations">
                <p className="lo-explore-label">Dans le livre</p>
                <div className="situation-grid">
                  {lesson.situations.map((sit) => (
                    <button
                      key={sit.id}
                      type="button"
                      className="situation-card"
                      onClick={() => setItem({ kind: 'situation', id: sit.id })}
                    >
                      <span className="situation-num">Situation {sit.number}</span>
                      <span className="situation-title">{sit.title}</span>
                      <span className="situation-goal">{sit.goal}</span>
                      <span className="lesson-topic-arrow" aria-hidden="true">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="lo-explore">
              <p className="lo-explore-label">Mémo</p>
              <div className="lo-explore-grid">
                {exploreSections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    className="lo-explore-card"
                    onClick={() => openTab(section.id)}
                  >
                    <span className="lo-explore-icon">{section.icon}</span>
                    <span className="lo-explore-name">{section.label}</span>
                    <span className="lo-explore-desc">{section.desc}</span>
                    <span className="lo-explore-count">{section.count(unit)}</span>
                  </button>
                ))}
                {lesson.dialogue && (
                  <button
                    type="button"
                    className="lo-explore-card"
                    onClick={() => openTab('dialogue')}
                  >
                    <span className="lo-explore-icon">🎭</span>
                    <span className="lo-explore-name">Dialogue</span>
                    <span className="lo-explore-desc">Conversation modèle</span>
                    <span className="lo-explore-count">{lesson.dialogue.lines.length}</span>
                  </button>
                )}
              </div>
            </div>

            {!lesson.situations?.length && (
            <div className="lo-objectives card">
              <div className="lo-objectives-head">
                <span className="lo-objectives-icon">🎯</span>
                <h3 className="lo-objectives-title">Objectifs communicatifs</h3>
              </div>
              <ol className="lo-objectives-list">
                {meta.objectives.map((obj, i) => (
                  <li key={obj}>
                    <span className="lo-objectives-num">{i + 1}</span>
                    <span className="lo-objectives-text">{obj}</span>
                  </li>
                ))}
              </ol>
            </div>
            )}

            {!lesson.situations?.length && (
              <div className="lo-grammar-preview">
                <div className="lo-grammar-preview-head">
                  <h3 className="lo-grammar-preview-title">Points de grammaire</h3>
                  <button type="button" className="lo-see-all" onClick={() => openTab('grammar')}>
                    Tout voir →
                  </button>
                </div>
                <div className="lesson-topic-grid">
                  {lesson.grammar.slice(0, 6).map((point, i) => (
                    <TopicCard
                      key={point.id}
                      index={i + 1}
                      title={point.title}
                      summary={point.summary}
                      onClick={() => openGrammar(point.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {featuredPhrase && (
              <blockquote className="lo-featured card">
                <span className="lo-featured-label">Phrase clé</span>
                <p className="lo-featured-fr">« {featuredPhrase.french} »</p>
                <p className="lo-featured-en">{featuredPhrase.english}</p>
                {featuredPhrase.context && (
                  <cite className="lo-featured-context">{featuredPhrase.context}</cite>
                )}
              </blockquote>
            )}

            {lesson.dialogue && (
              <button type="button" className="lo-dialogue-preview card" onClick={() => openTab('dialogue')}>
                <span className="lo-featured-label">Dialogue</span>
                <p className="lo-featured-fr">{lesson.dialogue.title}</p>
                {lesson.dialogue.setting && (
                  <p className="lo-featured-en">{lesson.dialogue.setting}</p>
                )}
                <span className="lo-see-all">Lire le dialogue →</span>
              </button>
            )}

            {cultureNotes.map((note) => (
              <aside key={note.title} className="lo-culture card">
                <div className="lo-culture-head">
                  <span className="lo-culture-icon">🇫🇷</span>
                  <h3 className="lo-culture-title">{note.title}</h3>
                </div>
                <p className="lo-culture-text">{note.text}</p>
              </aside>
            ))}

            {onStartPractice && (
              <div className="lo-cta">
                <button type="button" className="btn btn--primary btn--full lo-cta-btn" onClick={onStartPractice}>
                  <span>Commencer les exercices</span>
                  <span className="lo-cta-arrow">→</span>
                </button>
                <p className="lo-cta-hint">~30 min · cartes, quiz, phrases, verbes & mission</p>
              </div>
            )}
            {!onStartPractice && onAdoptAndPractice && (
              <div className="lo-cta">
                <p className="lo-cta-hint lo-cta-hint--peek">
                  Mémo seulement
                  {practiceLabel ? ` — la pratique reste sur ${practiceLabel}` : ''}.
                </p>
                <button type="button" className="btn btn--primary btn--full lo-cta-btn" onClick={onAdoptAndPractice}>
                  <span>Marquer Terminé et pratiquer</span>
                  <span className="lo-cta-arrow">→</span>
                </button>
              </div>
            )}
          </section>
        )}

        {tab === 'grammar' && (
          <section className="lesson-section">
            {selectedGrammar ? (
              <>
                <BackToIndex label="Tous les points de grammaire" onClick={() => setItem(null)} />
                <GrammarArticle point={selectedGrammar} />
              </>
            ) : (
              <div className="lesson-topic-grid">
                {lesson.grammar.map((point, i) => (
                  <TopicCard
                    key={point.id}
                    index={i + 1}
                    title={point.title}
                    summary={point.summary}
                    onClick={() => openGrammar(point.id)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {tab === 'vocab' && (
          <section className="lesson-section">
            {selectedVocab ? (
              <>
                <BackToIndex label="Tous les thèmes" onClick={() => setItem(null)} />
                <div className="vocab-group card">
                  <h3 className="vocab-cat">{selectedVocab.category}</h3>
                  <dl className="vocab-list">
                    {selectedVocab.items.map((vocabItem) => (
                      <div key={vocabItem.id} className="vocab-row">
                        <dt className="vocab-fr">{vocabItem.french}</dt>
                        <dd className="vocab-en">
                          {vocabItem.english}
                          {vocabItem.hint && <span className="vocab-hint"> · {vocabItem.hint}</span>}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </>
            ) : (
              <div className="lesson-topic-grid">
                {vocabByCategory.map((group) => (
                  <TopicCard
                    key={group.category}
                    title={group.category}
                    summary={`${group.items.length} mot${group.items.length > 1 ? 's' : ''}`}
                    count={group.items.length}
                    onClick={() => openVocab(group.category)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {tab === 'verbs' && (
          <section className="lesson-section">
            {selectedVerb ? (
              <>
                <BackToIndex label="Tous les verbes" onClick={() => setItem(null)} />
                <VerbArticle verb={selectedVerb} />
              </>
            ) : (
              groupVerbs(conjugationExercises).map((g) => (
                <div key={g.group} className="verb-group-block">
                  <p className="lo-explore-label">{g.label}</p>
                  <div className="lesson-topic-grid">
                    {g.items.map((verb) => (
                      <TopicCard
                        key={verb.id}
                        title={verb.verb}
                        summary={verb.english}
                        onClick={() => openVerb(verb.id)}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </section>
        )}

        {tab === 'phrases' && (
          <section className="lesson-section">
            <div className="card">
              <p className="lesson-hint">
                Phrases utiles à mémoriser — elles reviennent dans les exercices et missions.
              </p>
            </div>
            <div className="lesson-topic-grid">
              {lesson.keyPhrases.map((phrase) => (
                <div key={phrase.french} className="phrase-card card">
                  {phrase.context && (
                    <span className="phrase-context">{phrase.context}</span>
                  )}
                  <p className="phrase-fr">{phrase.french}</p>
                  <p className="phrase-en">{phrase.english}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === 'dialogue' && lesson.dialogue && (
          <section className="lesson-section">
            <div className="dialogue-card card">
              <h3 className="dialogue-title">{lesson.dialogue.title}</h3>
              {lesson.dialogue.setting && (
                <p className="dialogue-setting">{lesson.dialogue.setting}</p>
              )}
              <ol className="dialogue-lines">
                {lesson.dialogue.lines.map((line, i) => (
                  <li key={`${line.speaker}-${i}`} className="dialogue-line">
                    <span className="dialogue-speaker">{line.speaker}</span>
                    <p className="dialogue-fr">{line.french}</p>
                    <p className="dialogue-en">{line.english}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function TopicCard({
  index,
  title,
  summary,
  count,
  onClick,
}: {
  index?: number;
  title: string;
  summary: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button type="button" className="lesson-topic-card" onClick={onClick}>
      <span className="lesson-topic-top">
        {index != null && (
          <span className="lesson-topic-num">{String(index).padStart(2, '0')}</span>
        )}
        {count != null && index == null && (
          <span className="lesson-topic-count">{count}</span>
        )}
        <span className="lesson-topic-arrow" aria-hidden="true">→</span>
      </span>
      <span className="lesson-topic-title">{title}</span>
      <span className="lesson-topic-summary">{summary}</span>
    </button>
  );
}

function SituationMemo({
  situation,
  unit,
  onBack,
  onOpenGrammar,
  onOpenVerb,
}: {
  situation: LessonSituation;
  unit: UnitContent;
  onBack: () => void;
  onOpenGrammar: (id: string) => void;
  onOpenVerb: (id: string) => void;
}) {
  const grammar = situation.grammarIds
    .map((id) => unit.lesson.grammar.find((g) => g.id === id))
    .filter((g): g is GrammarPoint => Boolean(g));
  const phrases = unit.lesson.keyPhrases.filter(
    (p) => p.context && situation.phraseContexts.includes(p.context),
  );
  const verbs = (situation.verbIds ?? [])
    .map((id) => unit.conjugationExercises.find((v) => v.id === id))
    .filter((v): v is ConjugationExercise => Boolean(v));

  return (
    <section className="lesson-section situation-memo">
      <BackToIndex label="Tableau de l'unité" onClick={onBack} />
      <header className="situation-memo-head">
        <span className="situation-num">Situation {situation.number}</span>
        <h2 className="situation-memo-title">{situation.title}</h2>
        <p className="situation-memo-goal">{situation.goal}</p>
      </header>
      <div className="lesson-topic-grid">
        {grammar.map((point, i) => (
          <TopicCard
            key={point.id}
            index={i + 1}
            title={point.title}
            summary={point.summary}
            onClick={() => onOpenGrammar(point.id)}
          />
        ))}
      </div>
      {verbs.length > 0 && (
        <div className="verb-group-block">
          <p className="lo-explore-label">Verbes</p>
          <div className="lesson-topic-grid">
            {verbs.map((verb) => (
              <TopicCard
                key={verb.id}
                title={verb.verb}
                summary={verb.english}
                onClick={() => onOpenVerb(verb.id)}
              />
            ))}
          </div>
        </div>
      )}
      {phrases.length > 0 && (
        <div className="verb-group-block">
          <p className="lo-explore-label">Phrases à retenir</p>
          <div className="lesson-topic-grid">
            {phrases.map((phrase) => (
              <div key={phrase.french} className="phrase-card card">
                {phrase.context && <span className="phrase-context">{phrase.context}</span>}
                <p className="phrase-fr">{phrase.french}</p>
                <p className="phrase-en">{phrase.english}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function BackToIndex({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="lesson-back" onClick={onClick}>
      <span aria-hidden="true">←</span>
      {label}
    </button>
  );
}

function GrammarArticle({ point }: { point: GrammarPoint }) {
  return (
    <article className="grammar-card card">
      <h3 className="grammar-title">{point.title}</h3>
      <p className="grammar-summary">{point.summary}</p>
      {point.explanation && (
        <div className="grammar-explanation">
          {point.explanation.split('\n\n').map((para) => (
            <p key={para.slice(0, 40)}>{para}</p>
          ))}
        </div>
      )}
      {point.rules && (
        <ul className="grammar-rules">
          {point.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      )}
      <div className="grammar-examples">
        {point.examples.map((ex) => (
          <div key={ex.french} className="grammar-example">
            <span className="grammar-fr">{ex.french}</span>
            <span className="grammar-en">{ex.english}</span>
            {ex.note && <span className="grammar-note">{ex.note}</span>}
          </div>
        ))}
      </div>
      {point.commonMistakes && point.commonMistakes.length > 0 && (
        <div className="grammar-mistakes">
          <p className="grammar-mistakes-title">Pièges fréquents</p>
          {point.commonMistakes.map((m) => (
            <div key={m.wrong} className="grammar-mistake">
              <p className="grammar-mistake-pair">
                <span className="grammar-wrong">{m.wrong}</span>
                <span className="grammar-mistake-arrow" aria-hidden="true">→</span>
                <span className="grammar-right">{m.right}</span>
              </p>
              <p className="grammar-mistake-why">{m.why}</p>
            </div>
          ))}
        </div>
      )}
      {point.tip && <p className="grammar-tip">💡 {point.tip}</p>}
    </article>
  );
}

function VerbArticle({ verb }: { verb: ConjugationExercise }) {
  return (
    <article className="verb-card card">
      <div className="verb-header">
        <div className="verb-header-text">
          <h3 className="verb-name">{verb.verb}</h3>
          <span className="verb-meta">{verb.tense} · {verb.english}</span>
        </div>
        <span className="verb-group-badge">{verbGroupLabel[verb.group]}</span>
      </div>
      {verb.patternNote && <p className="verb-note">{verb.patternNote}</p>}
      {verb.stem && (
        <p className="verb-legend">
          <span className="conj-stem">radical</span>
          {' · '}
          <span className="conj-ending">terminaison</span>
        </p>
      )}
      <table className="conj-table">
        <tbody>
          {verb.rows.map((row) => (
            <tr key={row.pronoun}>
              <td className="conj-pr">{row.pronoun}</td>
              <td className="conj-form">
                <ConjForm form={row.answer} stem={verb.stem} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {verb.examples && verb.examples.length > 0 && (
        <div className="verb-examples">
          <p className="verb-examples-label">En contexte</p>
          {verb.examples.map((ex) => (
            <div key={ex.french} className="grammar-example">
              <span className="grammar-fr">{ex.french}</span>
              <span className="grammar-en">{ex.english}</span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
