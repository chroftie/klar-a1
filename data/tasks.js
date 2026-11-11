const listeningText = `
tanisma|Wie heißt der Mann mit Nachnamen?|Guten Tag, ich bin Daniel Weber. Ich habe heute einen Termin bei Frau Klein.|Klein|Weber|Müller|1|Weber erkeğin soyadı. Frau Klein randevu aldığı kişi.
aile|Wie alt ist Noras Sohn?|Das ist mein Sohn Leon. Er ist acht Jahre alt. Seine Schwester ist schon elf.|8|11|18|0|Acht sekiz demektir. Elf kız kardeşinin yaşı.
kurs|In welchem Raum ist der Kurs heute?|Der Deutschkurs ist heute nicht in Raum zwölf. Gehen Sie bitte in Raum zwanzig.|Raum 12|Raum 2|Raum 20|2|Nicht in Raum zwölf, on ikinci odada olmadığını söylüyor.
alisveris|Was kostet ein Kilo Tomaten?|Was kosten die Tomaten? Heute kostet ein Kilo zwei Euro fünfzig. Normal kostet es drei Euro.|2,15 €|2,50 €|3,00 €|1|Zwei Euro fünfzig, 2,50 avro. Üç avro normal fiyat.
saat|Um wie viel Uhr treffen sie sich?|Treffen wir uns um halb sieben? Ja, gerne. Um sechs Uhr dreißig bin ich da.|06:30|07:30|07:00|0|Halb sieben, saat 6.30 anlamına gelir.
ev|Wie viele Zimmer hat die Wohnung?|Die Wohnung ist hell und hat drei Zimmer. Im Haus gibt es leider keinen Aufzug.|2|4|3|2|Hat drei Zimmer, üç odası var.
ulasim|Der Zug fährt heute von Gleis 6 ab.|Achtung am Bahnhof. Der Zug nach Mainz fährt heute von Gleis sechs ab, nicht von Gleis zwei.|Richtig|Falsch||0|Doğru. Gleis sechs, altıncı peron.
saglik|Die Praxis ist am Freitag geöffnet.|Guten Tag. Die Praxis am Markt ist von Montag bis Donnerstag geöffnet. Am Freitag bleibt sie geschlossen.|Richtig|Falsch||1|Geschlossen kapalı demektir. Muayenehane cuma kapalı.
giyim|Die Kundinnen und Kunden sollen zur Kasse gehen.|Liebe Kundinnen und Kunden, wir schließen in fünf Minuten. Gehen Sie bitte jetzt zur Kasse. Vielen Dank.|Richtig|Falsch||0|Zur Kasse gehen, kasaya gitmek.
davet|Der Film beginnt um 20 Uhr.|Der Film im Saal zwei beginnt heute um neunzehn Uhr dreißig. Einlass ist ab neunzehn Uhr.|Richtig|Falsch||1|Başlangıç 19.30. Einlass içeri giriş saatini bildirir.
is|Wann soll Mila arbeiten?|Hallo Mila, hier ist Ben aus dem Büro. Bitte komm am Mittwoch erst um zehn Uhr. Am Dienstag brauchst du nicht zu kommen.|Dienstag um 10 Uhr|Mittwoch um 10 Uhr|Mittwoch um 8 Uhr|1|Mittwoch çarşamba. Erst um zehn, ancak saat onda.
gecmis|Für welche Nacht ist die Reservierung?|Guten Tag, Hotel Linden. Ihr Doppelzimmer ist für die Nacht von Freitag auf Samstag reserviert. Rufen Sie uns bei Fragen an.|Donnerstag auf Freitag|Samstag auf Sonntag|Freitag auf Samstag|2|Von Freitag auf Samstag, cuma gecesi cumartesiye kadar.
saglik|Was soll Lena mitbringen?|Hallo Lena. Dein Termin ist am Montag um elf. Bring bitte deine Versichertenkarte mit. Den Befund haben wir schon.|Die Versichertenkarte|Den Befund|Ein Rezept|0|Mitbringen yanında getirmek. Versichertenkarte sağlık sigortası kartı.
ev|Wo liegt der Schlüssel?|Hallo, hier ist Amir. Ich bin noch im Büro. Der Schlüssel für die Wohnung liegt bei Frau Roth im Erdgeschoss.|Im Büro|Bei Frau Roth|In der Wohnung|1|Bei Frau Roth, Bayan Roth’ta. Arayan kişi ofiste.
davet|Was soll Tom zur Feier bringen?|Hallo Tom, danke, dass du am Samstag kommst. Getränke habe ich genug. Kannst du einen Kuchen mitbringen?|Einen Kuchen|Getränke|Ein Geschenk|0|Getränke içecekler. İstenen şey Kuchen, yani kek.
kurs|Wann beginnt die Prüfung?|Die Prüfung beginnt morgen um neun. Bitte seien Sie schon um Viertel vor neun im Raum.|08:45|09:00|09:15|1|Sınav 9.00’da başlıyor. 8.45, salonda olman gereken saat.
ulasim|Wie kommt Mira ins Zentrum?|Hallo Mira. Die U-Bahn fährt heute nicht. Nimm bitte den Bus Nummer vier bis zum Rathaus.|Mit dem Bus 4|Mit der U-Bahn|Mit dem Bus 14|0|Nimm den Bus Nummer vier, dört numaralı otobüse bin.
alisveris|Welches Getränk bestellt der Gast?|Für mich bitte keinen Tee. Ich nehme ein Glas Apfelsaft. Meine Freundin möchte einen Kaffee.|Tee|Kaffee|Apfelsaft|2|Misafir elma suyu alıyor. Kahve arkadaşının siparişi.
saat|Wann ruft Jana wieder an?|Hallo, hier ist Jana. Ich kann gerade nicht sprechen. Ich rufe dich um Viertel nach vier wieder an.|16:15|15:45|16:45|0|Viertel nach vier, dördü çeyrek geçe.
is|Was muss Paul heute machen?|Paul, heute musst du zuerst die E-Mails lesen. Die Briefe können bis morgen warten.|Briefe schreiben|E-Mails lesen|Morgen anrufen|1|Zuerst önce demektir. Bugün e-postaları okumalı.
giyim|Welche Größe sucht die Kundin?|Die Jacke in Größe M ist zu klein. Haben Sie dieselbe Jacke in Größe L?|S|M|L|2|M küçük geldiği için L beden arıyor.
tanisma|Wo wohnt Sofia jetzt?|Ich heiße Sofia. Ich komme aus Wien, aber jetzt wohne ich in Hamburg.|Wien|Hamburg|Berlin|1|Woher geldiği Viyana, oturduğu şehir Hamburg.
aile|Wer holt das Kind ab?|Heute kann ich nicht zur Schule kommen. Unser Sohn wartet dort. Sein Vater holt ihn um drei ab.|Seine Mutter|Sein Vater|Seine Schwester|1|Sein Vater, babası.
gecmis|Was hat Sara gestern gemacht?|Gestern bin ich nicht nach Köln gefahren. Ich habe den ganzen Tag zu Hause gearbeitet.|Sie war in Köln.|Sie hat zu Hause gearbeitet.|Sie war im Hotel.|1|Nicht nach Köln gefahren olumsuz. Evde çalışmış.
`;
function makeChoice(id,skill,topic,stem,options,answer,explain,extra={}){
  return {id,kind:'choice',skill,topic,stem,options,answer:Number(answer),explain,...extra};
}
export const listening = listeningText.trim().split('\n').map((line,i)=>{
  const [topic,stem,transcript,a,b,c,answer,explain]=line.split('|');
  const id=`listen-${i+1}`;
  return makeChoice(id,'listening',topic,stem,[a,b,c].filter(Boolean),answer,explain,{transcript,audio:`./assets/audio/${id}.mp3`,plays:i>=6&&i<=9?1:2});
});

const readingText = String.raw`
tanisma|Nina wohnt jetzt in Essen.|Hallo Lea, ich bin jetzt in Essen. Ich wohne mit meiner Freundin in der Nähe vom Bahnhof. Besuch mich bald! Nina|Richtig|Falsch||0|Ich bin jetzt in Essen ve ich wohne, Nina’nın artık Essen’de yaşadığını gösterir.
saat|Das Treffen ist am Dienstag.|Hallo Deniz, am Dienstag muss ich arbeiten. Hast du am Donnerstag um 18 Uhr Zeit? Wir können uns vor dem Kino treffen. Timo|Richtig|Falsch||1|Salı çalışıyor. Donnerstag yani perşembe için öneri yapıyor.
ev|Die Wohnung hat einen Balkon.|Ich habe eine neue Wohnung. Sie hat zwei Zimmer und einen kleinen Balkon. Am Samstag kannst du sie sehen. Liebe Grüße, Lotte|Richtig|Falsch||0|Einen kleinen Balkon, küçük bir balkonu var.
is|Juri beginnt morgen um acht Uhr.|Hallo Juri, du beginnst morgen erst um zehn. Anna ist um acht im Laden. Bring bitte deine Schlüssel mit. Ciao, Mo|Richtig|Falsch||1|Juri saat 10’da başlıyor. Sekizde gelen Anna.
gecmis|Selin bleibt zwei Nächte in Bremen.|Liebe Selin, dein Zimmer in Bremen ist von Freitag bis Sonntag reserviert. Frühstück gibt es ab sieben Uhr. Viele Grüße, Hotel Anker|Richtig|Falsch||0|Cuma ve cumartesi geceleri otelde kalacak.
ev|Sie suchen eine Wohnung mit zwei Zimmern. Welche Anzeige passt?|A · Helles Zimmer in einer WG. Küche und Bad gemeinsam. 310 Euro.\nB · Kleine Wohnung mit zwei Zimmern und Balkon. 620 Euro.|Anzeige A|Anzeige B||1|Wohnung mit zwei Zimmern iki odalı dairedir. A’da yalnızca bir oda kiralanıyor.
kurs|Sie arbeiten bis 17 Uhr und möchten Deutsch lernen. Welcher Kurs passt?|A · Deutsch A1: Montag und Mittwoch, 18:30–20:00 Uhr.\nB · Deutsch A1: Dienstag und Donnerstag, 10:00–11:30 Uhr.|Kurs A|Kurs B||0|A kursu işten sonra saat 18.30’da başlıyor.
gecmis|Sie möchten mit einem Hund im Hotel übernachten. Wo geht das?|A · Hotel am Park: Haustiere leider nicht erlaubt.\nB · Pension Nord: Hunde willkommen. 8 Euro pro Nacht für einen Hund.|Hotel am Park|Pension Nord||1|Hunde willkommen, köpekler kabul edilir.
giyim|Sie möchten am Sonntag Schuhe kaufen. Welcher Laden ist offen?|A · Schuhhaus West: Mo–Sa 9–18 Uhr. So geschlossen.\nB · Schuhe am Bahnhof: täglich 10–20 Uhr.|Laden A|Laden B||1|Täglich her gün anlamına gelir. So geschlossen, pazar kapalı.
davet|Sie wollen am Samstag draußen Sport machen. Was passt?|A · Laufgruppe im Park: Samstag 9 Uhr.\nB · Yoga im Studio: Freitag 17 Uhr.|Angebot A|Angebot B||0|Açık havadaki etkinlik cumartesi parkta yapılan koşu.
saglik|Sie können heute ohne Termin kommen.|Praxis Dr. Koch\nHeute nur mit Termin. Bitte rufen Sie vorher an.|Richtig|Falsch||1|Nur mit Termin, sadece randevuyla.
ulasim|Hier dürfen Sie das Fahrrad mitnehmen.|Buslinie 6\nFahrräder dürfen zwischen 9 und 16 Uhr mitfahren. Jetzt ist es 11 Uhr.|Richtig|Falsch||0|Saat 11, izin verilen aralığın içinde.
alisveris|Sie können hier bar bezahlen.|Café Ufer\nHeute ist leider nur Kartenzahlung möglich.|Richtig|Falsch||1|Nur Kartenzahlung, sadece kartla ödeme.
davet|Am Sonntag kostet der Eintritt nichts.|Stadtmuseum\nSonntag: Eintritt frei.\nDienstag bis Samstag: 6 Euro.|Richtig|Falsch||0|Eintritt frei, giriş ücretsiz.
aile|Kinder unter sechs Jahren brauchen eine Karte.|Schwimmbad\nKinder unter 6 Jahren haben freien Eintritt. Karten ab 6 Jahren: 3 Euro.|Richtig|Falsch||1|Altı yaşın altındakiler ücretsiz. Bilet 6 yaştan itibaren gerekiyor.
aile|Wann kann Emil seine Mutter anrufen?|Emil, bis 14 Uhr bin ich in der Arbeit. Ruf mich bitte nach 15 Uhr an. Mama|Vor 14 Uhr|Nach 15 Uhr|Um 12 Uhr|1|Nach 15 Uhr, saat 15’ten sonra.
kurs|Die Schule bietet auch einen Kurs am Vormittag an.|Sprachschule Mitte: Deutsch A1 · Mo und Mi 9–11 Uhr oder Di und Do 18–20 Uhr.|Richtig|Falsch||0|09–11 saatleri Vormittag, yani öğleden önce.
alisveris|Wann schließt der Markt heute?|Wegen des Feiertags schließt unser Markt heute schon um 14 Uhr. Morgen sind wir wieder bis 20 Uhr für Sie da.|14 Uhr|18 Uhr|20 Uhr|0|Heute schon um 14 Uhr, bugün saat 14’te kapanıyor.
ev|Die Wohnung liegt im dritten Stock.|Zwei Zimmer, dritter Stock, ohne Aufzug. Miete 700 Euro. Besichtigung am Montag.|Richtig|Falsch||0|Dritter Stock üçüncü kat.
giyim|Kann man die Jacke am Freitag abholen?|Blaue Jacke, Größe S. Abholung nur Samstag oder Sonntag, jeweils nach 13 Uhr.|Ja|Nein||1|Sadece cumartesi veya pazar, saat 13’ten sonra.
gecmis|Kann man im Hotel frühstücken?|Zimmer frei! Frühstück von 7 bis 10 Uhr im Erdgeschoss. Bitte melden Sie sich an der Rezeption.|Ja|Nein||0|Frühstück, kahvaltı. Kahvaltı 7–10 arasında sunuluyor.
ulasim|Wo fährt der Ersatzbus ab?|Heute keine Züge zwischen Ostbahnhof und Mitte. Ersatzbus vor dem Haupteingang.|Auf Gleis 3|Vor dem Haupteingang|Im Zug|1|Vor dem Haupteingang, ana girişin önünde.
saglik|Wann ist die Apotheke am Samstag geöffnet?|Apotheke Rosenweg · Mo–Fr 8–18 Uhr · Sa 9–12 Uhr · So geschlossen.|8–18 Uhr|9–18 Uhr|9–12 Uhr|2|Sa, Samstag’ın kısaltması. Cumartesi 9–12 arası açık.
is|Wann ist das Büro geschlossen?|Unser Büro bleibt vom 3. bis 5. Mai geschlossen. Ab dem 6. Mai sind wir wieder da.|Am 2. Mai|Am 4. Mai|Am 6. Mai|1|3–5 Mayıs kapalı olduğundan 4 Mayıs da bu aralıkta.
`;
export const reading = readingText.trim().split('\n').map((line,i)=>{
  const [topic,stem,text,a,b,c,answer,explain]=line.split('|');
  return makeChoice(`read-${i+1}`,'reading',topic,stem,[a,b,c].filter(Boolean),answer,explain,{text:text.replaceAll('\\n','\n')});
});

const grammarText = `
tanisma|Ich ___ Ada.|heißt|heiße|heißen|1|Ich ile heißen fiili heiße olur.
tanisma|Woher ___ Sie?|kommen|kommst|kommt|0|Resmî Sie ile fiil kommen biçiminde kalır.
tanisma|Doğru kelime sırasını seç.|Wo du wohnst?|Wo wohnst du?|Wohnst wo du?|1|W-sorularında soru kelimesi, çekimli fiil, özne sırası gelir.
aile|Das ist ___ Schwester.|mein|meine|meinen|1|Schwester dişil. Nominativde meine.
aile|Wir ___ zwei Kinder.|habt|hat|haben|2|Wir ile haben kullanılır.
kurs|Das ist ___ Wörterbuch. (Bu bir sözlük değil.)|keine|keinen|kein|2|Das Wörterbuch nötr. Olumsuz artikel kein.
kurs|___ Stift liegt auf dem Tisch.|Der|Die|Das|0|Stift eril. Nominativ belirli artikel der.
kurs|Ich verstehe die Frage ___.|kein|nicht|keine|1|Burada fiil olumsuzlanıyor, nicht kullanılır.
alisveris|Ich möchte ___ Kaffee.|ein|eine|einen|2|Kaffee eril. Akkusativde einen olur.
alisveris|Wie viel ___ die Äpfel?|kostet|kosten|kostest|1|Äpfel çoğul. Fiil kosten biçiminde olur.
saat|Ich ___ um sieben Uhr ___.|aufstehe / —|stehe / auf|stehen / auf|1|Ayrılabilen fiilin çekimli kısmı ikinci öğe, auf sonda.
saat|Wir treffen uns ___ Montag ___ zehn.|am / um|um / am|in / an|0|Haftanın günü am, saat um ile söylenir.
ev|Das ist ___ Küche. (Sizin mutfağınız.)|Ihr|Ihren|Ihre|2|Küche dişil. Resmî Sie için Ihre Küche.
ev|Der Stuhl steht ___ Fenster. (Pencerenin yanında.)|neben dem|neben das|neben der|0|Yer bildiriliyor. Nötr das Fenster dativde dem Fenster olur.
ulasim|Ich fahre mit ___ Bus.|der|den|dem|2|Mit dativ ister. Der Bus → dem Bus.
ulasim|Wie komme ich ___ Apotheke?|zum|zur|zu dem|1|Zu der Apotheke → zur Apotheke.
is|Morgen ___ ich früh arbeiten.|muss|müssen|musst|0|Müssen fiili ich ile muss olur. Ana fiil arbeiten sonda.
is|Er ___ gut Deutsch sprechen.|können|kann|kannst|1|Er ile kann kullanılır.
saglik|Meine Füße ___ weh.|tut|tun|tue|1|Füße çoğul, tun kullanılır.
saglik|Hier ___ Sie nicht rauchen.|dürfen|darfst|darf|0|Sie dürfen nicht, izin yok anlamında.
gecmis|Wir ___ nach Bonn gefahren.|haben|sind|ist|1|Yön değiştiren fahren Perfekt’te sein alır. Wir sind.
gecmis|Ich habe gestern einen Film ___.|sehe|gesehen|sehen|1|Sehen fiilinin Partizip II biçimi gesehen.
giyim|___ Farbe gefällt Ihnen?|Welche|Welchen|Welches|0|Farbe dişil. Nominativde welche.
giyim|Die Hose passt ___ gut. (bana)|mich|mein|mir|2|Passen dativ ister. Ich → mir.
davet|Ich lade dich ___ meiner Feier ein.|zu|nach|bei|0|Jemanden zu einer Feier einladen, birini kutlamaya davet etmek.
davet|Leider ___ ich am Freitag nicht kommen.|kannst|kann|können|1|Ich ile kann, ana fiil kommen sonda.
`;
export const grammar = grammarText.trim().split('\n').map((line,i)=>{
  const [topic,stem,a,b,c,answer,explain]=line.split('|');
  return makeChoice(`grammar-${i+1}`,'grammar',topic,stem,[a,b,c],answer,explain);
});

const form = (id,topic,stem,text,fields,explain)=>({
  id,kind:'form',skill:'writing',topic,stem,text,fields:fields.map(([label,...answers])=>({label,answers})),explain,
});
const writing = (id,topic,stem,text,points,model,modelTr)=>({
  id,kind:'writing',skill:'writing',topic,stem,text,points,model,modelTr,
});
export const forms = [
  form('form-1','kurs','Anmeldung zum Deutschkurs',
    'Mira Korkmaz wohnt in 28195 Bremen. Sie wurde am 12.04.1997 in Antalya geboren. Sie arbeitet bis 16 Uhr und möchte den Abendkurs besuchen. Ihre Telefonnummer ist 0176 20304050.',
    [['Geburtsort','Antalya'],['Geburtsdatum','12.04.1997','12.4.1997'],['Postleitzahl','28195'],['Kurszeit (Vormittag / Abend)','Abend','Abendkurs'],['Telefonnummer','017620304050']],
    'Geburtsort doğduğun yer, Wohnort yaşadığın yer. Mira Antalya’da doğmuş ve Bremen’de yaşıyor.'),
  form('form-2','gecmis','Reservierung im Hotel',
    'Frau Stein und ihr Mann reisen am 14.06. nach Köln. Sie bleiben drei Nächte. Sie möchten ein Doppelzimmer und zahlen mit Karte. Ihre E-Mail-Adresse ist s.stein@example.com.',
    [['Anreise','14.06.','14.6.'],['Anzahl der Nächte','3','drei'],['Zimmertyp','Doppelzimmer'],['Zahlungsart','Karte','mit Karte','Kartenzahlung'],['E-Mail','s.stein@example.com']],
    'Anreise geliş tarihi. Drei Nächte üç gece, Doppelzimmer çift kişilik oda.'),
  form('form-3','aile','Anmeldung in der Kita',
    'Elin Berger ist am 06.09.2021 in Bonn geboren. Sie wohnt in der Wiesenstraße 7 in Köln. Ihre Mutter heißt Jana Berger. Elin braucht einen Platz am Vormittag.',
    [['Vorname des Kindes','Elin'],['Geburtsort','Bonn'],['Wohnort','Köln','Koeln'],['Hausnummer','7','sieben'],['Betreuungszeit','Vormittag','am Vormittag']],
    'Kind, çocuk. İstenen ön ad çocuğun adı Elin. Wohnort Köln, Geburtsort Bonn.'),
  form('form-4','davet','Anmeldung zum Sportkurs',
    'Baran will am Mittwoch Tennis spielen. Er ist 26 Jahre alt und wohnt in Ulm. Er hat schon Tennis gespielt. Seine Nummer ist 0151 44778899.',
    [['Sportart','Tennis'],['Wochentag','Mittwoch'],['Alter','26','26 Jahre'],['Wohnort','Ulm'],['Telefon','015144778899']],
    'Sportart spor dalı, Wochentag haftanın günü.'),
];
export const writings = [
  writing('write-1','kurs','Fragen zum Deutschkurs','Sie möchten im Mai in Köln Deutsch lernen. Schreiben Sie an die Sprachschule.',
    ['Warum schreiben Sie?','Fragen Sie nach dem Preis.','Fragen Sie nach dem Kursbeginn.'],
    'Sehr geehrte Damen und Herren,\nich möchte im Mai in Köln einen Deutschkurs machen. Was kostet der Kurs? Wann beginnt der Unterricht?\nVielen Dank.\nMit freundlichen Grüßen\nElif Kaya',
    'Sayın yetkili, mayıs ayında Köln’de Almanca kursuna gitmek istiyorum. Kursun ücreti ne kadar? Ders ne zaman başlıyor? Teşekkürler. Saygılarımla, Elif Kaya'),
  writing('write-2','davet','Einladung zum Abendessen','Sie möchten am Samstag bei Ihnen zu Hause mit Ihrer Freundin Nora essen. Schreiben Sie Nora.',
    ['Laden Sie Nora ein.','Nennen Sie Tag und Uhrzeit.','Bitten Sie Nora, etwas mitzubringen.'],
    'Liebe Nora,\nhast du am Samstag um 19 Uhr Zeit? Ich möchte bei mir zu Hause mit dir essen. Kannst du bitte einen Salat mitbringen?\nLiebe Grüße\nLina',
    'Sevgili Nora, cumartesi saat 19’da vaktin var mı? Benim evimde seninle yemek yemek istiyorum. Lütfen salata getirebilir misin? Sevgiler, Lina'),
  writing('write-3','ev','Eine Wohnung besichtigen','Sie suchen eine Wohnung. Sie haben eine Anzeige von Frau Hoffmann gelesen. Schreiben Sie ihr.',
    ['Sagen Sie, warum Sie schreiben.','Fragen Sie nach der Miete.','Fragen Sie nach einem Besichtigungstermin.'],
    'Sehr geehrte Frau Hoffmann,\nich habe Ihre Anzeige gelesen und interessiere mich für die Wohnung. Wie hoch ist die Miete? Kann ich die Wohnung am Freitag besichtigen?\nMit freundlichen Grüßen\nDeniz Akın',
    'Sayın Bayan Hoffmann, ilanınızı okudum ve daireyle ilgileniyorum. Kira ne kadar? Daireyi cuma günü görebilir miyim? Saygılarımla, Deniz Akın'),
  writing('write-4','saglik','Termin verschieben','Sie haben am Mittwoch einen Arzttermin, aber Sie können nicht kommen. Schreiben Sie an die Praxis.',
    ['Sagen Sie, welchen Termin Sie haben.','Nennen Sie den Grund.','Bitten Sie um einen neuen Termin.'],
    'Guten Tag,\nich habe am Mittwoch einen Termin. Leider muss ich an diesem Tag arbeiten. Kann ich bitte am Freitag kommen?\nVielen Dank und freundliche Grüße\nMert Kaya',
    'İyi günler, çarşamba randevum var. Maalesef o gün çalışmak zorundayım. Cuma gelebilir miyim? Teşekkürler ve saygılar, Mert Kaya'),
  writing('write-5','gecmis','Zimmer für ein Wochenende','Sie wollen mit Ihrem Bruder im Juni zwei Nächte in Leipzig bleiben. Schreiben Sie an das Hotel am Park.',
    ['Sagen Sie, wann und mit wem Sie kommen.','Fragen Sie nach dem Preis für ein Zimmer.','Fragen Sie nach dem Frühstück.'],
    'Sehr geehrte Damen und Herren,\nich möchte im Juni mit meinem Bruder zwei Nächte bei Ihnen bleiben. Was kostet ein Doppelzimmer? Gibt es Frühstück im Hotel?\nMit freundlichen Grüßen\nSeda Demir',
    'Sayın yetkili, haziranda erkek kardeşimle sizde iki gece kalmak istiyorum. Çift kişilik oda ne kadar? Otelde kahvaltı var mı? Saygılarımla, Seda Demir'),
  writing('write-6','is','Eine Frage zur Arbeit','Ihre Kollegin Lara hat am Montag Urlaub. Schreiben Sie ihr wegen ihrer Schicht.',
    ['Sagen Sie, warum Sie schreiben.','Fragen Sie nach der Uhrzeit.','Bieten Sie Ihre Hilfe an.'],
    'Hallo Lara,\nich habe eine Frage zu deiner Schicht am Montag. Wann beginnt die Arbeit im Laden? Ich kann gern für dich arbeiten.\nViele Grüße\nAslı',
    'Merhaba Lara, pazartesi vardiyanla ilgili bir sorum var. Dükkânda iş ne zaman başlıyor? Senin yerine memnuniyetle çalışabilirim. Selamlar, Aslı'),
];

const speaking = (id,topic,stem,text,points,model,modelTr)=>({
  id,kind:'speaking',skill:'speaking',topic,stem,text,points,model,modelTr,
});
export const speakings = [
  speaking('speak-1','tanisma','Sich vorstellen','Name · Alter · Land · Wohnort · Sprachen · Beruf · Hobby',
    ['Kişisel bilgilerimi kısa cümlelerle söyledim.','Adımı harf harf söyledim.','Telefon numaramı veya bir örnek numarayı söyledim.'],
    'Guten Tag. Ich heiße Elif Kaya. Ich bin 28 Jahre alt. Ich komme aus der Türkei und wohne in Izmir. Ich spreche Türkisch und ein bisschen Deutsch. Ich bin Designerin. Mein Hobby ist Schwimmen.',
    'İyi günler. Benim adım Elif Kaya. 28 yaşındayım. Türkiye’den geliyorum ve İzmir’de oturuyorum. Türkçe ve biraz Almanca konuşuyorum. Tasarımcıyım. Hobim yüzmek.'),
  speaking('speak-2','alisveris','Fragen stellen und antworten','Thema: Einkaufen\nKarten: Brot · Supermarkt',
    ['Kartlardaki kelimelerle birer soru sordum.','Sorularım alışveriş konusuna uygun.','Her soruya tam bir cümleyle cevap verdim.'],
    'Wie viel kostet das Brot? Es kostet zwei Euro.\nWann öffnet der Supermarkt? Er öffnet um acht Uhr.',
    'Ekmek ne kadar? İki avro.\nMarket ne zaman açılıyor? Saat sekizde açılıyor.'),
  speaking('speak-3','kurs','Bitten formulieren und reagieren','Karten: Fenster öffnen · Stift geben',
    ['İki kart için de nazikçe ricada bulundum.','Ne istediğimi açıkça söyledim.','Ricalara kısa birer cevap verdim.'],
    'Können Sie bitte das Fenster öffnen? Ja, gern.\nKönnen Sie mir bitte einen Stift geben? Natürlich, bitte schön.',
    'Lütfen pencereyi açar mısınız? Evet, memnuniyetle.\nBana lütfen bir kalem verir misiniz? Tabii, buyurun.'),
  speaking('speak-4','ulasim','Nach dem Weg fragen','Thema: Stadt\nKarten: Bahnhof · Bus',
    ['Garın yolunu sordum.','Otobüsle ilgili bir soru sordum.','Her soruya cevap verdim.'],
    'Wie komme ich zum Bahnhof? Gehen Sie geradeaus und dann links.\nWann fährt der Bus? Er fährt um zehn Uhr.',
    'Tren garına nasıl giderim? Düz gidin, sonra sola dönün.\nOtobüs ne zaman kalkıyor? Saat onda.'),
  speaking('speak-5','saglik','Einen Termin vereinbaren','Rufen Sie in der Praxis an. Sagen Sie, was Ihnen fehlt, und fragen Sie nach einem Termin.',
    ['Şikâyetimi söyledim.','Randevu istedim.','Bir gün ya da saat belirttim.'],
    'Guten Tag. Mein Rücken tut weh. Ich möchte bitte einen Termin. Haben Sie am Donnerstag um zehn Uhr Zeit?',
    'İyi günler. Sırtım ağrıyor. Bir randevu almak istiyorum. Perşembe saat onda uygun musunuz?'),
  speaking('speak-6','davet','Ein Treffen planen','Thema: Freizeit\nKarten: Kino · Wochenende',
    ['İki kelimeyi de kullandım.','Gün ve saat önerdim.','Bir davete cevap verdim.'],
    'Möchtest du am Wochenende ins Kino gehen? Ja, gern. Hast du am Samstag um sechs Zeit?',
    'Hafta sonu sinemaya gitmek ister misin? Evet, seve seve. Cumartesi saat altıda vaktin var mı?'),
  speaking('speak-7','ev','Um Hilfe bitten','Karten: Tür schließen · Stuhl bringen',
    ['İki kartı kullanarak rica cümleleri kurdum.','Bitte ile nazikçe rica ettim.','Ricalardan birine cevap verdim.'],
    'Können Sie bitte die Tür schließen?\nKönnen Sie mir bitte einen Stuhl bringen? Ja, natürlich.',
    'Lütfen kapıyı kapatır mısınız?\nBana lütfen bir sandalye getirir misiniz? Evet, tabii.'),
  speaking('speak-8','giyim','Nach Preis und Größe fragen','Thema: Kleidung\nKarten: Jacke · Größe',
    ['Fiyatı sordum.','Beden veya renk hakkında soru sordum.','Bir soruya tam cümleyle cevap verdim.'],
    'Was kostet die Jacke? Sie kostet fünfzig Euro.\nHaben Sie die Jacke in Größe M? Ja, wir haben sie in Größe M.',
    'Ceket ne kadar? Elli avro.\nCeketin M bedeni var mı? Evet, M bedeni var.'),
];
export const tasks = [...grammar,...listening,...reading,...forms,...writings,...speakings];
export const examParts = [
  {skill:'listening', minutes:20, tasks:listening.slice(0,15)},
  {skill:'reading', minutes:25, tasks:reading.slice(0,15)},
  {skill:'writing', minutes:20, tasks:[forms[0],writings[0]]},
  {skill:'speaking', minutes:15, tasks:speakings.slice(0,3)},
];
