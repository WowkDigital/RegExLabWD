# RegEx Lab — Interaktywny kurs wyrażeń regularnych

RegEx Lab to nowoczesna, interaktywna aplikacja webowa do nauki wyrażeń regularnych (RegEx). Oferuje pełny program nauczania od podstaw (poziom Beginner) aż po zaawansowane techniki optymalizacyjne (poziom Expert). Całość została zaprojektowana w estetyce dark-mode z neonowymi akcentami.

## 🚀 Główne funkcje

- **12 interaktywnych lekcji** podzielonych na 4 poziomy zaawansowania (Podstawowy, Pośredni, Zaawansowany, Ekspert).
- **Zadania z walidacją w czasie rzeczywistym** i systemem podpowiedzi.
- **Playground (Piaskownica)** pozwalająca na testowanie własnych wzorców RegEx na dowolnym tekście, z obsługą grup przechwytujących i gotowymi szablonami (Email, URL, IP itp.).
- **Ściągawka (Cheatsheet)** stanowiąca podręczne źródło wiedzy o klasach znaków, kotwicach, kwantyfikatorach, lookaroundach oraz popularnych wzorcach (PESEL, NIP, e-mail).
- **Zapisywanie postępów** automatycznie w pamięci przeglądarki (`localStorage`).

## 🛠️ Stos technologiczny

Aplikacja jest w pełni statycznym projektem typu Single Page Application (SPA):
- **Struktura**: HTML5
- **Stylizowanie**: CSS3 (Vanilla CSS + Tailwind CSS dla ułatwienia układu)
- **Logika**: JavaScript (ES Modules)
- **Ikony**: Lucide Icons
- **Czcionki**: JetBrains Mono, Orbitron, Share Tech Mono (Google Fonts)

## 📁 Struktura katalogów po refaktoryzacji

Projekt został zorganizowany w sposób modułowy:

```text
RegExWD/
├── css/
│   └── style.css          # Arkusz stylów CSS (zmienne, kolory, animacje)
├── js/
│   ├── lessons.js         # Definicje lekcji, zadań, podpowiedzi i teorii
│   ├── utils.js           # Pomocnicze funkcje (np. escapeHtml, highlightMatches)
│   ├── playground.js      # Kontroler widoku i logiki piaskownicy
│   ├── cheatsheet.js      # Kontroler widoku ściągawki
│   └── main.js            # Główny plik inicjalizujący aplikację i zarządzający stanem
├── .gitignore             # Plik ignorowanych plików dla Gita
├── README.md              # Niniejsza dokumentacja
└── index.html             # Główny plik wejściowy HTML
```

## 💻 Jak uruchomić projekt lokalnie?

Z uwagi na to, że aplikacja korzysta z **modułów JavaScript (`ES Modules`)**, przeglądarki internetowe ze względów bezpieczeństwa (polityka CORS) blokują wczytywanie skryptów bezpośrednio z protokołu lokalnego `file://` (np. przez podwójne kliknięcie pliku `index.html`). 

Aby uruchomić projekt lokalnie, należy postawić prosty serwer HTTP w katalogu projektu:

### Opcja 1: Używając Pythona (zalecane)
Otwórz terminal w folderze projektu i wpisz:
```bash
python -m http.server 8080
```
Następnie otwórz przeglądarkę pod adresem: [http://localhost:8080](http://localhost:8080)

### Opcja 2: Używając Node.js i http-server
Zainstaluj i uruchom serwer komendą:
```bash
npx http-server -p 8080
```
Następnie przejdź do: [http://localhost:8080](http://localhost:8080)

## 📄 Licencja

Projekt jest udostępniany na licencji MIT. Szczegóły znajdziesz w pliku `LICENSE` (jeśli zdecydujesz się go dodać).
