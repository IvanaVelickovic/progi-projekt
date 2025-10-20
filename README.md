# Platforma za online poduke
## Opis projekta 
Projekt je razvijen kao timski rad studenata u sklopu zadatka iz kolegija Programsko inženjerstvo na Fakultetu elektrotehnike i računarstva Sveučilišta u Zagrebu.
Cilj nam je napraviti funkcionalnu platformu, jednostavnu za uporabu, koja svojim korisnicima omogućava objavljivanje materijala za učenja (kao instruktor) i korištenje tih materijala (kao učenik). Drugim riječima, razvijamo sustav za održavanje instrukcija u različitim formatima.
## Analiza zahtjeva

### Funkcionalni zahtjevi
| ID zahtjeva | Opis                                                                                          | Prioritet | Izvor                     | Kriteriji prihvaćanja                                                                                         |
|-------------|-----------------------------------------------------------------------------------------------|-----------|---------------------------|---------------------------------------------------------------------------------------------------------------|
| F-001       | Sustav omogućuje prijavu i registraciju korisnika putem OAuth 2.0 servisa (Google, Microsoft, GitHub, FER) i e-mailom.     | Visok     | Zahtjev dionika                | Korisnik se može registrirati putem OAuth-a ili e-mailom, primiti potvrdu i uspješno se prijaviti. |
| F-002       | Sustav zahtijeva promjenu inicijalne lozinke nakon prve prijave kod klasične registracije.                                 | Visok     | Dokument zahtjeva              | Nakon prve prijave korisnik mora promijeniti lozinku prije pristupa profilu.                       |
| F-003       | Korisnici mogu povezati dodatne OAuth identitete sa svojim računom.                                                        | Srednji   | Dokument zahtjeva              | Korisnik uspješno povezuje novi identitet i može se prijaviti bilo kojim povezanim računom.        |
| F-004       | Instruktori mogu uređivati svoj profil (biografija, stručnost, cjenik, lokacija, dostupni termini, video-uvod, reference). | Visok     | Zahtjev dionika                | Instruktor može unijeti i spremiti sve navedene informacije te ih ažurirati u bilo kojem trenutku. |
| F-005       | Instruktori oglašavaju termine putem integriranog kalendara (Google Calendar / CalDAV).                                    | Srednji   | Dokument zahtjeva              | Instruktor može dodati, promijeniti ili ukloniti termine u sinkroniziranom kalendaru.              |
| F-006       | Svaki termin ima datum, vrijeme, trajanje, cijenu, format (online/u živo) i maksimalan broj polaznika.                     | Visok     | Dokument zahtjeva              | Svi podaci o terminu su vidljivi i ispravno spremljeni u sustav.                                   |
| F-007       | Učenici mogu uređivati svoj profil (razina znanja, razred/semestar, ciljevi učenja, preferirani termini).                  | Visok     | Zahtjev dionika                | Učenik može unijeti i spremiti podatke o svom profilu te ih kasnije ažurirati.                     |
| F-008       | Učenici mogu kreirati popis omiljenih instruktora i postaviti obavijesti za nove slobodne termine.                         | Srednji   | Dokument zahtjeva              | Novi termini omiljenih instruktora generiraju automatske obavijesti učeniku.                       |
| F-009       | Sustav omogućuje pregled i filtriranje instruktora po predmetu, cijeni, ocjeni, dostupnosti, formatu i lokaciji.           | Visok     | Zahtjev dionika                | Pretraga vraća točne i ažurirane rezultate prema zadanim filtrima.                                 |
| F-010       | Sustav integrira geolokaciju instruktora putem mapa (OpenStreetMap/Google Maps).                                           | Srednji   | Dokument zahtjeva              | Lokacija instruktora prikazuje se točno na karti.                                                  |
| F-011       | Učenici mogu pregledavati detaljan profil instruktora s ocjenama i recenzijama.                                            | Visok     | Zahtjev dionika                | Profil prikazuje biografiju, cijenu, termine, ocjene i recenzije.                                  |
| F-012       | Učenici mogu rezervirati termine instruktora i odabrati format (online/u živo).                                            | Visok     | Zahtjev dionika                | Nakon rezervacije termin se prikazuje kao zauzet i korisnik prima potvrdu e-mailom.                |
| F-013       | Sustav omogućuje sigurno online plaćanje rezerviranih termina.                                                             | Visok     | Dokument zahtjeva              | Transakcija se uspješno izvršava i potvrda plaćanja je vidljiva korisniku.                         |
| F-014       | Sustav omogućuje izvođenje online sesija putem video API-ja (npr. Jitsi, Zoom, Whereby).                                   | Visok     | Dokument zahtjeva              | Korisnici se mogu spojiti na sesiju, koristiti kameru, mikrofon, chat i dijeljenje ekrana.         |
| F-015       | Tijekom online sesije moguće je korištenje bijele ploče, chata, pohrana bilješki i djeljenje ekrana.                                                | Srednji   | Dokument zahtjeva              | Sudionici mogu koristiti interaktivnu ploču i bilješke se spremaju u profil učenika.               |
| F-016       | Sustav automatski generira sažetak sesije i popis zadataka nakon završetka.                                                | Srednji   | Dokument zahtjeva              | Sažetak i zadaci dostupni su učeniku unutar profila.                                               |
| F-017       | Instruktori mogu kreirati zadatke i kvizove različitih tipova (jednostruki/višestruki izbor, kratki odgovor).              | Srednji   | Zahtjev dionika                | Instruktor može spremiti i pregledati kreirane zadatke.                                            |
| F-018       | Sustav koristi adaptivni algoritam za preporuku sljedećih zadataka učenicima.                                              | Srednji   | Dokument zahtjeva              | Sustav generira relevantne prijedloge temeljem povijesne uspješnosti učenika.                      |
| F-019       | Učenici mogu ocijeniti instruktora i ostaviti recenziju nakon održane sesije.                                              | Visok     | Povratne informacije korisnika | Učenik može unijeti ocjenu 1–5 i komentar, koji se prikazuju javno.                                |
| F-020       | Administrator može ukloniti lažne ili uvredljive recenzije.                                                                | Srednji   | Dokument zahtjeva              | Administrator vidi listu prijavljenih recenzija i može ih ukloniti.                                |
| F-021       | Sustav šalje e-mail i push obavijesti o rezervacijama, promjenama termina i podsjetnicima.                                 | Visok     | Dokument zahtjeva              | Obavijesti se šalju 24 h i 1 h prije termina.                                                      |
| F-022       | Administrator može upravljati korisnicima (verifikacija, suspenzija, brisanje).                                            | Visok     | Dokument zahtjeva              | Administrator može promijeniti status korisnika i vidjeti povijest aktivnosti.                     |
| F-023       | Administrator može uređivati predmete i standarde profila instruktora.                                                     | Srednji   | Dokument zahtjeva              | Promjene su odmah vidljive u formama za instruktore.                                               |
| F-024       | Administrator ima pristup statistici o rezervacijama, otkazima i zadovoljstvu korisnika.                                   | Srednji   | Dokument zahtjeva              | Prikaz statistike u obliku grafikona i tablica u administratorskom sučelju.                        |
| F-025       | Sustav automatski vodi audit log svih sigurnosno osjetljivih akcija.                                                       | Visok     | Sigurnosni zahtjev             | Log se bilježi s korisničkim ID-om, vremenom i akcijom.                                            |
| F-026       | Sustav pohranjuje datoteke i zadatke u vanjsku pohranu (S3 kompatibilan servis).                                           | Srednji   | Tehnički zahtjev               | Datoteke su sigurno spremljene i dostupne za preuzimanje.                                          |
                 

## Tehnologije
## Članovi tima
Ivana Veličković, [github](https://github.com/IvanaVelickovic)  
Petar Blatančić-Vuković, [github](https://github.com/PetarBV)  
Klara Bilać, [github](https://github.com/klarabilac)      
Mia Grahovac, [github](https://github.com/Mia-Grahovac)  
Ivan Miloš, [github](https://github.com/ivan-milos)  
Marin Denić, [github](https://github.com/denabena)  
Ive Šarić, [github](https://github.com/Ive-Saric)  
## Kontribucije
## Licenca
Ovaj repozitorij je licenciran pod [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).

[![License: CC BY-NC-SA 4.0](https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
