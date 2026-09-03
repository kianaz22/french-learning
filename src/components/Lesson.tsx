import { useState } from 'react';
import type { UnitContent } from '../data/types';
import { flashcardCategories } from '../data/types';

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
  onStartPractice?: () => void;
};

const exploreSections: { id: Tab; label: string; desc: string; icon: string; count: (u: UnitContent) => number }[] = [
  { id: 'grammar', label: 'Grammaire', desc: 'Explications, règles & pièges', icon: '✦', count: (u) => u.lesson.grammar.length },
  { id: 'vocab', label: 'Vocabulaire', desc: 'Par thème', icon: '📚', count: (u) => u.flashcards.length },
  { id: 'verbs', label: 'Verbes', desc: 'Tableaux de conjugaison', icon: '↻', count: (u) => u.conjugationExercises.length },
  { id: 'phrases', label: 'Phrases clés', desc: 'Expressions utiles', icon: '💬', count: (u) => u.lesson.keyPhrases.length },
];

export function Lesson({ unit, onStartPractice }: Props) {
  const [tab, setTab] = useState<Tab>('overview');
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
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="lesson-body">
        {tab === 'overview' && (
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
              <p className="lo-desc">{lesson.overview}</p>
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

            <div className="lo-explore">
              <p className="lo-explore-label">Explorer la leçon</p>
              <div className="lo-explore-grid">
                {exploreSections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    className="lo-explore-card"
                    onClick={() => setTab(section.id)}
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
                    onClick={() => setTab('dialogue')}
                  >
                    <span className="lo-explore-icon">🎭</span>
                    <span className="lo-explore-name">Dialogue</span>
                    <span className="lo-explore-desc">Conversation modèle</span>
                    <span className="lo-explore-count">{lesson.dialogue.lines.length}</span>
                  </button>
                )}
              </div>
            </div>

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

            <div className="lo-grammar-preview card">
              <div className="lo-grammar-preview-head">
                <h3 className="lo-grammar-preview-title">Points de grammaire</h3>
                <button type="button" className="lo-see-all" onClick={() => setTab('grammar')}>
                  Tout voir →
                </button>
              </div>
              <div className="lo-grammar-chips">
                {lesson.grammar.map((point) => (
                  <button
                    key={point.id}
                    type="button"
                    className="lo-grammar-chip"
                    onClick={() => setTab('grammar')}
                  >
                    {point.title}
                  </button>
                ))}
              </div>
            </div>

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
              <button type="button" className="lo-dialogue-preview card" onClick={() => setTab('dialogue')}>
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
          </section>
        )}

        {tab === 'grammar' && (
          <section className="lesson-section">
            {lesson.grammar.map((point) => (
              <article key={point.id} className="grammar-card card">
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
            ))}
          </section>
        )}

        {tab === 'vocab' && (
          <section className="lesson-section">
            {vocabByCategory.map(({ category, items }) => (
              <div key={category} className="vocab-group card">
                <h3 className="vocab-cat">{category}</h3>
                <dl className="vocab-list">
                  {items.map((item) => (
                    <div key={item.id} className="vocab-row">
                      <dt className="vocab-fr">{item.french}</dt>
                      <dd className="vocab-en">
                        {item.english}
                        {item.hint && <span className="vocab-hint"> · {item.hint}</span>}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </section>
        )}

        {tab === 'verbs' && (
          <section className="lesson-section">
            {conjugationExercises.map((verb) => (
              <div key={verb.id} className="verb-card card">
                <div className="verb-header">
                  <h3 className="verb-name">{verb.verb}</h3>
                  <span className="verb-meta">{verb.tense} · {verb.english}</span>
                </div>
                <table className="conj-table">
                  <tbody>
                    {verb.rows.map((row) => (
                      <tr key={row.pronoun}>
                        <td className="conj-pr">{row.pronoun}</td>
                        <td className="conj-form">{row.answer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </section>
        )}

        {tab === 'phrases' && (
          <section className="lesson-section">
            <div className="card">
              <p className="lesson-hint">
                Phrases utiles à mémoriser — elles reviennent dans les exercices et missions.
              </p>
            </div>
            {lesson.keyPhrases.map((phrase) => (
              <div key={phrase.french} className="phrase-card card">
                {phrase.context && (
                  <span className="phrase-context">{phrase.context}</span>
                )}
                <p className="phrase-fr">{phrase.french}</p>
                <p className="phrase-en">{phrase.english}</p>
              </div>
            ))}
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
