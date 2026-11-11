import {lessons} from './course.js';

const entries = [
  {
    topic:'tanisma',
    reading:'Hallo! Ich heiße Lea Roth. Ich komme aus Österreich und wohne jetzt in Kassel. Ich bin neu im Deutschkurs. Meine Freundin Aya kommt aus Syrien.',
    read:[
      ['Wo wohnt Lea jetzt?',['In Wien','In Kassel','In Syrien'],1,'Wohne jetzt in Kassel, şu anda Kassel’de yaşıyor. Österreich geldiği ülke.'],
      ['Aya kommt aus Österreich.',['Richtig','Falsch'],1,'Avusturya’dan gelen Lea. Aya Suriye’den geliyor.'],
    ],
    dialogue:['Guten Tag. Ich heiße Amir Yilmaz. Und wie heißen Sie?','Guten Tag, ich bin Eva Kern. Kommen Sie aus Berlin?','Nein, ich wohne in Potsdam.'],
    hear:[
      ['Wie heißt die Frau mit Nachnamen?',['Yilmaz','Kern','Eva'],1,'Eva ön ad, Kern soyadı.'],
      ['Wo wohnt Amir?',['Berlin','Kassel','Potsdam'],2,'Amir Potsdam’da oturuyor. Berlin bir soru olarak geçiyor.'],
    ],
    fill:[['Ich ___ Lea. (heißen)','heiße'],['Woher ___ du? (kommen)','kommst'],['Frau Kern, wo ___ Sie? (wohnen)','wohnen']],
    why:'Ich heiße, du kommst ve resmî Sie ile wohnen. Woher köken, wo konum sorar.',
    write:['Bir sınıf arkadaşına ilk mesaj','Sie sind neu im Deutschkurs. Schreiben Sie eine kurze Nachricht an Jonas.',['Stellen Sie sich vor.','Sagen Sie, woher Sie kommen.','Fragen Sie Jonas, wo er wohnt.'],'Hallo Jonas,\nich heiße Mira und bin neu im Deutschkurs. Ich komme aus der Türkei und wohne jetzt in Leipzig. Wo wohnst du?\nViele Grüße\nMira','Merhaba Jonas, adım Mira ve Almanca kursunda yeniyim. Türkiye’den geliyorum ve şimdi Leipzig’de oturuyorum. Sen nerede oturuyorsun? Selamlar, Mira'],
    speak:['İlk tanışma','Sie treffen eine neue Person im Kurs. Stellen Sie sich vor. Fragen Sie nach dem Namen und der Herkunft.',['Adımı ve nereli olduğumu söyledim.','Karşımdakinin adını sordum.','Nereli olduğunu sordum.'],'Hallo, ich heiße Mira. Ich komme aus der Türkei. Wie heißen Sie? Und woher kommen Sie?','Merhaba, adım Mira. Türkiye’den geliyorum. Adınız nedir? Peki nerelisiniz?'],
  },
  {
    topic:'sayilar',
    reading:'Kontaktkarte · Vorname: Leon · Nachname: Weiß · Telefon: 0157 204893 · Adresse: Bergstraße 16, 34117 Kassel.',
    read:[
      ['Wie ist die Hausnummer?',['16','17','57'],0,'Cadde adından sonraki 16 ev numarasıdır.'],
      ['Wie ist die Postleitzahl?',['20489','34117','34116'],1,'Beş haneli 34117, Kassel adresinin posta kodu.'],
    ],
    dialogue:['Können Sie mir Ihre Nummer sagen?','Ja, null eins sieben sechs, vier zwei neun drei.','Vier zwei neun drei, danke. Die Hausnummer ist zwölf, richtig?','Nein, die Hausnummer ist zwanzig.'],
    hear:[
      ['Wie lautet die Telefonnummer?',['0176 4293','0167 4923','0176 4932'],0,'Null eins sieben sechs ve dört iki dokuz üç.'],
      ['Welche Hausnummer ist richtig?',['12','20','22'],1,'Zwölf ilk tahmin. Kişi zwanzig diyerek düzeltiyor.'],
    ],
    fill:[['17 in Worten','siebzehn'],['24 in Worten','vierundzwanzig'],['36 in Worten','sechsunddreißig'],['50 in Worten','fünfzig']],
    why:'24, “dört ve yirmi” sırasıyla söylenir. Siebzehn ve dreißig düzensiz biçimlerdir.',
    write:['Telefon numarasını düzelt','Ihr Freund Emil hat Ihre alte Telefonnummer. Schreiben Sie ihm.',['Sagen Sie, warum Sie schreiben.','Geben Sie eine neue Nummer an.','Bitten Sie Emil, Sie heute Abend anzurufen.'],'Hallo Emil,\ndu hast noch meine alte Telefonnummer. Meine neue Nummer ist 0176 428369. Kannst du mich heute Abend anrufen?\nDanke und viele Grüße\nSeda','Merhaba Emil, sende hâlâ eski telefon numaram var. Yeni numaram 0176 428369. Bu akşam beni arayabilir misin? Teşekkürler ve selamlar, Seda'],
    speak:['Numarayı doğrula','Nennen Sie eine Beispielnummer und Ihre Hausnummer. Bitten Sie die andere Person, ihre Nummer zu wiederholen.',['Bir örnek telefon numarasını rakam rakam söyledim.','Ev numarasını söyledim.','Numarayı tekrar etmesini istedim.'],'Meine Telefonnummer ist null eins fünf sieben, drei zwei sechs acht. Meine Hausnummer ist vierzehn. Können Sie Ihre Nummer bitte wiederholen?','Telefon numaram 0157 3268. Ev numaram on dört. Numaranızı tekrar eder misiniz?'],
  },
  {
    topic:'aile',
    reading:'Liebe Mia, am Sonntag kommt meine Schwester Nora mit ihren zwei Kindern zu uns. Ihr Sohn Ben ist sechs und ihre Tochter Ida ist neun. Mein Vater kommt erst am Abend. Liebe Grüße, Kim',
    read:[
      ['Wie viele Kinder hat Nora?',['Ein Kind','Zwei Kinder','Drei Kinder'],1,'Mit ihren zwei Kindern, iki çocuğuyla.'],
      ['Kims Vater kommt am Morgen.',['Richtig','Falsch'],1,'Erst am Abend, ancak akşam geliyor.'],
    ],
    dialogue:['Ist das dein Bruder auf dem Foto?','Nein, das ist mein Onkel. Mein Bruder ist rechts.','Und das Mädchen neben ihm?','Das ist seine Tochter. Sie ist fünf.'],
    hear:[
      ['Wer ist auf dem Foto rechts?',['Der Onkel','Der Bruder','Der Vater'],1,'Mein Bruder ist rechts, erkek kardeşim sağda.'],
      ['Wie alt ist die Tochter?',['Vier','Fünf','Sechs'],1,'Sie ist fünf, beş yaşında.'],
    ],
    fill:[['Das ist ___ Vater. (mein oder meine)','mein'],['Das ist ___ Tochter. (mein oder meine)','meine'],['Das ___ meine Eltern. (sein)','sind']],
    why:'Mein Vater, meine Tochter, meine Eltern. Çoğul Eltern ile sind.',
    write:['Aileni ziyarete çağır','Ihre Schwester Lena hat am Samstag frei. Schreiben Sie ihr.',['Laden Sie Lena zu Ihrer Familie ein.','Nennen Sie eine Uhrzeit.','Fragen Sie, ob ihre Kinder mitkommen.'],'Hallo Lena,\nmöchtest du am Samstag zu uns kommen? Wir essen um zwölf Uhr zusammen. Kommen deine Kinder auch mit? Wir freuen uns auf euch.\nLiebe Grüße\nAyla','Merhaba Lena, cumartesi bize gelmek ister misin? Saat on ikide birlikte yemek yiyoruz. Çocukların da geliyor mu? Sizi bekliyoruz. Sevgiler, Ayla'],
    speak:['Bir aile üyesini tanıt','Sprechen Sie über zwei Personen in Ihrer Familie. Fragen Sie auch nach Geschwistern.',['İki kişiyi tanıttım.','Birinin yaşını veya nerede yaşadığını söyledim.','Kardeşler hakkında soru sordum.'],'Das ist mein Vater. Er wohnt in Bonn. Meine Schwester ist zweiundzwanzig Jahre alt. Hast du auch Geschwister?','Bu babam. Bonn’da oturuyor. Kız kardeşim yirmi iki yaşında. Senin de kardeşin var mı?'],
  },
  {
    topic:'kurs',
    reading:'Sprachschule West · Deutsch A1 · Dienstag und Donnerstag, 18–20 Uhr · Kursraum 4 · Bitte bringen Sie ein Heft mit. Das Kursbuch bekommen Sie am ersten Tag.',
    read:[
      ['Wann findet der Kurs statt?',['Montag und Mittwoch','Dienstag und Donnerstag','Freitag und Samstag'],1,'Dienstag salı, Donnerstag perşembe.'],
      ['Die Teilnehmenden müssen ein Kursbuch mitbringen.',['Richtig','Falsch'],1,'Yanında defter getirmesi gerekiyor. Kurs kitabı ilk gün veriliyor.'],
    ],
    dialogue:['Ist das mein Wörterbuch?','Nein, das ist ein Kursbuch. Das Wörterbuch liegt auf dem Tisch.','Danke. Können Sie bitte Seite zwölf wiederholen?','Natürlich. Wir lesen die Aufgabe noch einmal.'],
    hear:[
      ['Wo liegt das Wörterbuch?',['Im Regal','Auf dem Tisch','In der Tasche'],1,'Auf dem Tisch, masanın üzerinde.'],
      ['Welche Seite möchte die Person wiederholen?',['Seite 2','Seite 10','Seite 12'],2,'Zwölf on iki.'],
    ],
    fill:[['Das ist ___ Heft. (ein/eine)','ein'],['Das ist ___ Tasche. (ein/eine)','eine'],['Ich habe ___ Wörterbuch. (kein/keine)','kein']],
    why:'Heft ve Wörterbuch das, Tasche die. Bu kullanımda ein Heft, eine Tasche, kein Wörterbuch.',
    write:['Ödev bilgisi iste','Sie können heute nicht zum Kurs kommen. Schreiben Sie an Herrn Wolf.',['Sagen Sie, warum Sie fehlen.','Fragen Sie nach der Hausaufgabe.','Sagen Sie, wann Sie wiederkommen.'],'Sehr geehrter Herr Wolf,\nich kann heute nicht zum Kurs kommen, denn ich bin krank. Welche Hausaufgabe haben wir? Am Donnerstag bin ich wieder da.\nMit freundlichen Grüßen\nCan','Sayın Bay Wolf, hastayım, bugün kursa gelemiyorum. Ev ödevimiz ne? Perşembe tekrar oradayım. Saygılarımla, Can'],
    speak:['Sınıfta yardım iste','Sie verstehen eine Aufgabe nicht. Bitten Sie um Hilfe und fragen Sie nach der Seite.',['Anlamadığımı söyledim.','Nazikçe tekrar istedim.','Sayfa numarasını sordum.'],'Entschuldigung, ich verstehe die Aufgabe nicht. Können Sie sie bitte wiederholen? Welche Seite ist das?','Pardon, alıştırmayı anlamıyorum. Lütfen tekrar eder misiniz? Hangi sayfa?'],
  },
  {
    topic:'saat',
    reading:'Hallo Ela, morgen arbeite ich bis 16 Uhr. Um Viertel nach fünf hole ich die Kinder ab. Können wir uns um halb sieben vor dem Café treffen? Nils',
    read:[
      ['Wann soll Ela zum Café kommen?',['16:00','17:15','18:30'],2,'Halb sieben, akşam 18.30. 17.15 çocukları alma saati.'],
      ['Nils arbeitet bis vier Uhr nachmittags.',['Richtig','Falsch'],0,'16.00, öğleden sonra dört.'],
    ],
    dialogue:['Wann stehst du morgen auf?','Um Viertel vor sieben. Um halb acht fahre ich zur Arbeit.','Und wann bist du wieder zu Hause?','Gegen sechs Uhr abends.'],
    hear:[
      ['Wann steht die Person auf?',['06:45','07:15','07:45'],0,'Viertel vor sieben, yediye çeyrek kala.'],
      ['Wann fährt die Person zur Arbeit?',['06:30','07:00','07:30'],2,'Halb acht, yedi buçuk.'],
    ],
    fill:[['Ich ___ um sechs Uhr ___. (aufstehen)','stehe auf'],['Wir treffen uns ___ Donnerstag.','am'],['Der Kurs beginnt ___ halb zehn.','um']],
    why:'Ayrılan auf sona gider. Am haftanın gününde, um saatte kullanılır.',
    write:['Buluşma saatini değiştir','Sie haben um 16 Uhr ein Treffen mit Ihrer Freundin Sara. Sie müssen bis 17 Uhr arbeiten.',['Sagen Sie, warum Sie später kommen.','Nennen Sie eine neue Uhrzeit.','Fragen Sie, ob die Uhrzeit passt.'],'Hallo Sara,\nich arbeite heute bis 17 Uhr. Deshalb kann ich um 16 Uhr nicht kommen. Können wir uns um 18 Uhr vor dem Café treffen? Passt das?\nViele Grüße\nEla','Merhaba Sara, bugün 17’ye kadar çalışıyorum. Bu yüzden 16’da gelemem. Saat 18’de kafenin önünde buluşabilir miyiz? Uygun mu? Selamlar, Ela'],
    speak:['Günlük rutinini anlat','Sagen Sie, wann Sie aufstehen, zur Arbeit oder zum Kurs gehen und abends zu Hause sind.',['Kalkış saatimi söyledim.','Kurs veya iş saatimi söyledim.','Akşam ne yaptığımı anlattım.'],'Ich stehe um sieben Uhr auf. Um halb neun fahre ich zum Deutschkurs. Um sechs Uhr abends bin ich zu Hause.','Saat yedide kalkıyorum. Sekiz buçukta Almanca kursuna gidiyorum. Akşam altıda evdeyim.'],
  },
  {
    topic:'alisveris',
    reading:'Marktangebot · Äpfel 1,90 € pro Kilo · Brot 2,40 € · Milch 1,10 € · Nur am Freitag. Am Samstag gelten die normalen Preise.',
    read:[
      ['Wie viel kostet ein Kilo Äpfel am Freitag?',['1,10 €','1,90 €','2,40 €'],1,'Pro Kilo kilogram başına. Elma 1,90 €.'],
      ['Das Angebot gilt auch am Samstag.',['Richtig','Falsch'],1,'Nur am Freitag, sadece cuma günü.'],
    ],
    dialogue:['Guten Tag. Ich möchte ein halbes Kilo Käse und zwei Brötchen, bitte.','Gern. Möchten Sie auch Brot?','Nein, danke. Was macht das zusammen?','Sechs Euro zwanzig, bitte.'],
    hear:[
      ['Was kauft die Person?',['Käse und Brot','Käse und zwei Brötchen','Milch und zwei Brötchen'],1,'Yarım kilo peynir ve iki küçük ekmek. Büyük ekmeği kabul etmiyor.'],
      ['Was kostet alles zusammen?',['6,02 €','6,20 €','6,50 €'],1,'Sechs Euro zwanzig, 6 avro 20 sent.'],
    ],
    fill:[['Ich möchte ___ Tee. (ein)','einen'],['Ich nehme ___ Banane. (ein)','eine'],['Ein ___ Äpfel, bitte. (1 kg)','Kilo','Kilogramm']],
    why:'Tee eril nesne olduğu için einen, Banane dişil olduğu için eine. Ein Kilo, bir kilogram.',
    write:['Kafeden bilgi al','Sie möchten am Samstag mit drei Freunden in ein Café gehen. Schreiben Sie an das Café.',['Fragen Sie nach der Öffnungszeit.','Bitten Sie um einen Tisch für vier Personen.','Fragen Sie nach Kartenzahlung.'],'Guten Tag,\nwann öffnen Sie am Samstag? Ich möchte um 15 Uhr einen Tisch für vier Personen reservieren. Kann man bei Ihnen mit Karte bezahlen?\nVielen Dank\nMira','İyi günler, cumartesi ne zaman açılıyorsunuz? Saat 15’e dört kişilik masa ayırtmak istiyorum. Kartla ödeme yapabilir miyiz? Teşekkürler, Mira'],
    speak:['Markette sipariş ver','Kaufen Sie Obst und Brot. Fragen Sie nach dem Preis und antworten Sie auf „Sonst noch etwas?“',['Miktarı belirttim.','Fiyatı sordum.','Başka bir şey isteyip istemediğimi söyledim.'],'Ein Kilo Äpfel und ein Brot, bitte. Was kostet das zusammen? Sonst nichts, vielen Dank.','Bir kilo elma ve bir ekmek lütfen. Hepsi ne kadar? Başka bir şey yok, teşekkürler.'],
  },
  {
    topic:'ev',
    reading:'Wohnung frei · Zwei Zimmer, 58 m², 2. Stock, Balkon, kein Aufzug. 650 Euro pro Monat. Besichtigung am Mittwoch ab 17 Uhr. Bitte vorher anrufen.',
    read:[
      ['Was hat die Wohnung?',['Einen Balkon','Einen Aufzug','Drei Zimmer'],0,'Balkon var. Kein Aufzug, asansör yok.'],
      ['Wann kann man die Wohnung sehen?',['Mittwoch vor 17 Uhr','Mittwoch ab 17 Uhr','Donnerstag ab 17 Uhr'],1,'Ab 17 Uhr, 17.00’den itibaren.'],
    ],
    dialogue:['Wo steht der Tisch jetzt?','Neben dem Fenster. Der Schrank steht im Flur.','Haben wir Platz für das Sofa?','Ja, das Sofa kommt ins Wohnzimmer.'],
    hear:[
      ['Wo steht der Schrank?',['Im Flur','Neben dem Fenster','Im Wohnzimmer'],0,'Flur koridor. Pencere yanında masa duruyor.'],
      ['Wohin kommt das Sofa?',['Ins Bad','Ins Wohnzimmer','In die Küche'],1,'Ins Wohnzimmer, oturma odasına.'],
    ],
    fill:[['Der Tisch steht neben ___ Fenster.','dem'],['Der Schrank steht in ___ Küche.','der'],['Die Miete beträgt 650 Euro ___ Monat.','pro','im']],
    why:'Yer bildirirken neben dem Fenster, in der Küche. Pro Monat ay başına demek.',
    write:['Ev ilanına yaz','Sie suchen eine Wohnung und haben eine Anzeige von Herrn König gelesen.',['Sagen Sie, warum Sie schreiben.','Fragen Sie nach der Miete.','Fragen Sie nach einer Besichtigung.'],'Sehr geehrter Herr König,\nich suche eine Wohnung und habe Ihre Anzeige gelesen. Wie viel kostet die Wohnung pro Monat? Kann ich sie am Mittwoch besichtigen?\nMit freundlichen Grüßen\nDeniz Kaya','Sayın Bay König, bir daire arıyorum ve ilanınızı okudum. Daire aylık ne kadar? Çarşamba görebilir miyim? Saygılarımla, Deniz Kaya'],
    speak:['Bir odayı tarif et','Beschreiben Sie ein Zimmer und sagen Sie, wo zwei Möbel stehen.',['Odayı adlandırdım.','İki eşya söyledim.','Konum bildirmek için in veya neben kullandım.'],'Das ist mein Wohnzimmer. Der Tisch steht neben dem Fenster. Das Sofa steht vor der Wand.','Bu oturma odam. Masa pencerenin yanında. Kanepe duvarın önünde.'],
  },
  {
    topic:'ulasim',
    reading:'Bus 21 · Markt → Bahnhof · Abfahrt 14:12 am Markt, Ankunft 14:28 am Bahnhof. Heute fährt der Bus ab Haltestelle B.',
    read:[
      ['Wann kommt der Bus am Bahnhof an?',['14:12','14:21','14:28'],2,'Ankunft varış. 14.12 kalkış saati.'],
      ['Wo fährt der Bus am Markt ab?',['Haltestelle A','Haltestelle B','Gleis B'],1,'Heute ab Haltestelle B, bugün B durağından.'],
    ],
    dialogue:['Entschuldigung, wie komme ich zur Post?','Gehen Sie geradeaus bis zur Ampel. Dann gehen Sie links.','Ist die Post neben dem Café?','Ja, genau. Das Café ist an der Ecke.'],
    hear:[
      ['Wo soll die Person links gehen?',['Am Bahnhof','An der Ampel','Am Park'],1,'Bis zur Ampel und dann links, trafik ışığına kadar ve sonra sola.'],
      ['Wo ist die Post?',['Neben dem Café','Im Bahnhof','Im Park'],0,'Postane kafenin yanında.'],
    ],
    fill:[['Ich fahre mit ___ Bus.','dem'],['Wie komme ich ___ Bahnhof?','zum','zu dem'],['Wir gehen ___ Post.','zur','zu der']],
    why:'Mit ve zu dativ ister. Zu dem → zum, zu der → zur.',
    write:['Tren gecikmesini haber ver','Ihr Zug hat Verspätung. Sie treffen Mira am Bahnhof. Schreiben Sie ihr.',['Entschuldigen Sie sich.','Nennen Sie die neue Ankunftszeit.','Sagen Sie, wo Sie sich treffen.'],'Hallo Mira,\nmein Zug hat leider Verspätung. Ich komme erst um 18 Uhr an. Können wir uns dann vor dem Haupteingang treffen? Tut mir leid!\nViele Grüße\nEmir','Merhaba Mira, trenim maalesef gecikiyor. Ancak 18’de varacağım. O zaman ana girişin önünde buluşabilir miyiz? Özür dilerim! Selamlar, Emir'],
    speak:['Yol sor ve tarif et','Karte: Bahnhof. Fragen Sie nach dem Weg und geben Sie eine kurze Wegbeschreibung.',['Garın yolunu sordum.','Bir yön söyledim.','Bir yer işareti kullandım.'],'Wie komme ich zum Bahnhof? Gehen Sie geradeaus und an der Ampel rechts. Der Bahnhof ist neben dem Hotel.','Tren garına nasıl giderim? Düz gidin ve trafik ışığında sağa dönün. Gar otelin yanında.'],
  },
  {
    topic:'hobiler',
    reading:'Freizeit im Park · Samstags um 10 Uhr: Laufgruppe, Treffpunkt am Eingang. Sonntags um 15 Uhr: Schach im Café. Beide Angebote sind kostenlos.',
    read:[
      ['Was kann man am Sonntag machen?',['Schach spielen','Laufen','Schwimmen'],0,'Pazar saat 15’te kafede satranç.'],
      ['Die Laufgruppe kostet fünf Euro.',['Richtig','Falsch'],1,'Kostenlos ücretsiz. İki etkinlik de ücretsiz.'],
    ],
    dialogue:['Was machst du gern am Wochenende?','Ich spiele gern Gitarre. Und du?','Ich gehe oft schwimmen. Wollen wir am Sonntag zusammen schwimmen gehen?','Ja, gern. Am Sonntag habe ich Zeit.'],
    hear:[
      ['Welches Instrument spielt die Person gern?',['Klavier','Gitarre','Flöte'],1,'Gitarre çalmayı seviyor.'],
      ['Wann wollen beide schwimmen gehen?',['Am Samstag','Am Freitag','Am Sonntag'],2,'Am Sonntag, pazar günü.'],
    ],
    fill:[['Ich lese ___ Krimis. (severek)','gern','gerne'],['___ wir morgen Tennis spielen? (wollen)','Wollen'],['Am Samstag ___ ich oft spazieren. (gehen)','gehe']],
    why:'Gern hoşlanmayı belirtir. “Wollen wir …?” birlikte öneri yapar.',
    write:['Etkinlik öner','Sie möchten mit Ihrer Freundin Eda ins Kino gehen. Schreiben Sie ihr.',['Schlagen Sie einen Tag vor.','Sagen Sie, welchen Film Sie sehen möchten.','Nennen Sie einen Treffpunkt.'],'Hallo Eda,\nhast du am Samstag Zeit? Ich möchte den Film „Am Meer“ sehen. Wollen wir uns um 18 Uhr vor dem Kino treffen?\nLiebe Grüße\nAda','Merhaba Eda, cumartesi vaktin var mı? “Am Meer” filmini görmek istiyorum. Saat 18’de sinemanın önünde buluşalım mı? Sevgiler, Ada'],
    speak:['Hobileri sor','Sprechen Sie über Ihre Freizeit. Fragen Sie, was die andere Person gern macht, und machen Sie einen Vorschlag.',['Bir hobimi söyledim.','Karşımdakinin hobisini sordum.','Birlikte bir etkinlik önerdim.'],'Ich lese gern und spiele manchmal Tennis. Was machst du gern? Wollen wir am Samstag zusammen spielen?','Okumayı seviyorum ve bazen tenis oynuyorum. Sen ne yapmayı seversin? Cumartesi birlikte oynayalım mı?'],
  },
  {
    topic:'is',
    reading:'Bäckerei Nord sucht Hilfe im Verkauf. Arbeitszeit: Mittwoch bis Samstag, 7–12 Uhr. Erfahrung ist gut, aber nicht nötig. Fragen per E-Mail an laden@example.org.',
    read:[
      ['Wann arbeitet man?',['Mittwoch bis Samstag','Montag bis Freitag','Nur am Sonntag'],0,'Mittwoch bis Samstag, çarşambadan cumartesiye kadar.'],
      ['Man braucht unbedingt Erfahrung.',['Richtig','Falsch'],1,'Nicht nötig, gerekli değil.'],
    ],
    dialogue:['Was machen Sie beruflich?','Ich arbeite als Verkäuferin. Am Freitag kann ich ab neun arbeiten.','Und am Samstag?','Am Samstag muss ich um acht anfangen.'],
    hear:[
      ['Was ist der Beruf der Frau?',['Lehrerin','Verkäuferin','Köchin'],1,'Verkäuferin, kadın satış görevlisi.'],
      ['Wann beginnt sie am Samstag?',['Um acht','Um neun','Um zehn'],0,'Samstag um acht, cumartesi saat sekiz.'],
    ],
    fill:[['Ich arbeite ___ Verkäufer.','als'],['Ich ___ am Freitag arbeiten. (können)','kann'],['Sie ___ um acht anfangen. (müssen, sie tekil)','muss']],
    why:'Mesleği als ile tanıt. Kann/muss çekimli, arbeiten/anfangen mastar olarak sonda.',
    write:['Bir iş ilanına cevap ver','Sie lesen die Anzeige einer Bäckerei. Schreiben Sie an den Laden.',['Sagen Sie, warum Sie schreiben.','Sagen Sie, an welchen Tagen Sie arbeiten können.','Fragen Sie nach der Arbeitszeit.'],'Guten Tag,\nich habe Ihre Anzeige gelesen und möchte bei Ihnen arbeiten. Ich kann am Freitag und Samstag kommen. Wann beginnt die Arbeit?\nVielen Dank und freundliche Grüße\nEren Kaya','İyi günler, ilanınızı okudum ve sizde çalışmak istiyorum. Cuma ve cumartesi gelebilirim. İş ne zaman başlıyor? Teşekkürler ve saygılar, Eren Kaya'],
    speak:['Mesleğini ve uygun saatini anlat','Sagen Sie, was Sie beruflich machen, was Sie gut können und wann Sie Zeit haben.',['Mesleğimi söyledim.','Können ile bir becerimi anlattım.','Uygun olduğum bir gün veya saat söyledim.'],'Ich arbeite im Büro. Ich kann gut mit dem Computer arbeiten. Am Mittwoch habe ich ab zehn Uhr Zeit.','Ofiste çalışıyorum. Bilgisayarla iyi çalışabilirim. Çarşamba saat ondan itibaren vaktim var.'],
  },
  {
    topic:'giyim',
    reading:'Kleiderladen Linden · Blaue Jacke, Größe M, 35 Euro. Schwarze Jacke, Größe L, 42 Euro. Umtausch mit Kassenbon innerhalb von 14 Tagen.',
    read:[
      ['Wie viel kostet die schwarze Jacke?',['35 Euro','42 Euro','14 Euro'],1,'Schwarze Jacke 42 avro. 14 iade/değişim süresi.'],
      ['Was braucht man für den Umtausch?',['Einen Kassenbon','Eine Kreditkarte','Einen Ausweis'],0,'Mit Kassenbon, fiş ile.'],
    ],
    dialogue:['Kann ich die grüne Jacke in Größe M anprobieren?','Ja. Die Kabine ist dort links.','Sie ist zu klein. Haben Sie die Jacke auch in Größe L?','Ja, ich hole sie für Sie.'],
    hear:[
      ['Warum möchte die Person Größe L?',['M ist zu groß.','M ist zu klein.','M ist zu teuer.'],1,'Zu klein, küçük geliyor.'],
      ['Wo ist die Kabine?',['Links','Rechts','Im ersten Stock'],0,'Dort links, şurada solda.'],
    ],
    fill:[['Haben Sie die Hose ___ Größe M?','in'],['Die Jacke ist ___ klein. (gereğinden küçük)','zu'],['Die Jacke passt ___ gut. (bana)','mir']],
    why:'In Größe M beden sorar, zu klein gereğinden küçük. Passen dativ ister: mir.',
    write:['Beden değişimi iste','Sie haben gestern eine Hose gekauft. Sie ist zu groß. Schreiben Sie dem Geschäft.',['Nennen Sie den Kaufzeitpunkt.','Beschreiben Sie das Problem.','Fragen Sie nach einer kleineren Größe.'],'Guten Tag,\nich habe gestern bei Ihnen eine Hose gekauft. Sie ist leider zu groß. Haben Sie dieselbe Hose auch in Größe S? Kann ich sie umtauschen?\nViele Grüße\nMira','İyi günler, dün sizden pantolon aldım. Maalesef büyük geldi. Aynı pantolonun S bedeni var mı? Değiştirebilir miyim? Selamlar, Mira'],
    speak:['Kıyafet dene','Sie möchten eine Jacke anprobieren. Fragen Sie nach Farbe, Größe und Preis.',['Bir renk söyledim.','Beden sordum.','Fiyat sordum.'],'Haben Sie die Jacke in Blau und in Größe M? Kann ich sie anprobieren? Wie viel kostet sie?','Ceketin mavi ve M bedeni var mı? Deneyebilir miyim? Fiyatı ne kadar?'],
  },
  {
    topic:'hizmet',
    reading:'Bürgerbüro · Mo–Fr 8–12 Uhr. Donnerstag zusätzlich 14–18 Uhr. Für Ihren Termin brauchen Sie einen Ausweis. Bitte bringen Sie das ausgefüllte Formular mit.',
    read:[
      ['Wann ist das Bürgerbüro nachmittags geöffnet?',['Am Mittwoch','Am Donnerstag','Am Freitag'],1,'Zusätzlich 14–18 Uhr yalnızca perşembe.'],
      ['Man soll einen Ausweis und ein Formular mitbringen.',['Richtig','Falsch'],0,'Ausweis kimlik, ausgefülltes Formular doldurulmuş form.'],
    ],
    dialogue:['Guten Tag, ich möchte ein Paket nach Bonn schicken.','Haben Sie die Adresse auf das Paket geschrieben?','Ja. Was kostet das?','Vier Euro achtzig. Bezahlen Sie bar oder mit Karte?'],
    hear:[
      ['Was möchte die Person machen?',['Ein Paket schicken','Geld abheben','Einen Brief abholen'],0,'Ein Paket schicken, paket göndermek.'],
      ['Wie viel kostet es?',['4,18 €','4,80 €','8,40 €'],1,'Vier Euro achtzig, 4 avro 80 sent.'],
    ],
    fill:[['___: Ada (ön ad)','Vorname'],['___: Bursa (doğum yeri)','Geburtsort'],['___: Bremen (ikamet yeri)','Wohnort']],
    why:'Vorname ön ad, Geburtsort doğum yeri, Wohnort şu anda yaşadığın yer.',
    write:['Belediyeden randevu iste','Sie sind neu in der Stadt und möchten zum Bürgerbüro. Schreiben Sie eine E-Mail.',['Sagen Sie, warum Sie einen Termin brauchen.','Schlagen Sie einen Tag vor.','Fragen Sie, was Sie mitbringen müssen.'],'Guten Tag,\nich bin neu in der Stadt und möchte mich anmelden. Haben Sie am Donnerstag einen Termin frei? Was muss ich mitbringen?\nVielen Dank und freundliche Grüße\nAda Kaya','İyi günler, şehirde yeniyim ve kayıt olmak istiyorum. Perşembe boş randevunuz var mı? Yanımda ne getirmem gerekiyor? Teşekkürler ve saygılar, Ada Kaya'],
    speak:['Gişede işlem yap','Sie möchten ein Paket schicken. Fragen Sie nach dem Preis und nach der Zahlungsart.',['Ne yapmak istediğimi söyledim.','Ücreti sordum.','Kartla ödemeyi sordum.'],'Guten Tag. Ich möchte ein Paket nach Bonn schicken. Was kostet das? Kann ich mit Karte bezahlen?','İyi günler. Bonn’a paket göndermek istiyorum. Ne kadar? Kartla ödeyebilir miyim?'],
  },
  {
    topic:'saglik',
    reading:'Praxis Dr. Lang · Heute nur Termine am Vormittag. Wenn Sie Fieber haben, rufen Sie bitte zuerst an. Rezeptabholung morgen ab 9 Uhr.',
    read:[
      ['Wann finden die Termine heute statt?',['Vormittags','Nachmittags','Abends'],0,'Nur am Vormittag, sadece öğleden önce.'],
      ['Das Rezept kann man morgen ab neun Uhr abholen.',['Richtig','Falsch'],0,'Rezeptabholung morgen ab 9 Uhr ifadesi bunu söylüyor.'],
    ],
    dialogue:['Guten Tag. Was fehlt Ihnen?','Mein Hals tut weh und ich habe Fieber.','Seit wann haben Sie Fieber?','Seit gestern Abend.'],
    hear:[
      ['Was tut der Person weh?',['Der Rücken','Der Hals','Der Arm'],1,'Mein Hals tut weh, boğazım ağrıyor.'],
      ['Seit wann hat die Person Fieber?',['Seit gestern Abend','Seit heute Morgen','Seit Montag'],0,'Seit gestern Abend, dün akşamdan beri.'],
    ],
    fill:[['Mein Rücken ___ weh.','tut'],['Meine Füße ___ weh.','tun'],['Der Arzt sagt: Sie ___ viel trinken. (sollen)','sollen']],
    why:'Tekil tut, çoğul tun. Doktor önerisini sollen ile aktarıyoruz.',
    write:['Muayene randevusu al','Ihr Rücken tut weh. Schreiben Sie an die Arztpraxis.',['Beschreiben Sie das Problem.','Sagen Sie, seit wann es besteht.','Bitten Sie um einen Termin.'],'Guten Tag,\nmein Rücken tut seit gestern weh. Haben Sie morgen am Vormittag einen Termin frei? Können Sie mir bitte antworten?\nVielen Dank und freundliche Grüße\nEla Demir','İyi günler, dünden beri sırtım ağrıyor. Yarın öğleden önce boş randevunuz var mı? Lütfen bana cevap verir misiniz? Teşekkürler ve saygılar, Ela Demir'],
    speak:['Şikâyetini anlat','Sie sind in der Praxis. Sagen Sie, was Ihnen wehtut, seit wann und wann Sie Zeit haben.',['Şikâyetimi söyledim.','Ne zamandır sürdüğünü söyledim.','Randevu için uygun saatimi belirttim.'],'Mein Hals tut seit gestern weh. Ich möchte gern einen Termin. Morgen um zehn Uhr habe ich Zeit.','Dünden beri boğazım ağrıyor. Randevu almak istiyorum. Yarın saat onda vaktim var.'],
  },
  {
    topic:'kurallar',
    reading:'Stadtbibliothek · Bitte leise sprechen. Essen und Getränke sind im Lesesaal verboten. Handys bitte ausschalten. Fotos ohne Blitz sind erlaubt.',
    read:[
      ['Darf man im Lesesaal essen?',['Ja','Nein'],1,'Essen ist verboten, yemek yasak.'],
      ['Darf man ohne Blitz fotografieren?',['Ja','Nein'],0,'Ohne Blitz erlaubt, flaşsız fotoğraf serbest.'],
    ],
    dialogue:['Entschuldigung, darf ich hier telefonieren?','Im Lesesaal leider nicht. Draußen dürfen Sie telefonieren.','Danke. Können Sie bitte das Fenster öffnen?','Ja, natürlich.'],
    hear:[
      ['Wo darf die Person telefonieren?',['Im Lesesaal','Draußen','Im Büro'],1,'Draußen, dışarıda.'],
      ['Worum bittet die Person danach?',['Das Fenster öffnen','Das Handy ausschalten','Die Tür schließen'],0,'Fenster öffnen, pencereyi açmak.'],
    ],
    fill:[['___ ich hier fotografieren? (dürfen)','Darf'],['Sie ___ hier nicht rauchen. (dürfen)','dürfen'],['Können Sie bitte die Tür ___? (kapatmak)','schließen','zumachen']],
    why:'İzin istemek için Darf ich …? Rica için Können Sie bitte …? Ana fiil sonda.',
    write:['Ortak alanda bir rica','Im Hausflur stehen Fahrräder. Schreiben Sie eine kurze Nachricht an Ihre Nachbarn.',['Sagen Sie, was im Flur steht.','Erklären Sie, warum das ein Problem ist.','Bitten Sie die Nachbarn, die Fahrräder wegzustellen.'],'Liebe Nachbarn,\nim Flur stehen zwei Fahrräder. Die Tür geht deshalb nicht ganz auf. Können Sie die Fahrräder bitte in den Hof stellen? Vielen Dank und viele\nGrüße\nAda','Sevgili komşular, koridorda iki bisiklet var. Bu yüzden kapı tamamen açılmıyor. Lütfen bisikletleri avluya koyabilir misiniz? Teşekkürler ve selamlar, Ada'],
    speak:['İzin iste ve rica et','Karten: Foto machen · Fenster schließen. Fragen Sie nach Erlaubnis und formulieren Sie eine Bitte.',['Darf ich ile izin istedim.','Können Sie bitte ile rica ettim.','Sorulardan birine kısa cevap verdim.'],'Darf ich hier fotografieren? Ja, aber bitte ohne Blitz. Können Sie bitte das Fenster schließen?','Burada fotoğraf çekebilir miyim? Evet, ama lütfen flaşsız. Pencereyi kapatır mısınız?'],
  },
  {
    topic:'gecmis',
    reading:'Hallo Emil, am Wochenende war ich in Lübeck. Am Samstag habe ich ein Museum besucht. Am Sonntag bin ich ans Meer gefahren. Am Abend war ich wieder zu Hause. Grüße, Leyla',
    read:[
      ['Was hat Leyla am Samstag gemacht?',['Sie war im Museum.','Sie war am Meer.','Sie war zu Hause.'],0,'Museum besucht cumartesi, Meer pazar.'],
      ['Wann war Leyla wieder zu Hause?',['Sonntagmorgen','Sonntagabend','Montagabend'],1,'Am Abend, önceki cümledeki pazarın akşamı.'],
    ],
    dialogue:['Wie war dein Urlaub in Weimar?','Sehr schön. Wir sind am Freitag mit dem Zug gefahren und waren zwei Nächte dort.','Habt ihr auch das Museum besucht?','Nein, es war geschlossen. Wir haben einen langen Spaziergang gemacht.'],
    hear:[
      ['Wie lange war die Person in Weimar?',['Eine Nacht','Zwei Nächte','Drei Nächte'],1,'Zwei Nächte, iki gece.'],
      ['Was hat die Person dort gemacht?',['Ein Museum besucht','Einen Spaziergang gemacht','Ein Fahrrad gekauft'],1,'Spaziergang gemacht, yürüyüşe çıktı. Müze kapalıydı.'],
    ],
    fill:[['Wir ___ mit dem Zug gefahren.','sind'],['Ich habe ein Museum ___. (besuchen)','besucht'],['Gestern ___ ich zu Hause. (sein, geçmiş)','war']],
    why:'Fahren burada sein alır. Besuchen → besucht. Geçmişte ich war.',
    write:['Tatilinden yaz','Sie waren am Wochenende in einer anderen Stadt. Schreiben Sie an Ihren Freund Ben.',['Nennen Sie die Stadt.','Sagen Sie, was Sie gemacht haben.','Fragen Sie nach Bens Wochenende.'],'Hallo Ben,\nam Wochenende war ich in Dresden. Ich habe ein Museum besucht und bin im Park spazieren gegangen. Was hast du am Wochenende gemacht?\nViele Grüße\nLeyla','Merhaba Ben, hafta sonu Dresden’deydim. Müzeye gittim ve parkta yürüdüm. Sen hafta sonu ne yaptın? Selamlar, Leyla'],
    speak:['Hafta sonunu anlat','Sagen Sie, wo Sie waren, wie Sie dorthin gefahren sind und was Sie gemacht haben.',['Nerede olduğumu söyledim.','Yolculuğu anlattım.','Geçmişte yaptığım bir eylemi söyledim.'],'Ich war in Lübeck. Ich bin mit dem Zug gefahren. Dort habe ich das Museum besucht.','Lübeck’teydim. Trenle gittim. Orada müzeyi ziyaret ettim.'],
  },
  {
    topic:'davet',
    reading:'Hallo zusammen! Am Samstag feiern wir meinen Geburtstag im Garten. Es geht um 16 Uhr los. Wenn es regnet, feiern wir bei mir in der Wohnung. Bitte bringt etwas zu trinken mit. Tessa',
    read:[
      ['Was sollen die Gäste mitbringen?',['Essen','Getränke','Einen Kuchen'],1,'Etwas zu trinken, içecek bir şey.'],
      ['Wo ist die Feier bei Regen?',['Im Garten','In der Wohnung','Im Restaurant'],1,'Wenn es regnet, yağmur yağarsa evde.'],
    ],
    dialogue:['Hast du am Samstag Zeit für ein Picknick?','Gern, aber am Samstag soll es regnen. Geht Sonntag?','Ja, Sonntag um drei im Park?','Prima. Ich bringe Saft mit.'],
    hear:[
      ['Warum ändern sie den Tag?',['Am Samstag soll es regnen.','Am Sonntag ist der Park zu.','Die Person arbeitet am Samstag.'],0,'Cumartesi yağmur bekleniyor.'],
      ['Was bringt die Person mit?',['Brot','Wasser','Saft'],2,'Saft meyve suyu.'],
    ],
    fill:[['Ich lade dich ___ meiner Feier ein.','zu'],['Wir treffen uns ___ Sonntag.','am'],['Die Feier beginnt ___ 16 Uhr.','um']],
    why:'Zu einer Feier einladen, am Sonntag, um 16 Uhr.',
    write:['Bir davete cevap ver','Tessa hat Sie zu ihrer Feier eingeladen. Am Samstag können Sie nicht kommen.',['Bedanken Sie sich.','Erklären Sie, warum Sie nicht kommen können.','Schlagen Sie ein anderes Treffen vor.'],'Liebe Tessa,\nvielen Dank für deine Einladung! Leider muss ich am Samstag arbeiten. Hast du am Sonntag Zeit für einen Kaffee? Ich wünsche dir eine schöne Feier.\nLiebe Grüße\nMelis','Sevgili Tessa, davetin için çok teşekkürler! Maalesef cumartesi çalışmam gerek. Pazar kahve içmeye vaktin var mı? Güzel bir kutlama dilerim. Sevgiler, Melis'],
    speak:['Davet et ve yanıt ver','Laden Sie eine Person ein. Nennen Sie Ort und Zeit. Machen Sie bei Regen einen anderen Vorschlag.',['Davetimi söyledim.','Yer ve saat verdim.','Yağmur için başka bir plan önerdim.'],'Möchtest du am Sonntag mit mir in den Park gehen? Wir treffen uns um drei Uhr. Wenn es regnet, gehen wir ins Café.','Pazar benimle parka gitmek ister misin? Saat üçte buluşuruz. Yağmur yağarsa kafeye gideriz.'],
  },
];
const entryByTopic=new Map(entries.map(e=>[e.topic,e]));
const openTask=(skill,topic,[stem,text,points,model,modelTr])=>({
  id:`unit-${topic}-${skill}`,kind:skill,skill,topic,stem,text,points,model,modelTr,stemLang:'tr',
});
function objective(topic,skill,[stem,options,answer,explain],i,context){
  return {id:`unit-${topic}-${skill}-${i+1}`,kind:'choice',skill,topic,stem,options,answer,explain,...context};
}
export const unitTasks=lessons.flatMap(({id:topic})=>{
  const data=entryByTopic.get(topic);
  const transcript=data.dialogue.join('\n');
  const audio=`./assets/audio/unit-${topic}.mp3`;
  return [
    ...data.hear.map((q,i)=>objective(topic,'listening',q,i,{audio,transcript})),
    ...data.read.map((q,i)=>objective(topic,'reading',q,i,{text:data.reading})),
    {id:`unit-${topic}-grammar`,kind:'form',skill:'grammar',topic,stem:'Ünitenin temel kalıpları',
      fields:data.fill.map(([label,...answers])=>({label,answers})),explain:data.why},
    openTask('writing',topic,data.write),openTask('speaking',topic,data.speak),
  ];
});
export const unitAudio=entries.map(({topic,dialogue})=>[`./assets/audio/unit-${topic}.mp3`,dialogue]);

export const unitForms=[
  {topic:'sayilar',stem:'İletişim kartını doldur',text:'Ida Berger wohnt in der Parkstraße 28, 34119 Kassel. Ihre Handynummer ist 0157 290346. Ihre E-Mail-Adresse ist ida@example.org.',
    fields:[['Vorname','Ida'],['Nachname','Berger'],['Hausnummer','28'],['Postleitzahl','34119'],['Mobilnummer','0157290346']],
    explain:'Hausnummer caddenin sonundaki sayı. Postleitzahl ise şehrin önündeki beş basamaklı kod.'},
  {topic:'hobiler',stem:'Satranç kulübü kaydı',text:'Emre Wolf ist 23 Jahre alt. Er möchte am Sonntag um 15 Uhr in Bonn Schach spielen. Er kann schon Schach spielen. Seine E-Mail-Adresse ist emre@example.org.',
    fields:[['Alter','23','23 Jahre'],['Aktivität','Schach','Schach spielen'],['Tag','Sonntag'],['Uhrzeit','15 Uhr','15:00','15'],['Stadt','Bonn']],
    explain:'Schach satranç, Sonntag pazar. Saat 15.00, öğleden sonra üç.'},
  {topic:'hizmet',stem:'Paket gönderim formu',text:'Nora Klein schickt ein Paket an Elias Vogt. Er wohnt in der Marktstraße 7 in 53111 Bonn. Das Paket wiegt zwei Kilo. Nora bezahlt bar.',
    fields:[['Empfänger','Elias Vogt'],['Hausnummer','7'],['Postleitzahl','53111'],['Gewicht','2','2 kg','zwei Kilo','zwei Kilogramm'],['Zahlungsart','bar','Bargeld']],
    explain:'Empfänger alıcı, Gewicht ağırlık. Nora gönderen, Elias alıcı.'},
  {topic:'kurallar',stem:'Etkinlik giriş kaydı',text:'Mira Schmid besucht am Freitag um 17 Uhr die Ausstellung im Stadtmuseum. Sie kommt mit ihrer Schwester. Fotos ohne Blitz sind erlaubt. Große Taschen bleiben an der Garderobe.',
    fields:[['Wochentag','Freitag'],['Uhrzeit','17 Uhr','17:00','17'],['Ort','Stadtmuseum','im Stadtmuseum'],['Anzahl der Besucherinnen','2','zwei'],['Fotos mit Blitz erlaubt?','Nein']],
    explain:'Mit ihrer Schwester, kız kardeşiyle, toplam iki ziyaretçi. Yalnızca flaşsız fotoğraf serbest.'},
].map(({topic,fields,...task})=>({
  ...task,id:`unit-${topic}-form`,topic,kind:'form',skill:'writing',stemLang:'tr',
  fields:fields.map(([label,...answers])=>({label,answers})),
}));
