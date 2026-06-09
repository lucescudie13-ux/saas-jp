-- =====================================================================
-- seed.sql — Jeu d'exemple repris du prototype (pour tester l'app).
-- Tu remplaceras/compléteras ce contenu par le tien.
-- Idempotent : ré-exécutable (on conflict do nothing / upsert par slug).
-- =====================================================================

-- ------------------------- Vocabulaire -------------------------------
insert into vocab_items (slug, level, type, lemma, reading, gloss, readings, sens, decomp, keys, mnemo, origin, cn, examples, confuse, conj, usage, position) values
('hi','N5','kanji','日','ひ・にち','soleil, jour',
 '[{"k":"on","v":"ニチ・ジツ"},{"k":"kun","v":"ひ・か"}]',
 '{"together":"<strong>日</strong> signifie « soleil » et, par extension, « jour ».","parts":[{"g":"日","r":"ニチ / ひ","m":"ne se décompose pas davantage."}]}',
 'Pictogramme : un cercle avec un point central représentant le soleil.',
 '[{"g":"日","n":"clé « soleil » (radical 72)"}]',
 'Un disque solaire avec une tache en son centre.',
 'Pictogramme du soleil.',
 '{"has":true,"glyph":"日","pinyin":"rì","note":"Identique au chinois.","hsk":"HSK 1"}',
 '[{"jp":"今日はいい天気です。","yomi":"きょうは いい てんきです。","fr":"Il fait beau aujourd''hui."},{"jp":"日曜日に会いましょう。","yomi":"にちようびに あいましょう。","fr":"Retrouvons-nous dimanche."}]',
 '[{"g":"太陽","n":"たいよう","d":"« le Soleil » en tant qu''astre (terme scientifique)."}]',
 null,'Caractère fondamental, extrêmement fréquent et neutre.',1),
('mizu','N5','kanji','水','みず','eau',
 '[{"k":"on","v":"スイ"},{"k":"kun","v":"みず"}]',
 '{"together":"<strong>水 (みず)</strong> signifie « eau ».","parts":[{"g":"水","r":"スイ / みず","m":"l''eau qui s''écoule."}]}',
 'Pictogramme : un trait central et des éclaboussures.',
 '[{"g":"水","n":"clé « eau » (radical 85)"},{"g":"氵","n":"forme combinée (sanzui)"}]',
 'Une rivière vue d''en haut.','Pictogramme d''un cours d''eau.',
 '{"has":true,"glyph":"水","pinyin":"shuǐ","note":"Identique au chinois.","hsk":"HSK 1"}',
 '[{"jp":"水を一杯ください。","yomi":"みずを いっぱい ください。","fr":"Un verre d''eau, s''il vous plaît."}]',
 '[{"g":"湯","n":"ゆ","d":"« eau chaude »."}]',
 null,'Très courant et neutre.',2),
('taberu','N5','verbe','食べる','たべる','manger',
 '[{"k":"on","v":"ショク"},{"k":"kun","v":"た(べる)・く(う)"}]',
 '{"together":"<strong>食べる (たべる)</strong> signifie « manger ».","parts":[{"g":"食","r":"ショク / た(べる)","m":"manger, nourriture."},{"g":"べる","r":"—","m":"okurigana."}]}',
 '食 = un couvercle au-dessus d''un récipient.',
 '[{"g":"食","n":"clé « manger » (radical 184)"}]',
 'Un toit posé sur un bol bien rempli.','Pictogramme d''un récipient à nourriture.',
 '{"has":true,"glyph":"食","pinyin":"shí","note":"Existe en chinois.","hsk":"HSK 3"}',
 '[{"jp":"寿司を食べたいです。","yomi":"すしを たべたいです。","fr":"Je veux manger des sushis."}]',
 '[{"g":"食う","n":"くう","d":"« bouffer » : familier."}]',
 '{"group":"Verbe ichidan (2ᵉ groupe)","rows":[["Forme polie (-masu)","食べます"],["Négatif","食べない"],["Passé","食べた"],["Forme en -te","食べて"],["Potentiel","食べられる"],["Volitif","食べよう"]]}',
 'Verbe neutre et passe-partout.',3),
('manabu','N4','verbe','学ぶ','まなぶ','apprendre, étudier',
 '[{"k":"on","v":"ガク"},{"k":"kun","v":"まな(ぶ)"}]',
 '{"together":"<strong>学ぶ (まなぶ)</strong> signifie « apprendre, étudier ».","parts":[{"g":"学","r":"ガク / まな(ぶ)","m":"étude, science."},{"g":"ぶ","r":"—","m":"okurigana."}]}',
 '学 est une forme simplifiée de 學.',
 '[{"g":"子","n":"clé « enfant » (radical 39)"},{"g":"冖","n":"toit"}]',
 'Sous un toit, un enfant reçoit le savoir.','À l''origine (學), deux mains transmettant un savoir.',
 '{"has":true,"glyph":"学","pinyin":"xué","note":"Identique au chinois simplifié.","hsk":"HSK 1"}',
 '[{"jp":"日本語を学ぶのはとても楽しいです。","yomi":"にほんごを まなぶのは とても たのしいです。","fr":"Apprendre le japonais est très amusant."}]',
 '[{"g":"習う","n":"ならう","d":"apprendre par la pratique."},{"g":"勉強する","n":"べんきょうする","d":"étudier au sens d''efforts."}]',
 '{"group":"Verbe godan (1ᵉʳ groupe)","rows":[["Forme polie (-masu)","学びます"],["Négatif","学ばない"],["Passé","学んだ"],["Forme en -te","学んで"],["Potentiel","学べる"],["Volitif","学ぼう"]]}',
 'Registre neutre à soutenu.',4),
('kotoba','N4','mot','言葉','ことば','mot, parole, langage',
 '[{"k":"kun","v":"こと・ば"}]',
 '{"together":"<strong>言葉 (ことば)</strong> désigne « les mots, la parole, le langage ».","parts":[{"g":"言","r":"ゲン / い(う)","m":"dire, parole."},{"g":"葉","r":"ヨウ / は","m":"feuille."}]}',
 '言 = clé de la parole ; 葉 = herbe + 世 + arbre.',
 '[{"g":"言","n":"clé « parole » (radical 149)"},{"g":"艹","n":"clé « herbe »"}]',
 'Les paroles tombent comme des feuilles.','言 pictogramme d''une bouche.',
 '{"has":true,"glyph":"言 / 叶","pinyin":"yán / yè","note":"La combinaison 言葉 est propre au japonais.","hsk":"言 : HSK 4"}',
 '[{"jp":"優しい言葉をありがとう。","yomi":"やさしい ことばを ありがとう。","fr":"Merci pour ces mots gentils."}]',
 '[{"g":"単語","n":"たんご","d":"« mot » au sens d''unité de vocabulaire."},{"g":"言語","n":"げんご","d":"« langue » au sens linguistique."}]',
 null,'Mot du quotidien, très courant.',5),
('utsukushii','N4','adjectif','美しい','うつくしい','beau, magnifique',
 '[{"k":"on","v":"ビ"},{"k":"kun","v":"うつく(しい)"}]',
 '{"together":"<strong>美しい (うつくしい)</strong> : « beau, magnifique », nuance littéraire.","parts":[{"g":"美","r":"ビ / うつく(しい)","m":"beauté."},{"g":"しい","r":"—","m":"okurigana."}]}',
 null,'[{"g":"美","n":"radical de la beauté"}]',
 'Quelque chose de grand et harmonieux.',null,
 '{"has":true,"glyph":"美","pinyin":"měi","note":"Existe en chinois.","hsk":"HSK 3"}',
 '[{"jp":"美しい景色ですね。","yomi":"うつくしい けしきですね。","fr":"Quel beau paysage."}]',
 '[{"g":"きれい","n":"綺麗","d":"« joli / propre », plus courant et concret."}]',
 '{"group":"Adjectif en -い","rows":[["Présent","美しい"],["Négatif","美しくない"],["Passé","美しかった"],["Adverbe","美しく"]]}',
 'Plutôt soutenu et littéraire.',6)
on conflict (slug) do nothing;

-- --------------------------- Phrases ---------------------------------
insert into phrases (slug, level, lemma, reading, gloss, position) values
('p1','N5','これをください','これ を ください','Ceci, s''il vous plaît.',1),
('p2','N5','すみません','すみません','Excusez-moi / Pardon.',2),
('p3','N5','いくらですか','いくら です か','C''est combien ?',3)
on conflict (slug) do nothing;

-- --------------------------- Grammaire -------------------------------
insert into grammar_points (slug, level, lemma, gloss, detail, position) values
('g1','N5','〜は〜です','A は B です — « A est B ».','は marque le thème, です est la copule polie « être ».',1),
('g2','N5','〜を','Particule を — complément d''objet direct.','を (« o ») marque l''objet direct, placé avant le verbe.',2),
('g3','N5','〜ます','Forme polie des verbes au présent.','Employée en situation courante et polie.',3)
on conflict (slug) do nothing;

insert into grammar_questions (grammar_id, direction, prompt, answer, position)
select g.id, 'FR_JP', x.prompt, x.answer, x.pos from grammar_points g
join (values
  ('g1','Je suis Luc.','私はルークです。',1),
  ('g1','C''est un livre.','これは本です。',2),
  ('g2','Je mange du pain.','パンを食べます。',1),
  ('g2','J''apprends le japonais.','日本語を学びます。',2),
  ('g3','Je mange.','食べます。',1)
) as x(slug,prompt,answer,pos) on x.slug = g.slug
where not exists (select 1 from grammar_questions q where q.grammar_id = g.id and q.prompt = x.prompt);

insert into grammar_questions (grammar_id, direction, prompt, answer, position)
select g.id, 'JP_FR', x.prompt, x.answer, x.pos from grammar_points g
join (values
  ('g1','田中さんは先生です。','M. Tanaka est professeur.',1),
  ('g2','コーヒーを飲みます。','Je bois un café.',1),
  ('g3','行きます。','Je vais / j''y vais.',1)
) as x(slug,prompt,answer,pos) on x.slug = g.slug
where not exists (select 1 from grammar_questions q where q.grammar_id = g.id and q.prompt = x.prompt);

-- --------------------------- Dialogue --------------------------------
insert into dialogues (slug, level, lemma, reading, gloss, title, position) values
('d1','N5','カフェで注文','カフェ で ちゅうもん','Commander dans un café.','Au café',1)
on conflict (slug) do nothing;

insert into dialogue_lines (dialogue_id, speaker, jp, fr, position)
select d.id, x.who, x.jp, x.fr, x.pos from dialogues d
join (values
  ('d1','店員','いらっしゃいませ。','Bienvenue !',1),
  ('d1','客','コーヒーをください。','Un café, s''il vous plaît.',2),
  ('d1','店員','かしこまりました。少々お待ちください。','Bien, tout de suite.',3),
  ('d1','客','ありがとうございます。','Merci beaucoup.',4)
) as x(slug,who,jp,fr,pos) on x.slug = d.slug
where not exists (select 1 from dialogue_lines l where l.dialogue_id = d.id and l.position = x.pos);

insert into dialogue_questions (dialogue_id, prompt, answer, position)
select d.id, x.prompt, x.answer, x.pos from dialogues d
join (values
  ('d1','Qu''est-ce que le client commande ?','コーヒー — un café.',1),
  ('d1','Quelle particule marque l''objet « café » ?','を',2)
) as x(slug,prompt,answer,pos) on x.slug = d.slug
where not exists (select 1 from dialogue_questions q where q.dialogue_id = d.id and q.position = x.pos);

-- --------------------------- Lecture ---------------------------------
insert into readings (slug, level, title, body, translation, position) values
('r1','N5','Une journée','今日はいい天気です。私はカフェでコーヒーを飲みます。それから、日本語を少し学びます。','Aujourd''hui il fait beau. Je bois un café au café. Ensuite, j''étudie un peu le japonais.',1)
on conflict (slug) do nothing;

insert into reading_questions (reading_id, prompt, answer, position)
select r.id, x.prompt, x.answer, x.pos from readings r
join (values
  ('r1','Quel temps fait-il aujourd''hui ?','いい天気 — il fait beau.',1),
  ('r1','Que fait-elle ensuite ?','日本語を学びます.',2)
) as x(slug,prompt,answer,pos) on x.slug = r.slug
where not exists (select 1 from reading_questions q where q.reading_id = r.id and q.position = x.pos);

-- ---------------------- Leçon N5-1 + composition ----------------------
insert into lessons (level, number, title, summary, position) values
('N5',1,'Premiers mots','Vocabulaire de base, phrases de survie et la structure A は B です.',1)
on conflict (level, number) do nothing;

insert into lesson_items (lesson_id, kind, item_id, position)
select l.id, 'vocab'::item_type, v.id, v.position
from lessons l, vocab_items v
where l.level='N5' and l.number=1 and v.slug in ('hi','mizu','taberu')
and not exists (select 1 from lesson_items li where li.lesson_id=l.id and li.kind='vocab' and li.item_id=v.id);

insert into lesson_items (lesson_id, kind, item_id, position)
select l.id, 'phrase'::item_type, p.id, p.position
from lessons l, phrases p
where l.level='N5' and l.number=1 and p.slug in ('p1','p2','p3')
and not exists (select 1 from lesson_items li where li.lesson_id=l.id and li.kind='phrase' and li.item_id=p.id);

insert into lesson_items (lesson_id, kind, item_id, position)
select l.id, 'grammar'::item_type, g.id, g.position
from lessons l, grammar_points g
where l.level='N5' and l.number=1 and g.slug in ('g1','g2','g3')
and not exists (select 1 from lesson_items li where li.lesson_id=l.id and li.kind='grammar' and li.item_id=g.id);

insert into lesson_items (lesson_id, kind, item_id, position)
select l.id, 'dialogue'::item_type, d.id, 0 from lessons l, dialogues d
where l.level='N5' and l.number=1 and d.slug='d1'
and not exists (select 1 from lesson_items li where li.lesson_id=l.id and li.kind='dialogue' and li.item_id=d.id);

insert into lesson_items (lesson_id, kind, item_id, position)
select l.id, 'reading'::item_type, r.id, 0 from lessons l, readings r
where l.level='N5' and l.number=1 and r.slug='r1'
and not exists (select 1 from lesson_items li where li.lesson_id=l.id and li.kind='reading' and li.item_id=r.id);

-- --------------------------- Réussites -------------------------------
insert into achievements (slug, title, emoji, description, position) values
('streak-7','Série de 7 jours','🔥','Sept jours d''affilée.',1),
('words-100','100 mots appris','📚','Cap des 100 mots.',2),
('first-lesson','Première leçon terminée','🎌','Bravo pour la première !',3),
('n5-complete','Niveau N5 complété','🏆','Tout le N5 bouclé.',4)
on conflict (slug) do nothing;
