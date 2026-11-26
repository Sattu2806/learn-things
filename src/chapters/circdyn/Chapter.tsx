import { ChapterShell } from '../NotesPage';

/** Placeholder until the chapter is written. */
export default function Chapter() {
  return (
    <ChapterShell id="circdyn" sections={[{ id: 'soon', title: 'Being written', group: 'Theory' }]} sideTitle="Coming soon" sideLead="This chapter is being written.">
      <section className="t-section" id="t-soon">
        <p>This chapter is being written.</p>
      </section>
    </ChapterShell>
  );
}
