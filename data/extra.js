const dialogues=String.raw`
ulasim|Wann fährt der nächste Bus zum Bahnhof?|Entschuldigung, wann fährt der Bus zum Bahnhof? ~ Der Bus um neun ist schon weg. Der nächste fährt um neun Uhr zwanzig. ~ Danke, dann warte ich hier.|09:00|09:20|09:40|1|Der nächste fährt um neun Uhr zwanzig, sıradaki otobüs 09.20’de.
alisveris|Was bestellt die Frau?|Möchten Sie Kaffee oder Tee? ~ Für mich einen Tee mit Zitrone, bitte. ~ Gerne. Möchten Sie auch Kuchen? ~ Nein, danke.|Kaffee|Kuchen|Tee|2|Kadın limonlu çay istiyor. Kuchen teklifini reddediyor.
ev|In welchem Stock liegt die Wohnung?|Ist die Wohnung im ersten Stock? ~ Nein, sie liegt im zweiten Stock. Es gibt einen Aufzug. ~ Das ist gut.|Im zweiten Stock|Im ersten Stock|Im Erdgeschoss|0|Zweiten Stock ikinci kat demek.
saat|Wann gehen sie ins Kino?|Wollen wir heute Abend um sieben ins Kino? ~ Um sieben arbeite ich noch. Geht es um acht? ~ Ja, acht Uhr passt.|Um sieben|Um acht|Um halb acht|1|Sekiz uygun. Sieben çalışmaya devam ettiği saat.
giyim|Was kauft der Mann?|Suchen Sie eine Hose? ~ Nein, eine Jacke. Haben Sie diese Jacke auch in Schwarz? ~ Ja, hier. ~ Super, die nehme ich.|Eine schwarze Jacke|Eine blaue Hose|Einen schwarzen Pullover|0|Eine Jacke in Schwarz, siyah ceket.
aile|Wer kommt zum Geburtstag?|Kommt deine Schwester zu meinem Geburtstag? ~ Nein, sie muss arbeiten. Aber meine Mutter kommt. ~ Schön, dann sind wir zu dritt.|Die Schwester|Der Vater|Die Mutter|2|Aber meine Mutter kommt, annesi gelecek.
gecmis|Das Frühstück gibt es bis 10 Uhr.|Guten Morgen. Unser Frühstück ist heute bis zehn Uhr im Erdgeschoss. Das Restaurant öffnet um zwölf Uhr.|Richtig|Falsch||0|Bis zehn Uhr, saat ona kadar.
davet|Das Konzert findet im Park statt.|Achtung, liebe Gäste. Wegen des Regens ist das Konzert heute nicht im Park, sondern in der Stadthalle.|Richtig|Falsch||1|Konser Stadthalle’de. Nicht im Park, parkta değil.
kurs|Die Teilnehmer sollen ihre Ausweise zeigen.|Guten Morgen. Vor dem Kursbeginn zeigen Sie bitte Ihren Ausweis am Eingang. Vielen Dank.|Richtig|Falsch||0|Ihren Ausweis zeigen, kimliğinizi gösterin.
ulasim|Der Zug nach Erfurt kommt pünktlich.|Achtung am Gleis vier. Der Zug nach Erfurt hat heute fünfzehn Minuten Verspätung.|Richtig|Falsch||1|Verspätung gecikme. Tren 15 dakika geç geliyor.
is|Wann soll Eren zum Gespräch kommen?|Guten Tag, hier ist Frau Jung von der Firma Wiese. Ihr Gespräch ist am Donnerstag um zehn. Bitte kommen Sie zehn Minuten früher.|Donnerstag um 09:50|Donnerstag um 10:10|Mittwoch um 10:00|0|Saat ondan on dakika önce, 09.50.
saglik|Was soll Nils in die Apotheke mitbringen?|Hallo Nils, die Tabletten sind da. Die Apotheke ist bis achtzehn Uhr geöffnet. Nimm das Rezept mit, bitte.|Seine Jacke|Das Rezept|Die Rechnung|1|Nimm das Rezept mit, reçeteyi yanında getir.
ev|Wo wartet Mila?|Hallo, ich bin schon da. Ich warte nicht vor dem Haus, sondern im Café gegenüber. Ruf mich an, wenn du da bist.|Vor dem Haus|In der Wohnung|Im Café|2|Im Café gegenüber, karşıdaki kafede.
gecmis|Wie lange bleibt Frau Öztürk im Hotel?|Guten Tag, Hotel Fuchs. Wir haben Ihr Zimmer für drei Nächte reserviert. Sie kommen am Dienstag und fahren am Freitag wieder ab.|Zwei Nächte|Drei Nächte|Vier Nächte|1|Drei Nächte üç gece, salıdan cumaya.
davet|Was soll Jan mitbringen?|Hallo Jan. Für unser Picknick habe ich schon Saft und Brot. Kannst du noch etwas Obst kaufen und mitbringen?|Obst|Brot|Saft|0|Jan’dan meyve getirmesi isteniyor. Saft ve Brot zaten var.
`;
const notices=String.raw`
davet|Das Essen beginnt um sieben Uhr.|Hallo Tarek, meine Feier am Freitag beginnt um 19 Uhr. Komm bitte zu mir nach Hause. Wir essen zusammen. Viele Grüße, Mina|Richtig|Falsch||0|19.00 akşam yedi.
aile|Linas Schwester wohnt in Köln.|Hallo Lina, deine Schwester ist jetzt in Aachen. Sie hat dort eine Wohnung gefunden. Ich besuche sie am Wochenende. Papa|Richtig|Falsch||1|Kız kardeşi Aachen’da yaşıyor.
saglik|Der Termin ist heute Nachmittag.|Guten Tag Frau Kaya, Ihr Termin heute ist um 15 Uhr. Bringen Sie bitte Ihre Versichertenkarte mit. Praxis Dr. Wolf|Richtig|Falsch||0|15.00 öğleden sonra.
is|Jonas arbeitet am Montag im Büro.|Hallo Jonas, das Büro bleibt am Montag geschlossen. Bitte arbeite an diesem Tag zu Hause. Am Dienstag sehen wir uns im Büro. Grüße, Kim|Richtig|Falsch||1|Am Montag kapalı. Jonas evden çalışacak.
gecmis|Eva fährt mit dem Zug nach Wien.|Liebe Eva, dein Flug nach Wien ist am Samstag um 11 Uhr. Ich fahre dich zum Flughafen. Bis bald, Nico|Richtig|Falsch||1|Flug ve Flughafen uçak yolculuğunu gösterir.
ev|Sie brauchen eine Wohnung mit Aufzug. Welche Anzeige passt?|A · Wohnung, 4. Stock, kein Aufzug, 600 Euro.\nB · Wohnung, 3. Stock, mit Aufzug, 680 Euro.|Anzeige A|Anzeige B||1|Mit Aufzug, asansörlü.
davet|Sie möchten am Sonntag schwimmen. Wohin gehen Sie?|A · Bad Mitte: Sa 9–18 Uhr, So geschlossen.\nB · Hallenbad Ost: Sa und So 10–17 Uhr.|Bad Mitte|Hallenbad Ost||1|Hallenbad Ost cumartesi ve pazar açık.
kurs|Sie suchen einen Kurs am Morgen. Welcher Kurs passt?|A · Deutsch A1, Mo und Mi 8–10 Uhr.\nB · Deutsch A1, Di und Do 18–20 Uhr.|Kurs A|Kurs B||0|A sabah 8’de. B akşam 18’de.
giyim|Sie möchten eine rote Jacke kaufen. Was passt?|A · Winterjacke, rot, Größe M, 25 Euro.\nB · Pullover, rot, Größe M, 15 Euro.|Anzeige A|Anzeige B||0|Jacke ceket, Pullover kazak.
gecmis|Sie brauchen ein Zimmer für zwei Personen. Wo können Sie buchen?|A · Pension West: noch zwei Doppelzimmer frei.\nB · Hotel Mitte: nur Einzelzimmer frei.|Pension West|Hotel Mitte||0|Doppelzimmer çift kişilik oda.
ulasim|Sie dürfen hier Ihr Fahrrad abstellen.|Bahnhof Süd\nVor dem Eingang bitte keine Fahrräder abstellen.|Richtig|Falsch||1|Girişin önüne bisiklet bırakmak yasak.
alisveris|Sie können heute bis 18 Uhr einkaufen.|Bäckerei Fischer\nHeute geöffnet: 7–18 Uhr.|Richtig|Falsch||0|Bis 18 Uhr, saat 18.00’e kadar.
saglik|Die Apotheke ist heute geöffnet.|Apotheke am Ring\nHeute geschlossen. Die nächste Apotheke ist am Markt.|Richtig|Falsch||1|Geschlossen kapalı. Açık eczane için Markt’a gidilmeli.
davet|Kinder zahlen am Samstag keinen Eintritt.|Stadtbibliothek\nSamstag: Lesetag für Kinder. Eintritt frei.|Richtig|Falsch||0|Eintritt frei, giriş ücretsiz.
kurs|Hier können Sie auch am Freitag ein Formular abgeben.|Anmeldung\nFormulare bitte nur Montag bis Donnerstag im Büro abgeben.|Richtig|Falsch||1|Yalnızca pazartesiden perşembeye teslim ediliyor.
`;
function choices(text,skill){
  return text.trim().split('\n').map((line,index)=>{
    const [topic,stem,context,a,b,c,answer,explain]=line.split('|');
    const id=`${skill==='listening'?'listen':'read'}-b-${index+1}`;
    const task={id,kind:'choice',skill,topic,stem,options:[a,b,c].filter(Boolean),answer:Number(answer),explain};
    if(skill==='listening'){
      task.segments=context.split(' ~ ');
      task.transcript=task.segments.join(' ');
      task.audio=`./assets/audio/${id}.mp3`;
      task.plays=index>=6&&index<10?1:2;
    }else task.text=context.replaceAll('\\n','\n');
    return task;
  });
}
export const moreListening=choices(dialogues,'listening');
export const moreReading=choices(notices,'reading');
const makeForm=(i,topic,stem,text,fields,explain)=>({id:'form-b-'+i,kind:'form',skill:'writing',topic,stem,text,
  fields:fields.map(([label,...answers])=>({label,answers})),explain});
const makeWriting=(i,topic,stem,text,points,model,modelTr)=>({id:'write-b-'+i,kind:'writing',skill:'writing',topic,stem,text,points,model,modelTr});
const makeSpeaking=(i,topic,stem,text,points,model,modelTr)=>({id:'speak-b-'+i,kind:'speaking',skill:'speaking',topic,stem,text,points,model,modelTr});
export const moreForms=[
  makeForm(1,'ulasim','Reservierung für eine Stadtführung',
    'Lina Malik besucht Dresden am 18. August. Sie möchte mit ihren zwei Freunden um 14 Uhr eine Führung auf Deutsch machen. Ihre E-Mail ist lina@example.org.',
    [['Datum','18. August','18.08.','18.8.'],['Personenzahl','3','drei'],['Beginn','14 Uhr','14:00','14'],['Sprache','Deutsch'],['E-Mail','lina@example.org']],
    'Lina ile iki arkadaşı toplam üç kişi. Führung rehberli tur.'),
  makeForm(2,'is','Kontakt für ein Praktikum',
    'Eren Aslan sucht im Juni ein Praktikum in Hamburg. Er wohnt in Lübeck und ist 22 Jahre alt. Er kann nur am Vormittag arbeiten. Seine Telefonnummer ist 0174 33221100.',
    [['Ort des Praktikums','Hamburg'],['Wohnort','Lübeck'],['Alter','22','22 Jahre'],['Arbeitszeit','Vormittag','am Vormittag'],['Telefon','017433221100']],
    'İş yeri Hamburg, ikamet yeri Lübeck. Nur am Vormittag, yalnızca öğleden önce.'),
  makeForm(3,'ev','Besichtigung einer Wohnung',
    'Herr Benno Kraft möchte eine Wohnung mit zwei Zimmern mieten. Er kann am Samstag um 11 Uhr kommen. Er hat einen Hund und braucht einen Parkplatz. Seine Nummer ist 0152 4567890.',
    [['Anzahl der Zimmer','2','zwei'],['Wochentag','Samstag'],['Uhrzeit','11','11 Uhr','11:00'],['Haustier','Hund','ein Hund'],['Telefon','01524567890']],
    'Haustier evcil hayvan. Parkplatz otopark yeri.'),
  makeForm(4,'saglik','Erster Besuch in der Praxis',
    'Nora Vogel wohnt in Dortmund und ist am 04.02.1991 in Essen geboren. Sie hat seit Montag Rückenschmerzen. Sie kann am Freitag um neun Uhr kommen.',
    [['Geburtsort','Essen'],['Geburtsdatum','04.02.1991','4.2.1991'],['Wohnort','Dortmund'],['Beschwerden','Rückenschmerzen','Rücken tut weh'],['Wochentag','Freitag']],
    'Beschwerden sağlık şikâyetleri. Wohnort ve Geburtsort farklı.'),
  makeForm(5,'giyim','Abholung einer Bestellung',
    'Selin Brandt hat eine blaue Jacke in Größe M bestellt. Sie kostet 49 Euro. Selin holt sie am Samstag ab und zahlt mit Karte.',
    [['Kleidungsstück','Jacke','eine Jacke'],['Farbe','blau','blaue'],['Größe','M'],['Preis','49','49 Euro','49 €'],['Zahlungsart','Karte','mit Karte','Kartenzahlung']],
    'Abholung teslim alma. Größe beden.'),
];
export const moreWritings=[
  makeWriting(1,'ev','Hilfe beim Umzug',
    'Sie ziehen am Samstag um. Schreiben Sie an Ihren Freund Tim.',
    ['Erklären Sie, warum Sie schreiben.','Nennen Sie Uhrzeit und Treffpunkt.','Bitten Sie Tim um Hilfe.'],
    'Hallo Tim,\nich ziehe am Samstag um. Wir treffen uns um zehn Uhr vor meiner Wohnung in der Lindenstraße. Kannst du mir bitte mit den Kartons helfen?\nViele Grüße\nEren',
    'Merhaba Tim, cumartesi taşınıyorum. Saat onda Lindenstraße’deki evimin önünde buluşuyoruz. Kolilerle bana yardım edebilir misin? Selamlar, Eren'),
  makeWriting(2,'giyim','Eine Jacke umtauschen',
    'Sie haben eine Jacke gekauft. Die Jacke ist zu klein. Schreiben Sie an das Geschäft.',
    ['Sagen Sie, wann Sie die Jacke gekauft haben.','Beschreiben Sie das Problem.','Fragen Sie nach einer größeren Größe.'],
    'Guten Tag,\nich habe gestern bei Ihnen eine Jacke gekauft. Leider ist sie zu klein. Haben Sie die Jacke auch in Größe L? Kann ich sie umtauschen?\nFreundliche Grüße\nNora Vogel',
    'İyi günler, dün sizden bir ceket aldım. Maalesef küçük geldi. Ceketin L bedeni var mı? Değiştirebilir miyim? Saygılarımla, Nora Vogel'),
  makeWriting(3,'ulasim','Verspätung melden',
    'Sie kommen mit dem Zug. Sie können nicht pünktlich zum Treffen mit Mira kommen.',
    ['Entschuldigen Sie sich.','Sagen Sie, warum Sie später kommen.','Nennen Sie die neue Uhrzeit.'],
    'Hallo Mira,\nes tut mir leid, ich komme heute später. Mein Zug hat zwanzig Minuten Verspätung. Können wir uns um 17.30 Uhr treffen?\nLiebe Grüße\nAda',
    'Merhaba Mira, üzgünüm, bugün geç geleceğim. Trenim yirmi dakika gecikiyor. 17.30’da buluşabilir miyiz? Sevgiler, Ada'),
  makeWriting(4,'davet','Eine Einladung ablehnen',
    'Ihre Freundin Anna feiert am Freitag Geburtstag. Sie können leider nicht kommen.',
    ['Bedanken Sie sich für die Einladung.','Sagen Sie, warum Sie nicht kommen.','Schlagen Sie ein neues Treffen vor.'],
    'Liebe Anna,\nvielen Dank für die Einladung. Am Freitag kann ich leider nicht kommen, weil ich arbeiten muss. Hast du am Sonntag Zeit für einen Kaffee?\nLiebe Grüße\nMina',
    'Sevgili Anna, davetin için çok teşekkürler. Cuma çalışmak zorunda olduğum için maalesef gelemiyorum. Pazar kahve içmek için vaktin var mı? Sevgiler, Mina'),
  makeWriting(5,'kurs','Im Kurs fehlen',
    'Sie können am Dienstag nicht in den Deutschkurs kommen. Schreiben Sie an Ihre Lehrerin Frau Groß.',
    ['Sagen Sie, warum Sie fehlen.','Fragen Sie nach den Hausaufgaben.','Sagen Sie, wann Sie wieder kommen.'],
    'Sehr geehrte Frau Groß,\nich kann am Dienstag nicht zum Kurs kommen, denn ich bin krank. Was sind die Hausaufgaben? Am Donnerstag bin ich wieder im Kurs.\nMit freundlichen Grüßen\nEren Kaya',
    'Sayın Bayan Groß, hasta olduğum için salı kursa gelemiyorum. Ev ödevleri neler? Perşembe tekrar kursta olacağım. Saygılarımla, Eren Kaya'),
  makeWriting(6,'aile','Besuch bei Verwandten',
    'Sie möchten Ihre Tante am Wochenende besuchen. Schreiben Sie ihr.',
    ['Sagen Sie, warum Sie schreiben.','Fragen Sie, ob Samstag passt.','Bieten Sie an, etwas mitzubringen.'],
    'Liebe Tante Leyla,\nich möchte dich gern am Wochenende besuchen. Hast du am Samstag um drei Uhr Zeit? Ich kann einen Kuchen mitbringen.\nViele Grüße\nSelin',
    'Sevgili Leyla teyze, hafta sonu seni ziyaret etmek istiyorum. Cumartesi saat üçte vaktin var mı? Bir kek getirebilirim. Selamlar, Selin'),
];
export const moreSpeakings=[
  makeSpeaking(1,'tanisma','Sich kurz vorstellen','Name · Alter · Wohnort · Beruf · Sprachen · Freizeit',
    ['Kendimle ilgili en az dört bilgi verdim.','Soyadımı harf harf söyledim.','Telefon numaramı veya örnek bir numarayı söyledim.'],
    'Guten Tag. Ich heiße Selin Brandt und wohne in Berlin. Ich bin 31 Jahre alt und arbeite im Büro. Ich spreche Deutsch und Türkisch. In meiner Freizeit lese ich gern.',
    'İyi günler. Ben Selin Brandt ve Berlin’de oturuyorum. 31 yaşındayım ve ofiste çalışıyorum. Almanca ve Türkçe konuşuyorum. Boş zamanımda kitap okumayı severim.'),
  makeSpeaking(2,'davet','Fragen zur Freizeit','Thema: Freizeit\nKarten: Sport · Wochenende',
    ['Sport kelimesiyle bir soru sordum.','Wochenende kelimesiyle bir soru sordum.','Her iki soruya da cevap verdim.'],
    'Machst du gern Sport? Ja, ich spiele gern Tennis.\nWas machst du am Wochenende? Ich gehe ins Kino.',
    'Spor yapmayı sever misin? Evet, tenis oynamayı severim.\nHafta sonu ne yapıyorsun? Sinemaya gidiyorum.'),
  makeSpeaking(3,'alisveris','Im Café um etwas bitten','Karten: Wasser bringen · Rechnung geben',
    ['İki ricayı da söyledim.','Bitte ve uygun hitap kullandım.','Ricalara kısa cevap verdim.'],
    'Können Sie mir bitte ein Glas Wasser bringen? Ja, sofort.\nKönnen Sie mir bitte die Rechnung geben? Natürlich.',
    'Lütfen bir bardak su getirir misiniz? Evet, hemen.\nLütfen hesabı verir misiniz? Tabii.'),
  makeSpeaking(4,'is','Am ersten Arbeitstag','Thema: Arbeit\nKarten: Arbeitszeit · Pause',
    ['Çalışma saatlerini sordum.','Mola hakkında soru sordum.','İki soruya da kısa cevap verdim.'],
    'Wann beginnt die Arbeit? Um acht Uhr.\nWie lange ist die Pause? Dreißig Minuten.',
    'İş ne zaman başlıyor? Saat sekizde.\nMola ne kadar? Otuz dakika.'),
];
export const extraTasks=[...moreListening,...moreReading,...moreForms,...moreWritings,...moreSpeakings];
export const examSetB=[
  {skill:'listening',minutes:20,tasks:moreListening},{skill:'reading',minutes:25,tasks:moreReading},
  {skill:'writing',minutes:20,tasks:[moreForms[0],moreWritings[0]]},{skill:'speaking',minutes:15,tasks:moreSpeakings.slice(0,3)},
];
